import React, { useEffect, useState,useRef } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { Row, Col, Container, Form, Button, Image, Alert, Accordion, Modal, Card } from "react-bootstrap";
import Footer from '../../_components/Footer/Footer'
import Header from '../../_components/Header/Header'
import ModalSuccess from '../../common/ModalSuccess'
import { v4 as uuidv4 } from "uuid";
import Loading from '../../payments/Loading'
import axios from 'axios';
import Cookies from 'js-cookie';


const currentDate = new Date().toISOString().split("T")[0];

export default function modifyProfile({ user }) {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [showBanner, setshowBanner] = useState({ show: false, message: '', variant: '' });
    const [loaded, setloaded] = useState(false);
    const [card, setcard] = useState(false);

    const [zipErrorMessage, setzipErrorMessage] = useState('');
    const [fieldEmptyErrorMessage, setfieldEmptyErrorMessage] = useState('');
    const [cardErrorMessage, setcardErrorMessage] = useState('');
    const [buttonDisabled, setbuttonDisabled] = useState(false);
    const [spinnerStyle, setspinnerStyle] = useState("none");
    const [showSuccesAlert, setshowSuccesAlert] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        variantClose: '',
        variantConfirm: '',
        context: '',
    });

    const formRef = useRef(null);
    let history = useHistory();
