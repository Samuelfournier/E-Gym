import { React, useState, useRef, useEffect } from 'react'

import "./Exercice.css";
import { Col, Row, Container,Card,Button, Image, Modal, Alert,Form } from 'react-bootstrap'
import Header from '../_components/Header/Header'
import Footer from '../_components/Footer/Footer'

import axios from 'axios';
import { useHistory } from 'react-router-dom';

import CreateExerciceForm from './CreateExerciceForm';
import ModalSuccess from '../common/ModalSuccess'
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search, CSVExport, } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import Select from 'react-select'



let formFields = [
    "exercice-media",
    'exercice-titre',

]
export default function Exercice({ user }) {
    const [showSuccesAlert, setshowSuccesAlert] = useState(false);
    const [fieldErrorMessage, setfieldErrorMessage] = useState('');
    // const [editorContentValue, setEditorContentValue] = useState(null);
    const formRef = useRef(null);
    let history = useHistory();



    const [exercice, setExercice] = useState(null);
    const [equipement, setEquipement] = useState(null);
    const [context, setContext] = useState({ context: 'LIST', currentExercice: null });

    useEffect(() => {

        axios.get('/api/getAllMyExercices').then((res) => {
            setExercice(res.data);
        })
        axios.get('/api/getEquipementForDropdown').then((res) => {
            setEquipement(res.data);
        })

    }, [])




    // This function validate every form field of ArticleForm to make sure they aren't empty.
    const validateForm = (formFields, formRef) => {
        for (let i = 0; i < formFields.length; i++) {
            if (formRef.current[formFields[i]].value === 'undefined') {
                setfieldErrorMessage('Veuillez remplir l\'ensemble des champs de ce formulaire.');
                throw new Error();
            }
        }
        // if ( editorContentValue  == null) {
        //     console.log("Veuillez remplir l'ensemble des champs de ce formulaire.")
        //     setfieldErrorMessage(
        //         "Veuillez remplir l'ensemble des champs de ce formulaire."
        //     );
        //     throw new Error();
        // }
    }
    const handleSubmit = async (e, equipementList) => {

        e.preventDefault();

        let data = new FormData()


        let equipmentId = [];
        if (equipementList.length > 0) {
            for (let i = 0; i < equipementList.length; i++) {
                equipmentId.push(equipementList[i].value);
            }
        }


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
            data.append('name', formRef.current['exercice-titre'].value)
            data.append('description', formRef.current['exercice-description'].value)
            data.append('media', formRef.current['exercice-media'].files[0])
            data.append('equipement', equipmentId)


            const response = await axios.post('/api/creation-exercice', data, config)

            if (response.data.success === true) {

                handleshowSuccesAlert();
                setExercice(response.data.NewExerciceList);
                formRef.current['exercice-titre'].value = '';
                formRef.current['exercice-description'].value = '';
                formRef.current['exercice-media'].value = null;

                setfieldErrorMessage();
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


    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    }
    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                {
                    (context.context === 'LIST')
                    ? (exercice && <ExerciceTable exercices={exercice} context={context} setContext={setContext} />)
                        : (context.context === 'CREATE') ? (
                            <CreateExercice context={context} setContext={setContext}
                                setExercice={setExercice}
                                user={user}
                                handleSubmit={handleSubmit}
                                // editorContentValue={editorContentValue}
                                // setEditorContentValue={setEditorContentValue}
                                formRef={formRef}
                                equipement={equipement}
                                fieldErrorMessage={fieldErrorMessage}

                        />)
                    : (<ModifyExerciceForm context={context} setContext={setContext} setExercice={setExercice} equipement={equipement} />)
                }
            </Container>

            <Footer />
            <ModalSuccess
                title='Notification'
                body="Création de l'exercice réussi !"
                buttonMessage= 'Créer un autre exercice'
                redirect={false}
                // handleRedirect={handleRedirect}
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
        </>
    )
}


