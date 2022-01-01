import React, { useEffect, useState, useRef } from 'react'
import { Form, Container, Col, Accordion, ListGroup, Row, Button, useAccordionButton, Card, Image, Overlay, Popover, Modal, Alert, Spinner } from 'react-bootstrap'
import ModalForm from '../../common/ModalForm'
import axios from 'axios'
import AddExerciceForm from './AddExerciceForm'
import CreateExerciceForm from './CreateExerciceForm'
import ExerciceContainerCreation from './ExerciceContainerCreation'
import { useHistory } from 'react-router-dom';
import { data } from 'jquery'

const initializeTrainingProgram = ({ formData, mode, trainingProgramData }) => {
    var weeksArray = new Array();
    var trainingProgram = [];

    // console.log(mode);
    if (formData != null) {
        if (mode == "modification")
            trainingProgram['id'] = trainingProgramData.id;
        trainingProgram['title'] = formData.get('title');
        trainingProgram['activite_id'] = formData.get('activity_id');
        trainingProgram['position_id'] = formData.get('position_id');
        trainingProgram['categorie_id'] = formData.get('category_id');
        trainingProgram['content'] = formData.get('content');
        trainingProgram['overview'] = formData.get('overview');
        if (formData.get('media') != 'undefined') {
            trainingProgram['media'] = formData.get('media');
        }
        else {
            trainingProgram['media'] = trainingProgramData.media;
        }
        // console.log('tags sent :', formData.get('tags'));
        trainingProgram['tags'] = formData.get('tags');
        trainingProgram['author_id'] = formData.get('user_id');

        if (trainingProgramData != null) {
            if (trainingProgramData.weeks.length >= parseInt(formData.get('weekNumber')) && trainingProgramData.weeks[0].sessions.length >= parseInt(formData.get('sessionNumber'))) {
                trainingProgramData.weeks = trainingProgramData.weeks.slice(0, parseInt(formData.get('weekNumber')));
                trainingProgramData.weeks.map(week => {
                    week.sessions = week.sessions.slice(0, parseInt(formData.get('sessionNumber')));
                });
            } else {
                if (trainingProgramData.weeks.length < parseInt(formData.get('weekNumber'))) {
                    for (var i = trainingProgramData.weeks.length; i < formData.get('weekNumber'); i++) {
                        var week = {};
                        week["id"] = i;
                        week["order"] = i;
                        week["new"] = true;
                        week["description"] = "";
                        var sessions = [];
                        for (var j = 0; j < formData.get('sessionNumber'); j++) {
                            var session = {};
                            session["id"] = j;
                            session["order"] = j;
                            session["new"] = true;
                            session["trainings"] = [];
                            sessions.push(session);
                        }
                        week["sessions"] = sessions;
                        weeksArray.push(week);
                    }
                    trainingProgramData.weeks = trainingProgramData.weeks.concat(weeksArray);
                }
                if (trainingProgramData.weeks[0].sessions.length < parseInt(formData.get('sessionNumber'))) {
                    for (var i = 0; i < formData.get('weekNumber'); i++) {
                        var sessions = [];
                        for (var j = trainingProgramData.weeks[i].sessions.length; j < formData.get('sessionNumber'); j++) {
                            var session = {};
                            session["id"] = j;
                            session["order"] = j;
                            session["new"] = true;
                            session["trainings"] = [];
                            sessions.push(session);
                        }
                        trainingProgramData.weeks[i].sessions = trainingProgramData.weeks[i].sessions.concat(sessions);
                    }
                }
            }
            trainingProgram['weeks'] = trainingProgramData.weeks;
        } else {
            for (var i = 0; i < formData.get('weekNumber'); i++) {
                var week = {};
                week["id"] = i;
                week["order"] = i;
                week["description"] = "";
                var sessions = [];
                for (var j = 0; j < formData.get('sessionNumber'); j++) {
                    var session = {};
                    session["id"] = j;
                    session["order"] = j;
                    session['new'] = true;
                    session["trainings"] = [];
                    sessions.push(session);
                }
                week["sessions"] = sessions;
                weeksArray.push(week);
            }
            trainingProgram['weeks'] = weeksArray;
        }
    }

    // console.log('training program : ',trainingProgram);
    return trainingProgram;
}

