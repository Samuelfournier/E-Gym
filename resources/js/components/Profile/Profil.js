import React,{useState} from 'react'
import "./ProfilForm.css"
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import { Col, Row, Container, Image } from 'react-bootstrap'
import ProfilForm from './ProfilForm'


const Profil = ({ user }) => {


    return (
        <>
            <Header user={user} />
            <Container fluid className="main_container_profile">
                <Col lg={12}>
                    <div>
                        <ProfilForm
                        />
                    </div>
                </Col>
            </Container>
            <Footer />
        </>
    )
}
export default Profil
