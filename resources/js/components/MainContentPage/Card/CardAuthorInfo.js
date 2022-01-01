import { React } from "react";
import { Card, Row, Col } from "react-bootstrap";

const CardAuthorInfo = ({ auhorName, authorId, creationDate, handleClickAuthor }) => {
    return (
        <>
            <Row className="author-hover" onClick={(e) => handleClickAuthor(e, authorId)}>
                <Col className="child" xs={7} sm={7} md={7} lg={7} >
                    <Card.Subtitle className="mb-2">{auhorName}</Card.Subtitle>
                </Col>
                <Col xs={5} sm={5} md={5} lg={5}>
                    <Card.Subtitle className="mb-2 text-muted">
                        {creationDate}
                    </Card.Subtitle>
                </Col>
            </Row>
        </>
    );
};

export default CardAuthorInfo;
