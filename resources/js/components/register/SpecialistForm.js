import React, { useState, useEffect,} from 'react'
import { Row, Col, Button, Form, Card } from 'react-bootstrap'
import Country from '../Profile/Country'
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    pays: "",
    province: "",
    title: "",
    media: "",
    description: "",
}

export default function SpecialistForm({ handleSubmit, formRef, err,setEditorContentValue,setGender }) {

    const [userProfil, setuserProfil] = useState(initialState)
    const [data, setData] = useState(null);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        let dataTemp = await axios.get('/api/complete-profile');
        setData(dataTemp.data.data);
    }

    const handleOnChange = e => {
        setuserProfil({ ...userProfil, [e.target.name]: e.target.value });
    }

    return (
        <>
        <Form ref={formRef} id="profil-form" onSubmit={handleSubmit}>
            <Card bg="light">

                <Card.Header as="h4" className="bg-secondary text-white">
                    Ajouter un compte spécialiste
                    <span className="fa-pull-right">
                        <Button type="submit" variant="primary">Enregistrer</Button>
                    </span>
                </Card.Header>

                <Card.Body>
                    <span>{err}</span>
                        <Row>
                            <Col lg={6} className="mb-2">

                                <Form.Group controlId="firstName" className="mb-2">
                                    <Form.Label className="lead fs-3" >Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        required
                                        onChange={handleOnChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="lastName" className="mb-2">
                                    <Form.Label className="lead fs-3">Nom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        required
                                        onChange={handleOnChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="email" className="mb-2">
                                    <Form.Label className="lead fs-3">Courriel</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        onChange={handleOnChange}
                                        placeholder="courriel@example.com"
                                    />
                                </Form.Group>

                                <Form.Group controlId="facebook" className="mb-2">
                                    <Form.Label className="lead fs-3">Facebook</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="facebook"
                                        onChange={handleOnChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="linkedin" className="mb-2">
                                    <Form.Label className="lead fs-3">Linkedin</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="linkedin"
                                        onChange={handleOnChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="instagram" className="mb-2">
                                    <Form.Label className="lead fs-3">Instagram</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="instagram"
                                        onChange={handleOnChange}
                                    />
                                </Form.Group>

                                <Country
                                    {...data}
                                    formRef={formRef} />

                                <Form.Group controlId="title" className="mb-2">
                                    <Form.Label className="lead fs-3">Titre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        required
                                        onChange={handleOnChange}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="gender" className="mb-2">
                                    <Form.Label className="lead fs-3">Genre</Form.Label>
                                    <Form.Select required name="gender" onChange={(e) => setGender(e.target.value)}>
                                        <option>Homme</option>
                                        <option>Femme</option>
                                        <option>Autre</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="media" className="mb-2">
                                    <Form.Label className="lead fs-3">Média</Form.Label>
                                    <Form.Control type="file"
                                        placeholder="choisir un fichier"
                                        name="media"
                                        onChange={handleOnChange}
                                        required
                                    />
                                </Form.Group>

                            </Col>

                            <Col lg={6}>
                                <Form.Group controlId="specialist-description" className="mb-2">
                                    <Form.Label className="lead fs-3">Description</Form.Label>
                                    <CKEditor
                                        required
                                        name="specialist-description"
                                        editor={ClassicEditor}
                                        onChange={(e, editor) => setEditorContentValue(editor.getData())}
                                        onReady={(editor) => {
                                                editor.editing.view.change((writer) => {
                                                writer.setStyle(
                                                    "height",
                                                    "400px",
                                                    editor.editing.view.document.getRoot()
                                                );
                                                });
                                            }}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                </Card.Body>
            </Card>
        </Form>
        </>
    )
}

