import React, { useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const initialState = {
    email: "",
    password: ""
}

const LoginForm = ({handleOnSubmit, formRef, invalidCredentialsError}) => {

    const [userLogin, setuserLogin] = useState(initialState)

    const setMail = (event) => {
        setuserLogin({ ...userLogin, email: event.target.value });
    };
    const setPassword = (event) => {
        setuserLogin({ ...userLogin, password: event.target.value })
    };


    return (
        <>

            <Col sm={6}m={6}g={4}className="form-wrapper">
                <Form onSubmit={handleOnSubmit} ref={formRef} className="background-form" >
                    <div className="width-100 mb-2 alert-danger text-center">
                        <span>{invalidCredentialsError}</span>
                    </div>
                    <h1 className="title pt-3 login-h1">Entrer dans le E-gym</h1>
                    <hr className="login-hr"/>
                    <Form.Group className="mb-3">
                        <Form.Label className="withColor" >Courriel</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={userLogin.email}
                            onChange={setMail}
                            placeholder="courriel@email.com"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="withColor ">Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={userLogin.password}
                            onChange={setPassword}
                            placeholder="Mot de passe"
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Link className="login-a"to="/mot-de-passe-oublie">Mot de passe oublié?</Link>
                        </Col>
                    </Row>
                    <hr className="login-hr"/>
                    <Row>
                        <Col>
                            <div className="d-grid gap-2 pb-4">
                                <Button type="submit" variant="primary" size="lg">
                                    Se connecter
                                </Button>
                            </div>

                        </Col>
                        <p className="withColor">Pas encore de compte? </p><Link className="login-a"to ="/inscription"> S'enregistrer</Link>
                    </Row>
                </Form>
            </Col>

        </>
    )
}
export default LoginForm;
