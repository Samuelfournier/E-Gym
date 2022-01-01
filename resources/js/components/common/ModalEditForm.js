import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalEditForm = ({ component: Component, redirect, fieldErrorMessage, show, title, handleShow, categoryId, ...props }) => {
    const handleClose = () => handleShow();

    return (
        <Modal show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Component
                    handleClose={handleClose}
                    {...props}
                    id={categoryId}
                    err={fieldErrorMessage} />
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditForm
