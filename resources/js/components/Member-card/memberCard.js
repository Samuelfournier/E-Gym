import { React, useEffect,useState } from "react";
import { Container, Card, Col, Row, Ratio, Image } from "react-bootstrap";

// Components
import Header from "../_components/Header/Header";
import Footer from "../_components/Footer/Footer";
import axios from "axios";


export default function MemberCard({ user }) {

    const [subscriptionEndDate, setSubscriptionEndDate] = useState('AAAA-MM-JJ');

    console.log(user);
    useEffect(() => {
        axios.get("/api/square-info/" + user.id_subscription_square).then(response => {
            console.log(response);
            setSubscriptionEndDate(response.data);
        });
    }, []);

    // Render
    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                <Card bg="light">
                    <Card.Header as="h4">Carte de membre</Card.Header>
                    <Card.Body>
                        <Row className="justify-content-between">
                            <Col lg="3">
                                {user.media != '' && user.media != null ? (
                                    <Ratio aspectRatio="4x3">
                                        <Image
                                            className="card-img-top"
                                            src={user.media}
                                            thumbnail
                                        />
                                    </Ratio>)
                                    : ('')}
                            </Col>
                            <Col lg="3">
                                <p className="lead fs-3"># de membre</p>
                                <hr/>
                                <p className="fs-2">{user.id}</p>
                                <br/>
                                <p className="lead fs-3">Nom</p>
                                <hr/>
                                <p className="fs-2 tex">{user.firstname} {user.lastname}</p>
                            </Col>
                            <Col lg="3">
                                <p className="lead fs-3">Membre depuis</p>
                                <hr/>
                                <p className="fs-2">{new Date(user.created_at).toLocaleDateString()}</p>
                                <br/>
                                <p className="lead fs-3">Date de naissance</p>
                                <hr/>
                                <p className="fs-2">{user.birthdate}</p>
                            </Col>
                            <Col lg="3">
                                <p className="lead fs-3">Date d'expiration</p>
                                <hr/>
                                <p className="fs-2">{subscriptionEndDate}</p>
                                <br/>
                                <p className="lead fs-3">Statut</p>
                                <hr/>
                                <p className="fs-2">
                                    {user.user_status_id === 1
                                        ? "Actif"
                                        : "Inactif"}
                                </p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
}
