import {React, useState} from 'react'
import { Container,Col, Row,Button, Modal } from 'react-bootstrap'
import './paymentStyles.css'

export default function Bill() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
          <Button variant="outline-info" onClick={handleShow}>
            Sommaire de l'abonnement
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Sommaire de l'abonnement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={7} sm={10} md={10} lg={10}>Abonnement</Col>
                        <Col className="text_align_right_bill" xs={5} sm={2} md={2} lg={2}>9.99 $</Col>
                    </Row>
                    <Row>
                        <Col lg={10}>Renouvelable mensuellement</Col>
                    </Row>
                    <Row>
                        <Col lg={10}>Résiliable à tout moment</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs={7} sm={10} md={10} lg={10}>TPS</Col>
                        <Col className="text_align_right_bill" xs={5} sm={2} md={2} lg={2}>0.50 $</Col>
                    </Row>
                    <Row>
                        <Col xs={7} sm={10} md={10} lg={10}>TVQ</Col>
                        <Col className="text_align_right_bill" xs={5} sm={2} md={2} lg={2}>1.00 $</Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col  xs={7} sm={10} md={10} lg={10}>Total</Col>
                        <Col className="text_align_right_bill" xs={5} sm={2} md={2} lg={2}>11.49 $</Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
}
