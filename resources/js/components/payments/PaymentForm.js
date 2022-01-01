import React from 'react'
import './paymentStyles.css'
import { Col, Row, Form, Button } from 'react-bootstrap'
import Bill from './Bill'

export default function PaymentForm({handleSubmit,buttonDisabled, formRef, zipErrorMessage, fieldEmptyErrorMessage, cardErrorMessage}) {
    return (
        <>

            <Form id="payment-form" ref={formRef} onSubmit={handleSubmit} className="p-3 shadow-sm">

                <Row className="mb-2 mt-2">
                    <Bill/>
                </Row>

                <Row className="mb-2">
                    <Form.Group as={Col} controlId="cardOwner">
                        <Form.Label className="lead text-muted">Titulaire de la carte</Form.Label>
                        <Form.Control type="text" name="card_owner" placeholder="Entrez votre nom complet..." />
                    </Form.Group>
                </Row>

                <Row className="mb-2">
                    <Form.Group as={Col} controlId="address">
                        <Form.Label className="lead text-muted">Adresse</Form.Label>
                        <Form.Control className="mb-2" type="text" placeholder="Numéro civique, nom de la rue..." />
                        <Form.Control type="text" placeholder="Appartement, unitée..." />
                    </Form.Group>
                </Row>

                <Row className="mb-2">
                    <Form.Group as={Col} controlId="zip">
                        <Form.Label className="lead text-muted">Code postal</Form.Label>
                        <Form.Control className="mb-2" type="text" placeholder="H1H 1H1" />
                        <span className="error">{zipErrorMessage}</span>
                    </Form.Group>
                </Row>

                <Row className="mb-2">
                    <Form.Group as={Col} controlId="province">
                        <Form.Label className="lead text-muted">Province</Form.Label>
                        <Form.Control className="mb-2" type="text" defaultValue='Québec' />
                    </Form.Group>

                    <Form.Group as={Col} controlId="country">
                        <Form.Label className="lead text-muted">Pays</Form.Label>
                        <Form.Control className="mb-2" type="text" defaultValue='Canada' />
                    </Form.Group>
                        <span className="error">{fieldEmptyErrorMessage}</span>
                </Row>
                        <div id="card-container" ></div>
                        <span className="error">{cardErrorMessage}</span>

                <Button variant="primary" id="card-button" type="submit" className="width_payment" disabled={buttonDisabled}>Compléter l'abonnement</Button>

            </Form>
        </>
    )
}
