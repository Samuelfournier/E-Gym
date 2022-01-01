import React, { useState } from "react";
import { Card, Form, Row, Col, Button, } from "react-bootstrap";

const today = new Date().toISOString().split("T")[0]

export default function GenerateTokenForm({formRef, onSubmit}) {

   const getLastDayOfYear = (separator='') => {

        let newDate = new Date()
        let date = 31;
        let month = 12;
        let year = newDate.getFullYear();

        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }

    const [quantity, setQuantity] = useState(0);
    const [expirationDate, setExpirationDate] = useState(getLastDayOfYear("-"));

    // Render
    return (
        <>
        <Form
            id="generate-token-form"
            ref={formRef}
            onSubmit={onSubmit}
        >
            <Card bg="light">
                <Card.Header as="h4" className="bg-secondary text-white">
                    Générer des codes d'inscription
                    <span className="fa-pull-right">
                        <Button type="submit" variant="primary">Générer</Button>
                    </span>
                </Card.Header>
                <Card.Body>
                    <Row className="justify-content-between mb-3">
                        <Form.Group as={Col} controlId="quantity">
                            <Form.Label className="lead fs-3">Nombre de codes</Form.Label>
                            <Form.Control type="number" min="0" value={quantity} onChange={(e) => { setQuantity(e.target.value) }} required />
                        </Form.Group>

                        <Form.Group as={Col} controlId="expiration_date">
                            <Form.Label className="lead fs-3">Date d'expiration</Form.Label>
                            <Form.Control type="date" value={expirationDate} onChange={(e) => { setExpirationDate(e.target.value) }} min={today} required />
                            {/* Add min value = today */}
                        </Form.Group>
                    </Row>
                </Card.Body>
            </Card>
        </Form>
        </>
    );
}
