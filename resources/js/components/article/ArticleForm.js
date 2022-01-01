import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button, Image } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loading from "../payments/Loading";
import { useHistory } from "react-router-dom";

export default function ArticleForm({
    user,
    article_id,
    handleSubmit,
    buttonDisabled,
    formRef,
    fieldErrorMessage,
    setEditorOverviewValue,
    setEditorContentValue,
}) {
    // States
    const [dataFetched, setDataFetched] = useState(null);
    const [formData, setFormData] = useState(null);
    const [spinnerStyle, setspinnerStyle] = useState("none");
    let history = useHistory();

    // UseEffects
    useEffect(() => {
        setspinnerStyle("block");
        axios.get("/api/create-article/" + article_id).then((response) => {

            if (response.data.data.activity_id > 0)
            {
                setDataFetched({
                    ...dataFetched,
                    sports: response.data.data.activities,
                    authors: response.data.data.authors,
                    categories: response.data.data.categories,
                    positions:
                        response.data.data.activities[
                            response.data.data.activity_id
                        ].positions,
                });
            }
            else
            {
                setDataFetched({
                    ...dataFetched,
                    sports: response.data.data.activities,
                    authors: response.data.data.authors,
                    categories: response.data.data.categories,
                });
            }

            setFormData({
                category_id: response.data.data.article.category_id,
                content: response.data.data.article.content,
                created_at: response.data.data.article.created_at,
                deleted_at: response.data.data.article.deleted_at,
                id: response.data.data.article.id,
                media: response.data.data.article.media,
                media_card: response.data.data.article.media_card,
                overview: response.data.data.article.overview,
                position_id: response.data.data.article.position_id,
                tags: response.data.data.article.tags,
                time_total: response.data.data.article.time_total,
                title: response.data.data.article.title,
                type_publication_id: 2,
                type_visibility_id:
                    response.data.data.article.type_visibility_id,
                updated_at: response.data.data.article.updated_at,
                activity_id: response.data.data.activity_id,
                author_id: response.data.data.author_id,
            });

            setEditorOverviewValue(response.data.data.article.overview);
            setEditorContentValue(response.data.data.article.content);
            setspinnerStyle("none");

        }).catch(error => {
            history.push('/');
            setspinnerStyle("none");
        });
    }, []);

    // Render
    return (
        <>
            {dataFetched && formData ? (
                <Form
                    id="article-form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    //className="border-light rounded shadow p-5"
                >
                    <div className="width-100 mb-3 alert-danger text-center rounded">
                        <span>{fieldErrorMessage}</span>
                    </div>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="visibility">
                            <Form.Label className="lead text-muted">
                                Visibilité
                            </Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type_visibility_id: e.target.value,
                                    })
                                }
                                value={formData.type_visibility_id}
                            >
                                <option key="visibility_0" value={0}>
                                    Sélectionner le type de visibilité
                                </option>
                                <option key="visibility_1" value={1}>
                                    Public
                                </option>
                                <option key="visibility_2" value={2}>
                                    Privé
                                </option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} controlId="time_total">
                            <Form.Label className="lead text-muted">
                                Durée de lecture estimée
                            </Form.Label>
                            <Form.Control
                                type="time"
                                key="time"
                                min="00:00"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        time_total: e.target.value,
                                    })
                                }
                                value={formData.time_total}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="article_title">
                            <Form.Label className="lead text-muted">
                                Titre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                value={formData.title}
                                placeholder="Titre de l'article"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group controlId="media">
                            <Form.Label className="lead text-muted">
                                Média
                            </Form.Label>
                            <Row className="justify-content-center">
                                {formData.media ? (
                                    <>
                                        <Col lg={3} sm={12}>
                                            <Image
                                                src={formData.media}
                                                thumbnail
                                                style={{ maxHeight: "300px" }}
                                            />
                                        </Col>
                                        <Col lg={9} sm={12}>
                                            <Form.Control
                                                type="file"
                                                name="media"
                                                placeholder="Sélectionner un média"
                                                style={{
                                                    /*width: "80%",*/
                                                    height: "fit-content",
                                                }}
                                            />
                                        </Col>
                                    </>
                                ) : (
                                    <Col>
                                        <Form.Control
                                            type="file"
                                            name="media"
                                            placeholder="Sélectionner un média"
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="sport">
                            <Form.Label className="lead text-muted">
                                Activités
                            </Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        activity_id: e.target.value,
                                    });

                                    setDataFetched({
                                        ...dataFetched,
                                        positions:
                                            dataFetched.sports[e.target.value]
                                                .positions,
                                    });
                                }}
                                value={formData.activity_id}
                            >
                                <option key={"activity_0"} value="0">
                                    Sélectionner une activité
                                </option>
                                {dataFetched.sports &&
                                    Object.keys(dataFetched.sports).map(
                                        (act_id, idx) => {
                                            return (
                                                <option
                                                    key={"activity_" + act_id}
                                                    value={act_id}
                                                >
                                                    {
                                                        dataFetched.sports[
                                                            act_id
                                                        ].name
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="position">
                            <Form.Label className="lead text-muted">
                                Positions
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.position_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        position_id: e.target.value,
                                    })
                                }
                            >
                                <option key={"position_0"} value="0">
                                    Sélectionner une position
                                </option>
                                {dataFetched.positions &&
                                    Object.keys(dataFetched.positions).map(
                                        function (position_key, idxPosition) {
                                            return (
                                                    <option
                                                        key={
                                                            "position_" +
                                                            position_key
                                                        }
                                                        value={position_key}
                                                    >
                                                        {
                                                            dataFetched
                                                                .positions[
                                                                position_key
                                                            ].name
                                                        }
                                                    </option>
                                            );
                                        }
                                    )}
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="category">
                            <Form.Label className="lead text-muted">
                                Catégories
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.category_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category_id: e.target.value,
                                    })
                                }
                            >
                                <option key={"category_0"} value="0">
                                    Sélectionner une catégorie
                                </option>
                                {dataFetched.categories &&
                                    Object.keys(dataFetched.categories).map(
                                        function (category_id, idx) {
                                            return (
                                                    <option
                                                        key={
                                                            "category_" +
                                                            category_id
                                                        }
                                                        value={category_id}
                                                    >
                                                        {
                                                            dataFetched
                                                                .categories[
                                                                category_id
                                                            ]
                                                        }
                                                    </option>
                                            );
                                        }
                                    )}
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="tags">
                            <Form.Label className="lead text-muted">
                                Attributs (séparés par des ,)
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.tags}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        tags: e.target.value,
                                    });
                                }}
                                placeholder="Tag1,tag2,tag3..."
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="overview">
                            <Form.Label className="lead text-muted">
                                Résumé
                            </Form.Label>

                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.overview}
                                onChange={(e, editor) =>
                                    setEditorOverviewValue(editor.getData())
                                }
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        {/* This should be a text editor */}
                        <Form.Group as={Col} controlId="content">
                            <Form.Label className="lead text-muted">
                                Contenu
                            </Form.Label>

                            <CKEditor
                                editor={ClassicEditor}
                                data={formData.content}
                                onChange={(e, editor) =>
                                    setEditorContentValue(editor.getData())
                                }
                            />
                        </Form.Group>
                    </Row>
                    {user != null && user.role_id === 2 && (
                        <Row className="mb-3">
                            {/* This should be only visible by an admin */}
                            <Form.Group as={Col} controlId="author">
                                <Form.Label className="lead text-muted">
                                    Auteur
                                </Form.Label>
                                <Button
                                    size="sm"
                                    className="m-3"
                                    variant="outline-secondary"
                                    type="button"
                                >
                                    Créer un professionnel
                                </Button>
                                <Form.Control
                                    as="select"
                                    value={formData.author_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            author_id: e.target.value,
                                        })
                                    }
                                >
                                    <option key={"author_0"} value="0">
                                        Sélectionner un auteur
                                    </option>
                                    {dataFetched.authors &&
                                        Object.keys(dataFetched.authors).map(
                                            function (authors_id, idx) {
                                                return (
                                                        <option
                                                            key={
                                                                "author_" +
                                                                authors_id
                                                            }
                                                            value={authors_id}
                                                        >
                                                            {
                                                                dataFetched
                                                                    .authors[
                                                                    authors_id
                                                                ].name
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                dataFetched
                                                                    .authors[
                                                                    authors_id
                                                                ].email
                                                            }
                                                        </option>
                                                );
                                            }
                                        )}
                                </Form.Control>
                            </Form.Group>
                        </Row>
                    )}
                    <hr />
                    <Row className="pt-3 justify-content-end">
                        <Col lg="2">
                            {article_id && article_id != 0 ? (
                                <Button
                                    variant="primary"
                                    id="article-submit"
                                    type="submit"
                                    className="w-100 mb-2"
                                    disabled={buttonDisabled}
                                >
                                    Modifier l'article
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    id="article-submit"
                                    type="submit"
                                    className="w-100 mb-2"
                                    disabled={buttonDisabled}
                                >
                                    Créer l'article
                                </Button>
                            )}
                        </Col>
                        <Col lg="2">
                            <Button
                                variant="outline-danger"
                                id="cancel"
                                type="button"
                                className="w-100"
                                disabled={buttonDisabled}
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push("/auteur/" + user.id);
                                }}
                            >
                                Annuler
                            </Button>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <Loading style={spinnerStyle} />
            )}
        </>
    );
}