// // Au loading initial, load le SDK de Square pour la carte
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

    const createPayment = async function (token, form) {

        const body = {
          sourceId: token,
          id: user.id,
          cardHolderName: form.current['cardOwner'].value,
          address_1: form.current['address'][0].value,
          address_2: form.current['address'][1].value,
          zip: form.current['zip'].value,
          province: form.current['province'].value,
          country: form.current['country'].value
        };


        const paymentResponse = await axios.post('/api/updateSquareCardInfo', body);
        return paymentResponse.data;
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


    const valideUserInfo = () => {

        let valid = true;
        let infoToValidate = [];

        if (userInfo.info.role_id == 1) {

            infoToValidate = ['firstname', 'lastname', 'gender', 'country_id', 'province_id', 'birthdate', 'email'];

            for (let i = 0; i < infoToValidate.length; i++){

                if (userInfo.info[infoToValidate[i]] == '') {
                    valid = false;
                    break;
                }
            }
        }

        else if (userInfo.info.role_id == 3) {

            infoToValidate = ['firstname', 'lastname', 'gender', 'country_id', 'province_id', 'title', 'description', 'email'];

            for (let i = 0; i < infoToValidate.length; i++){

                if (userInfo.info[infoToValidate[i]] == '') {
                    valid = false;
                    break;
                }
            }
        }



        return valid;

    }

    const handleCardChange  = async (e) => {
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

            if (paymentResults.success) {
                setshowBanner({ show: true, message: "La modification de votre profil c'est complété avec succès", variant: 'success' });
                setspinnerStyle("none");
                setUserInfo({ ...userInfo, square: paymentResults.square })
                window.scrollTo(0, 0);
                setbuttonDisabled(false);
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

    const handleResetPassword = () => {


        axios.post('/api/forgot-password', userInfo.info).then(res => {
            handleshowSuccesAlert();
        }).catch(error => {
            setshowBanner({ show: true, message: "Une erreur c'est produite, veuillez réessayer sous peu.", variant: 'danger' });
        });
    }

    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }

    useEffect(() => {

        axios.get(`/api/modifyPreferenceInfo/${id}`).then((res) => {

            //console.log(res.data);
            let infoTemp = res.data.userInfo;
            if (res.data.userInfo.positions != null) {
                let positions = res.data.userInfo.positions.split(',');
                infoTemp['positions'] = positions;
            }
            else {
                infoTemp['positions'] = [];
            }

            setUserInfo({
                info: infoTemp,
                square: res.data.square,
                sports: res.data.sports,
                location: res.data.locationInfo,
            });

        });

    }, [])

    const handleOnChange = (e) => {

        const target = e.target.id;
        const value = e.target.value;

        const newInfo = userInfo.info;
        newInfo[target] = value;

        setUserInfo({
            ...userInfo,
            info: newInfo
        });
    }

    const handleStatusChange = (e) => {
        const target = e.target.id;
        const value = e.target.checked;

        const newInfo = userInfo.info;
        newInfo[target] = value;

        setUserInfo({
            ...userInfo,
            info: newInfo
        });
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()



        let valid = valideUserInfo();

        if (!valid) {
            setshowBanner({ show: true, message: "Veuillez ne pas laissez de valeur vide dans vos informations de profil. Les champs avec un * sont obligatoire", variant: 'danger' })
            return;
        }

        let data = new FormData();
        // set province manually if different
        let prov = e.target['province_id'].value;

        let media = undefined;

        if (e.target['media']) media = e.target['media'].files[0]

        data.append("id", userInfo.info.id);
        data.append("firstname", userInfo.info.firstname);
        data.append("email", userInfo.info.email);
        data.append("lastname", userInfo.info.lastname);
        data.append("birthdate", userInfo.info.birthdate);
        data.append("gender", userInfo.info.gender);
        data.append("title", userInfo.info.title);
        data.append("description", userInfo.info.description);
        data.append("media", media);
        data.append("role_id", userInfo.info.role_id);
        data.append("status", userInfo.info.status);
        data.append("province_id", userInfo.info.province_id);
        data.append("country_id", userInfo.info.country_id);
        data.append("positions", userInfo.info.positions);
        data.append("prov", prov);
        data.append("facebook_link", userInfo.info.facebook_link != null ? userInfo.info.facebook_link : "");
        data.append("instagram_link", userInfo.info.instagram_link != null ? userInfo.info.instagram_link : "");
        data.append("linkedin_link", userInfo.info.linkedin_link != null ? userInfo.info.linkedin_link : "");
        data.append("current_user_role_id", user.role_id);


        // set the header to be able to send files to backend.
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };


        axios.post('/api/updateProfil', data, config).then((res) => {
            if (res.data.success) {
                setshowBanner({ show: true, message: "La modification de votre profil c'est complété avec succès", variant: 'success' });

                if (userInfo.info.role_id == 3 || userInfo.info.role_id == 2) {

                    const newInfo = userInfo.info;
                    newInfo['media'] = res.data.newMedia;

                    setUserInfo({
                        ...userInfo,
                        info: newInfo
                    });
                }
            }
            else {
                if (userInfo.info.role_id == 1) {
                    setshowBanner({ show: true, message: "Une erreur c'est produit. Assurer vous d'avoir bien remplis tous les champs. Les champs avec un * sont obligatoire", variant: 'danger' });
                }
                else {
                    setshowBanner({ show: true, message: "Une erreur c'est produit. Assurer vous d'avoir bien remplis tous les champs. Les champs avec un * sont obligatoire et si vous avez fournis une photo elle dois être valide.", variant: 'danger' });
                }
            }
        });

    }

    const handleModalConfim = (e) => {

        switch (showConfirmModal.context) {

            case 'RESET_PASSWORD': {

                handleResetPassword();
                setShowConfirmModal({
                    show: false,
                    title: '',
                    message: "",
                    variantClose: '',
                    variantConfirm: '',
                    context: '',
                })
                break;
            }
            case 'UNSUBSCRIBE': {


                axios.post('/api/unSubscribe', userInfo.info).then(res => {
                    Cookies.remove('egym_user_logged_in');
                    axios.post('/api/logout').then(res => {
                        history.push('/');
                    });

                })


                break;
            }
            case 'STATUS': {

                handleStatusChange({ target: { id: 'status', checked: !userInfo.info.status }})
                setShowConfirmModal({
                    show: false,
                    title: '',
                    message: "",
                    variantClose: '',
                    variantConfirm: '',
                    context: '',
                })
                break;
            }
        }
    }

    const handleModalClose = () => {
        setShowConfirmModal({
            show: false,
            title: '',
            message: "",
            variantClose: '',
            variantConfirm: '',
            context: '',
        })
    }


    const handleClick = (e) => {

        switch (e.target.id) {

            case 'RESET_PASSWORD': {
                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Voulez-vrous vraiment rénitialiser votre mot de passe ? En confirmant, un courriel vous sera envoyé avec les étapes à suivre.",
                    variantClose: 'dark',
                    variantConfirm: 'danger',
                    context: 'RESET_PASSWORD',
                })

                break;
            }
            case 'UNSUBSCRIBE': {

                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: `Votre abonnement termine le ${userInfo.square.endOfSubscription}, voulez-vous vraiment vous désabonner maintenant. Si vous confirmer, vous allez perdre accès à la plateforme dès maintenant.`,
                    variantClose: 'dark',
                    variantConfirm: 'danger',
                    context: 'UNSUBSCRIBE',
                })
                break;
            }
            case 'status': {


                if (userInfo.info.status) {
                    setShowConfirmModal({
                        show: true,
                        title: 'Avertissement',
                        message: "Voulez-vrous vraiment désactivé cet utilisateur, il perdra accès à la plateforme dès maintenant et il ne pourra plus y accéder tant que vous ne l'avez pas réactivé.",
                        variantClose: 'dark',
                        variantConfirm: 'danger',
                        context: 'STATUS',
                    })
                }
                else {
                    setShowConfirmModal({
                        show: true,
                        title: 'Avertissement',
                        message: "Voulez-vrous vraiment réactivé cet utilisateur, il aura accès à la plateforme dès maintenant.",
                        variantClose: 'dark',
                        variantConfirm: 'danger',
                        context: 'STATUS',
                    })
                }


                break;
            }
        }
    }

    //if(userInfo) console.log(userInfo.info)

    return (
        <>
            <Header user={user} />

            <Container fluid className="p-3">
                <Form onSubmit={handleOnSubmit} ref={formRef} className="form border-light rounded p-4">
                    <Card bg="light" className="mb-2">
                        <Card.Header className="bg-secondary text-white">
                            <h4 style={{display:'inline-block'}}>Modifier le profil</h4>
                            <span className="fa-pull-right">
                                <Button type="submit" variant="primary">
                                    Enregistrer le profil
                                </Button>
                            </span>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-2 justify-content-center">
                                <Col lg={8}>
                                    <Card bg="light" className="shadow-sm" style={{zIndex:"0"}}>
                                        <Card.Header as="h4" className="align-content-center">
                                            Informations personnelles
                                        </Card.Header>
                                        <Card.Body>

                                            {/* banner section */}
                                            <Row className="mb-2">
                                                {
                                                    showBanner.show && <Col lg={12} >
                                                        <div className="text-center">
                                                            <Alert variant={showBanner.variant} onClose={() => setshowBanner({ ...showBanner, show: false })} dismissible>
                                                                {showBanner.message}
                                                            </Alert>
                                                        </div>
                                                    </Col>
                                                }
                                            </Row>

                                            <Row className="mb-2">
                                                <Col lg={12} >
                                                    <div className="sticky-top">
                                                        {userInfo &&
                                                            <>
                                                                <Row className="g-4 justify-content-center mb-2">
                                                                    <Col lg={12}>
                                                                        <Form.Group className="mb-2" controlId="firstname">
                                                                            <Form.Label className="lead fs-4">Prénom *</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name="fname"
                                                                                value={userInfo.info.firstname}
                                                                                onChange={handleOnChange}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={12}>
                                                                        <Form.Group className="mb-2" controlId="lastname">
                                                                            <Form.Label className="lead fs-4">Nom *</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name="fname"
                                                                                value={userInfo.info.lastname}
                                                                                onChange={handleOnChange}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-2 g-4 justify-content-center">
                                                                    <Col lg={user.role_id === 2 ? 6 : 12}>
                                                                        <Form.Group className="mb-2" controlId="emailLock">
                                                                            <Form.Label className="lead fs-4">Courriel</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                name="email"
                                                                                defaultValue={userInfo.info.email}
                                                                                readOnly
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    {user.role_id === 2 ?
                                                                        <Col lg={6}>
                                                                            <Form.Group className="mb-2" controlId="email">
                                                                                <Form.Label className="lead fs-4">Nouveau Courriel</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    name="email"
                                                                                    value={userInfo.info.email}
                                                                                    onChange={handleOnChange}
                                                                                />
                                                                            </Form.Group>
                                                                        </Col>
                                                                        : ''
                                                                    }
                                                                </Row>

                                                                <Row className="g-4 mb-2">
                                                                    {userInfo.info.role_id == 1 ?
                                                                        <Col lg={6}>
                                                                            <Form.Group className="mb-2" controlId="birthdate">
                                                                                <Form.Label className="lead fs-4">Date de naissance *</Form.Label>
                                                                                <Form.Control
                                                                                    type="date"
                                                                                    name="birthdate"
                                                                                    value={userInfo.info.birthdate}
                                                                                    onChange={handleOnChange}
                                                                                    max={currentDate}
                                                                                />
                                                                            </Form.Group>
                                                                        </Col>
                                                                        : ''
                                                                    }
                                                                    <Col lg={6}>
                                                                        <Form.Group className="mb-2" controlId="gender">
                                                                            <Form.Label className="lead fs-4">Sexe *</Form.Label>
                                                                            <Form.Select defaultValue={userInfo.info.gender} onChange={handleOnChange}>
                                                                                <option value={'Homme'}>Homme</option>
                                                                                <option value={'Femme'}>Femme</option>
                                                                                <option value={'Autre'}>Autre</option>
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>

                                                                <Row className="mb-2 g-4 justify-content-center">
                                                                    <Col lg={6}>
                                                                        <Form.Group className="mb-2" controlId="country_id">
                                                                            <Form.Label className="lead fs-4">Pays *</Form.Label>
                                                                            <Form.Select defaultValue={userInfo.info.country_id} onChange={handleOnChange}>
                                                                                {
                                                                                    userInfo.location.map((item, idx) => {
                                                                                        return <option key={idx} value={item.id}>{item.name}</option>
                                                                                    })
                                                                                }
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        <Form.Group className="mb-2" controlId="province_id">
                                                                            <Form.Label className="lead fs-4">Province *</Form.Label>
                                                                            <Form.Select defaultValue={userInfo.info.province_id} onChange={handleOnChange}>
                                                                                <Prov idCountry={userInfo.info.country_id} listCountries={userInfo.location} />
                                                                            </Form.Select>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>

                                                                <Row className=" p-3">
                                                                    <Button type='button' id='RESET_PASSWORD' onClick={handleClick} variant="primary">Réinitialiser mon mot de passe</Button>
                                                                </Row>

                                                                {user.role_id === 2 ?
                                                                    <>
                                                                        <Row className="g-4">
                                                                            <Col lg={6}>
                                                                                <Form.Group className="mb-2" controlId="status">
                                                                                    <Form.Check
                                                                                        type="switch"
                                                                                        label="Statut de l'utilisateur"
                                                                                        checked={userInfo.info.status}
                                                                                        onChange={handleClick}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>

                                                                    </>
                                                                    : ''
                                                                }
                                                                {user.role_id === 3 || (user.role_id === 2 && (userInfo.info.role_id == 3 || userInfo.info.role_id == 2)) ?
                                                                    <>
                                                                        <Row className="mb-2 g-4">
                                                                            <Col lg={12}>
                                                                                <Form.Group className="mb-2" controlId="title">
                                                                                    <Form.Label className="lead fs-4">Titre *</Form.Label>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="title"
                                                                                        value={userInfo.info.title}
                                                                                        onChange={handleOnChange}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={12}>
                                                                                <Form.Group className="mb-2" controlId="description">
                                                                                    <Form.Label className="lead fs-4">Description *</Form.Label>
                                                                                    <Form.Control
                                                                                        as="textarea"
                                                                                        name="description"
                                                                                        style={{ height: '250px' }}
                                                                                        value={userInfo.info.description}
                                                                                        onChange={handleOnChange}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>

                                                                        <Row className="mb-2 g-4">
                                                                            <Col lg={12}>
                                                                                <Form.Group className="mb-2" controlId="facebook_link">
                                                                                    <Form.Label className="lead fs-4">Lien vers votre page Facebook</Form.Label>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="facebook_link"
                                                                                        value={userInfo.info.facebook_link != null ? userInfo.info.facebook_link : ''}
                                                                                        onChange={handleOnChange}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={12}>
                                                                                <Form.Group className="mb-2" controlId="instagram_link">
                                                                                    <Form.Label className="lead fs-4">Lien vers votre page Instagram</Form.Label>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="instagram_link"
                                                                                        value={userInfo.info.instagram_link != null ? userInfo.info.instagram_link : ''}
                                                                                        onChange={handleOnChange}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={12}>
                                                                                <Form.Group className="mb-2" controlId="linkedin_link">
                                                                                    <Form.Label className="lead fs-4">Lien vers votre page LinkedIn</Form.Label>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        name="linkedin_link"
                                                                                        value={userInfo.info.linkedin_link != null ? userInfo.info.linkedin_link : ''}
                                                                                        onChange={handleOnChange}
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>

                                                                        <Row className="mb-2 g-4">
                                                                            <Col lg={6}>
                                                                                <Form.Group className="mb-2" controlId="currentMedia">
                                                                                    <Form.Label className="lead fs-4">Photo actuelle</Form.Label>
                                                                                    <Image src={userInfo.info.media} thumbnail />
                                                                                </Form.Group>
                                                                            </Col>
                                                                            <Col lg={6}>
                                                                                <Form.Group className="mb-2" controlId="media">
                                                                                    <Form.Label className="lead fs-4">Changer ma photo</Form.Label>
                                                                                    <Form.Control
                                                                                        type="file"
                                                                                        name="media"
                                                                                    />
                                                                                </Form.Group>
                                                                            </Col>
                                                                        </Row>

                                                                    </>
                                                                    : ''
                                                                }
                                                            </>
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Row className="my-4">
                                        {/* Paiement*/}
                                        <Col lg={12}>
                                            <Card bg="light" className="shadow-sm">
                                                <Card.Header as="h4" className="">
                                                    Méthodes de paiement
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row className="mb-2 g-4">
                                                        <Col lg={12}>
                                                            <Form.Label className="lead fs-4">Méthodes de paiements</Form.Label>
                                                            <Accordion className="border p-2">
                                                                <Accordion.Item eventKey="0">

                                                                    {userInfo && (userInfo.info.id_client_square == null || userInfo.info.id_client_square == '')
                                                                        ?
                                                                        <Accordion.Header>Ajout d'une méthode de paiement</Accordion.Header>
                                                                        :
                                                                        <Accordion.Header>{ userInfo && userInfo.square.brand.charAt(0).toUpperCase() + userInfo.square.brand.slice(1)
                                                                            + " terminant par "
                                                                            + userInfo.square.last4 + ' expiration : ' + userInfo.square.exp}</Accordion.Header>
                                                                    }

                                                                    <Accordion.Body>
                                                                        <div className="relative">
                                                                            <Row className="mb-2">
                                                                                <Col lg={9}>
                                                                                <h4>Changer ma méthode de paiement</h4>
                                                                                </Col>
                                                                                <Col lg={3}>
                                                                                    {
                                                                                    userInfo && userInfo.info.role_id == user.role_id && userInfo.info.role_id != 3 ?
                                                                                            <Button variant="outline-danger" id='UNSUBSCRIBE' onClick={handleClick} type="button">Me désabonner</Button>
                                                                                            : ''
                                                                                    }

                                                                                </Col>
                                                                            </Row>


                                                                            <ChangePaymentForm
                                                                                zipErrorMessage={zipErrorMessage}
                                                                                fieldEmptyErrorMessage={fieldEmptyErrorMessage}
                                                                            />
                                                                        { loaded && <div id="card-container" ></div> }
                                                                            <span className="error">{cardErrorMessage}</span>

                                                                            <Button variant="primary" id="card-button" onClick={handleCardChange} type="button" className="width_payment" disabled={buttonDisabled}>Changer la méthode de paiement</Button>
                                                                            <Loading style={spinnerStyle} />

                                                                        </div>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>

                                {/* Pr/f/rences */}
                                <Col lg={4} className="p-2">
                                    <Card bg="light" className="shadow-sm sticky-top" style={{zIndex:"0"}}>
                                        <Card.Header as="h4" className="" style={{zIndex:"0"}}>
                                            Préférences
                                        </Card.Header>
                                        <Card.Body>
                                            <Row className="mb-2">
                                                <Col xs={6} sm={6} md={6} lg={6}>
                                                    <h3 className="lead fs-4">Sports</h3>
                                                    <hr />
                                                </Col>
                                                <Col xs={6} sm={6} md={6} lg={6}>
                                                    <h3 className="lead fs-4">Positions</h3>
                                                    <hr />
                                                </Col>
                                            </Row>

                                            {userInfo && <Sports sportsList={userInfo.sports} userPositions={userInfo.info.positions}
                                                userInfo={userInfo} setUserInfo={setUserInfo}
                                            />}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                </Form>
            </Container>

            <Footer />
            <ModalSuccess
                title='Notification'
                body="Un courriel vous à été envoyer pour changer votre mot de passe"
                buttonMessage='Fermer'
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
            <ModalInformations
                title={showConfirmModal.title}
                message={showConfirmModal.message}
                show={showConfirmModal.show}
                variantClose={showConfirmModal.variantClose}
                variantConfirm={showConfirmModal.variantConfirm}
                handleConfirm={handleModalConfim}
                handleClose={handleModalClose}
            />


        </>
    )
}



