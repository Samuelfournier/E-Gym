import { React, useState } from 'react'
import './forgottenPassword.css'
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import { Col, Row, Container, Image } from 'react-bootstrap'
import Forgotten_passwordForm from './forgotten_passwordForm'
import ModalSuccess from '../common/ModalSuccess'

const ForgottenPassword = () => {

    const [showSuccesAlert, setshowSuccesAlert] = useState(false);

    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }

    return (
        <>
            <Header user={null} />
            <Container fluid className="main_container_frgt_pass">
                <Col lg={12}>
                    <div>
                        <Forgotten_passwordForm setshowSuccesAlert={setshowSuccesAlert} />
                    </div>
                </Col>
            </Container>
            <Footer />
            <ModalSuccess
                title='Notification'
                body="Nous avons envoyé votre lien de réinitialisation de mot de passe par e-mail."
                redirect={false}
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
        </>
    )
}
export default ForgottenPassword
