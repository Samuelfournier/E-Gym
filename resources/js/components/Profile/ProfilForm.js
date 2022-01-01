
import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import ActivitiesData from './ActivitiesData'
import Country from './Country'
import ModalSuccess from '../common/ModalSuccess'
import { useHistory } from 'react-router-dom';

const current = new Date().toISOString().split("T")[0]

const initialState = {
    firstName: "",
    secondName: "",
    bDay: "",
    position: []
}

const ProfilForm = () => {

    const [userProfil, setuserProfil] = useState(initialState)
    const [gender, setGender] = useState("Homme")
    const [userProvince, setProvince] = useState(null)
    const [data, setData] = useState(null);
    const [activities, setActivities] = useState(null)
    const [fieldErrorMessage, setfieldErrorMessage] = useState('');
    const [showSuccesAlert, setshowSuccesAlert] = useState(false);


    let history = useHistory();
    const handleRedirect = () => {
        history.push('/rechercher');
    }

    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }

    useEffect(() => {
        getData();
    }, [])


    const getData = async () => {
        let dataTemp = await axios.get('/api/complete-profile');
        setData(dataTemp.data.data);
        setActivities(dataTemp.data.data.activities)
    }

    const formRef = useRef(null);

    const createProfil = function (props) {
        const profil = {
            firstname: userProfil.firstName,
            lastname: userProfil.secondName,
            birthdate: userProfil.bDay,
            gender:gender ,
            province: formRef.current['provinces'].value,
            positions: props
        }
        return profil

    }


    const handleClickPreference = (e) => {


        Object.keys(activities).forEach(function (activity_key) {
            let sport = false;
            let hasPositons = false;
            let parent = e.target.id;

            if (formRef.current[activities[activity_key].name].checked) {
                sport = true;
            }

            Object.keys(activities[activity_key].positions).forEach(function (position_key) {

                if (formRef.current[activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name].checked) {
                    hasPositons = true;
                }
            })



            if (parent == formRef.current[activities[activity_key].name].name && !sport) {

                formRef.current[activities[activity_key].name].checked = false;
                if (hasPositons) {
                    Object.keys(activities[activity_key].positions).forEach(function (position_key) {

                        if (formRef.current[activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name].checked) {
                            formRef.current[activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name].checked = false;
                        }
                    })
                }
                hasPositons = false;
            }
            if (!sport && hasPositons) {
                formRef.current[activities[activity_key].name].checked = true;
            }


        })
    }


    const handleOnSubmit = async function (e) {
        e.preventDefault()

        const position = [];
        Object.keys(activities).forEach(function (activity_key) {
            let sport = false;
            let position_temp = [];
            let all_positions = [];
            if (formRef.current[activities[activity_key].name].checked) {
                sport = true;
            }
            Object.keys(activities[activity_key].positions).forEach(function (position_key) {
                if (formRef.current[activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name].checked) {
                    position_temp.push(formRef.current[activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name].value);
                }
                all_positions.push(formRef.current[activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name].value);
            })
            if (sport) {
                if (position_temp.length == 0) {
                    position.push(...all_positions);
                }
                else {
                    position.push(...position_temp);
                }
            }
        })
        try {
            let profil = createProfil(position)
            const response = await axios.post('/api/complete-profile', profil);
            if (response.data.success === true) {
                handleshowSuccesAlert();
                return;
            }
            else if (response.data.success === false) {
                setfieldErrorMessage(response.data.message);
            }
        }
        catch (error) {
            console.log('Error: ', error)
        }
    }
    const handleOnChange = e => {
        setuserProfil({ ...userProfil, [e.target.name]: e.target.value });
    }
    return (
        <>
            <Col className="form-wrapper">
                <Form ref={formRef} id="profil-form" onSubmit={handleOnSubmit} className="background-form px-4">
                <div className="width-100 mb-3 alert-danger text-center rounded">
                    <span>{fieldErrorMessage}</span>
                </div>
                    <h1 className="title pt-3 .profil-h1">Compléter votre profil</h1>
                    <hr className="profil-hr" />
                    <Row className="mainRow">
                        <Col sm={6} m={5} lg={5} >
                            <Row>
                                <Col >
                                    <Form.Group controlId="bDay">
                                        <Form.Label className="profil-form-label">Entrer date de naissance</Form.Label>
                                        <Form.Control
                                            required
                                            type="date"
                                            name="bDay"
                                            onChange={handleOnChange}
                                            max={current}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group as={Col} controlId="gender">
                                        <Form.Label className="profil-form-label">Genre</Form.Label>
                                        <Form.Select
                                            required
                                            name="gender"
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            }
                                        >
                                            <option>Homme</option>
                                            <option>Femme</option>
                                            <option>Autre</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Country
                                        {...data}
                                        formRef={formRef} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="d-grid gap-2 mt-2">
                                        <Button type="submit" variant="primary" size="lg">
                                            Enregistrer le profil
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="rightSideForm" sm={6} m={5} lg={4}>
                            <ActivitiesData
                                actviData={activities}
                                formRef={formRef}
                                handleClickPreference={handleClickPreference}
                            />
                        </Col>
                    </Row >
                </Form>
            </Col>
            <ModalSuccess
                title='Notification'
                body="Enregistrement du profil réussi !"
                buttonMessage='Voir le contenu'
                redirect={true}
                handleRedirect={handleRedirect}
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
        </>
    )
}
export default ProfilForm

