import { React } from "react";
import { Card, Row, Col } from "react-bootstrap";

const CardActivityInfo = ({
    categorie,
    sport,
    position,
    type,
    nb_of_weeks,
    timeTotal
}) => {
    return (
        <div className="min-height-activity">
            <Row>
                <Col xs={4} sm={4} md={4} lg={4}>
                    <Card.Subtitle className="mb-2">Catégorie</Card.Subtitle>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <Card.Subtitle className="mb-2 text-muted">
                        {categorie}
                    </Card.Subtitle>
                </Col>
            </Row>
            <Row>
                <Col xs={4} sm={4} md={4} lg={4}>
                    <Card.Subtitle className="mb-2">Sport</Card.Subtitle>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <Card.Subtitle className="mb-2 text-muted">
                        {sport}
                    </Card.Subtitle>
                </Col>
            </Row>
            <Row className={position == 'tous' ? 'd-none' : ''}>
                <Col xs={4} sm={4} md={4} lg={4}>
                    <Card.Subtitle className="mb-2">Position</Card.Subtitle>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <Card.Subtitle className="mb-2 text-muted">
                        {position}
                    </Card.Subtitle>
                </Col>
            </Row>
            {type == 1 ? (
                <Row>
                    <Col xs={4} sm={4} md={4} lg={4}>
                        <Card.Subtitle className="mb-2">Durée</Card.Subtitle>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8}>
                        <Card.Subtitle className="mb-2 text-muted">
                            {nb_of_weeks}{" "}
                            {nb_of_weeks > 1 ? "semaines" : "semaine"}
                        </Card.Subtitle>
                    </Col>
                </Row>
            ) : (
                <Row>
                <Col xs={4} sm={4} md={4} lg={4}>
                    <Card.Subtitle className="mb-2">Lecture</Card.Subtitle>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <Card.Subtitle className="mb-2 text-muted">
                                {timeTotal}
                                {timeTotal > 1 ? " minutes" : " minute"}
                    </Card.Subtitle>
                </Col>
                </Row>
            )}
        </div>
    );
};

export default CardActivityInfo;
