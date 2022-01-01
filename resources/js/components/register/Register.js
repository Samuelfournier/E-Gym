import {React, useState, useRef } from 'react'
import "./register.css";
import { Col,Container, } from 'react-bootstrap'
import { useHistory, } from 'react-router-dom';
import axios from 'axios'

//Components
import ModalSuccess from "../common/ModalSuccess";
import Footer from "../_components/Footer/Footer";
import Header from "../_components/Header/Header";
import RegisterForm from "./RegisterForm";
import Loading from '../payments/Loading';

export default function Register()
{
    // State pour gérer quand afficher le modal
    const [show, setShow] = useState(false);

    // State pour gerer le message
    const [notification, setNotification] = useState('');

    // State pour le loading animation
    const [spinnerStyle, setspinnerStyle] = useState("none");

    // Variables
    const formRef = useRef(null);

    // Functions
    // une méthode pour envoyer en props au modal pour qu'il puisse dire au parent de le fermer
    const handleShow = () => {
            setShow(!show);
    }

    //le use history pour redirigé
    let history = useHistory();

    //Fonction à envoyé à l'enfant pour redirect à la fermeture du modal
    const handleRedirect = () => {
        history.push('/connexion');
    }

    const registerUser = async function(form) {

        // Build the user object to send
        const user = {
                firstname: form.current['firstname'].value,
                lastname: form.current['lastname'].value,
                email: form.current['email'].value,
                password: form.current['password'].value,
                password_confirmation: form.current['password_confirmation'].value,
            };

        // Fetch cookie
        let cookie = await axios.get('/sanctum/csrf-cookie');
        // Register user
        try{

            let response = await axios.post('/api/register', user);
            //Cookies.set('egym_user_logged_in', true, { expires: 7 }); //create cookie
            console.log(response);
            return 'Un courriel vous a été envoyé';
        }
        catch(error){
            console.log('error::',error);
            return 'Un courriel vous a été envoyé'; // same notification in case a problem occured in
        }

    }

    const handleSubmit = async function(e) {

        e.preventDefault();

        try{
            // Handle loading style
            setspinnerStyle("block");

            const registerResult = await registerUser(formRef);
            if(registerResult){
                // return the modalsuccess
                setNotification(registerResult);
                setShow(true);
                //Handle loading style
                setspinnerStyle("none");
                return;
            }
            // redirect
            handleRedirect();

        }
        catch (err) {
            console.log(err);
        }
    }

        // Return
    return (
        <>
            <Header user={null} />
            <Container fluid className=" main_container_register">
                <Col lg={12}>
                    <div>
                        <RegisterForm
                            handleSubmit={handleSubmit}
                            formRef={formRef}
                        />
                    </div>
                    <Loading style={spinnerStyle} />
                </Col>
            </Container>
            <Footer />

            <ModalSuccess
                title="Notification"
                body={notification}
                buttonMessage="Aller à la page de connexion"
                redirect={true}
                handleRedirect={handleRedirect}
                show={show}
                handleShow={handleShow}
            />
        </>
    );
}
