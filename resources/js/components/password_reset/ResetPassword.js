import React, { useState } from 'react'
import { usePassValidation } from '../customHooks/usePassValidation'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import axios from 'axios'

let verificator = true
let url_string = window.location.search.substring(1)
let params = new URLSearchParams(url_string)

const initialState = {
    email: params.get("email"),
    password: "",
    password_confirmation: "",
    token: params.get("token")
}

function ResetPassword({setshowSuccesAlert}) {
    const [credentials, setcredential] = useState(initialState)

    const [
        hasLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecial,
        match
    ] = usePassValidation({ password: credentials.password, password_confirmation: credentials.password_confirmation });

    verificator = !(hasLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial && match)
    const setFirst = (event) => {
        setcredential({ ...credentials, password: event.target.value });
    };

    const setSecond = (event) => {
        setcredential({ ...credentials, password_confirmation: event.target.value });
    };

    const handleOnSubmit = (e) => {
        e.preventDefault()
        axios.post('/api/reset-password',credentials).then(response =>{
            // console.log(response)
            setshowSuccesAlert(true);
        }).catch(error =>{
            console.log("Error:: ",error)
        })
    }
    return (
        <>

                <Col sm={6}m={6}g={4}className="form-wrapper">
                    <Form onSubmit={handleOnSubmit} className="background-form">
                    <h1 className="title pt-3 rst-h1">Nouveau mot de passe</h1>
                        <hr className="rst-hr"/>
                        <Form.Group className="mb-3" >
                            <Form.Label className="withColor">Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                onChange={setFirst}
                                placeholder="Mot de passe"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="withColor">Nouveau mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password_confirmation"
                                onChange={setSecond}
                                placeholder="Confirmer mot de passe"
                            />
                        </Form.Group>
                        <ul className="mb-4 rst-ul">
                            <li className={hasLength ? "text-success" : "text-danger"}>Doit contenir minimum de 8 caractères</li>
                            <li className={hasUpperCase ? "text-success" : "text-danger"}>Doit contenir au moins une majuscule</li>
                            <li className={hasLowerCase ? "text-success" : "text-danger"}>Doit contenir au moins une minuscule</li>
                            <li className={hasNumber ? "text-success" : "text-danger"}>Doit contenir au moins un chiffre</li>
                            <li className={hasSpecial ? "text-success" : "text-danger"}>Doit contenir au moins un caractère spéciale (@ ! # % *)</li>
                            <li className={match ? "text-success" : "text-danger"}>Les mots de passes sont identiques</li>
                        </ul>
                        <div className="d-grid gap-2">
                            <Button type="submit" variant="primary" size="lg" disabled={verificator}>
                                Enregistrer
                            </Button>
                        </div>
                    </Form>
                </Col>

        </>
    )
}
export default ResetPassword
