import {React,useEffect,useState} from 'react'
import { Row, Col, Card,Button,Form, ListGroup, Modal,Alert, Container } from "react-bootstrap";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search, CSVExport, } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import { v4 as uuidv4 } from "uuid";

export default function Sports() {

    const [activties, setActivities] = useState(null);
    const [context, setContext] = useState( {context:'LIST', currentActivity: null} );


    useEffect(() => {
        axios.get('/api/get-all-activities').then((res) => {
            setActivities(res.data);
        })
    }, [])



    return (
        <div>

            {
                (context.context === 'LIST')
                ? (activties && <ActivitiesTable activities={activties} context={context} setContext={setContext} />)
                : (context.context === 'CREATE') ? (<CreateActivitiesForm context={context} setContext={setContext} setActivities={setActivities} />)
                : (<ModifyActivitiesForm context={context} setContext={setContext} setActivities={setActivities} />)

            }

        </div>
    )
}


const ModifyActivitiesForm = ({ context, setContext, setActivities }) => {


    const [activity, setActivity] = useState(context.currentActivity);
    const [listPositions, setListPositions] = useState([]);
    const [position, setPosition] = useState('');

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

    const handleChangeActivity = (e) => {
        const target = e.target.id;
        const value = e.target.value;

        const actTemp = activity;
        actTemp[target] = value;

        setActivity({...activity});
    }


    const handleAddPosition = () => {

        if (position != '') {
            setListPositions([...listPositions, { id: uuidv4(), name: position }]);
            setPosition('');
        }

    }

    const handleDeletePosition = (idx) => {
        let newListPositions = listPositions.filter((lp) => lp.id != idx);
        setListPositions(newListPositions);
    }

    const handleChangeCurrentPosition = (e, id) => {
        const value = e.target.value;

        let indexOfPosition = activity.positions.findIndex((pos => pos.id == id));

        activity.positions[indexOfPosition].name = value;
        setActivity({...activity});

    }


    const handleSubmit = (e) => {
        e.preventDefault();



        let listPositionsName = [];
        if (listPositions.length > 0) {
            for (let i = 0; i < listPositions.length; i++){
                listPositionsName.push(listPositions[i].name);
            }
        }

        const data = {
            activity : activity,
            newPositions: listPositionsName
        }



        axios.post('/api/updateActivity', data).then((res) => {

            if (res.data.success) {

                setActivities(res.data.newActivities);

                let newCurrentActivity = res.data.newActivities.find(activity => activity.id == context.currentActivity.id)
                setListPositions([]);
                setPosition('');
                setActivity({ ...newCurrentActivity })

                setShowConfirmModal({
                    show: true,
                    title: 'Confirmation',
                    message: "La mise à jour à été effectué avec succès",
                    variantAlert: 'success',
                })
            }
            else {
                setShowConfirmModal({
                    show: true,
                    title: 'Avertissement',
                    message: "Une erreur est survenue veuillez réessayer",
                    variantAlert: 'danger',
                })
            }

        });

    }


    return (
        <>
        <Container fluid className="p-4">
            <Card bg="light">
                <Card.Header className="bg-secondary text-white">
                    <Row>
                        <Col lg={9}>
                            <h4>Modification du sport </h4>
                        </Col>
                        <Col lg={3}>
                            <span className="fa-pull-right">
                                <Button type="button" variant="primary" onClick={(e) => setContext({ ...context, context: 'LIST' })} size="sm">
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
                                    <Form.Label >Nom*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={activity.name}
                                            onChange={handleChangeActivity}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label >Description*</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={activity.description}
                                            onChange={handleChangeActivity}/>
                                </Form.Group>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label >Nouvelle position </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="positions"
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                            />
                                        </Form.Group>


                                        {listPositions.length > 0 ?
                                            (<ListGroup>
                                                {listPositions.map((pos, idx) => {
                                                    return (
                                                        <ListGroup.Item key={idx} variant="secondary">
                                                            <Row>
                                                                <Col lg={10}>
                                                                    {pos.name}
                                                                </Col>
                                                                <Col lg={2} >

                                                                    <Button type="button" variant="danger" size="sm" onClick={(e) => handleDeletePosition(pos.id)}>
                                                                        x
                                                                    </Button>
                                                                </Col>
                                                            </Row>

                                                        </ListGroup.Item>)
                                                })}
                                            </ListGroup>)
                                        : ''
                                        }

                                        <ListGroup>
                                            Position courante :
                                            {activity.positions.map((pos, idx) => {
                                                return (
                                                    <ListGroup.Item key={pos.id} variant="secondary">
                                                        <Form.Control
                                                            type="text"
                                                            name="positions"
                                                            value={pos.name}
                                                            onChange={(e) => handleChangeCurrentPosition(e,pos.id)}
                                                        />
                                                    </ListGroup.Item>)
                                            })}
                                        </ListGroup>


                                    </Col>
                                    <Col lg={6}>
                                        <Button type="button" variant="secondary" size="sm" onClick={handleAddPosition}>
                                            Ajouter une postion
                                        </Button>
                                    </Col>
                                </Row>
                                <Col>
                                    <div className="d-grid gap-2 ">
                                        <Button type="submit" variant="primary" size="lg">
                                            Enregistrer les changements
                                        </Button>
                                    </div>

                                </Col>
                            </Form>
                        </div>
                    </Row>
                </Card.Body>
                </Card>
            </Container>
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


const CreateActivitiesForm = ({ context, setContext,setActivities }) => {

    const [activity, setActivity] = useState({ name: '', description: '' });
    const [listPositions, setListPositions] = useState([]);
    const [position, setPosition] = useState('');

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


    const handleAddPosition = () => {
        if (position != '') {
            setListPositions([...listPositions, { id: uuidv4(), name: position }]);
            setPosition('');
        }
    }

    const handleDeletePosition = (idx) => {
        let newListPositions = listPositions.filter((lp) => lp.id != idx);
        setListPositions(newListPositions);
    }

    const handleChangeActivity = (e) => {
        const target = e.target.id;
        const value = e.target.value;

        const actTemp = activity;
        actTemp[target] = value;

        setActivity({...activity});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let listPositionsName = [];
        if (listPositions.length > 0) {
            for (let i = 0; i < listPositions.length; i++){
                listPositionsName.push(listPositions[i].name);
            }
        }
        else {
            listPositionsName = ['tous'];
        }

        const data = {
            name: activity.name,
            description: activity.description,
            positions: listPositionsName
        }

        axios.post('/api/createActivity', data).then((res) => {

            if (res.data.success) {
                setActivities(res.data.newActivities);
                setListPositions([]);
                setPosition('');
                setActivity({ name: '', description: '' });

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
        <Container fluid className="p-4">
            <Card bg="light">
                <Card.Header className="bg-secondary text-white">
                    <Row>
                        <Col lg={9}>
                            <h4>Création d'un nouveau sport</h4>
                        </Col>
                        <Col lg={3}>
                            <span className="fa-pull-right">
                            <Button type="button" variant="primary" onClick={(e) => setContext({ ...context, context: 'LIST' })} size="sm">
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
                                    <Form.Label >Nom*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={activity.name}
                                        onChange={handleChangeActivity}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label >Description*</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={activity.description}
                                        onChange={handleChangeActivity} />
                                </Form.Group>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label >Position </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="positions"
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                            />
                                        </Form.Group>

                                        <ListGroup>
                                            {listPositions.map((pos, idx) => {
                                                return (
                                                    <ListGroup.Item key={idx} variant="secondary">
                                                        <Row>
                                                            <Col lg={10}>
                                                                {pos.name}
                                                            </Col>
                                                            <Col lg={2} >

                                                                <Button type="button" variant="danger" size="sm" onClick={(e) => handleDeletePosition(pos.id)}>
                                                                    x
                                                                </Button>
                                                            </Col>
                                                        </Row>

                                                    </ListGroup.Item>)
                                            })}
                                        </ListGroup>

                                    </Col>
                                    <Col lg={6}>
                                        <Button type="button" variant="secondary" size="sm" onClick={handleAddPosition}>
                                            Ajouter une postion
                                        </Button>
                                    </Col>
                                </Row>
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
            </Container>
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


const ActivitiesTable = ({ activities, context,setContext }) => {

    const { SearchBar } = Search;


     // Add buttons actions in action col for each sport.
     const actionColFormatter = (cell, row, rowIndex, formatExtraData) => {

        return (
            <>
                <Button size="sm" variant="primary" className="mx-1" onClick={(e) => handleClickModifySport(e,row)}>Modifer</Button>
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
            <div>
                Les positions du {row.name} sont :
                {row.positions.map((pos,idx) => {
                    return (
                        <li key={idx}>{pos.name}</li>
                    )
                })}
            </div>
        )
      };



    const handleClickModifySport = (e,sport) => {
        e.stopPropagation();
        setContext({ context: 'MODIFY', currentActivity: sport});

    }

    const handleClickCreateSport = () => {
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
                value: activities.length,
            },
        ],
    };

    return (
        <>
        <Container fluid className="p-4">
            <Card bg="light">
                    <Card.Header className="bg-secondary text-white">
                        <Row>
                        <Col lg={9}>
                            <h4>Listes des sports</h4>
                        </Col>
                        <Col lg={3}>
                            <span className="fa-pull-right">
                                <Button size="sm" variant="primary" className="mx-1" onClick={handleClickCreateSport}>Créer un nouveau sport</Button>
                            </span>
                        </Col>
                    </Row>
                    </Card.Header>
                <Card.Body>
                    {/* Boostrap table */}
                    <ToolkitProvider
                        keyField="id"
                        data={activities}
                        columns={columns}
                        search
                    >
                        {(props) => (
                            <div>
                                <Row className="justify-content-between mb-2">
                                    <span className="lead fs-3">
                                        Rechercher un sport:
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
                                        expandRow={expandRow}
                                        headerClasses="bg-secondary text-white text-center"
                                />
                            </div>
                        )}
                    </ToolkitProvider>
                </Card.Body>
            </Card>
        </Container>
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
