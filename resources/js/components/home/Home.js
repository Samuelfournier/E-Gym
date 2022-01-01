import Header from '../_components/Header/Header'
import Footer from '../_components/Footer/Footer'
import { Link } from 'react-router-dom'
import { Container, Image, Button, Row, Col, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faPlayCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import '../home/home.css'

const Home = ({ user }) => {
    return (
        <>
            <Header user={user} />
            <Container className="homepage-container px-0" fluid>
                <Container className="upper-section-container" fluid>
                    <Container className="title-container">
                        <FontAwesomeIcon className="title-icon" icon={faDumbbell} size="10x" color="white" />
                        <h1>E-GYM</h1>
                        <Link to="/inscription"><Button variant="primary" className="title-button">Commencez dès maintenant !</Button></Link>
                    </Container>
                </Container>
                <Container className="whoweare-container">
                    <Row className="first-row-container">
                        <Col xs={12} md={6} className="content-col">
                            <Container className="content-container">
                                <h3>Qui sommes nous ?</h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, possimus id. Recusandae magnam corrupti perferendis quisquam, saepe quis maiores doloremque nulla soluta fuga accusantium quo ut ratione pariatur, harum explicabo?</p>
                            </Container>
                        </Col>
                        <Col xs={12} md={6} className="image-col">
                            <Container className="image-container">
                                <Image className="picture" src="../../../images/home_picture.jpg" />
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Container className="mission-container">
                    <Row className="d-flex flex-row-reverse">
                        <Col xs={12, { order: "last" }} md={6} className="image-col">
                            <Container className="image-container">
                                <Image className="picture" src="../../../images/picture.jpg" />
                            </Container>
                        </Col>
                        <Col xs={12, { order: "first" }} md={6} className="content-col">
                            <Container className="content-container">
                                <h3>Notre mission</h3>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, possimus id. Recusandae magnam corrupti perferendis quisquam, saepe quis maiores doloremque nulla soluta fuga accusantium quo ut ratione pariatur, harum explicabo?</p>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Container className="starting-container">
                    <Row>
                        <Col xs={12} md={6}>
                            <Container className="registernow-container">
                                <h3>Commencer maintenant !</h3>
                                <Link to="/inscription"><FontAwesomeIcon className="title-icon" icon={faPlayCircle} size="10x" color="lightgrey" /></Link>
                            </Container>
                        </Col>
                        <Col xs={12} md={6}>
                            <Container className="seeprofessionals-container">
                                <h3>Découvrir nos spécialistes</h3>
                                <Link to="/professionnels"><FontAwesomeIcon className="title-icon" icon={faUserCircle} size="10x" color="lightgrey" /></Link>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Container className="infolettre-container" fluid>
                    <h2>Abonnez-vous à notre infolettre !</h2>
                    <Form className="infolettre-form-container">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control className="input-infolettre" type="email" placeholder="Votre adresse couriel" />
                            {/* <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text> */}
                            {/* <Button variant="primary" className="button-submit-infolettre" type="submit"> */}
                            <Button variant="primary" className="button-submit-infolettre">
                                S'abonner
                            </Button>
                        </Form.Group>
                    </Form>
                </Container>
            </Container>
            <Footer />
        </>
    )
}

export default Home
