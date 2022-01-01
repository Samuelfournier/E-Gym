import { React, useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'

const AddExerciceForm = ({ formRef, submitCallback, handleClose, exercices }) => {
    const [exerciceId, setExerciceId] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (exerciceId != null) {
            handleClose();
            const exercice = exercices.find(exercice => exercice.id == exerciceId);
            submitCallback(exercice);
        }
    }

    const ExerciceInfo = () => {
        const exercice = exercices.find(exercice => exercice.id == exerciceId);
        return (
            <Card>
                <Card.Body className="exercice-preview-body-container">
                    <Card.Img className="ratio ratio-16x9 mx-auto" src={exercice.media} style={{ width: 350, height: 350 }} />
                    <Card.Title className="exercice-preview-title">{exercice.name}</Card.Title>
                    <Card.Subtitle className="exercice-preview-description">{exercice.description}</Card.Subtitle>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label className="exercice-form-label" >Exercices</Form.Label>
                <Form.Select name="exerciceId" onChange={e => setExerciceId(e.target.value)} defaultValue="0" htmlSize="5">
                    <option disabled key="0" value="0">Choisissez un exercice...</option>
                    {exercices != '' && Object.keys(exercices).map(function (exercice_idx, idx) {
                        return <option key={`exercice-${exercices[exercice_idx].id}`} value={exercices[exercice_idx].id}>{exercices[exercice_idx].name}</option>
                    })}
                </Form.Select>
            </Form.Group>
            {exerciceId != null && <ExerciceInfo />}
            <Button variant="danger" onClick={handleClose}>Annuler</Button>
            <Button type="submit" variant="primary">Ajouter</Button>
        </Form>
    )
}

export default AddExerciceForm
