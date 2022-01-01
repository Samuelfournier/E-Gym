import { React, useEffect, useState, useRef } from 'react'
import CardForCreator from './Card/CardForCreator'
import { Row, Col, Container, Card } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import './ContentCreator.css';
import PageComponent from '../common/PageComponent'
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import { filterContentCreator } from "../MainContentPage/Filter/filterMethod.js";
import Search from '../MainContentPage/Search'
import BannerEmptyContent from '../common/BannerEmptyContent'

export default function ContentCreator({ user }) {

    const [creators, setCreators] = useState({
        originalCreatorsList: [],
        creatorsList: [],
        currentPage: 1,
        cardPerPage: 8,
        showEmptyMessage: false,
        emptyMessage: "Il n'y a aucun résultat avec votre sélection.",
    });

    //State pour la barre de recherhce
    const [search, setSearch] = useState('');

    let history = useHistory();
    const firstUpdate = useRef(true);

    useEffect(() => {
        // Load tous les contenus
        axios.get("/api/GetAllContentCreator").then((res) => {
            setCreators({
                ...creators,
                creatorsList: res.data,
                originalCreatorsList: res.data
            });
        })
    }, [])


    //Lorsqu'on tappe dans la barre de recherche , filtre le contenu
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        let newContent = filterContentCreator(creators.originalCreatorsList, search);
        setCreators({
            ...creators,
            creatorsList: newContent,
            showEmptyMessage: newContent.length == 0 ? true : false,
        })
    }, [search])

    const HandleSearch = (e) => {
        let current_search = e.target.value.toLowerCase().replace(/\s+/g, " ");
        setSearch(current_search);
    }

    const handleClickCard = (e, id) => {
        history.push(`/auteur/${id}`);
    }

    // Change la page
    const handleClickPage = (e) => {

        if (e.target.innerHTML[0] != creators.currentPage) {
            window.scrollTo(0, 0);
            setCreators({ ...creators, currentPage: e.target.innerHTML[0] });
        }
    };

    // Regarde la dernière carte à allez chercher et la première pour séparer le array.
    const indexOfLastCard = creators.currentPage * creators.cardPerPage;
    const indexOfFirstCard = indexOfLastCard - creators.cardPerPage;
    const currentCreators = creators.creatorsList.slice(
        indexOfFirstCard,
        indexOfLastCard
    );

    // Rempli le nombre de page selon le nombre de Card
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(creators.creatorsList.length / creators.cardPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                <Card bg="light">
                    <Card.Header className="bg-secondary text-white">
                        <h4>Nos professionnels</h4>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-4 mb-2 justify-content-center">
                            <Col lg={12}>

                                <Row className="g-4 mb-2 justify-content-center">
                                    <Col lg={12}>
                                        <Search HandleSearch={HandleSearch} />
                                    </Col>
                                </Row>


                                {/* Only visible on mobile */}
                                <div className="d-block d-sm-block d-md-block d-lg-none">
                                    <Row className="g-4 my-2 justify-content-center">
                                        <hr />
                                        <Col className="col-auto">
                                            <PageComponent pageNumbers={pageNumbers} currentPage={creators.currentPage} handleClickPage={handleClickPage} />
                                        </Col>
                                    </Row>

                                </div>

                                <Row className="g-4 mb-2 justify-content-center">
                                <BannerEmptyContent text={creators.emptyMessage} show={creators.showEmptyMessage} />
                                    {
                                        currentCreators.map((creator) => {
                                            return (
                                                <Col className="col-auto" key={creator.id}>
                                                    <CardForCreator creator={creator} handleClickCard={handleClickCard} />
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>

                                <Row className="g-4 my-2 justify-content-center">
                                    <hr />
                                    <Col className="col-auto">
                                        <PageComponent pageNumbers={pageNumbers} currentPage={creators.currentPage} handleClickPage={handleClickPage} />
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    )
}
