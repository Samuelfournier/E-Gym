import {React,useState, useEffect} from 'react'
import {Alert, Button, Modal } from 'react-bootstrap'
import { Redirect, useHistory } from 'react-router-dom';

export default function ModalSuccess(props) {

    const handleClose = () => props.handleShow();

    return (
    <>

        <Modal show={props.show} 
        onExit={() => {props.redirect ? props.handleRedirect() : ''}} 
        onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert  variant={'success'}>
                    {props.body}
                </Alert>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
                {props.buttonMessage ? props.buttonMessage : 'Fermer'}
            </Button>
            </Modal.Footer>
        </Modal>
    </>
    )
}


/**
 * 
 * EXEMPLE D'UTILISATION DU MODEL d'un parent qui appel le modal ci-dessus
 * 
 * 
 */

 function ParentComponent() {

    //une state pour gérer quand afficher le modal
    const [show, setShow] = useState(false);

    // une méthode pour envoyer en props au modal pour qu'il puisse dire au parent de le fermer
    const handleShow = () => {
        setShow(!show);
    }
    
    
    //le use history pour redirigé
    let history = useHistory();

    //Fonction à envoyé à l'enfant pour redirect à la fermeture du modal
    const handleRedirect = () => {
        history.push('/')
    }

    return (

        <>
            <Button variant="primary" onClick={handleShow}>
                Button test modal
            </Button>

            <ModalSuccess
                title='Notification'                    // Le titre du modal
                body= 'Bravo ceci est le body'          // Le texte à l'intérieur de l'alerte
                buttonMessage='Test Button'             // Le texte sur le bouton, SI VIDE sera Fermer
                redirect={false}                        // Mettre à true si on doit faire une redirection à la fermuture du modal
                handleRedirect={handleRedirect}         // mettre la méthode de redirection, ne pas envoyer ce props si redirect == false
                show={show}                             // La variable de la state pour gérer l'affichage
                handleShow={handleShow}                 // la méthode pour que l'enfant puisse fermer le modal
            />
        </>
        
    )
}


    /*
        PROPS PRIS PAR LE MODAL
        
        title :  Titre du modal
        body : contenu du body
        buttonMessage : Text sur le bouton SI VIDE = Fermer
        redirect : Boolean pour savoir si redirection lors du clic du bouton
        redirectRoute : la route à rediriger, doit avoir mis redirect à true
        show : le boolean pour l'affichage sois true ou false
        handleShow : la méthode pour le faire afficher du component parent
    */