const ModalInformations = ({ title, message, show, handleClose, handleConfirm, variantClose, variantConfirm }) => {


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant={variantClose} onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button variant={variantConfirm} onClick={handleConfirm}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}


const ChangePaymentForm = ({zipErrorMessage, fieldEmptyErrorMessage}) => {

    return (
        <>
            <Row className="mb-2">
                <Form.Group className="mb-2" as={Col} controlId="cardOwner">
                    <Form.Label className="lead fs-4">Titulaire de la carte</Form.Label>
                    <Form.Control type="text" name="card_owner" placeholder="Entrez votre nom complet..." />
                </Form.Group>
            </Row>

            <Row className="mb-2">
                <Form.Group className="mb-2" as={Col} controlId="address">
                    <Form.Label className="lead fs-4">Adresse</Form.Label>
                    <Form.Control className="mb-2" type="text" placeholder="Numéro civique, nom de la rue..." />
                    <Form.Control type="text" placeholder="Appartement, unitée..." />
                </Form.Group>
            </Row>

            <Row className="mb-2">
                <Form.Group className="mb-2" as={Col} controlId="zip">
                    <Form.Label className="lead fs-4">Code postal</Form.Label>
                    <Form.Control className="mb-2" type="text" placeholder="H1H 1H1" />
                    <span className="error">{zipErrorMessage}</span>
                </Form.Group>
            </Row>

            <Row className="mb-2">
                <Form.Group className="mb-2" as={Col} controlId="province">
                    <Form.Label className="lead fs-4">Province</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue='Québec' />
                </Form.Group>

                <Form.Group className="mb-2" as={Col} controlId="country">
                    <Form.Label className="lead fs-4">Pays</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue='Canada' />
                </Form.Group>
                <span className="error">{fieldEmptyErrorMessage}</span>
            </Row>


        </>
    )
}



const Prov = ({ idCountry, listCountries }) => {

    const currentCountryProvince = listCountries.find(country => country.id == idCountry).provinces;

    return (
        <>
            {
                currentCountryProvince.map((prov, idx) => <option key={idx} value={prov.id}>{prov.name}</option>)
            }
        </>

    )
}



const Sports = ({ sportsList, userPositions, userInfo, setUserInfo }) => {

    const handleOnChange = (e) => {

        const targetParent = e.target.getAttribute("typeofinput");
        const value = e.target.value;
        const checked = e.target.checked;

        const newInfo = userInfo.info;

        // si c'est le parent qui est coché
        if (targetParent == 'parent') {

            let newPositions = [];
            let currentSport = sportsList.filter(sport => sport.id == value);

            //Si il viens d'être coché, ajoute tous les positions
            if (checked) {

                for (let i = 0; i < currentSport[0].positions.length; i++) {
                    newPositions.push(currentSport[0].positions[i].id.toString());
                }
                newInfo['positions'] = [...newInfo['positions'], ...newPositions];

            }
            // si il viens d'être décoché, enlève tous les positions
            else {

                for (let i = 0; i < currentSport[0].positions.length; i++) {
                    newPositions.push(currentSport[0].positions[i].id.toString());
                }
                let removePosition = userPositions.filter(position => !newPositions.includes(position.toString()))
                newInfo['positions'] = [...removePosition];

            }

            setUserInfo({
                ...userInfo,
                info: newInfo
            });
            return;
        }

        //Ajoute la position
        if (checked) {
            newInfo['positions'] = [...newInfo['positions'], value.toString()];
        }
        //Enlève la position
        else {
            newInfo['positions'] = userInfo.info['positions'].filter(position => position !== value.toString());

        }
        setUserInfo({
            ...userInfo,
            info: newInfo
        });

    }

    return (
        <>
            {sportsList.map((sport) => {
                var count = 1;
                return sport.positions.map((position) => {
                    if (count == 1) {
                        count++;
                        return (
                            <div key={uuidv4()}>
                                <Row key={uuidv4()}>
                                    <Col xs={6} sm={6} md={6} lg={6}>
                                        <Form.Group className="mb-2" controlId={sport.name}>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={handleOnChange}
                                                value={sport.id}
                                                label={sport.name}
                                                typeofinput={'parent'}
                                                checked={userPositions.some(up => sport.positions.some(p => (p.id).toString() == up))}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} sm={6} md={6} lg={6}>
                                        <Form.Group className={position.name == 'tous' ? 'd-none' : ''}  controlId={sport.name + "_" + position.name}>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={handleOnChange}
                                                value={position.id}
                                                label={position.name}
                                                checked={userPositions.includes((position.id).toString())}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {count > sport.positions.length ? <br /> : ''}
                            </div>
                        );
                    } else {
                        count++;
                        return (
                            <div key={uuidv4()}>
                                <Row >
                                    <Col xs={{ span: 6, offset: 6 }} sm={{ span: 6, offset: 6 }} md={{ span: 6, offset: 6 }} lg={{ span: 6, offset: 6 }}>
                                        <Form.Group className="mb-2" controlId={sport.name + "_" + position.name}>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={handleOnChange}
                                                value={position.id}
                                                label={position.name}
                                                checked={userPositions.includes((position.id).toString())}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {count > sport.positions.length ?  <br /> : ''}
                            </div>
                        );
                    }
                });
            })
            }
        </>
    )
}
