import React, { useEffect, useState, useRef } from 'react'
import { Form, Container, Col, Accordion, ListGroup, Row, Button, useAccordionButton, Card, Image, Overlay, Popover, ProgressBar, Spinner, Modal, Alert } from 'react-bootstrap'
import ModalForm from '../../common/ModalForm'
import axios from 'axios'
import AddExerciceForm from '../creation/AddExerciceForm'
import CreateExerciceForm from '../creation/CreateExerciceForm'
import ExerciceContainerConsultation from './ExerciceContainerConsultation'
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';

const TrainingProgramDetails = ({ id = null, user }) => {
    let history = useHistory();
    const [trainingProgram, setTrainingProgram] = useState([]); //contient les données des séances à sauvegarder en BD lorsque l'utilisateur appuie sur le bouton enregistrer
    const [isLoading, setLoading] = useState(true);

    const [currentSessionId, setCurrentSessionId] = useState(0); //permet de render les exercices de la bonne session dans la section de gauche
    const [currentWeekId, setCurrentWeekId] = useState(0); //permet d'enregistrer la description de la semaine dans le bon objet dans l'array weeks
    const [currentWeek, setCurrentWeek] = useState({});
    const [currentSession, setCurrentSession] = useState({});
    const [currentSessionEquipments, setCurrentSessionEquipments] = useState([]);
    const [nbExercices, setNbExercices] = useState(0);
    const [timeTotal, setTimeTotal] = useState(0);
    const [showEquipments, setShowEquipments] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState([]); //on stockera les id des sessions qui ont été complété
    const [weeksCompleted, setWeeksCompleted] = useState([]);
    const [nbSessionsTotal, setNbSessionsTotal] = useState(0);

    const [showConfirmModal, setShowConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        variantAlert: ''
    });

    const handleModalClose = () => {

        const body = {
            publication_id: trainingProgram.id,
            user_id: user.id
        }

        axios.post('/api/seenChanges', body);
        setShowConfirmModal({
            show: false,
            title: '',
            message: "",
            variantAlert: '',
        })
    }


    const getTrainingProgram = async () => {
        axios.get(`/api/training-program/${id}`).then(function (response) {
            // console.log(response.data);
            setTrainingProgram(response.data);
            setCurrentWeekId(response.data.weeks[0].id);
            setCurrentSessionId(response.data.weeks[0].sessions[0].id);
            setNbSessionsTotal(response.data.weeks.length * response.data.weeks[0].sessions.length);

            if (response.data.completed_sessions != null && response.data.completed_sessions != '') {
                setSessionsCompleted(response.data.completed_sessions.split(" "));
            }

            setLoading(false);
        });
    }

    useEffect(() => {
        if (id != null) {
            getTrainingProgram();
        } else {
            history.push('/');
        }
    }, [])

    useEffect(() => {
        
        if (Object.keys(trainingProgram).length > 0 && currentWeekId != 0 && currentSessionId != 0) {

            let week = trainingProgram.weeks.find((week) => week.id === currentWeekId);
            let session = week['sessions'].find((session) => session.id === currentSessionId);

            setCurrentSession(session);
            setCurrentWeek(trainingProgram.weeks.find((week) => week.id === currentWeekId));

            setNbExercices(session['trainings'].length);
            calculateTimeTotal();

        }

        if (trainingProgram.has_changed != null) {
           
            setShowConfirmModal({
                show: true,
                title: 'Avertissement',
                message: "Le plan à été mis à jour par l'auteur(e), donc votre progression à été remis à 0. N'hésiter pas à regarder les nouvelles séances du plan ! ",
                variantAlert: 'warning',
            })
        }

    }, [trainingProgram])

    useEffect(() => {
        if (currentWeekId != 0) {
            setCurrentWeek(
                trainingProgram.weeks.find((week) => week.id === currentWeekId)
            );
        }
    }, [currentWeekId])

    useEffect(() => {
        if (Object.keys(trainingProgram).length > 0 && currentWeekId != 0 && currentSession != 0) {
            let week = trainingProgram.weeks.find((week) => week.id === currentWeekId);
            let session = week['sessions'].find((session) => session.id === currentSessionId);
            setCurrentSession(session);
            calculateTimeTotal();
            setNbExercices(session['trainings'].length);

            var equipments = [];
            session.trainings.map(exercice => {
                exercice.equipments.map(equipment => {
                    if (equipments.find((currentEquipment) => currentEquipment.id === equipment.id))
                        return;

                    equipments = equipments.concat(equipment);
                })
            });
        }

        setCurrentSessionEquipments(equipments);
    }, [currentSessionId])

    useEffect(() => {
        if (Object.keys(sessionsCompleted).length > 0) {
            var weeksCompletedUpdated = [];
            trainingProgram.weeks.map(week => {
                var weekCompleted = true;
                week.sessions.map(session => {
                    if (sessionsCompleted.find(session_id => session_id == session.id) == undefined)
                        weekCompleted = false;
                })
                if (weekCompleted)
                    weeksCompletedUpdated.push((week.id).toString());
            })

            if (Object.keys(weeksCompleted).length > 0) {
                let result = weeksCompletedUpdated.every((week) => {
                    return weeksCompleted.includes(week);
                });

                if (!(weeksCompletedUpdated.length === weeksCompleted.length) || !result)
                    setWeeksCompleted(weeksCompletedUpdated);
            } else {
                setWeeksCompleted(weeksCompletedUpdated);
            }

            const config = {
                headers: {
                    'content-type': 'application/json',
                }
            }

            var sessions = {
                sessions_id: sessionsCompleted,
            }

            axios.post(`/api/save-progress/training-program/${(trainingProgram.id).toString()}`, JSON.stringify(sessions), config);
        }
        else {
            if (trainingProgram.length == 0) return;

            const config = {
                headers: {
                    'content-type': 'application/json',
                }
            }

            var sessions = {
                sessions_id: sessionsCompleted,
            }

            axios.post(`/api/save-progress/training-program/${(trainingProgram.id).toString()}`, JSON.stringify(sessions), config);

        }
    }, [sessionsCompleted])

    const handleShowAddExercice = () => {
        setShowAddExercice(!showAddExercice);
    }

    const handleShowCreateExercice = () => {
        setShowCreateExercice(!showCreateExercice);
    }

    const calculateTimeTotal = () => {
        var time = 0;
        trainingProgram.weeks.map((week) => {
            week.sessions.map((session) => {
                if (session.id != currentSessionId || session.trainings.length == 0)
                    return;

                session.trainings.map((exercice) => {
                    if ((exercice.tempo == "" && exercice.duration == "") || exercice.nb_serie == "" || exercice.nb_repetition == "")
                        return;

                    if (exercice.tempo != "") {
                        let total = 0;
                        let tempoElements = exercice.tempo.split('-');
                        tempoElements.map(element => total += parseInt(element));
                        time += (total * exercice.nb_repetition) * exercice.nb_serie;
                    } else if (exercice.duration != "") {
                        time += (parseInt(exercice.duration) * exercice.nb_repetition) * exercice.nb_serie;
                    }

                    //add resting_time between each serie
                    if (exercice.resting_time != "")
                        time += exercice.resting_time * exercice.nb_serie;
                })
            })
        });

        setTimeTotal(time);
    }

    // load session with the specified id
    const handleSessionClick = (session_id, week_id) => {
        if (week_id != currentWeekId) {
            setCurrentWeekId(week_id);
            setCurrentSessionId(session_id);
        }
        else if (session_id != currentSessionId) {
            setCurrentSessionId(session_id);
        }
    }

    const addSessionCompleted = (id) => {
        setSessionsCompleted([...sessionsCompleted, id.toString()]);
    }

    const removeSessionCompleted = (session_id) => {
        setSessionsCompleted(sessionsCompleted.filter(id => id != session_id.toString()));
    }
    

    // console.log('current sessionId', currentSessionId);
    
    return (
        <Container fluid>
            <Row>
                {isLoading ? <Spinner className="trainingProgram-spinner" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> :
                    <>
                        <Container className="trainingProgram-title-container" fluid>
                            <h1>{trainingProgram.title}</h1>
                        </Container>
                        <Container fluid>
                            <Row className="justify-content-sm-center">
                                <Col md={8}>
                                    <Card className="mb-3">
                                        <Card.Title className="text-center mt-3">Description du plan d'entrainement</Card.Title>
                                        <Card.Body className="text-center">{trainingProgram.content}</Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                        <Container>
                            <Row>
                                <Col md={9} className="session-container">
                                    <Card className="exercices-container">
                                        <h1 className="training-title">{`Semaine ${currentWeek.order + 1} - Séance ${currentSession.order + 1}`}</h1>
                                        <Card className="mx-3">
                                            <Card.Title className="text-center m-3">Description de la semaine</Card.Title>
                                            <Card.Body className="text-justify">{currentWeek.description == "" ? "Aucune description pour cette semaine." : currentWeek.description}</Card.Body>
                                        </Card>
                                        <Form>
                                            <Row className="session-row">
                                                <Col>
                                                    <Row><h3>Équipements requis</h3></Row>
                                                    <Row>
                                                        <Container className="session-equipments-list-button">
                                                            <Button variant="primary" onClick={() => setShowEquipments(!showEquipments)}>Voir les équipements</Button>
                                                            {showEquipments &&
                                                                <Card className="current-session-card-equipments-list">
                                                                    <ListGroup variant="flush">
                                                                        {currentSessionEquipments.length > 0 ? currentSessionEquipments.map((equipment) => {
                                                                            return <ListGroup.Item key={`session-equipment-${equipment.id}`} className="equipments-list-item">{equipment.name}</ListGroup.Item>;
                                                                        }) : <p className="ifNoEquipments">Aucun équipement requis</p>}
                                                                    </ListGroup>
                                                                </Card>}
                                                        </Container>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <Form.Group className="mb-3">
                                                        <Row>
                                                            <Form.Label><h3>Durée totale</h3></Form.Label>
                                                        </Row>
                                                        <Form.Group as={Row} xs="auto" className="mb-3 timeTotal-container justify-content-md-center">
                                                            <Col className="time-col">
                                                                <Form.Control className="three-characters-input" value={Math.floor(timeTotal / 60)} disabled />
                                                            </Col>
                                                            <Form.Label className="time-col" column>Minutes</Form.Label>
                                                            <Col className="time-col">
                                                                <Form.Control className="three-characters-input" value={timeTotal % 60} disabled />
                                                            </Col>
                                                            <Form.Label className="time-col" column>Secondes</Form.Label>
                                                        </Form.Group>
                                                    </Form.Group>
                                                </Col>
                                                <Col className="time-col">
                                                    <Form.Group className="mb-3 NbExercices-container">
                                                        <Form.Label><h3>Nombre d'exercices</h3></Form.Label>
                                                        <Form.Control className="three-characters-input NbExercices-input" value={nbExercices} disabled />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Form>
                                        {Object.keys(currentSession).length != 0 ? currentSession.trainings.length != 0 ? currentSession['trainings'].map((exercice) => {
                                            return <ExerciceContainerConsultation
                                                key={exercice.id}
                                                exercice={exercice}
                                            />
                                        }) : <h1 className="ifNoTrainingText">aucun exercice !</h1> : ''}
                                    </Card>
                                </Col>

                                <Col md={3} className="trainingProgram-navigation-container">
                                    <Container className="navigation-sticky-container sticky-top">
                                        <WeekList weeks={trainingProgram.weeks} liked={trainingProgram.liked} weeksCompleted={weeksCompleted} sessionsCompleted={sessionsCompleted} handleSessionClick={handleSessionClick} handleAddSessionCompleted={addSessionCompleted} handleRemoveSessionCompleted={removeSessionCompleted} />
                                        
                                        {
                                            trainingProgram.liked ?
                                                <><h3 className="lead text-muted m-3 label-progression">Progression</h3>
                                                    <ProgressBar label={(Math.round((sessionsCompleted.length / nbSessionsTotal) * 100)).toString() + "%"} now={Math.round((sessionsCompleted.length / nbSessionsTotal) * 100)} />
                                                    <p className="lead m-3">{sessionsCompleted.length} séances complétées sur {nbSessionsTotal}</p></> : ''
                                        }
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    </>}
            </Row>
            <ModalInformations
                title={showConfirmModal.title}
                message={showConfirmModal.message}
                show={showConfirmModal.show}
                variantAlert={showConfirmModal.variantAlert}
                handleClose={handleModalClose}
            />
        </Container>
    )
}

