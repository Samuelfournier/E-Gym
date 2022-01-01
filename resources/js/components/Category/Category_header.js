import React from 'react'
import { Col, Row, } from 'react-bootstrap'


export default function Category_header() {
    return (
        <>
            <Row className="catHeaderColor justify-center mb-2 bg-secondary text-white">
                <Col xs={1}>ID</Col>
                <Col >Nom</Col>
                <Col xs={3}>Nbr d'articles</Col>
                <Col xs={2}>Dernière parution</Col>
                <Col xs={4}>Nbr de collaborateurs</Col>

            </Row>


        </>
    )
}