const TrainingProgramDetails = ({ trainingProgramData = null, mode, formData = null, id = null, handleFormChange }) => {
    let history = useHistory();
    const [trainingProgram, setTrainingProgram] = useState(() => initializeTrainingProgram({ formData, mode, trainingProgramData })); //contient les données des séances à sauvegarder en BD lorsque l'utilisateur appuie sur le bouton enregistrer
    const [isLoading, setLoading] = useState(true);

    const [currentSessionId, setCurrentSessionId] = useState(0); //permet de render les exercices de la bonne session dans la section de gauche
    const [currentWeekId, setCurrentWeekId] = useState(0); //permet d'enregistrer la description de la semaine dans le bon objet dans l'array weeks
    const [currentWeek, setCurrentWeek] = useState({});
    const [currentSession, setCurrentSession] = useState({});
    const [currentSessionEquipments, setCurrentSessionEquipments] = useState([]);
    const [nbExercices, setNbExercices] = useState(0);
    const [exercices, setExercices] = useState('');
    const [timeTotal, setTimeTotal] = useState(0);
    const [showAddExercice, setShowAddExercice] = useState(false);
    const [showModalMessage, setShowModalMessage] = useState(false);
    const [showCreateExercice, setShowCreateExercice] = useState(false);
    const [showEquipments, setShowEquipments] = useState(false);
    const modalRef = useRef(null);
    const exerciceFormRef = useRef(null);
    const [showConfirmModal, setShowConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        variantAlert: '',
        variantButton: '',
        multiLine: false
    });

    const getTrainingProgram = async () => {
        axios.get(`/api/training-program/${id}`).then(function (response) {
            setTrainingProgram(response.data);
            setCurrentWeekId(response.data.weeks[0].id);
            setCurrentSessionId(response.data.weeks[0].sessions[0].id);
            // console.log(response.data);
            setLoading(false);
        });
    }

    const handleModalClose = () => {
        setShowConfirmModal({
            show: false,
            title: '',
            message: "",
            variantAlert: '',
            variantButton: '',
            multiLine: false,
        })
    }

    useEffect(() => {
        getExercices();

        if (formData == null && mode == "modification") {
            getTrainingProgram();
        } else {
            if (trainingProgramData != null && formData != null && mode == "modification") {
                setCurrentWeekId(trainingProgramData.weeks[0].id);
                setCurrentSessionId(trainingProgramData.weeks[0].sessions[0].id);
            }

            setLoading(false);
        }
    }, [])

    useEffect(() => {

        if (formData != null && mode == "creation" || Object.keys(trainingProgram).length > 0 && currentWeekId != 0 && currentSessionId != 0) {
            let week = trainingProgram.weeks.find((week) => week.id === currentWeekId);
            let session = week['sessions'].find((session) => session.id === currentSessionId);

            setCurrentSession(session);
            setCurrentWeek(trainingProgram.weeks.find((week) => week.id === currentWeekId));

            setNbExercices(session['trainings'].length);
            calculateTimeTotal();
        }
    }, [trainingProgram])


    useEffect(() => {

        if (formData != null && mode == "creation") {

            setCurrentWeek(
                trainingProgram.weeks.find((week) => week.id === currentWeekId)
            );

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
            setCurrentSessionEquipments(equipments);
        }
        else if ( Object.keys(trainingProgram).length > 0 && currentWeekId != 0 && currentSessionId != 0 && mode == "modification") {
            setCurrentWeek(
                trainingProgram.weeks.find((week) => week.id === currentWeekId)
            );

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
            setCurrentSessionEquipments(equipments);
        }

    }, [currentSessionId, currentWeekId])

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
                        tempoElements.map(element => {
                            if (element != '' && element != null) {
                                total += parseInt(element)
                            }
                        });
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

    const getExercices = async () => {
        const exercices = await axios.get('/api/exercices');
        // console.log(exercices);
        setExercices(exercices.data.data);
    }

    // load session with the specified id
    const handleSessionClick = (session_id, week_id) => {

        if (week_id != currentWeekId) {
            // console.log('set current week');
            setCurrentWeekId(week_id);
            // console.log('set current session');
            setCurrentSessionId(session_id);
        }
        else if (session_id != currentSessionId) {
            setCurrentSessionId(session_id);
        }
    }

    const handleShowAddExercice = () => {
        setShowAddExercice(!showAddExercice);
    }

    const handleShowCreateExercice = () => {
        setShowCreateExercice(!showCreateExercice);
    }

    const setDescription = (value) => {
        setTrainingProgram(
            { ...trainingProgram, weeks: trainingProgram.weeks.map(week => week.id === currentWeekId ? { ...week, description: value } : week) }
        )
    }


    const valideWeeks = () => {


        //valide les infos des semaines
        for (let i = 0; i < trainingProgram.weeks.length; i++) {
            if (trainingProgram.weeks[i].description == '' || trainingProgram.weeks[i].description == null) {
                return {
                    valid: false,
                    context: 'DESC',
                    week: parseInt(trainingProgram.weeks[i].order + 1),
                }
            };

            //valide les infos des sessions
            for (let j = 0; j < trainingProgram.weeks[i].sessions.length; j++) {

                if (trainingProgram.weeks[i].sessions[j].trainings.length == 0) {
                    return {
                        valid: false,
                        context: 'MISSING_EXERCICE',
                        week: parseInt(trainingProgram.weeks[i].order + 1),
                        session: parseInt(trainingProgram.weeks[i].sessions[j].order + 1)
                    }
                };

                // valide les trainings
                for (let k = 0; k < trainingProgram.weeks[i].sessions[j].trainings.length; k++) {

                    if (!validateTraining(trainingProgram.weeks[i].sessions[j].trainings[k])) {
                        return {
                            valid: false,
                            context: 'MISSING_FIELD_EXERCICE',
                            week: parseInt(trainingProgram.weeks[i].order + 1),
                            session: parseInt(trainingProgram.weeks[i].sessions[j].order + 1),
                            training: parseInt(trainingProgram.weeks[i].sessions[j].trainings[k].order + 1)
                        }
                    };

                }
            }
        }

        return {
            valid: true,
        }

    }


    const validateTraining = (training) => {

        // console.log("first if");

        if (
            training.nb_repetition == '' || training.nb_repetition == null || training.nb_repetition < '1' ||
            training.nb_serie == '' || training.nb_serie == null  || training.nb_serie < '1' // ||
            //training.resting_time < '0' //|| training.resting_time == null
        ) return false;


        // console.log("second if");
        if (
            (training.duration == '' || training.duration == null) && (training.tempo == '' || training.tempo == null)
        ) return false;


        // console.log("third if");
        if (training.tempo != '' && training.tempo != null) {

            if (!(/\d+-\d+-\d+/.test(training.tempo))) return false;
        }


        // console.log("fourth if");
        console.log(training.duration);

        if (training.duration != '' && training.duration != null) {
            // console.log("inside  fifth if");
            if (training.duration < '1' || isNaN(training.duration)) return false;
        }
        
        if (training.resting_time != null && training.resting_time != '') {
            if (training.resting_time < '0') return false;
        }

        return true;


    }



    const saveTrainingProgram = () => {

        const response = valideWeeks();

        if (!response.valid) {

            if (response.context == 'DESC') {
                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Il manque la description à la semaine " + response.week,
                    variantAlert: 'danger',
                    variantButton: 'dark',
                    multiLine: false,
                })
            }

            if (response.context == 'MISSING_EXERCICE') {
                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Vous n'avez pas rempli d'exercice à la semaine " + response.week + " séances " + response.session,
                    variantAlert: 'danger',
                    variantButton: 'dark',
                    multiLine: false,
                })
            }

            if (response.context == 'MISSING_FIELD_EXERCICE') {
                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Vous n'avez pas rempli les informations de l'exercice " + response.training + " de la semaine " + response.week + " séances " + response.session + ". \n Les formats à respectés sont les suivants : \n 1. le format valide du tempo est 2-1-2 OU la durée doit être supérieure à 0. \n 2. Le minimum de séries et répétitions est 1. \n 3. le temps de repos doit être de 0 ou plus.",
                    variantAlert: 'danger',
                    variantButton: 'dark',
                    multiLine: true,
                })
            }
            return;

        }

        // console.log(trainingProgram);

        if (id != null) {
            let data = new FormData();
            data.append("title", trainingProgram.title);
            data.append("position_id", trainingProgram.position_id);
            data.append("activity_id", trainingProgram.activite_id);
            data.append("category_id", trainingProgram.categorie_id);
            data.append("content", trainingProgram.content);
            data.append("overview", trainingProgram.overview);
            data.append("media", trainingProgram.media);
            data.append("tags", trainingProgram.tags);

            data.append("weeks", JSON.stringify(trainingProgram.weeks));

            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Access-Control-Allow-Credentials': true,
                }
            }

            // console.log(formData.get('media'));

            // console.log(trainingProgram.id);

            axios.post(`/api/update/training-program/${trainingProgram.id}`, data, config).then((response) => {
                if (response.data.success === true) {
                    let id = response.data.id;
                    history.push(`/plan/${id}`);
                } else if (response.data.success === false) {
                    //afficher alert pour dire qu'il y a eu une erreur et laisser en mode creation
                }
            });

        } else {
            // let data = new FormData();
            // data.append("title", trainingProgram.title);
            // data.append("position_id", trainingProgram.position_id);
            // data.append("activity_id", trainingProgram.activite_id);
            // data.append("category_id", trainingProgram.categorie_id);
            // data.append("content", trainingProgram.content);
            // data.append("overview", trainingProgram.overview);
            // data.append("media", trainingProgram.media);
            // data.append("tags", trainingProgram.tags);

            let data = new FormData();
            data.append("title", trainingProgram.title);
            data.append("position_id", trainingProgram.position_id);
            data.append("activity_id", trainingProgram.activite_id);
            data.append("category_id", trainingProgram.categorie_id);
            data.append("content", trainingProgram.content);
            data.append("overview", trainingProgram.overview);
            data.append("media", trainingProgram.media);
            data.append("tags", trainingProgram.tags);
            data.append("user_id", formData.get('user_id'));
            data.append("weeks", JSON.stringify(trainingProgram.weeks));
            
            // console.log(formData.get);

            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Access-Control-Allow-Credentials': true,
                }
            }

            axios.post('/api/create/training-program', data, config).then((response) => {
                if (response.data.success === true) {
                    let id = response.data.id;
                    history.push(`/plan/${id}`);
                } else if (response.data.success === false) {
                    //afficher alert pour dire qu'il y a eu une erreur et laisser en mode creation
                }
            });
        }
    }

    const addExercice = (exercice, update = false) => {
        // console.log(exercice);
        var training = {};
        training = {
            ...exercice,
            exercice_id: exercice.id,
            id: "exercice" + "-" + exercice.id + "-" + Math.floor(Math.random() * 10000),
            duration: "",
            tempo: "",
            nb_serie: "",
            nb_repetition: "",
            resting_time: "",
            order: (currentSession['trainings'].length).toString(),
        }

        var exerciceEquipments = [];

        if (Array.isArray(training.equipments) && training.equipments.length > 0) {
            exerciceEquipments = training.equipments.filter(exerciceEquipment => {
                if (currentSessionEquipments.find((currentEquipment) => currentEquipment.id === exerciceEquipment.id))
                    return false;

                return true;
            });

            setCurrentSessionEquipments(currentSessionEquipments.concat(exerciceEquipments));
        }

        setTrainingProgram(
            {
                ...trainingProgram, weeks: trainingProgram.weeks.map(week => {
                    if (week.id !== currentWeekId)
                        return week;

                    var sessionsUpdated = week.sessions.map(session => {
                        if (session.id !== currentSessionId)
                            return session;

                        return { ...session, trainings: session.trainings.concat(training) };
                    })
                    return { ...week, sessions: sessionsUpdated };
                })
            }
        )

        setNbExercices(nbExercices + 1);

        if (update) {
            getExercices();
            setShowConfirmModal({
                show: true,
                title: 'Succès',
                message: "Exercice créé avec succès!",
                variantAlert: 'success',
                variantButton: 'primary',
                multiLine: false,
            })
        }
    }

    const modifyExercice = (e, exercice) => {
        var field = e.target.name;
        var value = e.target.value;

        if (e.target.value != null) {
            switch (field) {
                case 'resting_time_minutes':
                    field = 'resting_time';
                    value = (parseInt(e.target.value) * 60) + parseInt(exerciceFormRef.current['resting_time_seconds'].value);
                    break;
                case 'resting_time_seconds':
                    field = 'resting_time';
                    value = parseInt(e.target.value) + (parseInt(exerciceFormRef.current['resting_time_minutes'].value) * 60);
                    break;
                case 'duration_minutes':
                    field = 'duration';
                    value = (parseInt(e.target.value) * 60) + parseInt(exerciceFormRef.current['duration_seconds'].value);
                    break;
                case 'duration_seconds':
                    field = 'duration';
                    if (e.target.value != "")
                        if (exerciceFormRef.current['duration_minutes'] != undefined)
                            value = parseInt(e.target.value) + (parseInt(exerciceFormRef.current['duration_minutes'].value) * 60);
                        else
                            value = parseInt(e.target.value);
                    else
                        value = 0;
                    break;
            }

            setTrainingProgram(
                {
                    ...trainingProgram, weeks: trainingProgram.weeks.map((week) => {
                        if (week.id !== currentWeekId)
                            return week;

                        var sessionsUpdated = week.sessions.map(session => {
                            if (session.id !== currentSessionId)
                                return session;

                            var trainingsUpdated = session['trainings'].map((training) => {
                                if (training.id != exercice.id)
                                    return training;

                                training[field] = value;

                                switch (field) {
                                    case 'tempo':
                                        training.duration = "";
                                        break;
                                    case 'duration':
                                        training.tempo = "";
                                        break;
                                }

                                return training;
                            })

                            return { ...session, trainings: trainingsUpdated };
                        })
                        return { ...week, sessions: sessionsUpdated };
                    })
                }
            )
        }
    }

    const deleteExercice = (exercice_id) => {

        var currentExercice = currentSession.trainings.find((training) => training.id === exercice_id);
        var equipmentsToRemove = currentExercice.equipments;

        if (equipmentsToRemove != []) {
            currentSession.trainings.map((training) => {
                if (training.id === exercice_id)
                    return;

                training.equipments.map((currentEquipment) => {
                    equipmentsToRemove = equipmentsToRemove.filter(equipment => {
                        if (equipment.id === currentEquipment.id)
                            return false;

                        return true;
                    });
                })
            })

            var sessionEquipmentsUpdated = currentSessionEquipments.filter(currentEquipment => {
                if (equipmentsToRemove.find(equipment => equipment.id === currentEquipment.id))
                    return false;

                return true;
            });
        }

        setCurrentSessionEquipments(sessionEquipmentsUpdated);

        setTrainingProgram(
            {
                ...trainingProgram, weeks: trainingProgram.weeks.map(week => {
                    if (week.id !== currentWeekId)
                        return week;

                    var sessionsUpdated = week.sessions.map(session => {
                        if (session.id !== currentSessionId)
                            return session;

                        return { ...session, trainings: session.trainings.filter(exercice => exercice.id != exercice_id) };
                    })
                    return { ...week, sessions: sessionsUpdated };
                })
            }
        );
        setNbExercices(nbExercices - 1);
    }

    const changeOrder = (exercice, direction) => {
        var fromOrder = parseInt(exercice.order);
        var toOrder = parseInt(exercice.order) + direction;

        //if exercice is already the first one or the last one
        if (toOrder < 0 ||
            toOrder >= nbExercices ||
            nbExercices == 1)
            return;

        setTrainingProgram(
            {
                ...trainingProgram, weeks: trainingProgram.weeks.map(week => {
                    if (week.id !== currentWeekId)
                        return week;

                    var sessionsUpdated = week.sessions.map(session => {
                        if (session.id !== currentSessionId)
                            return session;

                        var trainingsUpdated = session['trainings'].map((training) => training.order == toOrder ? { ...training, order: fromOrder } : training);

                        var trainingRemoved = trainingsUpdated.splice(fromOrder, 1)[0];
                        trainingRemoved.order = toOrder;

                        trainingsUpdated.splice(toOrder, 0, trainingRemoved);

                        return { ...session, trainings: trainingsUpdated };
                    })
                    return { ...week, sessions: sessionsUpdated };
                })
            }
        );
    }

    // console.log('training : ', trainingProgram)
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
                        <Container>
                            <Row>
                                <Col md={9} className="session-container">
                                    <Card className="exercices-container">
                                        <h1 className="training-title">{`Semaine ${currentWeek.order + 1} - Séance ${currentSession.order + 1}`}</h1>
                                        <Row className="session-row">
                                            <Col><Button variant="primary" onClick={() => setShowAddExercice(true)}>Ajouter un exercice</Button></Col>

                                            <Col><Button variant="primary" onClick={() => setShowCreateExercice(true)}>Créer un nouvel exercice</Button></Col>
                                        </Row>
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
                                        {Object.keys(currentSession).length != 0 && currentSession.trainings.length != 0 ? currentSession['trainings'].map((exercice) => {
                                            return <ExerciceContainerCreation
                                                key={exercice.id}
                                                exercice={exercice}
                                                handleDelete={deleteExercice}
                                                handleOrderChange={changeOrder}
                                                handleExerciceDetailsChange={modifyExercice}
                                                formRef={exerciceFormRef}
                                            />
                                        }) : <h1 className="ifNoTrainingText">aucun exercice !</h1>}
                                    </Card>
                                </Col>

                                <Col md={3} className="trainingProgram-navigation-container">
                                    <Container className="navigation-sticky-container sticky-top">
                                        <Row>
                                            <Container className="text-center mb-3">
                                                <Button variant="secondary" className="trainingProgram-button" onClick={() => handleFormChange(trainingProgram)}>Modifier les détails du plan d'entrainement</Button>
                                            </Container>
                                        </Row>
                                        <Row>
                                            <Container className="text-center">
                                                <Button variant="primary" className="trainingProgram-button" onClick={() => saveTrainingProgram()}>Enregistrer</Button>
                                            </Container>
                                        </Row>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="lead text-muted description-semaine">Description de la semaine</Form.Label>
                                                <Form.Control as="textarea" value={currentWeek['description']} onChange={(e) => setDescription(e.target.value)} rows={3} />
                                            </Form.Group>
                                        </Form>
                                        <WeekList weeks={trainingProgram.weeks} handleSessionClick={handleSessionClick} />
                                    </Container>
                                </Col>
                                <ModalForm
                                    title='Ajouter un exercice'
                                    component={AddExerciceForm}
                                    buttonMessage="Ajouter"
                                    show={showAddExercice}
                                    handleShow={handleShowAddExercice}
                                    submitCallback={addExercice}
                                    formRef={modalRef}
                                    exercices={exercices}
                                />
                                <ModalForm
                                    title='Créer un nouvel exercice'
                                    component={CreateExerciceForm}
                                    buttonMessage="Créer"
                                    show={showCreateExercice}
                                    handleShow={handleShowCreateExercice}
                                    submitCallback={addExercice}
                                    formRef={modalRef}
                                />
                                <ModalInformations
                                    title={showConfirmModal.title}
                                    message={showConfirmModal.message}
                                    show={showConfirmModal.show}
                                    variantAlert={showConfirmModal.variantAlert}
                                    variantButton={showConfirmModal.variantButton}
                                    handleClose={handleModalClose}
                                    multiLine={showConfirmModal.multiLine}
                                />
                            </Row>
                        </Container>
                    </>}
            </Row>
        </Container>
    )
}

