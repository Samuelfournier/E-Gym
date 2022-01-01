import {React,useEffect,useState} from 'react'
import { Row, Col, Card,Button,Form, ListGroup, Modal,Alert, Container } from "react-bootstrap";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search, CSVExport, } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import { v4 as uuidv4 } from "uuid";
import Header from '../_components/Header/Header'
import Footer from '../_components/Footer/Footer'


export default function equipement({user}) {

    const [equipement, setEquipement] = useState(null);
    const [context, setContext] = useState({ context: 'LIST', currentEquipement: null });


    useEffect(() => {
        axios.get('/api/getAllEquipments').then((res) => {
            setEquipement(res.data);
        })
    }, [])


    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                {
                    (context.context === 'LIST')
                        ? (equipement && <EquipementTable equipement={equipement} context={context} setContext={setContext} />)
                        : (context.context === 'CREATE') ? (
                            <CreateEquipementForm context={context} setContext={setContext} setEquipements={setEquipement} />)
                            : (<ModifyEquipementForm context={context} setContext={setContext} setEquipements={setEquipement} />)


                }
            </Container>

            <Footer />
        </>
    )
}



const ModifyEquipementForm = ({ context, setContext,setEquipements }) => {

    const [currentEquipement, setCurrentEquipement] = useState(context.currentEquipement);

    const [showConfirmModal, setShowConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        variantAlert: ''
    });

    const handleModalClose = () => {
        setShowConfirmModal({
            show: false,
            title: '',
            message: "",
            variantAlert: '',
        })
    }


    const handleChangeEquipement = (e) => {
        const target = e.target.id;
        const value = e.target.value;

        const actTemp = currentEquipement;
        actTemp[target] = value;

        setCurrentEquipement({...currentEquipement});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentEquipement.name == '' || currentEquipement.name == null || currentEquipement.description == '' || currentEquipement.description == null) {
            setShowConfirmModal({
                show: true,
                title: 'Avertissement',
                message: "Veuillez remplir tous les champs",
                variantAlert: 'danger',
            })
            return;
        }

        const data = {
            id: currentEquipement.id,
            name: currentEquipement.name,
            description: currentEquipement.description,
        }

        axios.post('/api/editEquipment', data).then((res) => {

            if (res.data.success) {
                setEquipements(res.data.NewEquipements);

                setShowConfirmModal({
                    show: true,
                    title: 'Confirmation',
                    message: "La modification à été effectuée avec succès",
                    variantAlert: 'success',
                })
            }
            else {

                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Une erreur est survenue veuillez réessayer et bien remplir les champs",
                    variantAlert: 'danger',
                })
            }

        });

    }

    return (
        <>
            <Card bg="light">
                <Card.Header as="h4" className="bg-secondary text-white">
                    <Row>
                        <Col lg={9}>
                            <h4>Modification d'un équipement</h4>
                        </Col>
                        <Col lg={3}>
                            <span className="fa-pull-right pt-1">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={(e) =>
                                    setContext({ ...context, context: "LIST" })
                                }
                                size="sm"
                            >
                                Retourner à la liste
                            </Button>
                            </span>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body>
                    <Row className="justify-content-center">
                        <div className="half-width">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Nom*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={currentEquipement.name}
                                        onChange={handleChangeEquipement}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="description"
                                >
                                    <Form.Label>Description*</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={currentEquipement.description}
                                        onChange={handleChangeEquipement}
                                    />
                                </Form.Group>
                                <Col>
                                    <div className="d-grid gap-2 ">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                        >
                                            Modifier
                                        </Button>
                                    </div>
                                </Col>
                            </Form>
                        </div>
                    </Row>
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
    );
}


