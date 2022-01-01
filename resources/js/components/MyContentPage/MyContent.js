import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import { Row, Col, Container, Alert, Form, Card } from "react-bootstrap";
import MyContentCard from './Card/MyContentCard'
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import { v4 as uuidv4 } from "uuid";
import { filterMyContent } from "../MainContentPage/Filter/filterMethod";
import Search from "../MainContentPage/Search";
import PageComponent from '../common/PageComponent'
import FilterListMyContent from './Filter/FilterListMyContent'
import BannerEmptyContent from '../common/BannerEmptyContent'


export default function MyContent({ user }) {
    const [myContent, setMyContent] = useState({
        originalContent: [],
        currentContent: [],
        currentPage: 1,
        cardPerPage: 15,
        showEmptyMessage: false,
        emptyMessage: "Il n'y a aucun résultat avec votre sélection",
        set: false,
    });

    let history = useHistory();
    const formRef = useRef(null);
    const firstUpdate = useRef(true);

    //State pour la barre de recherche
    const [search, setSearch] = useState("");

    //State pour les types de publication
    const [types, setTypes] = useState(null);

    // Array contenant tout les publications liked d'un user connecter
    const [userLikedPublications, setUserLikedPublications] = useState([]);

    useEffect(() => {
        // Load tous les contenus
        axios.get(`/api/GetMyContent/${user.id}`).then((res) => {
            setMyContent({
                ...myContent,
                currentContent: res.data,
                originalContent: res.data,
                set: true,
            });
        });

        axios.get("/api/GetTypes").then((res) => {
            setTypes(res.data);
        });

        fetchUserLikedPublications();
    }, []);

    //Lorsqu'on tappe dans la barre de recherche , filtre le contenu
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        handleClickFilter(search);
    }, [search]);

    const HandleSearch = (e) => {
        let current_search = e.target.value.toLowerCase().replace(/\s+/g, " ");
        setSearch(current_search);
    };

    const handleClickCard = (e, id, type_id) => {
        //plan
        if (type_id == 1) {
            history.push(`/plan/${id}`);
        }
        //articles
        else {
            history.push(`/article/${id}`);
        }
    };

    const handleClickAuthor = (e, id) => {
        e.stopPropagation();
        history.push(`/auteur/${id}`);
    };

    const handleClickFilter = (title = search) => {
        let newContent = filterMyContent(
            myContent.originalContent,
            formRef,
            types,
            title
        );
        setMyContent({
            ...myContent,
            currentContent: newContent,
            showEmptyMessage: newContent.length == 0 ? true : false,
        });
    };

    // Change la page
    const handleClickPage = (e) => {
        if (e.target.innerHTML[0] != myContent.currentPage) {
            window.scrollTo(0, 0);
            setMyContent({ ...myContent, currentPage: e.target.innerHTML[0] });
        }
    };

    // Regarde la dernière carte à allez chercher et la première pour séparer le array.
    const indexOfLastCard = myContent.currentPage * myContent.cardPerPage;
    const indexOfFirstCard = indexOfLastCard - myContent.cardPerPage;
    const currentContent = myContent.currentContent.slice(
        indexOfFirstCard,
        indexOfLastCard
    );

    // Rempli le nombre de page selon le nombre de Card
    const pageNumbers = [];
    for (
        let i = 1;
        i <= Math.ceil(myContent.currentContent.length / myContent.cardPerPage);
        i++
    ) {
        pageNumbers.push(i);
    }

    // Fetch all likedPublications
    const fetchUserLikedPublications = () => {
        // Fetch tout les userPublications relié à un user connecter.
        axios.get("/api/get-all-liked-publications").then((response) => {
            setUserLikedPublications(response.data.userPublications);
        });
    };

    // Set the is_liked propos of the LikeButton (to change style)
    const handleIsLiked = (publication_id) => {
        // search in array, -1 ->not found
        if (userLikedPublications.indexOf(publication_id) > -1) {
            return true;
        }

        return false;
    };

    // Render
    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                <Row className="justify-content-center">
                    {/* Card for filters */}
                    <Col lg="2">
                        <Card bg="light" className="shadow-sm sticky-top" style={{zIndex:"0"}}>
                            <Card.Header as="h4" className="bg-secondary text-white">
                                Filtre
                            </Card.Header>
                            <Card.Body>
                                <Form ref={formRef}>
                                    {types && (
                                        <FilterListMyContent
                                            items={types}
                                            handleClickFilter={
                                                handleClickFilter
                                            }
                                            search={search}
                                        />
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Card for cards */}
                    <Col lg="10">
                        <Card bg="light" className="shadow-sm">
                            <Card.Header as="h4" className="bg-secondary text-white">
                                Mon contenu
                            </Card.Header>
                            <Card.Body>
                                <Row className="pb-4 justify-content-start">
                                    {/*<Col lg={{ span: 10, offset: 2 }}>*/}
                                    <Col lg="10">
                                        <Search HandleSearch={HandleSearch} />
                                    </Col>
                                </Row>

                                <div className="d-block d-sm-block d-md-block d-lg-none">
                                    <Row className="g-4 justify-content-center">
                                        <Col className="col-auto">
                                            <PageComponent
                                                pageNumbers={pageNumbers}
                                                currentPage={myContent.currentPage}
                                                handleClickPage={handleClickPage}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <Row className="g-4 justify-content-start">
                                    <BannerEmptyContent
                                        text={myContent.emptyMessage}
                                        show={myContent.showEmptyMessage}
                                    />
                                    {myContent.set &&
                                    myContent.originalContent.length == 0 ? (
                                        <BannerEmptyContent
                                            text={
                                                "Vous n'avez pas encore aimé du contenu"
                                            }
                                            show={true}
                                        />
                                    ) : (
                                        ""
                                    )}
                                    {currentContent.map((content, idx) => {

                                        return (
                                            <Col className="col-auto" key={idx}>
                                                <MyContentCard
                                                    user={user}
                                                    content={content}
                                                    handleClickCard={handleClickCard}
                                                    handleClickAuthor={
                                                        handleClickAuthor
                                                    }
                                                    isLiked={handleIsLiked(
                                                        content.publication_id
                                                    )}
                                                    userPublications={
                                                        userLikedPublications
                                                    }
                                                    setUserLike={
                                                        setUserLikedPublications
                                                    }
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                                <hr />
                                <Row className="g-4 justify-content-center">
                                    <Col className="col-auto">
                                        <PageComponent
                                            pageNumbers={pageNumbers}
                                            currentPage={myContent.currentPage}
                                            handleClickPage={handleClickPage}
                                        />
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Container>
            <Footer />
        </>
    );
}

       /* <>
            <Header user={user} />
            <Container fluid>
                <br />
                <h1>Mon contenu</h1>

                <Row className="justify-content-center">
                    <Col lg={{ span: 10, offset: 2 }}>
                        <Search HandleSearch={HandleSearch} />
                    </Col>
                </Row>

                <Row className="g-4 justify-content-center">
                    <Col lg={2}>
                        <br />
                        <div className="sticky-top">
                            <Form ref={formRef}>
                                {types && (
                                    <FilterListMyContent
                                        items={types}
                                        handleClickFilter={handleClickFilter}
                                        search={search}
                                    />
                                )}
                            </Form>
                        </div>
                    </Col>
                    <Col lg={10}>
                        <br />


                        <div className="d-block d-sm-block d-md-block d-lg-none">
                            <Row className="g-4 justify-content-center">
                                <Col className="col-auto">
                                    <PageComponent
                                        pageNumbers={pageNumbers}
                                        currentPage={myContent.currentPage}
                                        handleClickPage={handleClickPage}
                                    />
                                </Col>
                            </Row>
                            <br />
                        </div>

                        <Row className="g-4 justify-content-center">
                            <BannerEmptyContent
                                text={myContent.emptyMessage}
                                show={myContent.showEmptyMessage}
                            />
                            {myContent.set &&
                            myContent.originalContent.length == 0 ? (
                                <BannerEmptyContent
                                    text={
                                        "Vous n'avez pas encore aimé du contenu"
                                    }
                                    show={true}
                                />
                            ) : (
                                ""
                            )}
                            {currentContent.map((content, idx) => {

                                return (
                                    <Col className="col-auto" key={idx}>
                                        <MyContentCard
                                            user={user}
                                            content={content}
                                            handleClickCard={handleClickCard}
                                            handleClickAuthor={
                                                handleClickAuthor
                                            }
                                            isLiked={handleIsLiked(
                                                content.publication_id
                                            )}
                                            userPublications={
                                                userLikedPublications
                                            }
                                            setUserLike={
                                                setUserLikedPublications
                                            }
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                        <br />
                        <Row className="g-4 justify-content-center">
                            <Col className="col-auto">
                                <PageComponent
                                    pageNumbers={pageNumbers}
                                    currentPage={myContent.currentPage}
                                    handleClickPage={handleClickPage}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>*/
    //);
//}
