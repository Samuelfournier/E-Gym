import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";

// Components
import GenerateTokenForm from "./GenerateTokenForm";
import ReportTokensTable from "./ReportTokensTable";

export default function Tokens({ user }) {

    const generateTokenFormRef = useRef();
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        fetchTokens();
    }, []);

    // Handlers
    const onSubmit = async (e) => {
        e.preventDefault();

        // Form fields to validate
        let formFields = ['quantity', 'expiration_date'];
        validateForm(generateTokenFormRef, formFields);
        generateTokens(generateTokenFormRef);
    }

    // Helpers
    const validateForm = (formRef, formFields) => {

        // Form
        for (let i = 0; i < formFields.length; i++)
        {
            if (formRef.current[formFields[i]].value === 0 || formRef.current[formFields[i]].value === "" )
            {
                throw new Error();
            }
        }
    }

    // Fetch tokens from api
    const fetchTokens = async () => {
        try{
            let response = await axios.get("/api/get-all-tokens");
            setTokens(response.data.tokens)
        }
        catch(error) {
            console.log(error.response);
        }

    }

    // Generates the promocodes based on the form values.
    const generateTokens = async (formRef) => {

        if(confirm('Voulez-vous vraiment générer les ' + formRef.current["quantity"].value + ' codes?')){

            let params = {
                quantity: formRef.current["quantity"].value,
                expiration_date: formRef.current["expiration_date"].value,
            };

            // Axios call to generate codes
            axios
                .post("/api/generate-tokens", params)
                .then((response) => {
                    // set modalSuccess message and show.
                    fetchTokens();
                })
                .catch((error) => {
                    console.log(error.response);
            });

        }
    }

    // Delete a token in database and in frontend array.
    const deleteToken = (e, id) => {
        e.preventDefault();
        console.log(e);
        console.log(id);

        if (confirm("Êtes-vous certain de vouloir supprimer ce code?")) {
            axios.post("/api/delete-token", { token_id: id }).then((response) => {
                let newTokens = tokens.filter( (token) => token.id !== id );
                console.log(newTokens);
                setTokens(newTokens);
            });
        }
    };

    // Render
    return (
        <>
            <Container fluid className="p-4">
                <div className="mb-4">
                    <GenerateTokenForm formRef={generateTokenFormRef} onSubmit={onSubmit}></GenerateTokenForm>
                </div>
                <div className="mb-4">
                    <ReportTokensTable tokens={tokens} deleteToken={deleteToken}></ReportTokensTable>
                </div>
            </Container>
        </>
    );
}
