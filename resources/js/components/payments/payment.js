import { React, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Container, Col, Row, Image, Button, Modal, Card } from 'react-bootstrap'
import Header from '../_components/Header/Header'
import PaymentForm from './PaymentForm'
import './paymentStyles.css'
import Footer from '../_components/Footer/Footer'
import mainImage from './payment_image.jpg'
import EndingText from './EndingText'
import ModalSuccess from '../common/ModalSuccess'
import { useHistory, Redirect } from 'react-router-dom';
import Loading from './Loading'
import PromocodeForm from './PromoCode'

export default function payment({ user }) {

    const [loaded, setloaded] = useState(false);
    const [buttonDisabled, setbuttonDisabled] = useState(false);
    const [zipErrorMessage, setzipErrorMessage] = useState('');
    const [fieldEmptyErrorMessage, setfieldEmptyErrorMessage] = useState('');
    const [fieldEmptyPromoErrorMessage, setfieldEmptyPromoErrorMessage] = useState('');
    const [cardErrorMessage, setcardErrorMessage] = useState('');
    const [card, setcard] = useState(false);
    const [showSuccesAlert, setshowSuccesAlert] = useState(false);
    const [spinnerStyle, setspinnerStyle] = useState("none");

    let history = useHistory();
    const formRef = useRef(null);

    // Proo code form
    const formRefPromo = useRef(null);

    // Au loading initial, load le SDK de Square pour la carte
    useEffect(() => {
        let sqPaymentScript = document.createElement('script');
        sqPaymentScript.crossOrigin = 'anonymous'; // pour le sharing ngrok

        sqPaymentScript.src = "https://sandbox.web.squarecdn.com/v1/square.js";
        sqPaymentScript.async = false;
        sqPaymentScript.onload = () => {
            setloaded(true);
        };
        document.getElementsByTagName("head")[0].appendChild(sqPaymentScript);
    }, [])


    // Lorsque le SDK de Square est loadé, on initialise leur style
    useEffect(() => {
        if (loaded) {
            var payments = Square.payments(process.env.MIX_APPLICATION_ID, process.env.MIX_LOCATION_ID);
            initializeCard(payments);
        }
    }, [loaded])


    const initializeCard = async function (payments) {
        const cardTemp = await payments.card();
        await cardTemp.attach('#card-container');
        setcard(cardTemp);
    }


    const createPayment = async function (token, form) {

        let user = await axios.get('/api/user');
        const body = {
          sourceId: token,
          id: user.data.id,
          cardHolderName: form.current['cardOwner'].value,
          address_1: form.current['address'][0].value,
          address_2: form.current['address'][1].value,
          zip: form.current['zip'].value,
          province: form.current['province'].value,
          country: form.current['country'].value
        };

        const paymentResponse = await axios.post('/api/setupSubscription', body);
        return paymentResponse.data.success;
    }

    // Promo code
    const createPromocodePayment = async function(form){
        let user = await axios.get('/api/user');
        const body = {
            id: user.data.id,
            promocode:form.current['promocode'].value
        };

        const paymentResponse = await axios.post('/api/setupSubscriptionWithPromoCode', body);

        return paymentResponse;
    }

    //Méthode fournit par Square pour transformer la carte en Token
    const tokenize = async function (paymentMethod) {

        const tokenResult = await paymentMethod.tokenize();
        if (tokenResult.status === 'OK') {
            return tokenResult.token;
        } else {
            let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
            if (tokenResult.errors) {
                errorMessage += ` and errors: ${JSON.stringify(
                    tokenResult.errors
                )}`;
            }
            throw new Error(errorMessage);
        }
    }


    const validateForm = (form, formField) => {

        // look for empty field
        for (let i = 0; i < formField.length; i++) {
            if (form.current[formField[i]].value === '') {
                setfieldEmptyErrorMessage('Veuillez remplir tous les champs ci-dessus');
                throw new Error();
            }
        }

        // l'addresse is different cause it has 2 nodes
        if (form.current['address'][0].value === '') {
            setfieldEmptyErrorMessage('Veuillez remplir tous les champs ci-dessus');
            throw new Error();
        }

        // // valide le code postal
        // if(!(/^[A-Z]\d[A-Z](\s)?\d[A-Z]\d$/.test(form.current['zip'].value))) {
        //     setzipErrorMessage('Les formats valides sont A9A 9A9 ou A9A9A9');
        //     throw new Error();
        // }
    }


    const handleSubmit = async (e) => {

        e.preventDefault();
        setzipErrorMessage('');
        setfieldEmptyErrorMessage('');
        setcardErrorMessage('');


        let formField = ['cardOwner', 'zip', 'province', 'country'];


        try {
            setbuttonDisabled(true);
            setspinnerStyle("block");
            const token = await tokenize(card);
            validateForm(formRef, formField);
            const paymentResults = await createPayment(token, formRef);

            if (paymentResults) {
                handleshowSuccesAlert();
                setspinnerStyle("none");
                return;
            }

            setcardErrorMessage('Une erreur est survenue avec la carte, veuillez réessayer');
            setbuttonDisabled(false);
            setspinnerStyle("none");
        }
        catch (err) {
            console.log(err);
            setbuttonDisabled(false);
            setspinnerStyle("none");
        }
    }


    const validatePromoForm = (form, formField) => {

        // look for empty field
        for (let i = 0; i < formField.length; i++) {
            if (form.current[formField[i]].value === '') {
                setfieldEmptyPromoErrorMessage('Veuillez remplir tous les champs ci-dessus');
                throw new Error();
            }
        }
    }

    const handleSubmitPromo = async (e) => {
        e.preventDefault();
        setfieldEmptyPromoErrorMessage('');
        let formField = ['promocode'];

        try {

            setspinnerStyle("block");

            validatePromoForm(formRefPromo, formField);
            const paymentPromocodeResult = await createPromocodePayment(formRefPromo);
            console.log(paymentPromocodeResult);

            if(paymentPromocodeResult.data.success === true){
                handleshowSuccesAlert();
                setspinnerStyle("none");
                return;
            }
            else
            {
                setfieldEmptyPromoErrorMessage(paymentPromocodeResult.data.message);
            }
            setbuttonDisabled(false);
            setspinnerStyle("none");
        }
        catch (err) {
            console.log(err);
            setbuttonDisabled(false);
            setspinnerStyle("none");
        }
    }

    const handleRedirect = () => {
        history.push(`/modifier-profil/${user.id}`);
    }

    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }

    return (
        <>
            <Header user={user} />
            <Container fluid className="p4">
                <Row>
                    <Col lg={5}>
                        <Card bg="light">
                            <Card.Header as="h4" className="bg-secondary text-white">
                                Méthode de paiement
                            </Card.Header>
                            <Card.Body>
                                <PromocodeForm
                                    handleSubmit={handleSubmitPromo}
                                    formRef={formRefPromo}
                                    fieldEmptyErrorMessage={fieldEmptyPromoErrorMessage} />

                                <hr />

                                <PaymentForm handleSubmit={handleSubmit}
                                    buttonDisabled={buttonDisabled}
                                    formRef={formRef}
                                    zipErrorMessage={zipErrorMessage}
                                    fieldEmptyErrorMessage={fieldEmptyErrorMessage}
                                    cardErrorMessage={cardErrorMessage} />

                                <Loading style={spinnerStyle} />

                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={7} className="d-none d-md-none d-lg-block">
                        <Image src={mainImage} fluid className="hidden-xs" />
                    </Col>
                </Row>
                <Row>
                    <div className="ending_text_container">
                        <EndingText style="ending_text_style" />
                    </div>
                </Row>
            </Container>
            <Footer />
            <ModalSuccess
                title='Notification'
                body="Paiement réussi, vous allez recevoir le sommaire de l'abonnement par courriel."
                buttonMessage='Compléter mon profil'
                redirect={true}
                handleRedirect={handleRedirect}
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
        </>
    )
}
