import { React } from "react";
import { Card, Button, Row, Col, Ratio} from "react-bootstrap";
import CardActivityInfo from "./CardActivityInfo";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


const CardContentInAuthor = ({ user, content, img, handleClickCard, handleClickDelete, handleClickEdit }) => {

    //render
    return (
        <Card className="pointer border-secondary" content-id={content.id}
            style={{ width:'22rem' }}
        >
            
        <Ratio aspectRatio="16x9">
            <Card.Img
                    variant="top"
                    src={img}
                    onClick={(e) => handleClickCard(e,content.id, content.type_id,content.type_visibility_id)}
                />
        </Ratio>

            <Card.Body>
                <Card.Title
                    className="min-height-title"
                    onClick={(e) => handleClickCard(e,content.id, content.type_id,content.type_visibility_id)}
                >
                    {ReactHtmlParser(content.title)}
                </Card.Title>
                <Card.Text as="div"
                    className="min-height-text-card"
                    onClick={(e) => handleClickCard(e, content.id, content.type_id, content.type_visibility_id)}
                >
                    {ReactHtmlParser(content.overview)}
                </Card.Text>
                <hr/>
                <CardActivityInfo
                    categorie={content.categorie}
                    sport={content.activite}
                    position={content.position}
                    type={content.type_id}
                    nb_of_weeks={content.nb_of_weeks}
                    timeTotal={content.time_total}
                    handleClickCard={handleClickCard}
                    onClick={(e) =>handleClickCard(e,content.id,content.type_id,content.type_visibility_id)}
                />

                {user && user.id == content.id_author ? (
                    <>
                        <hr />
                        <Row className="mb-2 justify-content-center">
                            <Col>
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={(e) => {handleClickEdit(e, content.id);}}
                                >
                                    Modifier
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    className="w-100"
                                    onClick={(e) => {handleClickDelete(e, content.id);}}
                                >
                                    Supprimer
                                </Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    ""
                )}
            </Card.Body>
        </Card>
    );
};

export default CardContentInAuthor;