const ModifyExerciceForm = ({ context, setContext, setExercice, equipement }) => {

    const [currentExercice, setCurrentExercice] = useState(context.currentExercice);
    const [currentEquipement, setCurrentEquipement] = useState([]);

    const [showConfirmModal, setShowConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        variantAlert: ''
    });


    useEffect(() => {
        axios.get(`/api/getEquipmentForAnExercice/${context.currentExercice.id}`).then((res) => {
            setCurrentEquipement(res.data);
        })
    },[])

    const handleModalClose = () => {
        setShowConfirmModal({
            show: false,
            title: '',
            message: "",
            variantAlert: '',
        })
    }


    const handleChangeExercice = (e) => {
        const target = e.target.id;
        const value = e.target.value;

        const actTemp = currentExercice;
        actTemp[target] = value;


        setCurrentExercice({...currentExercice});
    }

    const handleEquipmentChosen = (e) => {
        setCurrentEquipement(e);
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        let equipmentId = [];
        if (currentEquipement.length > 0) {
            for (let i = 0; i < currentEquipement.length; i++) {
                equipmentId.push(currentEquipement[i].value);
            }
        }

        let data = new FormData()

        data.append('id', currentExercice.id)
        data.append('name', currentExercice.name)
        data.append('description', currentExercice.description)
        data.append('media', e.target['exercice-media'].files[0])
        data.append('equipement', equipmentId)

        const config = {
            headers: { "content-type": "multipart/form-data" },
        };

        axios.post('/api/edit-exercice', data, config).then((res) => {
            console.log(res);
                if (res.data.success) {
                    setExercice(res.data.NewExerciceList);
                    setCurrentExercice(res.data.currentExercice);

                    setShowConfirmModal({
                        show: true,
                        title: 'Confirmation',
                        message: "La mise à jour à été effectué avec succès",
                        variantAlert: 'success',
                    })
                } else {
                    setShowConfirmModal({
                        show: true,
                        title: 'Avertissement',
                        message: "Une erreur est survenue veuillez réessayer",
                        variantAlert: 'danger',
                    })
                }
        })

    }

    return (
        <>
        <Card bg="light">
            <Card.Header as="h4" className="bg-secondary text-white">
                <Row>
                    <Col lg={9}>
                        <h4>Modification de l'exercice </h4>
                    </Col>
                    <Col lg={3}>
                        <span className="fa-pull-right pt-1">
                            <Button type="button" variant="primary" onClick={(e) => setContext({ ...context, context: 'LIST' })} size="sm">
                                Retourner à la liste
                            </Button>
                        </span>
                    </Col>
                </Row>
            </Card.Header>
                <Card.Body>


                    <Col sm={6} m={6} g={4} className="form-wrapper">

                        <Form onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label className="exercice-form-label">Titre*</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    name="exercice-titre"
                                    value={currentExercice.name}
                                    onChange={(e) => handleChangeExercice(e)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label className="exercice-form-label">Description*</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="exercice-description"
                                    value={currentExercice.description}
                                    onChange={(e) => handleChangeExercice(e)}
                                    required />
                            </Form.Group>
                            <Form.Group controlId="equipement">
                                <Form.Label>Équipement</Form.Label>
                                <Select
                                    isMulti
                                    name="equipements"
                                    options={equipement}
                                    value={currentEquipement}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleEquipmentChosen}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exercice-media">
                                <Form.Label className="exercice-form-label">Média*</Form.Label>
                                <Form.Control type="file"
                                    placeholder="choisir un fichier"
                                    name="exercice-media"
                                    />
                            </Form.Group>
                            <Col>
                                <div className="d-grid gap-2 ">
                                    <Button type="submit" variant="primary" size="lg">
                                        Enregistrer
                                    </Button>
                                </div>

                            </Col>
                        </Form>
                    </Col>


            </Card.Body>
            </Card>
            <ModalInformations
                title={showConfirmModal.title}
                message={showConfirmModal.message}
                show={showConfirmModal.show}
                variantAlert={showConfirmModal.variantAlert}
                handleClose={handleModalClose}
            />
        </>
    )


}