class WeekList extends React.Component {

    constructor(props) {
        super(props);
    }

    handleOnClick = (session_id, week_id) => {
        this.props.handleSessionClick(session_id, week_id);
    }

    // Empêche le component de se loader après le loading initial
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <Accordion defaultActiveKey="0">
                {
                    this.props.weeks.map((week, week_idx) => {
                        return <Accordion.Item key={week_idx} eventKey={week_idx.toString()}>
                            <Accordion.Header>{`Semaine ${week_idx + 1}`}</Accordion.Header>
                            <Accordion.Body className="list-session-container">
                                <ListGroup className="list-session">
                                    {
                                        week.sessions.map((session, session_idx) => {
                                            return <ListGroup.Item key={`session-${session.id}`} action onClick={() => this.handleOnClick(session.id, week.id)}>{`Séance ${session_idx + 1}`}</ListGroup.Item>
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

const ModalInformations = ({ title, message, show, handleClose, variantAlert, variantButton, multiLine }) => {


    const text = message;
    let newText;
    if(multiLine)
        newText = text.split('\n').map((str, idx) => <p key={idx}>{str}</p>);
    
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={variantAlert}>
                        {
                            multiLine ? newText : message
                        }
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={variantButton} onClick={handleClose}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default TrainingProgramDetails


