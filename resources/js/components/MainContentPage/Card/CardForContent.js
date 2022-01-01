import { React } from "react";
import { Card,Ratio, Row, Col } from "react-bootstrap";
import moment from "moment";
import CardActivityInfo from "./CardActivityInfo";
import CardAuthorInfo from "./CardAuthorInfo";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import LikeButton from "../../common/LikeButton";

const CardForContent = ({
    user,
    content,
    img,
    handleClickCard,
    handleClickAuthor,
    userPublications,
    setUserLike,
    isLiked,
}) => {
    return (
        <Card
            onClick={(e) =>
                handleClickCard(
                    e,
                    content.id,
                    content.type_id,
                    content.type_visibility_id
                )
            }
            className="pointer border-secondary"
            content-id={content.id}
            style={{ width: "22rem" }}
        >
            <Ratio aspectRatio="16x9">
                <Card.Img variant="top" src={img} />
            </Ratio>
            <Card.Body>
                <Card.Title className="min-height-title">
                    {ReactHtmlParser(content.title)}
                    { user ? (
                        user.id != content.id_author ? (

                        <LikeButton
                            publication_id={content.id}
                            userPublications={userPublications}
                            setUserLike={setUserLike}
                            isLiked={isLiked}
                        ></LikeButton>

                        ) : ('')
                    )
                    : ('')
                    }

                </Card.Title>
                <Card.Text as="div" className="min-height-text-card">
                    {ReactHtmlParser(content.overview)}
                </Card.Text>
                <hr />
                <CardActivityInfo
                    categorie={content.categorie}
                    sport={content.activite}
                    position={content.position}
                    type={content.type_id}
                    nb_of_weeks={content.nb_of_weeks}
                    timeTotal={Math.floor(
                        moment.duration(content.time_total).asMinutes()
                    )}
                />
                <hr />
                <CardAuthorInfo
                    auhorName={content.author}
                    authorId={content.id_author}
                    creationDate={moment(content.created_at).format(
                        "DD MMM, YYYY"
                    )}
                    handleClickAuthor={handleClickAuthor}
                />
            </Card.Body>
        </Card>
    );
};

export default CardForContent;
