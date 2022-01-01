import React from 'react'
import './paymentStyles.css'
import { Col, Row, Form, Button, Card } from 'react-bootstrap'

export default function PromocodeForm({handleSubmit, fieldEmptyErrorMessage, formRef}) {
    return (
        <>
            <Row className="mb-3">
                <Form id="promocode-form" ref={formRef} onSubmit={handleSubmit} className="p-4">
                    <Form.Group as={Col} controlId="promocode">
                        <Form.Label className="lead text-muted">Code promotionnel</Form.Label>
                        <Form.Control type="text" name="promocode" placeholder="Entrez votre code promotionnel" />
                    </Form.Group>

                    <span className="error">{fieldEmptyErrorMessage}</span>
                    <Button variant="primary" id="card-button" type="submit" className="mt-4 width_payment" >Compléter l'abonnement</Button>
                </Form>
            </Row>
        </>
    )
}
