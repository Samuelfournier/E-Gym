import { React, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Col, Row, Card } from "react-bootstrap";
import Header from "../_components/Header/Header";
import ArticleForm from "./ArticleForm";

import Footer from "../_components/Footer/Footer";
import ModalSuccess from "../common/ModalSuccess";
import { useHistory } from "react-router-dom";
import Loading from "../payments/Loading";

export default function Article({ user }) {
    const [buttonDisabled, setbuttonDisabled] = useState(false);
    const [fieldErrorMessage, setfieldErrorMessage] = useState("");
    const [showSuccesAlert, setshowSuccesAlert] = useState(false);
    const [spinnerStyle, setspinnerStyle] = useState("none");
    const [editorOverviewValue, setEditorOverviewValue] = useState("");
    const [editorContentValue, setEditorContentValue] = useState("");

    let history = useHistory();
    const formRef = useRef(null);

    // Parameters
    const { id = 0 } = useParams(); // if no parameters is passed, set it to 0

    // This function calls the api and creates a publication.
    // returns a string containing the success message
    const createPublication = async function (form) {
        // Create form data to pass the data to backend
        let data = new FormData();
        let FormatedTags = ' ';

        if( form.current["tags"].value != '')
        {
            FormatedTags = form.current["tags"].value.replace(",", " ");
            FormatedTags = FormatedTags.replace(/\s+/g, " ");
        }

        // User already fetched
        if (user.role_id === 2)
            data.append("user_id", form.current["author"].value);
        else data.append("user_id", user.id);

        data.append("visibility", form.current["visibility"].value);
        data.append("title", form.current["article_title"].value);
        data.append("media", form.current["media"].files[0]);
        data.append("position", form.current["position"].value);
        data.append("category", form.current["category"].value);
        data.append("tags", FormatedTags);
        data.append("overview", editorOverviewValue);
        data.append("content", editorContentValue);
        data.append("time_total", form.current["time_total"].value);

        // set the header to be able to send files to backend.
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };

        const response = await axios.post(
            "/api/create-article/" + id,
            data,
            config
        );
        return response.data;
    };

    // This function validate every form field of ArticleForm to make sure they aren't empty.
    const validateForm = (formRef, formFields) => {
        // Form
        for (let i = 0; i < formFields.length; i++) {

            if (
                formRef.current[formFields[i]].value === 0 ||
                formRef.current[formFields[i]].value === ""
            ) {
                setfieldErrorMessage(
                    "Veuillez remplir l'ensemble des champs de ce formulaire."
                );
                throw new Error();
            }
        }

        // Rich text editor
        if ({ editorOverviewValue } == "") {
            setfieldErrorMessage(
                "Veuillez remplir l'ensemble des champs de ce formulaire."
            );
            throw new Error();
        }

        if ({ editorContentValue } == "") {
            setfieldErrorMessage(
                "Veuillez remplir l'ensemble des champs de ce formulaire."
            );
            throw new Error();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setfieldErrorMessage("");

        let formFields = [
            "visibility",
            "article_title",
            "position",
            "category",
            "time_total",
        ];

        if (user.role_id === 2) {
            formFields.push("author");
        }

        try {
            setbuttonDisabled(true);
            setspinnerStyle("block");

            validateForm(formRef, formFields);
            const result = await createPublication(formRef);

            if (result.success === true) {
                handleshowSuccesAlert();
                setspinnerStyle("none");
                return;
            } else if (result.success === false) {
                setfieldErrorMessage(result.message);
            }

            setbuttonDisabled(false);
            setspinnerStyle("none");
        } catch (err) {
            setbuttonDisabled(false);
            setspinnerStyle("none");
        }
    };

    const handleRedirect = () => {
        history.push("/auteur/" + user.id);
    };

    const handleshowSuccesAlert = () => {
        setshowSuccesAlert(!showSuccesAlert);
    };

    // Render
    return (
        <>
            <Header user={user} />
            <Container fluid className="p-4">
                <Card className="shadow-sm mb-4 bg-light">
                    <Card.Header as="h4" className="bg-secondary text-white">
                        {id && id != 0 ? (
                            'Modifier un article'
                        ) : (
                            'Créer un article'
                        )}
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>
                                <ArticleForm
                                    user={user}
                                    article_id={id}
                                    handleSubmit={handleSubmit}
                                    buttonDisabled={buttonDisabled}
                                    formRef={formRef}
                                    fieldErrorMessage={fieldErrorMessage}
                                    setEditorOverviewValue={
                                        setEditorOverviewValue
                                    }
                                    setEditorContentValue={
                                        setEditorContentValue
                                    }
                                />
                                <Loading style={spinnerStyle} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />

            <ModalSuccess
                title="Notification"
                body="Création de l'article réussi !"
                buttonMessage="Aller à la page de l'auteur"
                redirect={true}
                handleRedirect={handleRedirect}
                show={showSuccesAlert}
                handleShow={handleshowSuccesAlert}
            />
        </>
    );
}
