import React from 'react'
import moment from "moment";
import { Card, Ratio } from "react-bootstrap";

export default function CardForCreator({creator,handleClickCard}) {
    return (
        <Card onClick={(e) => handleClickCard(e, creator.id)} className="pointer" style={{ width: "22rem" }}>
            <Ratio aspectRatio="1x1">
                <Card.Img variant="top" src={creator.media} />
            </Ratio>
            <Card.Body>
                <Card.Title>{creator.fullName} </Card.Title>
                <Card.Text className="min-height-text-card-creator">{creator.title}</Card.Text>
                <hr />
                <Card.Subtitle className="mb-2">{creator.gender === 'Homme' || creator.gender === 'Autres' ? 'Créateur' : 'Créatrice'} depuis { moment(creator.created_at).format(
                        "YYYY"
                    )}</Card.Subtitle>
            </Card.Body>
        </Card>
    )
}
