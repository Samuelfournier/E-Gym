import { useRef, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Header from '../../_components/Header/Header'
import Footer from '../../_components/Footer/Footer'
import TrainingProgramCreationDetails from './TrainingProgramCreationDetails'
import TrainingProgramForm from './TrainingProgramForm'
import { Container, Row, Col, Modal, Button, Card } from 'react-bootstrap'
import './trainingProgramCreation.css'
import { Formik, Form } from 'formik'

const TrainingProgramCreation = ({ user, ...rest }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState(new FormData());
    const [formSubmitted, setFormSubmitted] = useState(id ? true : false);
    const [mode, setMode] = useState(id ? "modification" : "creation");
    const [trainingProgram, setTrainingProgram] = useState(null);
    const [modal, setModal] = useState({
        show: false,
        title: '',
        message: '',
    });
    const formRef = useRef(null);

    useEffect(() => {
        if (id == undefined) {
            setTrainingProgram(null);
            setFormSubmitted(false);
        }
    }, [window.location.href])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (mode == "modification" && trainingProgram != null) {
        // show modal if weekNumber/sessionNumber is inferior to current number
        if (parseInt(formRef.current['weekNumber'].value) < trainingProgram.weeks.length && parseInt(formRef.current['sessionNumber'].value) < trainingProgram.weeks[0].sessions.length) {
            setModal({
                show: true,
                title: 'confirmation',
                message: 'le nombre de semaine et de séance souhaité est inférieur au nombre de semaine et de séance actuel. Certaines semaines/séances seront effacéees. Souhaitez-vous continuer ?'
            });
        } else if (parseInt(formRef.current['weekNumber'].value) < trainingProgram.weeks.length) {
            setModal({
                show: true,
                title: 'confirmation',
                message: 'le nombre de semaine souhaité est inférieur au nombre de semaines actuel. Certaines semaines seront effacéees. Souhaitez-vous continuer ?'
            });
        } else if (parseInt(formRef.current['sessionNumber'].value < trainingProgram.weeks[0].sessions.length)) {
            setModal({
                show: true,
                title: 'confirmation',
                message: 'le nombre de séances souhaité est inférieur au nombre de séances actuel. Certaines séances seront effacéees. Souhaitez-vous continuer ?'
            });
        } else {
            saveData();
        }
     } else {
            saveData();
        }
    }

    const saveData = () => {
        if (formRef != null) {
            var data = new FormData();
            data.append("title", formRef.current['title'].value);
            data.append("position_id", formRef.current['position'].value);
            data.append("activity_id", formRef.current['sport'].value);
            data.append("category_id", formRef.current['category'].value);
            data.append("content", formRef.current['description'].value);
            data.append("overview", formRef.current['summary'].value);
            data.append("media", formRef.current['media'].files[0]);
            data.append("tags", formRef.current['tags'].value);
            data.append("weekNumber", formRef.current['weekNumber'].value);
            data.append("sessionNumber", formRef.current['sessionNumber'].value);

            if (user.role_id === 2)
                data.append('user_id', formRef.current['author'].value);
            else
                data.append('user_id', user.id);

            setFormData(data);
            setFormSubmitted(true);
        }
    }

    const handleModifyDetails = (trainingProgramData) => {
        setTrainingProgram(trainingProgramData);
        setFormSubmitted(false);
    }

    const handleModalCancel = () => {
        setModal({
            show: false,
            title: '',
            message: "",
        })
    }

    const handleModalConfirm = () => {
        saveData();
        setModal({
            show: false,
            title: '',
            message: "",
        })
        setFormSubmitted(true);
    }

    return (
        <>
            <Header user={user} />
            <Container className="p-4" fluid>
                {!formSubmitted && <TrainingProgramForm
                user={user}
                data={trainingProgram}
                formRef={formRef}
                handleSubmit={handleFormSubmit}
                />}
                {formSubmitted && <TrainingProgramCreationDetails mode={mode} trainingProgramData={trainingProgram} formData={formData.has('title') ? formData : null} id={id ? id : null} handleFormChange={(data) => handleModifyDetails(data)} />}
                <ModalInformations
                    title={modal.title}
                    message={modal.message}
                    show={modal.show}
                    handleCancel={handleModalCancel}
                    handleConfirm={handleModalConfirm}
                />
            </Container>
            <Footer />
        </>
    )
}

const ModalInformations = ({ title, message, show, handleConfirm, handleCancel }) => {


    return (
        <>
            <Modal show={show} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {message}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'danger'} onClick={handleCancel}>
                        annuler
                    </Button>
                    <Button variant={'primary'} onClick={handleConfirm}>
                        confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default TrainingProgramCreation
