import {React, useState} from 'react'
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import ResetPassword from './ResetPassword'
import { Col, Row,Container,Image } from 'react-bootstrap'
import ModalSuccess from '../common/ModalSuccess'
import { useHistory } from 'react-router-dom';
import "../password_reset/reset.css";

const Reinitialisation = () => {

    const [showSuccesAlert, setshowSuccesAlert] = useState(false);
    let history = useHistory();

    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }

    const handleRedirect = () => {
        history.push('/connexion');
    }



    return (
        <>
            <Header user={null} />
            <Container fluid className="main_container_reset">
                    <Col lg={12}>
                        <div >
                            <ResetPassword setshowSuccesAlert={setshowSuccesAlert}/>
                        </div>
                    </Col>
            </Container>
            <Footer />
            <ModalSuccess
                title='Notification'
                body= "Mot de passe réinitialisé avec succès."
                buttonMessage='Connexion'
                redirect={true}
                handleRedirect={handleRedirect}
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
        </>
    )
}
export default Reinitialisation
