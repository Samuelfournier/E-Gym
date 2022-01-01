
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'

const initialState = {
    email: "",
}
const Forgotten_passwordForm = ({ setshowSuccesAlert }) => {

    const [user, setuser] = useState(initialState)


    const setMail = (event) => {
        setuser({ ...user, email: event.target.value });
    };
    const handleOnSubmit = (e) => {
        e.preventDefault()
        console.log(user)
        axios.post('/api/forgot-password', user).then(res => {
            // console.log(res.data.message);
            setshowSuccesAlert(true);
        }).catch(error => {
            console.log("ERROR:: ", error);
        });
    }
    return (
        <Container>
            <Row>
                <Col sm={6} m={6} g={4} className="form-wrapper">
                    <Form onSubmit={handleOnSubmit} className="background-form">
                        <h1 className="fg-h1">Mot de passe oublié?</h1>
                        <p className="withColor">Ce n'est pas grave, ça arrive aux meilleurs d'entre nous.
                            Entre une adresse courriel valide pour recevoir un lien.
                        </p>
                        <hr className="withColor fg-hr"/>
                        <Form.Group >
                            <Form.Label className="fg-form-label">Courriel</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={setMail}
                                placeholder="courriel@example.com"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Envoyer
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container >
    )
}
export default Forgotten_passwordForm
