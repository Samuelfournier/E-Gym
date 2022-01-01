import { React, useState } from 'react'
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Form, Button, Col } from 'react-bootstrap'
import Select from 'react-select'

export default function CreateExerciceForm({ handleSubmit, formRef, fieldErrorMessage, editorContentValue, fieldEmptyErrorMessage,setEditorContentValue, equipement}) {

    const [currentEquipement, setCurrentEquipement] = useState([]);


    const handleEquipmentChosen = (e) => {
        setCurrentEquipement(e);
    }

    const handleSubmitForm = (e) => {
        handleSubmit(e, currentEquipement);
    }


    return (
        <>
            <Col sm={6} m={6} g={4} className="form-wrapper pt-5">
                <div className="width-100 mb-3 alert-danger text-center rounded">
                    <span>{fieldErrorMessage}</span>
                </div>
                <Form id="exercice-form" ref={formRef} onSubmit={handleSubmitForm} >
                    <Form.Group className="mb-3">
                        <Form.Label className="exercice-form-label" >Titre*</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="exercice-titre"
                        />
                    </Form.Group>
                    {/* <Form.Group className="mb-3" controlId="exercice-description">
                        <Form.Label className="exercice-form-label">Description*</Form.Label>
                        <CKEditor
                            required
                            name="exercice-description"
                            value={editorContentValue}
                            editor={ClassicEditor}
                            onChange={(e, editor) =>
                                setEditorContentValue(editor.getData())}
                        />
                    </Form.Group> */}
                    <Form.Group className="mb-3" controlId="exercice-description">
                        <Form.Label className="exercice-form-label">Description*</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="exercice-description"
                            required />
                    </Form.Group>
                    <Form.Group  controlId="equipement">
                        <Form.Label>Équipement</Form.Label>
                        <Select
                            isMulti
                            name="equipements"
                            options={equipement}
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
                            required />
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
        </>
    )
}

