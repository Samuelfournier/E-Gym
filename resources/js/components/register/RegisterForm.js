import React, { useState } from 'react'
import { usePassValidation } from '../customHooks/usePassValidation'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import './register.css'
import "../Login/Login.css";
let verificator = true
const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
}
const email_regex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~\.-])*(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9]){3,}\.[a-z]{2,}/

export default function RegisterForm({ handleSubmit, formRef, buttonDisabled }) {
    const [newUser, setnewUser] = useState(initialState)

    const setFirstname = (event) => {
        setnewUser({ ...newUser, firstname: event.target.value })
    };

    const setLastname = (event) => {
        setnewUser({ ...newUser, lastname: event.target.value })
    };

    const setMail = (event) => {
        setnewUser({ ...newUser, email: event.target.value })
    };

    const setPassword = (event) => {
        setnewUser({ ...newUser, password: event.target.value })
    };

    const setConfirmPass = (event) => {
        setnewUser({ ...newUser, password_confirmation: event.target.value })
    };

    const [
        hasLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecial,
        match
    ] = usePassValidation({ password: newUser.password, password_confirmation: newUser.password_confirmation });

    verificator = !(hasLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial && match)

    return (
        <>
        <Col sm={6}m={6}g={4}className="form-wrapper">
            <Form id="register-form" ref={formRef} onSubmit={handleSubmit} className="background-form px-4 ">
            <h1 className="title pt-3 rgt-h1">Inscription</h1>
            <hr className="rgt-hr"/>
                    <Form.Group as={Col}>
                        <Form.Label className="withColor ">Prénom</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={newUser.firstname}
                            //onChange={handleOnChange}
                            onChange={setFirstname}
                            placeholder="Prénom"

                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label className="withColor ">Nom de famille</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={newUser.lastname}
                            //onChange={handleOnChange}
                            onChange={setLastname}
                            placeholder="Nom de famille"

                        />
                    </Form.Group>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label className="withColor ">Courriel</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={newUser.email}
                            //onChange={handleOnChange}
                            onChange={setMail}
                            placeholder="courriel@example.com"
                        />
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label className="withColor ">Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={newUser.password}
                            //onChange={handleOnChange}
                            onChange={setPassword}
                            placeholder="Mot de passe"

                        />
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col}>
                        <Form.Label className="withColor ">Confirmation du mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="password_confirmation"
                            value={newUser.password_confirmation}
                            // onChange={handleOnChange}
                            onChange={setConfirmPass}
                            placeholder=" Confirmer le mot de passe"

                        />
                        <ul className="mb-2 cdtsFilledList rgt-ul">
                            <li className={hasLength ? "text-success" : "text-danger"}>Doit contenir minimum de 8 caractères</li>
                            <li className={hasUpperCase ? "text-success" : "text-danger"}>Doit contenir au moins une majuscule</li>
                            <li className={hasLowerCase ? "text-success" : "text-danger"}>Doit contenir au moins une minuscule</li>
                            <li className={hasNumber ? "text-success" : "text-danger"}>Doit contenir au moins un chiffre</li>
                            <li className={hasSpecial ? "text-success" : "text-danger"}>Doit contenir au moins un caractère spéciale (@ ! # % *)</li>
                            <li className={match ? "text-success" : "text-danger"}>Les mots de passes sont identiques</li>
                        </ul>
                    </Form.Group>
                </Row>
                <hr className="rgt-hr"/>

                <div className="d-grid gap-2 pb-4">
                    <Button type="submit" disabled={verificator} variant="primary" size="lg">
                        S'inscrire
                    </Button>
                </div>

            </Form>
            </Col>
        </>
    )
}
