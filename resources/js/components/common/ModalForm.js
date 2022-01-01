import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ModalForm = ({ component: Component, redirect, show, title, handleShow, ...props }) => {
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
                <Component handleClose={handleClose} {...props} />
            </Modal.Body>
        </Modal>
    )
}

export default ModalForm
