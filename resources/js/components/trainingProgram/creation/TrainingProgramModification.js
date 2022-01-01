import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../_components/Header/Header'
import Footer from '../../_components/Footer/Footer'
import TrainingProgramCreationDetails from './TrainingProgramCreationDetails'
import { Container } from 'react-bootstrap'

const TrainingProgramModification = ({ user }) => {
    const [formSubmitted, setFormSubmitted] = useState(true);
    const { id } = useParams();

    return (
        <>
            <Header user={user} />
            <Container className="body-container" fluid>
                {!formSubmitted && <TrainingProgramForm user={user} formRef={formRef} handleSubmit={handleFormSubmit} />}
                {formSubmitted && <TrainingProgramCreationDetails id={id} handleFormChange={() => setFormSubmitted(false)} />}
            </Container>
            <Footer />
        </>
    )
}

export default TrainingProgramModification