const CreateExercice = ({ handleSubmit, formRef,fieldErrorMessage ,context,setContext, equipement}) => {

    return (
        <Card bg="light">
            <Card.Header className="bg-secondary text-white">
                <Row>
                    <Col lg={9}>
                        <h4>Création d'un exercice</h4>
                    </Col>
                    <Col lg={3}>
                        <span className="fa-pull-right pt-1">
                            <Button size="sm" variant="primary" className="mx-1" onClick={(e) => setContext({ ...context, context: 'LIST' })}>Retourner à la liste</Button>
                        </span>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <CreateExerciceForm
                    handleSubmit={handleSubmit}
                    formRef={formRef}
                    fieldErrorMessage={fieldErrorMessage}
                    equipement={equipement}

                />
            </Card.Body>
        </Card>
    )
}


const ExerciceTable = ({ exercices, context,setContext }) => {

    const { SearchBar } = Search;


     // Add buttons actions in action col for each sport.
     const actionColFormatter = (cell, row, rowIndex, formatExtraData) => {

        return (
            <>
                <Button size="sm" variant="primary" className="mx-1" onClick={(e) => handleClickModifyExercice(e,row)}>Modifer</Button>
            </>
        );

    }


    const columns = [
        {
            dataField: "name",
            text: "Nom",
            align: "center",
            sort: true,
        },
        {
            dataField: "description",
            align: "center",
            text: "Description",
        },
        {
            // Contains buttons to delete
            dataField: "action",
            align: "center",
            text: "Actions",
            formatter: actionColFormatter,
        },
    ];

    const expandRow = {
        renderer: row => (
            <Image className="h-25 w-25 card-img-top" src={row.media} thumbnail />
        )
      };



    const handleClickModifyExercice = (e,exercice) => {
        e.stopPropagation();
        setContext({ context: 'MODIFY', currentExercice: exercice});

    }

    const handleClickCreateExercice = () => {
        setContext({...context, context: 'CREATE'});
    }
        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                Affiche {from} à {to} de {size} résultats
            </span>
        );

        const options = {
            showTotal: true,
            paginationTotalRenderer: customTotal,
            sizePerPageList: [
                {
                    text: "5",
                    value: 5,
                },
                {
                    text: "10",
                    value: 10,
                },
                {
                    text: "Tout",
                    value: exercices.length,
                },
            ],
        };

        return (
        <>
            <Card bg="light">
                    <Card.Header as="h4" className="bg-secondary text-white">
                        <Row>
                            <Col lg={9}>
                                <h4>Liste des exercices</h4>
                            </Col>
                        <Col lg={3}>
                            <span className="fa-pull-right">
                                <Button size="sm" variant="primary" className="mx-1" onClick={handleClickCreateExercice}>Créer un nouvel exercice</Button>
                            </span>
                        </Col>
                    </Row>
                    </Card.Header>
                <Card.Body>
                    {/* Boostrap table */}
                    <ToolkitProvider
                        keyField="id"
                        data={exercices}
                        columns={columns}
                        search
                    >
                        {(props) => (
                            <div>
                                <Row className="justify-content-between mb-2">
                                    <span className="lead fs-3">
                                        Rechercher un exercice:
                                    </span>
                                        <Col lg="4" md="5" sm="6" className="mb-2">
                                            <SearchBar {...props.searchProps} placeholder="Rechercher" />
                                        </Col>
                                </Row>

                                <BootstrapTable
                                        {...props.baseProps}
                                        pagination={paginationFactory(options)}
                                        bootstrap4
                                        hover
                                        sort={{ dataField: "name", order: "asc" }}
                                        expandRow={expandRow}
                                        headerClasses="text-center bg-secondary text-white"
                                />
                            </div>
                        )}
                    </ToolkitProvider>
                </Card.Body>
            </Card>
        </>
    );
}


const ModalInformations = ({ title, message, show, handleClose, variantAlert }) => {


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert  variant={variantAlert}>
                        {message}
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'dark'} onClick={handleClose}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}
