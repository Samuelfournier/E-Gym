import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Col, Row, Button, Image, Ratio, Card } from "react-bootstrap";
import Header from "../_components/Header/Header";
import Footer from "../_components/Footer/Footer";
import ReactHtmlParser, {
    processNodes,
    convertNodeToElement,
    htmlparser2
} from "react-html-parser";
import { useHistory } from "react-router-dom";
import LikeButton from "../common/LikeButton";

export default function TestRedirectBlog({ user }) {
    // Parameters
    const { id } = useParams();
    // Array contenant tout les publications liked d'un user connecter
    const [userLikedPublications, setUserLikedPublications] = useState([]);

    // Variables
    const [article, setArticle] = useState([]);
    let history = useHistory();

    // UseEffect
    useEffect(() => {
        axios.get("/api/article/" + id).then((response) => {
            setArticle(response.data.article);
        });
        fetchUserLikedPublications();
    }, []);


    const handleClickAuthor = (e, id) => {
        e.stopPropagation();
        history.push(`/auteur/${id}`);
    };

    // Permet à la redirection de fonctionner pour le ReactHtmlParser
    const options = {
        transform: (node, index) => {
            if (node.type === "tag" && node.name === "a") {
                return (
                    <a href={node.attribs.href} target="_blank">
                        {node.children[0].data}
                    </a>
                );
            }
        },

    };

    // Fetch all likedPublications
    const fetchUserLikedPublications =  async () => {
        // Fetch tout les userPublications relié à un user connecter.
        axios.get("/api/get-all-liked-publications").then((response) => {
            setUserLikedPublications(response.data.userPublications); // update la state pour y mettre tout les ids des pub. aimé
        });
    };

    // Set the is_liked propos of the LikeButton (to change style)
    const handleIsLiked = (publication_id) => {
        // search in array, -1 ->not found
        if (userLikedPublications.indexOf(publication_id) > -1) {
            // Si on trouve le id dans l'array, ca veut dire que l'utilisateur aime la publication, et donc le couer doit etre plein.
            return true;
        }
        // Si on trouve pas le id dans l'array, ca veut dire que l'utilisateur n'aime pas la publication, et donc le couer doit etre vide.
        return false;
    };


    // Render
    return (
        <>
            <Header user={user} />
            <Container
                fluid
               className="p-4"
            >
                <Row>
                    <Card className="shadow-sm mb-4 bg-light">
                        <Ratio aspectRatio="16x9">
                            <Image
                                className="card-img-top"
                                src={article.media}
                            />
                        </Ratio>
                        {user ? (
                            user.id != article.id_author ? (
                                <LikeButton
                                    publication_id={article.id}
                                    userPublications={userLikedPublications}
                                    setUserLike={setUserLikedPublications}
                                    isLiked={handleIsLiked(article.id)}
                                ></LikeButton>
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}
                    </Card>
                </Row>

                <Row className="justify-content-center my-5">
                    <Col className="text-center">
                        <h1 className="display-1">
                            {ReactHtmlParser(article.title)}
                        </h1>
                        <hr />
                    </Col>
                </Row>

                <Card
                    className="shadow-sm mb-4 bg-light"
                    bg="light"
                >
                    <Card.Header as="h4" className="bg-secondary text-white">Caractéristiques</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col className="py-2">
                                <div className="fs-3">
                                    Sport
                                    <hr className="my-1" />
                                </div>
                                <div className="lead text-capitalize fs-5">
                                    {article.activite}
                                </div>
                            </Col>
                            <Col
                                className={
                                    article.position == "tous"
                                        ? "d-none"
                                        : "py-2"
                                }
                            >
                                <div className=" fs-3">
                                    Position <hr className="my-1" />
                                </div>
                                <div className="lead text-capitalize fs-5">
                                    {article.position}
                                </div>
                            </Col>
                            <Col className="py-2">
                                <div className="fs-3">
                                    Catégorie
                                    <hr className="my-1" />
                                </div>
                                <div className="lead text-capitalize fs-5">
                                    {article.categorie}
                                </div>
                            </Col>
                            <Col className="py-2">
                                <div className="fs-3">
                                    Date de publication
                                    <hr className="my-1" />
                                </div>
                                <div className="lead fs-5">
                                    {article.created_at}
                                </div>
                            </Col>
                            <Col className="py-2">
                                <div className="fs-3">
                                    Visibilité
                                    <hr className="my-1" />
                                </div>
                                <div className="lead text-capitalize fs-5">
                                    {article.type_visibility_id == 1
                                        ? "Privé"
                                        : "Public"}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-5" bg="light">
                    <Card.Header as="h4" className="bg-secondary text-white">Contenu de l'article</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col className="px-5 py-2">
                                <span style={{ textAlign: "justify" }}>
                                    {ReactHtmlParser(article.content, options)}
                                </span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card bg="light">
                    <Card.Header as="h4" className="bg-secondary text-white">À propos de l'auteur</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col lg="3" className="py-1">
                                <Image thumbnail src={article.media_author} />
                                <hr />
                                <Button
                                    type="button"
                                    variant="info"
                                    className="w-100"
                                    onClick={(e) =>
                                        handleClickAuthor(e, article.author_id)
                                    }
                                >
                                    Consulter la fiche de ce professionnel
                                </Button>
                            </Col>
                            <Col lg="9" className="py-1">
                                <div className="fs-2">{article.author}</div>
                                <div className="lead fs-4">
                                    {article.title_author}
                                    <hr className="my-1" />
                                </div>

                                <div className="pt-4">
                                    {ReactHtmlParser(article.desc_author)}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
}
