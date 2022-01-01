import { Formik, useField, useFormikContext } from 'formik';
import { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Container, Image, Spinner, Card } from 'react-bootstrap';
import * as Yup from "yup";

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

//validation schema for all form fields
const schema = Yup.object().shape({
    title: Yup.string()
        .max(80, "Le titre peut contenir un maximum de 80 caractères")
        .required("Un titre est requis"),
    sport: Yup.string()
        .matches(/^[1-9][0-9]*$/, "un sport est requis"),
    position: Yup.string()
        .matches(/^[1-9][0-9]*$/, "une position est requise"),
    category: Yup.string()
        .matches(/^[1-9][0-9]*$/, "une catégorie est requise"),
    summary: Yup.string()
        .required("un résumé du plan d'entrainement est requis"),
    description: Yup.string()
        .required("Une description détaillée du plan d'entrainement est requise"),
    media: Yup.string()
        .when("mediaRequired", {
            is: true,
            then: Yup.string()
                .matches(/^.*\.(jpg|JPG|png)$/, "format de fichier incorrect")
                .required("un fichier image est requis"),
        }),
    tags: Yup.string().test("tagCount", "le nombre maximum d'attributs est 5", function (value) {
        var tags = value ? value.split(',') : {};

        if (tags.length > 5)
            return false;

        return true;
    }),
    weekNumber: Yup.number()
        .positive("le nombre de semaine doit être supérieur à 0")
        .integer("le nombre de semaine doit correspondre à un nombre")
        .required("un nombre de semaine est requis"),
    sessionNumber: Yup.number()
        .positive("le nombre de séance doit être supérieur à 0")
        .integer("le nombre de séance doit correspondre à un nombre")
        .required("un nombre de séance est requis"),
    author: Yup.string()
        .when("showAuthor", {
            is: true,
            then: Yup.string().matches(/^[1-9][0-9]*$/, "un auteur est requis"),
        })
});

const DependentSelectField = ({ onActivityChange, ...props }) => {
    const { values, touched, errors } = useFormikContext();
    const [field, meta] = useField(props);

    useEffect(() => {
        if (values.sport != '0' && values.sport != undefined)
            onActivityChange(props.activities[values.sport].positions);

    }, [values.sport, touched])

    return (
        <>
            <Form.Select {...props} {...field}>
                <option disabled key="0" value="0">Choisissez une position...</option>
                {Object.keys(props.positions).map(function (position_key, idxPosition) {
                    return <option key={idxPosition.toString()} value={position_key}>{props.positions[position_key].name}</option>
                })
                }
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.position}</Form.Control.Feedback>
        </>
    )
}

