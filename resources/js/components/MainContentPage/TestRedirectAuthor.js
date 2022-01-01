import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Container,Col,Row,Button,Image,ButtonGroup,Card,} from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useHistory, Redirect } from "react-router-dom";
import Header from "../_components/Header/Header";
import CardContentInAuthor from "./Card/CardContentInAuthor";
import Footer from "../_components/Footer/Footer";
import ModalSuccess from "../common/ModalSuccess";
import ReactHtmlParser, {processNodes,convertNodeToElement,htmlparser2,} from "react-html-parser";

export default function TestRedirectAuthor({ user }) {
    // Parameters
    const { id } = useParams();

    // Variables
    const [professionnal, setProfessionnal] = useState([]);
    const [plans, setPlans] = useState([]);
    const [articles, setArticles] = useState([]);
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState({
        show: false,
        title: '',
        message: '',
        handleConfirm: '',
    });
    let history = useHistory();

    const handleModalCancel = () => {
        setModalConfirmation({
            show: false,
            title: '',
            message: '',
            handleConfirm: '',
        })
    }

    // UseEffect
    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get("/api/professionnal/" + id).then((response) => {
            setProfessionnal(response.data.professionnal);
            setPlans(response.data.plans);
            setArticles(response.data.articles);
        });
    };

    // Handlers
    // une méthode pour envoyer en props au modal pour qu'il puisse dire au parent de le fermer
    const handleShowModal = () => {
        setShowModal(!showModal);
        getData();
    };

    //Fonction à envoyé à l'enfant pour redirect à la fermeture du modal
    const handleRedirect = () => {
        //history.push('/')
    };

    const handleClickCard = (e, id, type_id, visibility) => {
        //plan
        if (type_id == 1) {
            //si public
            if (visibility == 1) {
                history.push(`/plan/${id}`);
            }

            // si privé et user non connecté
            if (visibility == 2 && user == null) {
                history.push(`/connexion`);
            } else {
                history.push(`/plan/${id}`);
            }
        }
        //articles
        else {
            //si public
            if (visibility == 1) {
                history.push(`/article/${id}`);
            }

            // si privé et user non connecté
            if (visibility == 2 && user == null) {
                history.push(`/connexion`);
            } else {
                history.push(`/article/${id}`);
            }
        }
    };

    // Edit an article
    const handleClickEditArticle = (e, id) => {
        e.preventDefault();

        history.push("/creer-article/" + id);
    };

    // Delete an article
    const handleClickDeleteArticle = (e, id) => {
        e.preventDefault();

        if (confirm("Êtes-vous certain de vouloir supprimer ce contenu?")) {
            let response = axios.post("/api/delete-article/" + id).then((response) => {
                    setNotificationMsg(response.data.message);
                    setShowModal(!showModal);
                })
                .catch((error) => {
                    console.log(error.response);
                });
            }
    };

    // Edit an plan
    const handleClickEditPlan = (e, id) => {
        e.preventDefault();

        history.push(`/plan/${id}/modifier`)
    };

    // Delete a plan
    const handleClickDeletePlan = (e, id) => {
        e.preventDefault()

        if (confirm("Êtes-vous certain de vouloir supprimer ce contenu?")) {
            let response = axios
                .post("/api/delete/training-program/" + id)
                .then((response) => {

                    setNotificationMsg(response.data.message);
                    setShowModal(!showModal);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
    };

    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                <Card className="shadow-sm mb-4" bg="light">
                    <Card.Header as="h4" className="bg-secondary text-white">Professionnel</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>
                                <Image src={professionnal.media} thumbnail />
                            </Col>

                            <Col>
                                <h1>
                                    {professionnal.firstname}{" "}
                                    {professionnal.lastname}
                                </h1>
                                <span className="lead">
                                    {professionnal.title}
                                </span>
                                <hr />

                                {ReactHtmlParser(professionnal.description)}
                                <hr />

                                <a className="btn btn-outline-primary mb-2" href={"mailto:" + professionnal.email}>
                                    Envoyer un courriel
                                </a>

                                <br />

                                <ButtonGroup>
                                    <Button variant="outline-secondary">
                                        Facebook
                                    </Button>
                                    <Button variant="outline-secondary">
                                        LinkedIn
                                    </Button>
                                    <Button variant="outline-secondary">
                                        Twitter
                                    </Button>
                                    <Button variant="outline-secondary">
                                        Instagram
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="shadow-sm mb-2" bg="light">
                    <Card.Header as="h4" className="bg-secondary text-white">Contenu</Card.Header>
                    <Card.Body>

                        <Tabs defaultActiveKey="articles"  className="mb-3">
                            <Tab eventKey="articles" title="Articles">

                                <Row className="g-4 justify-content-start">
                                    {articles.map((article) => (
                                        <Col key={article.id} className="col-auto">

                                            <CardContentInAuthor
                                                user={user}
                                                content={article}
                                                img={article.media_card}
                                                handleClickEdit={handleClickEditArticle}
                                                handleClickDelete={handleClickDeleteArticle}
                                                handleClickCard={handleClickCard}
                                                style={{padding:'auto'}}
                                            />

                                        </Col>
                                    ))}
                                </Row>
                            </Tab>
                            <Tab eventKey="programs" title="Programmes">
                                <Row className="g-4 justify-content-center">
                                    {plans.map((plan) => (
                                        <Col className="col-auto" key={plan.id}>
                                            <CardContentInAuthor
                                                user={user}
                                                content={plan}
                                                img={plan.media_card}
                                                handleClickEdit={handleClickEditPlan}
                                                handleClickDelete={handleClickDeletePlan}
                                                handleClickCard={handleClickCard}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Container>

            <Footer />

            <ModalSuccess
                title="Notification"
                body={notificationMsg}
                buttonMessage="Fermer"
                redirect={true}
                handleRedirect={handleRedirect}
                show={showModal}
                handleShow={handleShowModal}
            />
        </>
    );
}
