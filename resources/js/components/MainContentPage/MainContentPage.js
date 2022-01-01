import { React, useEffect, useState, useRef } from "react";
import { Row, Col, Container, Form, Pagination, Card } from "react-bootstrap";
import "./MainContentPage.css";
import {filterContent} from "./Filter/filterMethod";
import FilterList from "./Filter/FilterList";
import FilterListSport from "./Filter/FilterListSport";
import CardForContent from "./Card/CardForContent";
import { useHistory } from 'react-router-dom';
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import Tags from './Tags'
import Search from './Search'
import PageComponent from '../common/PageComponent'
import BannerEmptyContent from '../common/BannerEmptyContent'
import axios from "axios";

export default function MainContentPage({ user }) {
    // State pour la pagination et le contenu courant et original
    const [content, setContent] = useState({
        original_contents: [],
        current_contents: [],
        currentPage: 1,
        cardPerPage: 15,
        showEmptyMessage: false,
        emptyMessage: "Il n'y a aucun résultat avec votre sélection.",
    });

    // State pour tous les attributs qui servent à filtrer
    const [attributes, setAttributes] = useState({
        types: [],
        visibilities: [],
        categories: [],
        sports: [],
    });

    // Le array des préférences utilisateurs
    const [userPreference, setUserPreference] = useState([]);
    // La state pour la barre de recherche
    const [search, setSearch] = useState("");
    // Les deux state qui s'occupe des tags, tags = Array de tags, input = le champ ou on écrit les tags
    const [input, setInput] = useState("");
    const [tags, setTags] = useState([]);

    const formRef = useRef(null);
    const firstUpdate = useRef(true);
    let history = useHistory();

    // Array contenant tout les publications liked d'un user connecter
    const [userLikedPublications, setUserLikedPublications] = useState([]);

    useEffect(() => {
        // Si un user, load les préférences
        if (user != null) {
            axios.get(`/api/getUserPreference/${user.id}`).then((res) => {
                setUserPreference(res.data);
            });

            fetchUserLikedPublications();
        }

        // Load tous les contenus
        axios.get("/api/get-all-content").then((res) => {
            setContent({
                ...content,
                original_contents: res.data.content,
                current_contents: res.data.content,
            });
            setAttributes({
                types: res.data.type,
                visibilities: res.data.visibility,
                categories: res.data.categories,
                sports: res.data.sports,
            });
        });
    }, []);

    //Lorsqu'on tappe dans la barre de recherche , filtre le contenu
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        handleClickFilter({ target: { id: 0 } }, search, tags);
    }, [search, tags]);

    // Méthode appelé lorsqu'un clic est fait dans les checkbox des filtres
    const handleClickFilter = (e, titleString = search, tags_user = tags) => {
        let newContent = filterContent(
            e.target.id,
            content.original_contents,
            attributes,
            formRef,
            user,
            titleString,
            tags_user
        );

        setContent({
            ...content,
            current_contents: newContent,
            showEmptyMessage: newContent.length == 0 ? true : false,
        });
    };

    // Change la page
    const handleClickPage = (e) => {
        if (e.target.innerHTML[0] != content.currentPage) {
            window.scrollTo(0, 0);
            setContent({ ...content, currentPage: e.target.innerHTML[0] });
        }
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

    const handleClickAuthor = (e, id) => {
        e.stopPropagation();
        history.push(`/auteur/${id}`);
    };

    const handleClickPreference = (e) => {
        // si la case à été coché.
        if (e.target.checked) {
            for (let i = 0; i < attributes.sports.length; i++) {
                for (
                    let j = 0;
                    j < attributes.sports[i].positions.length;
                    j++
                ) {
                    //Coche la case si elle fait parties des préférences
                    if (
                        userPreference.some(
                            (pref) =>
                                pref.position_id ==
                                parseInt(
                                    formRef.current[
                                        attributes.sports[i].name +
                                            "_" +
                                            attributes.sports[i].positions[j]
                                                .name
                                    ].value
                                )
                        )
                    ) {
                        formRef.current[
                            attributes.sports[i].name +
                                "_" +
                                attributes.sports[i].positions[j].name
                        ].checked = true;
                    }
                }
            }
        }
        // Si la case est décoché
        else {
            for (let i = 0; i < attributes.sports.length; i++) {
                let sportIsChecked =
                    formRef.current[attributes.sports[i].name].checked;
                let hasPositionChecked = false;

                for (
                    let j = 0;
                    j < attributes.sports[i].positions.length;
                    j++
                ) {
                    // Décoche la case si elle fait partie des préférances
                    if (
                        userPreference.some(
                            (pref) =>
                                pref.position_id ==
                                parseInt(
                                    formRef.current[
                                        attributes.sports[i].name +
                                            "_" +
                                            attributes.sports[i].positions[j]
                                                .name
                                    ].value
                                )
                        )
                    ) {
                        formRef.current[
                            attributes.sports[i].name +
                                "_" +
                                attributes.sports[i].positions[j].name
                        ].checked = false;
                    }

                    //Booléean pour savor si il y a d'autre position de coché par le user
                    if (
                        formRef.current[
                            attributes.sports[i].name +
                                "_" +
                                attributes.sports[i].positions[j].name
                        ].checked
                    ) {
                        hasPositionChecked = true;
                    }
                }

                // Si le sport et coché et qu'il n'y a pas d'autre position coché, décoche le sport
                if (sportIsChecked && !hasPositionChecked) {
                    formRef.current[attributes.sports[i].name].checked = false;
                }
            }
        }

        handleClickFilter(
            {
                target: { id: 0 },
            },
            search,
            tags
        );
    };

    const HandleSearch = (e) => {
        let current_search = e.target.value.toLowerCase().replace(/\s+/g, " ");
        setSearch(current_search);
    };

    // Regarde la dernière carte à allez chercher et la première pour séparer le array.
    const indexOfLastCard = content.currentPage * content.cardPerPage;
    const indexOfFirstCard = indexOfLastCard - content.cardPerPage;
    const currentContent = content.current_contents.slice(
        indexOfFirstCard,
        indexOfLastCard
    );

    // Rempli le nombre de page selon le nombre de Card
    const pageNumbers = [];
    for (
        let i = 1;
        i <= Math.ceil(content.current_contents.length / content.cardPerPage);
        i++
    ) {
        pageNumbers.push(i);
    }

    // Les 3 méthodes pour la tags
    // Update le input pour les tags
    const onChange = (e) => {
        const { value } = e.target;
        setInput(value);
    };

    // S'occupe de lire les key pour enregistrer le tag lorsque Enter ou Spacebar est tappé
    const onKeyDown = (e) => {
        const { key } = e;
        const trimmedInput = input.trim().toLowerCase();

        if (
            (key === "Enter" || e.code === "Space") &&
            trimmedInput.length &&
            !tags.includes(trimmedInput)
        ) {
            e.preventDefault();

            if (tags.length > 4) {
                setInput("");
                return;
            }

            if (trimmedInput.length < 30) {
                setInput("");
                setTags((prevState) => [...prevState, trimmedInput]);
            }
        }
    };

    //Delete les tags
    const deleteTag = (index) => {
        let newTags = [tags.filter((tag, i) => i !== index)];
        setTags((prevState) => prevState.filter((tag, i) => i !== index));
    };

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
                    {/* Card for filter section*/}
                    <Col lg="2">
                        <Card bg="light" className="shadow-sm sticky-top" style={{zIndex:"0"}}>
                            <Card.Header
                                as="h4"
                                className="bg-secondary text-white"
                            >
                                Filtre
                            </Card.Header>
                            <Card.Body>
                                <Tags
                                    onKeyDown={onKeyDown}
                                    onChange={onChange}
                                    input={input}
                                    tags={tags}
                                    deleteTag={deleteTag}
                                />

                                <Form ref={formRef}>
                                    <FilterList
                                        attributes={attributes}
                                        handleClickFilter={handleClickFilter}
                                        user={user}
                                        handleClickPreference={
                                            handleClickPreference
                                        }
                                        tags={tags}
                                        search={search}
                                    />
                                    <FilterListSport
                                        attributes={attributes}
                                        sports={attributes.sports}
                                        handleClickFilter={handleClickFilter}
                                        tags={tags}
                                        search={search}
                                    />
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Card for content section*/}
                    <Col lg="10">
                        <Card className="shadow-sm" bg="light">
                            <Card.Header
                                as="h4"
                                className="bg-secondary text-white"
                            >
                                Notre contenu
                            </Card.Header>
                            <Card.Body>
                                {/* Search bar on top */}
                                <Row className="pb-4 justify-content-start">
                                    {/*<Col lg={{ span: 10, offset: 2 }}>*/}
                                    <Col lg="10">
                                        <Search HandleSearch={HandleSearch} />
                                    </Col>
                                </Row>

                                {/* Cards */}
                                <div className="d-block d-sm-block d-md-block d-lg-none">
                                    <Row className="g-4 justify-content-center">
                                        <Col className="col-auto">
                                            <PageComponent
                                                pageNumbers={pageNumbers}
                                                currentPage={
                                                    content.currentPage
                                                }
                                                handleClickPage={
                                                    handleClickPage
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <Row className="g-4 justify-content-start">
                                    <BannerEmptyContent
                                        text={content.emptyMessage}
                                        show={content.showEmptyMessage}
                                    />
                                    {currentContent.map((content) => (
                                        <Col
                                            className="col-auto"

                                            key={content.id}
                                        >
                                            <CardForContent
                                                user={user}
                                                content={content}
                                                img={content.media_card}
                                                handleClickCard={
                                                    handleClickCard
                                                }
                                                handleClickAuthor={
                                                    handleClickAuthor
                                                }
                                                isLiked={handleIsLiked(
                                                    content.id
                                                )}
                                                userPublications={
                                                    userLikedPublications
                                                }
                                                setUserLike={
                                                    setUserLikedPublications
                                                }
                                            />
                                        </Col>
                                    ))}
                                </Row>
                                <hr />
                                <Row className="justify-content-center">
                                    <Col className="col-auto">
                                        <PageComponent
                                            pageNumbers={pageNumbers}
                                            currentPage={content.currentPage}
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
