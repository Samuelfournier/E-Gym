import { React, useState } from 'react'
import { CloseButton, Container, Image, Row, Col, Card, Button, Form, Accordion, ListGroup, Ratio } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import ToggleButtonGroup from '../ToggleButtonGroup';

const ExerciceContainer = ({ exercice, sessionId, handleDelete, handleOrderChange, formRef, handleExerciceDetailsChange }) => {
    const [showDuration, setShowDuration] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [showEquipments, setShowEquipments] = useState(false);
    const [radioButtonValue, setRadioButtonValue] = useState(() => {
        if (exercice.tempo == "" && exercice.duration == 0)
            return '1';
        else if (exercice.duration != 0)
            return '2';
        else
            return '1';
    });

    return (
        <Container className="exercice-container">
            <Row className="justify-content-md-end">
                <Col md="auto" className="exercice-buttons-container">
                    <Row>
                        <Col className="button-container">
                            <FontAwesomeIcon icon={faArrowUp} onClick={() => handleOrderChange(exercice, -1)} className="arrowUpIcon" />
                        </Col>
                        <Col className="button-container">
                            <FontAwesomeIcon icon={faArrowDown} onClick={() => handleOrderChange(exercice, 1)} className="arrowDownIcon" />
                        </Col>
                        <Col className="button-container">
                            <FontAwesomeIcon icon={faTimes} onClick={() => handleDelete(exercice.id)} className="timesIcon" />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="exercice-content-row">
                {/* <Col lg={8} className="my-auto"> */}
                <Col lg={8} >
                    <Card>
                        {/* <Card.Subtitle className="lead text-muted">{exercice.description}</Card.Subtitle> */}
                        <Card.Body>
                            <h2>{exercice.name}</h2>
                            <Accordion className="accordion-exercice">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Description de l'exercice</Accordion.Header>
                                    <Accordion.Body>
                                        {exercice.description}
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Équipements requis</Accordion.Header>
                                    <Accordion.Body className="list-equipments-exercice-container">
                                        {(Array.isArray(exercice.equipments) && exercice.equipments.length > 0) ?
                                        <ListGroup variant="flush" className="list-equipments-exercice">
                                            {exercice.equipments.map((equipment) => {
                                            return <ListGroup.Item key={`exercice-${exercice.id}-equipment-${equipment.id}`}>
                                                <b>{equipment.name}</b> : {equipment.description}
                                            </ListGroup.Item>;
                                        })}</ListGroup>
                                         : "Aucun équipement requis pour cet exercice."}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Form ref={formRef}>
                                <Row>
                                    <Row className="mb-3">
                                        <Col>
                                            <ToggleButtonGroup radioButtonValue={radioButtonValue} setRadioButtonValue={setRadioButtonValue} exercice={exercice} />
                                        </Col>
                                        <Col>
                                            <Row>
                                                {radioButtonValue == 1 && <Col>
                                                    <Form.Control type="text" name="tempo" defaultValue={exercice.tempo} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} placeholder="ex: 2-1-2" />
                                                </Col>}
                                                {radioButtonValue == 2 && <><Col md="auto">
                                                    <Form.Control min="0" name="duration_minutes" defaultValue={isNaN(Math.floor(exercice.duration / 60)) ? "0" : Math.floor(exercice.duration / 60)} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} className="exercice-time" type="number" />
                                                </Col>
                                                    <Form.Label className="time-col" column>Minutes</Form.Label>
                                                    <Col md="auto">
                                                        <Form.Control min="0" name="duration_seconds" defaultValue={exercice.duration % 60} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} className="exercice-time" type="number" />
                                                    </Col>
                                                    <Form.Label className="time-col" column>Secondes</Form.Label>
                                                </>}
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column>
                                            Nombre de Série
                                        </Form.Label>
                                        <Col>
                                            <Form.Control name="nb_serie" type="number" defaultValue={exercice.nb_serie} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} min="1" placeholder="ex: 3" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column>
                                            Nombre de répétitions
                                        </Form.Label>
                                        <Col>
                                            <Form.Control name="nb_repetition" type="number" defaultValue={exercice.nb_repetition} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} min="1" placeholder="ex: 12" />
                                        </Col>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Form.Label column>Temps de repos</Form.Label>
                                        <Col>
                                            <Row>
                                                <Col md="auto">
                                                    <Form.Control name="resting_time_minutes" min="0" defaultValue={isNaN(Math.floor(exercice.resting_time / 60)) ? "0" : Math.floor(exercice.resting_time / 60)} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} className="exercice-time" type="number" />
                                                </Col>
                                                <Form.Label className="time-col" column>Minutes</Form.Label>
                                                <Col md="auto">
                                                    <Form.Control min="0" name="resting_time_seconds" defaultValue={exercice.resting_time % 60} onBlur={(e) => handleExerciceDetailsChange(e, exercice)} className="exercice-time" type="number" />
                                                </Col>
                                                <Form.Label className="time-col" column>Secondes</Form.Label>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                {/* <Col md="auto" className="exercice-media-col"> */}
                <Col lg={4}>
                    <Ratio aspectRatio="16x9">
                        <Image className="card-img-top" src={exercice.media} style={{ width: 350, height: 350 }} />
                    </Ratio>
                </Col>
                
            </Row>
        </Container>
    )
}

export default ExerciceContainer