const CreateEquipementForm = ({ context, setContext,setEquipements }) => {

    const [currentEquipement, setCurrentEquipement] = useState({ name: '', description: '' });

    const [showConfirmModal, setShowConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        variantAlert: ''
    });

    const handleModalClose = () => {
        setShowConfirmModal({
            show: false,
            title: '',
            message: "",
            variantAlert: '',
        })
    }


    const handleChangeEquipement = (e) => {
        const target = e.target.id;
        const value = e.target.value;

        const actTemp = currentEquipement;
        actTemp[target] = value;

        setCurrentEquipement({...currentEquipement});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentEquipement.name == '' || currentEquipement.name == null || currentEquipement.description == '' || currentEquipement.description == null) {
            setShowConfirmModal({
                show: true,
                title: 'Avertissement',
                message: "Veuillez remplir tous les champs",
                variantAlert: 'danger',
            })
            return;
        }

        const data = {
            name: currentEquipement.name,
            description: currentEquipement.description,
        }


        axios.post('/api/addEquipment', data).then((res) => {

            if (res.data.success) {
                setEquipements(res.data.NewEquipements);
                setCurrentEquipement({ name: '', description: '' });

                setShowConfirmModal({
                    show: true,
                    title: 'Confirmation',
                    message: "La création à été effectué avec succès",
                    variantAlert: 'success',
                })
            }
            else {

                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Une erreur est survenue veuillez réessayer et bien remplir les champs",
                    variantAlert: 'danger',
                })
            }

        });

    }

    return (
        <>
            <Card bg="light">
                <Card.Header as="h4" className="bg-secondary text-white">
                    <Row>
                        <Col lg={9}>
                            <h4>Création d'un nouvel équipement</h4>
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
                    <Row className="justify-content-center">
                        <div className="w-50">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label >Nom*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={currentEquipement.name}
                                        onChange={handleChangeEquipement}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label >Description*</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={currentEquipement.description}
                                        onChange={handleChangeEquipement}
                                    />
                                </Form.Group>
                                <Col>
                                    <div className="d-grid gap-2 ">
                                        <Button type="submit" variant="primary" size="lg">
                                            Créer
                                        </Button>
                                    </div>

                                </Col>
                            </Form>
                        </div>
                    </Row>
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


const EquipementTable = ({ equipement, context,setContext }) => {

    const { SearchBar } = Search;


     // Add buttons actions in action col for each sport.
     const actionColFormatter = (cell, row, rowIndex, formatExtraData) => {

        return (
            <>
                <Button size="sm" variant="primary" className="mx-1" onClick={(e) => handleClickModifyEquipement(e,row)}>Modifer</Button>
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


    const handleClickModifyEquipement = (e,equipement) => {
        e.stopPropagation();
        setContext({ context: 'MODIFY', currentEquipement: equipement});

    }

    const handleClickCreateEquipement = () => {
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
                value: equipement.length,
            },
        ],
    };

    return (
        <>
            <Card bg="light">
                    <Card.Header as="h4" className="bg-secondary text-white">
                        <Row>
                        <Col lg={9}>
                            <h4>Liste des équipements</h4>
                        </Col>
                        <Col lg={3}>
                            <span className="fa-pull-right">
                                <Button size="sm" variant="primary" className="mx-1" onClick={handleClickCreateEquipement}>Créer un nouvel équipement</Button>
                            </span>
                        </Col>
                    </Row>
                    </Card.Header>
                <Card.Body>
                    {/* Boostrap table */}
                    <ToolkitProvider
                        keyField="id"
                        data={equipement}
                        columns={columns}
                        search
                    >
                        {(props) => (
                            <div>
                                <Row className="justify-content-between mb-2">
                                    <span className="lead fs-3">
                                        Rechercher un équipement:
                                    </span>
                                        <Col lg="4" md="5" sm="6" className="mb-2">
                                            <SearchBar {...props.searchProps} placeholder="Rechercher"/>
                                        </Col>
                                </Row>

                                <BootstrapTable
                                        {...props.baseProps}
                                        pagination={paginationFactory(options)}
                                        bootstrap4
                                        hover
                                        sort={{ dataField: "name", order: "asc" }}
                                        headerClasses="bg-secondary text-white text-center"
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
