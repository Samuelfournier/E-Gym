import { React, useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

import "./Category.css";
import { Col, Row, Container, InputGroup, FormControl, Form, Button, Card } from 'react-bootstrap'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AddCategoryForm from './AddCategoryForm';
import ModalSuccess from '../common/ModalSuccess'
import ModalEditForm from '../common/ModalEditForm';
import Category_header from './Category_header';
import { filterCategory } from "../MainContentPage/Filter/filterMethod.js";

export default function Category({ user }) {

    const [category, setCategory] = useState({
        originalCategoriesList: [],
        categoryList: [],
        showEmptyMessage: false,
        emptyMessage: "Il n'y a aucun résultat avec votre sélection.",
    });

    const [modalTitle, setTitle] = useState(null);
    const [categoryId, setId] = useState(null);
    const [showSuccesAlert, setshowSuccesAlert] = useState(false);
    const [fieldErrorMessage, setfieldErrorMessage] = useState('');
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const formRef = useRef(null);
    const [search, setSearch] = useState('');
    const firstUpdate = useRef(true);

    useEffect(() => {
        getData();
    }, [])


    const getData = async () => {
        let dataTemp = await axios.get('/api/categories');
        setCategory({
            ...category,
            originalCategoriesList: dataTemp.data.data,
            categoryList: dataTemp.data.data
        })

    }

    // This function validate every form field of CategoryForm to make sure they aren't empty.
    const validateForm = (formFields, formRef) => {
        //console.log('validation')
        for (let i = 0; i < formFields.length; i++) {
            if (formRef.current[formFields[i]].value === 'undefined') {
                console.log('non - validation')
                setfieldErrorMessage('Veuillez remplir l\'ensemble des champs de ce formulaire.');
                throw new Error();
            }
        }
    }
    //Lorsqu'on écrit dans la barre de recherche , filtre le contenu
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        let newContent = filterCategory(category.originalCategoriesList, search);

        setCategory({
            ...category,
            categoryList: newContent,
            showEmptyMessage: newContent.length == 0 ? true : false,
        })
    }, [search])

    const HandleSearch = (e) => {
        let current_search = e.target.value.toLowerCase().replace(/\s+/g, " ");
        setSearch(current_search);
    }
    const handleSubmit = async (e) => {
        //console.log(e.target.value)
        e.preventDefault();
        let formFields = [
            'category-titre',
            'category-description',
            'category-id'
        ]

        // set the header to be able to send files to backend.
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Credentials': true,
            }
        }
        try {
            let data = new FormData()

            validateForm(formFields, formRef);
            data.append('name', formRef.current['category-titre'].value)
            data.append('description', formRef.current['category-description'].value)
            data.append('id', formRef.current['category-id'].value)

            const response = await axios.post('/api/add-category', data, config)
            formRef.current['category-titre'].value = null
            formRef.current['category-description'].value = null
            formRef.current['category-id'].value = null

            if (response.data.success === true) {
                for (let i = 0; i < formFields.length; i++) {
                    formRef.current[formFields[i]].value = null
                }
                handleshowSuccesAlert();
                setNotificationMsg(response.data.message);
                setShowModal(!showModal);
                return;
            }
            else if (response.data.success === false) {
                setfieldErrorMessage(response.data.message);
            }
        }
        catch (error) {
            console.log('Error: ', error)
        }

    }
    const onEdit = (e) => {
        setId(e.target.id)
        setTitle("Modifier une catégorie")
        setShowAddCategory(true)
    }
    const onAdd = (e) => {
        setId(e.target.id)
        setTitle("Ajouter une catégorie")
        setShowAddCategory(true)
    }
    /* Fonction pour ajouter un bouton supprimé*/
 /*   const onDelete = (e) => {
        let categoryId = e.target.id
        if (confirm("Êtes-vous certain de vouloir supprimer ce contenu?")) {
            let response = axios.post('/api/delete-category/' + categoryId)
                .then((response) => {
                    console.log(response.data.message)
                    setNotificationMsg(response.data.message);
                    setShowModal(!showModal);
                }).catch(err => console.log(err))
        }
    }*/
    const handleShowModal = () => {
        setShowModal(!showModal);

        getData();
    };
    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }
    const handleShowEditCategorie = () => {
        setShowAddCategory(!showAddCategory);
    }

    let results = 0
    const listCategory = category.categoryList && Object.keys(category.categoryList).map((cat, i) =>

        <Row key={uuidv4()}>
            <span className="span-none">{results++}</span>
            <Form.Group className="me-1 row-display"
                controlId={category.categoryList[cat].name}>
                <Col xs={1} className="col-center"><Form.Label >{category.categoryList[cat].id}</Form.Label></Col>
                <Col xs={2} className="col-center"><Form.Label >{category.categoryList[cat].name}</Form.Label></Col>
                <Col xs={3} className="col-center"><Form.Label>{category.categoryList[cat].total}</Form.Label></Col>
                <Col xs={2} className="col-center"><Form.Label >{category.categoryList[cat].date}</Form.Label></Col>
                <Col xs={2} className="col-center"><Form.Label>{category.categoryList[cat].totalCollab}</Form.Label></Col>
                <Col xs={1}><Row><Button className="mb-1 " variant="primary" onClick={onEdit} id={category.categoryList[cat].id}>Modifier</Button></Row>
                    {/*<Row ><Button className="mb-1 " variant="danger" onClick={onDelete} id={category.categoryList[cat].id}>Supprimer</Button> </Row>*/}</Col>
            </Form.Group>
            <hr />
        </Row >

    )

    const columns = {

    }



    // Render
    return (
        <>
        <Container fluid className="p-4">
            <Card bg="light">
                <Card.Header as="h4" className="bg-secondary text-white">
                    Catégories
                    <span className="fa-pull-right">
                        <Button variant="primary" onClick={onAdd}>Ajouter</Button>
                    </span>
                </Card.Header>
                <Card.Body>
                    <Row className="">
                    <Col className="search" lg={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <span>
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                            </InputGroup.Text>
                            <FormControl
                                placeholder="Entrer un nom de catégorie"
                                onChange={HandleSearch}
                                type="search"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Category_header />
                <Form>
                    {listCategory}
                </Form>
                <span className="span-result">{results} Résulats</span>
                </Card.Body>
            </Card>
            </Container>

            {/*<Container className="main_container_category">
                <span>{fieldErrorMessage}</span>
                <br />
                <h1>Catégories</h1>
                <hr />
                <br />
                <Row className="justify-center">
                    <Col className="search">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <span>
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                            </InputGroup.Text>
                            <FormControl
                                placeholder="Entrer un nom de catégorie"
                                onChange={HandleSearch}
                                type="search"
                            />
                        </InputGroup></Col>

                    <Col className="mb-3 cat-form-bar">


                    </Col>
                </Row>
                <Category_header />
                <Form>
                    {listCategory}
                </Form>
            </Container>
    <span className="span-result">{results} Résulats</span>*/}
            <ModalSuccess
                title="Notification"
                body={notificationMsg}
                buttonMessage="Fermer"
                show={showModal}
                handleShow={handleShowModal}
            />
            <ModalEditForm
                title={modalTitle}
                component={AddCategoryForm}
                fieldErrorMessage={fieldErrorMessage}
                buttonMessage="Ajouter"
                show={showAddCategory}
                handleShow={handleShowEditCategorie}
                handleSubmit={handleSubmit}
                formRef={formRef}
                categoryId={categoryId}
            />
        </>
    )
}
