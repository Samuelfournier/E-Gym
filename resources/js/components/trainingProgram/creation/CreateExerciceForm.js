import axios from 'axios';
import { React, useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import Select from 'react-select'

const CreateExerciceForm = ({ formRef, handleClose, submitCallback }) => {
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [equipement, setEquipement] = useState(null);
    const [currentEquipement, setCurrentEquipement] = useState([]);


    const handleEquipmentChosen = (e) => {
        setCurrentEquipement(e);
    }

    useEffect(() => {

        axios.get('/api/getEquipementForDropdown').then((res) => {
            setEquipement(res.data);
        })

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // console.log('exercice created !');

        let equipmentId = [];
        if (currentEquipement.length > 0) {
            for (let i = 0; i < currentEquipement.length; i++) {
                equipmentId.push(currentEquipement[i].value);
            }
        }

        let data = new FormData();

        data.append('name', formRef.current['title'].value)
        data.append('description', formRef.current['description'].value)
        data.append('equipement', equipmentId)
        data.append('media', formRef.current['media'].files[0])

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Credentials': true,
            }
        }

        const response = await axios.post('/api/creation-exercice', data, config);

        if (response.data.success === true) {
            // console.log(response);

            const getResponse = await axios.get(`/api/exercice/${response.data.id}`);

            if (response.data.success === true) {
                handleClose();
                submitCallback(getResponse.data.data, true);
            } else if (response.data.success === false) {
                setError(response.data.message);
                setShowAlert(true);
            }
        }
        else if (response.data.success === false) {
            setError(response.data.message);
            setShowAlert(true);
        }
    }

    const ErrorAlert = () => {
        return (
            <Alert variant="danger" onClose={() => setShow(false)}>
                <Alert.Heading>Erreur</Alert.Heading>
                <p>{error}</p>
            </Alert>
        );
    }

    return (
        <>
            {showAlert && <ErrorAlert />}
            <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="exercice-form-label" >Titre*</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="title"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exercice-description">
                    <Form.Label className="exercice-form-label">Description*</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        required />
                </Form.Group>
                <Form.Group  controlId="equipement">
                        <Form.Label>Équipement</Form.Label>
                        <Select
                            isMulti
                            name="equipements"
                            options={equipement}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleEquipmentChosen}
                        />
                    </Form.Group>
                <Form.Group className="mb-3" controlId="exercice-media">
                    <Form.Label className="exercice-form-label">Média*</Form.Label>
                    <Form.Control type="file"
                        placeholder="choisir un fichier"
                        name="media"
                        required />
                </Form.Group>
                <Button variant="danger" onClick={handleClose}>Annuler</Button>
                <Button type="submit" variant="primary">Créer</Button>
            </Form>
        </>
    )
}

export default CreateExerciceForm
