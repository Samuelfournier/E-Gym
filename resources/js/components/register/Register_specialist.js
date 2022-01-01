import { React, useState, useRef } from 'react'
import "./register.css";
import SpecialistForm from './SpecialistForm'
import { Container, Card } from 'react-bootstrap'
import ModalSuccess from '../common/ModalSuccess'
import axios from 'axios'

let formFields = [
    'firstName',
    'lastName',
    'email',
    'provinces',
    'title',
    'media',
]
export default function Register_specialist({ user }) {
    const [fieldErrorMessage, setfieldErrorMessage] = useState('');

    //une state pour gérer quand afficher le modal
    const [show, setShow] = useState(false);

    // State pour gerer le message
    const [notification, setNotification] = useState('');

    // Variables
    const formRef = useRef(null);
    const [gender, setGender] = useState("Homme")
    // Functions
    // une méthode pour envoyer en props au modal pour qu'il puisse dire au parent de le fermer
    const handleShow = () => {
        setShow(!show);
    }
    const [editorContentValue, setEditorContentValue] = useState(null);

    //Fonction à envoyé à l'enfant pour redirect à la fermeture du modal
    const handleRedirect = () => {
        for (let i = 0; i < formFields.length; i++) {
            formRef.current[formFields[i]].value = null
        }
        setEditorContentValue("")
    }
    const registerSpecialist = async function (formRef) {

        // This function validate every form field of ExerciceForm to make sure they aren't empty.
        const validateForm = (formFields, formRef) => {
            for (let i = 0; i < formFields.length; i++) {
                console.log(i,': ',formRef.current[formFields[i]].value)
                if (formRef.current[formFields[i]].value === '') {
                    setfieldErrorMessage('Veuillez remplir l\'ensemble des champs de ce formulaire.');
                    throw new Error();
                }
                console.log(gender)
                if (editorContentValue == null || gender == null) {
                    setfieldErrorMessage(
                        "Veuillez remplir l'ensemble des champs de ce formulaire."
                    );
                    throw new Error();
                }
            }
        }
        let data = new FormData()
        console.log('form: ', formRef)
        validateForm(formFields, formRef)
        // Build the specialist object to send
        data.append('firstname', formRef.current[formFields[0]].value)
        data.append('lastname', formRef.current[formFields[1]].value)
        data.append('email', formRef.current[formFields[2]].value)
        data.append('facebook', formRef.current['facebook'].value)
        data.append('linkedin', formRef.current['linkedin'].value)
        data.append('instagram', formRef.current['instagram'].value)
        data.append('province', formRef.current[formFields[3]].value)
        data.append('title', formRef.current[formFields[4]].value)
        data.append('gender', gender)
        data.append('media', formRef.current[formFields[5]].files[0])
        data.append('description', editorContentValue)
        data.append('password', formRef.current[formFields[1]].value)

        try {

            let response = await axios.post('/api/registerSpecialist', data);
            return response.data.message;
        }
        catch (error) {
            console.log('error::', error);
            return 'Un courriel a été envoyé'; // same notification in case a problem occured in
        }
    }

    const handleSubmit = async function (e) {

        e.preventDefault();

        try {
            const registerResult = await registerSpecialist(formRef);
            if (registerResult) {
                // return the modalsuccess
                setNotification(registerResult);
                setShow(true);
                return;
            }
        }
        catch (err) {
            console.log('erreur', err);
        }
    }

    // Return
    return (
        <>
            <Container fluid className="p-4">
                <SpecialistForm
                    user={user}
                    handleSubmit={handleSubmit}
                    formRef={formRef}
                    err={fieldErrorMessage}
                    setGender ={setGender}
                    setEditorContentValue={setEditorContentValue}
                />
            </Container>

            <ModalSuccess
                title='Notification'
                body={notification}
                buttonMessage='Retour'
                redirect={true}
                handleRedirect={handleRedirect}
                show={show}
                handleShow={handleShow}
            />

        </>
    )
}
