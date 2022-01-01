import { React } from 'react'
import { Row, Col, Form, } from 'react-bootstrap'
import "./ProfilForm.css";

export default function ActivitiesData({ actviData, formRef, handleClickPreference }) {
    let activities = actviData



    const handleOnChange = (e) => {
        handleClickPreference(e)
    }


    return (

        <Col >
            {activities && Object.keys(activities).map(function (activity_key, idx) {
                var reset = activity_key;
                var count = 0;
                let radio
                return Object.keys(activities[activity_key].positions).map(function (position_key, idxPosition) {
                    if (reset == activity_key) {
                        reset++;
                        count++;

                        return (
                            <>
                                <br />
                                <Row >
                                    <Col lg={5}>
                                        <Form.Group className="me-1"
                                            controlId={activities[activity_key].name}
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                name={activities[activity_key].name}
                                                label={activities[activity_key].name}
                                                onChange={handleOnChange}
                                                className="profil-form-label"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={5} className={activities[activity_key].positions[position_key].name == 'tous' ? 'd-none' : ''}>
                                        <Row >
                                            <Form.Group className="me-1"
                                                controlId={activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name}
                                            >
                                                <Form.Check

                                                    key={position_key.toString()}
                                                    type="checkbox"
                                                    label={activities[activity_key].positions[position_key].name}
                                                    name={activities[activity_key].positions[position_key].name}
                                                    value={position_key}
                                                    onChange={handleOnChange}
                                                    className="profil-form-label"
                                                />

                                            </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        )
                    }
                    else {
                        count++;
                        return (
                            <>
                                <Row>
                                    <Col lg={{ span: 3, offset: 5 }}>
                                        <Form.Group className="me-1"
                                            controlId={activities[activity_key].name + '_' + activities[activity_key].positions[position_key].name}

                                        >
                                            <Form.Check

                                                key={idxPosition.toString()}
                                                type="checkbox"
                                                label={activities[activity_key].positions[position_key].name}
                                                name={activities[activity_key].positions[position_key].name}
                                                value={position_key}
                                                className="profil-form-label"
                                                onChange={handleOnChange}
                                                checked={activities[activity_key].positions[position_key].checked}

                                            />

                                        </Form.Group>

                                    </Col>
                                </Row>
                                {count == Object.keys(activities[activity_key].positions).length}
                            </>
                        )
                    }
                })
            })
            }
        </Col>
    )
}
