import { React, useState } from 'react'
import { CloseButton, Container, Image, Row, Col, Card, Button, Form, Accordion, ListGroup, Ratio } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import ToggleButtonGroup from '../ToggleButtonGroup';

const ExerciceContainer = ({ exercice, sessionId }) => {
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
            <Row className="exercice-content-row">
                {/* <Col className="my-auto"> */}
                <Col lg={8}>
                    <Card>
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
                                            : <p className="m-3">Aucun équipement requis pour cet exercice.</p>}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Row>
                                <Col>
                                    <Row>
                                        {exercice.tempo != "" ?
                                            <>
                                                <h3>Tempo:</h3>

                                            </> :
                                            <>
                                                <h3>Durée:</h3>
                                            </>
                                        }
                                    </Row>
                                    <Row>
                                        <h3>Nombre de série(s):</h3>
                                    </Row>
                                    <Row>
                                        <h3>Nombre de répétition(s):</h3>
                                    </Row>
                                    <Row>
                                        <h3>Temps de repos:</h3>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        {
                                            exercice.tempo != "" ?
                                                <p>{exercice.tempo}</p> :
                                                <p>{Math.floor(exercice.duration / 60)} minutes et {exercice.duration % 60} secondes</p>
                                        }
                                    </Row>
                                    <Row>
                                        <p>{exercice.nb_serie}</p>
                                    </Row>
                                    <Row>
                                        <p>{exercice.nb_repetition}</p>
                                    </Row>
                                    <Row>
                                        <p>{Math.floor(exercice.resting_time / 60)} minutes et {exercice.resting_time % 60} secondes</p>
                                    </Row>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
                {/* <Col md="auto" className="exercice-media-col-consultation"> */}
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
