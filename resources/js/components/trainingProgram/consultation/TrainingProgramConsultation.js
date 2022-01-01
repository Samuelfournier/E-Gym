import React from 'react'
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Header from '../../_components/Header/Header'
import Footer from '../../_components/Footer/Footer'
import TrainingProgramConsultationDetails from './TrainingProgramConsultationDetails'
import './trainingProgramConsultation.css'

const TrainingProgramConsultation = ({user}) => {
    const { id } = useParams();
    return (
        <>
            <Header user={user} />
            <Container className="body-container" fluid>
                <TrainingProgramConsultationDetails id={id} user={user} />
            </Container>
            <Footer />
        </>
    )
}

export default TrainingProgramConsultation