const TrainingProgramForm = ({ user, formRef, handleSubmit, data }) => {

    const [isLoading, setLoading] = useState(true);
    // Data containers
    const [activities, setActivities] = useState(null);
    const [positions, setPositions] = useState([]);
    const [authors, setAuthors] = useState(null);
    const [categories, setCategories] = useState(null);
    const [dataValues, setDataValues] = useState(null);
    const [mode, setMode] = useState(data != null ? "modification" : "creation");
    const mediaImg = useRef(null);

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        setDataValues(
            data != null ? {
                title: data.title,
                sport: data.activite_id,
                position: data.position_id,
                category: data.categorie_id,
                summary: data.overview,
                description: data.content,
                weekNumber: data.weeks.length,
                sessionNumber: data.weeks[0].sessions.length,
                media: "",
                tags:  data.tags == 'undefined' ? '' : data.tags,
                author: data.author_id,
                showAuthor: (user != null && user.role_id === 2 ? true : false),
                mediaRequired: false
            }
                : {
                    title: "",
                    sport: "0",
                    position: "0",
                    category: "0",
                    summary: "",
                    description: "",
                    weekNumber: "",
                    sessionNumber: "",
                    media: "",
                    tags: "",
                    author: "0",
                    showAuthor: (user != null && user.role_id === 2 ? true : false),
                    mediaRequired: true
                }
        )
    }, [data]);

    const getData = async () => {
        const response = await axios.get('/api/create-article/0');
        setActivities(response.data.data.activities);
        setAuthors(response.data.data.authors);
        setCategories(response.data.data.categories);
        setLoading(false);
    }


    const ReadFile = (media) => {

        // console.log(mediaImg);
        var reader = new FileReader();
        reader.readAsDataURL(media);

        reader.onload = function(e)  {
            mediaImg.current.src =  e.target.result
        }
    }

    return (
        <Container fluid className="p-4">
            {isLoading ? <Spinner className="trainingProgram-spinner" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner> :

                <Card bg="light">

                    <Card.Header as="h4" className="bg-secondary text-white">
                        Création d'un plan d'entrainement
                    </Card.Header>

                    <Card.Body>
                        <Row className="">
                            <Col lg={12} sm={8}>
                                <Formik
                                    enableReinitialize={true}
                                    validationSchema={schema}
                                    initialValues={{ title: dataValues.title, sport: dataValues.sport, position: dataValues.position, category: dataValues.category, summary: dataValues.summary, description: dataValues.description, weekNumber: dataValues.weekNumber, sessionNumber: dataValues.sessionNumber, media: dataValues.media, tags: dataValues.tags, author: dataValues.author, showAuthor: (user != null && user.role_id === 2 ? true : false), mediaRequired: dataValues.mediaRequired }}
                                >{({ handleChange, handleBlur, values, touched, errors, isSubmitting, isValid, dirty }) => (
                                    <Form id="trainingProgram-form" ref={formRef} onSubmit={handleSubmit}>
                                        <Row className="mb-3" lg={12}>
                                            <Form.Group controlId="formTitle">
                                                <Form.Label className="lead text-muted">Titre</Form.Label>
                                                <Form.Control type="text" name="title" placeholder="titre du plan d'entrainement" onChange={handleChange} onBlur={handleBlur} value={values.title} isInvalid={touched.title && errors.title} />
                                                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} sm={6}>
                                                <Form.Label className="lead text-muted">Sports</Form.Label>
                                                <Form.Select name="sport" onChange={handleChange} onBlur={handleBlur} value={values.sport} isInvalid={touched.sport && errors.sport}>
                                                    <option disabled key="0" value="0">Choississez un sport...</option>
                                                    {activities && Object.keys(activities).map(function (activity_id, idx) {
                                                        return <option key={idx.toString()} value={activity_id}>{activities[activity_id].name}</option>
                                                    })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">{errors.sport}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} sm={6}>
                                                <Form.Label className="lead text-muted">Positions</Form.Label>
                                                <DependentSelectField name="position" onChange={handleChange} onBlur={handleBlur} value={values.position} isInvalid={touched.position && errors.position} positions={positions} activities={activities} onActivityChange={setPositions}></DependentSelectField>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Catégories</Form.Label>
                                                <Form.Select name="category" onChange={handleChange} onBlur={handleBlur} value={values.category} isInvalid={touched.category && errors.category}>
                                                    <option disabled key="0" value="0">Choississez une catégorie...</option>
                                                    {categories && Object.keys(categories).map(function (category_id, idx) {
                                                        return <option key={idx.toString()} value={category_id}>{categories[category_id]}</option>
                                                    })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Résumé</Form.Label>
                                                <Form.Control type="text" name="summary" placeholder="résumé du plan d'entrainement" onChange={handleChange} onBlur={handleBlur} value={values.summary} isInvalid={touched.summary && errors.summary} />
                                                <Form.Control.Feedback type="invalid">{errors.summary}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Description complète du plan d'entrainement</Form.Label>
                                                <Form.Control as="textarea" name="description" rows="3" onChange={handleChange} onBlur={handleBlur} value={values.description} isInvalid={touched.description && errors.description} />
                                                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Miniature</Form.Label>
                                                    <Row>

                                                    {data != null && data.media != "" ?
                                                        <>
                                                                <Col lg={3} sm={12}>
                                                                <Image
                                                                    src={data.hasOwnProperty('id') ? data.media : ReadFile(data.media) }
                                                                    thumbnail
                                                                    style={{ maxHeight: "300px" }}
                                                                    ref={mediaImg}
                                                                    />

                                                            </Col>
                                                            <Col lg={9} sm={12}>
                                                                <Form.Control type="file" name="media" onChange={handleChange} onBlur={handleBlur} value={values.media} isInvalid={touched.media && errors.media} />
                                                                <Form.Control.Feedback type="invalid">{errors.media}</Form.Control.Feedback>
                                                            </Col>
                                                        </>
                                                        :
                                                        <Col>
                                                            <Form.Control type="file" name="media" onChange={handleChange} onBlur={handleBlur} value={values.media} isInvalid={touched.media && errors.media} />
                                                            <Form.Control.Feedback type="invalid">{errors.media}</Form.Control.Feedback>
                                                        </Col>
                                                    }
                                                </Row>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Tags (séparés par des ,)</Form.Label>
                                                <Form.Control type="text" name="tags" placeholder="tag1,tag2,tag3" onChange={handleChange} onBlur={handleBlur} value={values.tags} isInvalid={touched.tags && errors.tags} />
                                                <Form.Control.Feedback type="invalid">{errors.tags}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Durée du plan d'entrainement (nombre de semaines)</Form.Label>
                                                <Form.Control type="number" name="weekNumber" min="0" onChange={handleChange} onBlur={handleBlur} value={values.weekNumber} isInvalid={touched.weekNumber && errors.weekNumber} />
                                                <Form.Control.Feedback type="invalid">{errors.weekNumber}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Nombre de séance par semaine</Form.Label>
                                                <Form.Control type="number" name="sessionNumber" min="0" onChange={handleChange} onBlur={handleBlur} value={values.sessionNumber} isInvalid={touched.sessionNumber && errors.sessionNumber} />
                                                <Form.Control.Feedback type="invalid">{errors.sessionNumber}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        {user != null && user.role_id == 2 && <Row className="mb-3">
                                            <Form.Group>
                                                <Form.Label className="lead text-muted">Auteur</Form.Label><Button size="sm" className="m-3" variant="outline-secondary" type="button" >Créer un professionnel</Button>
                                                <Form.Select name="author" onChange={handleChange} onBlur={handleBlur} value={values.author} isInvalid={touched.author && errors.author}>
                                                    <option disabled key="0" value="0">Choississez un auteur...</option>
                                                    {authors && Object.keys(authors).map(function (authors_id, idx) {
                                                        return <option key={idx.toString()} value={authors_id}>{authors[authors_id].name} - {authors[authors_id].email}</option>
                                                    })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>}
                                        <hr/>
                                        <Row className="mb-3 p-2">
                                            <Button className="w-100" variant="primary" id="trainingProgramForm-submit-button" type="submit" disabled={mode == 'creation' ? !(isValid && dirty) : !(isValid)}>{data == null ? "Créer le plan d'entrainement" : "modifier le plan d'entrainement"}</Button>
                                        </Row>
                                    </Form>
                                )}
                                </Formik>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            }
        </Container>
    )
}

export default TrainingProgramForm
