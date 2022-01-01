import {React, useState, useRef } from 'react';
import Footer from '../_components/Footer/Footer';
import Header from '../_components/Header/Header';
import { Col, Container } from 'react-bootstrap';
import LoginForm from './LoginForm'
import "./Login.css";
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Login() {

    let history = useHistory();
    const formRef = useRef(null);
    const [invalidCredentialsError, setinvalidCredentialsError] = useState('');

    const loginUser = async function(form) {

        // Build the user object to send
        const user = {
                email: form.current['email'].value,
                password: form.current['password'].value,
            };

        // Fetch cookie
        let cookie = await axios.get('/sanctum/csrf-cookie');

        try{
            let loginResponse = await axios.post('/api/login', user);
            Cookies.set('egym_user_logged_in', true, { expires: 7 }); //create cookie
            return loginResponse;
        }
        catch (error) {

            if(error.response.status === 419)
            {
                await axios.post("/api/logout");
                history.push('/connexion');
            }


            return error.response;
        };

    }

    const handleSubmit = async function(e) {

        e.preventDefault();

        try{
            const loginResult = await loginUser(formRef);
            if(loginResult.status === 200){
               history.push('/');
            }
            else
            {
                // print message in error
                setinvalidCredentialsError(loginResult.data.message);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

     return (
        <>
            <Header user={null} />
            <Container fluid className="main_container_login">
                    <Col lg={12}className=" py-5">
                        <div className="container_login">
                            <LoginForm handleOnSubmit={handleSubmit}
                                formRef={formRef}
                                invalidCredentialsError = {invalidCredentialsError}
                            />
                        </div>
                    </Col>
            </Container>
            <Footer />
        </>

    )
}