class WeekList extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {value: 0}
    }

    handleOnClick = (session_id, week_id) => {
        this.props.handleSessionClick(session_id, week_id);
    }

    handleCheckBoxClick = (e, session_id) => {
        // console.log(e.target.checked);
        if (e.target.checked == true) {
            this.props.handleAddSessionCompleted(session_id);
        } else if (e.target.checked == false) {
            this.props.handleRemoveSessionCompleted(session_id);
        }
    }

    // // Empêche le component de se loader après le loading initial
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    render() {
        return (
            <Accordion defaultActiveKey="0">
                {
                    this.props.weeks.map((week, week_idx) => {
                        return <Accordion.Item key={week_idx} eventKey={week_idx.toString()}>
                            {/* {/* {console.log(week.id)} */}
                            {/* {console.log(this.props.weeksCompleted)} */}
                            <Accordion.Header>{`Semaine ${week_idx + 1}`} {this.props.weeksCompleted.includes((week.id).toString()) ? <FontAwesomeIcon icon={faCheckSquare} className="checkmark-week-completed-navigation" color="green" /> : null}</Accordion.Header>
                            <Accordion.Body className="list-session-container">
                                <ListGroup className="list-session">
                                    {
                                        week.sessions.map((session, session_idx) => {
                                            return <ListGroup.Item key={`session-${session.id}`} action onClick={() => this.handleOnClick(session.id, week.id)}>
                                                <Row className="justify-content-md-center">
                                                    {`Séance ${session_idx + 1}`}
                                                    { this.props.liked ?
                                                    <><Form as={Col} md="auto">
                                                        <Form.Group>
                                                            <Form.Check type="checkbox" checked={this.props.sessionsCompleted.includes((session.id).toString()) ? 1 : 0} onChange={(e) => this.handleCheckBoxClick(e, session.id)} />
                                                        </Form.Group>
                                                    </Form></> : ''
                                                    }
                                                </Row>
                                            </ListGroup.Item>
                                        })}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    })
                }
            </Accordion>
        )
    }
}


const ModalInformations = ({ title, message, show, handleClose, variantAlert }) => {


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert  variant={variantAlert}>
                        {message}
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'dark'} onClick={handleClose}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default TrainingProgramDetails


