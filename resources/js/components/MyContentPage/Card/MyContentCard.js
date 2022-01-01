import React from 'react'
import { Card, Ratio, ProgressBar } from "react-bootstrap";
import moment from "moment";
import CardActivityInfo from "../../MainContentPage/Card/CardActivityInfo";
import CardAuthorInfo from "../../MainContentPage/Card/CardAuthorInfo";
import ProgressBarPlan from './ProgressBarPlan';
import ReactHtmlParser, {
    processNodes,
    convertNodeToElement,
    htmlparser2,
} from "react-html-parser";

import LikeButton from '../../common/LikeButton';

export default function MyContentCard({
    user,
    content,
    handleClickCard,
    handleClickAuthor,
    userPublications,
    setUserLike,
    isLiked,
}) {
    return (
        <Card
            onClick={(e) =>
                handleClickCard(
                    e,
                    content.publication_id,
                    content.type_publication_id
                )
            }
            className="pointer border-secondary"
            style={{ width: "22rem" }}
        >
            <Ratio aspectRatio="16x9">
                <Card.Img variant="top" src={content.media_card} />
            </Ratio>
            <Card.Body>
                <Card.Title className="min-height-title">
                    {content.title}
                </Card.Title>
                <Card.Text as="div" className="min-height-text-card">
                    {ReactHtmlParser(content.overview)}
                    {user ? (
                        user.id != content.id_author ? (
                            <LikeButton
                                publication_id={content.publication_id}
                                userPublications={userPublications}
                                setUserLike={setUserLike}
                                isLiked={isLiked}
                            ></LikeButton>
                        ) : (
                            ""
                        )
                    ) : (
                        ""
                    )}
                </Card.Text>
                <hr />
                <CardActivityInfo
                    categorie={content.categorie}
                    sport={content.activite}
                    position={content.position}
                    type={content.type_publication_id}
                    nb_of_weeks={content.nb_of_weeks}
                    timeTotal={content.time_total}
                />
                <hr />
                {content.type_publication_id == 1 ? (
                    <ProgressBarPlan
                        progress={content.progress}
                        progressNumber={content.progressNumber}
                    />
                ) : (
                    ""
                )}

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
}
