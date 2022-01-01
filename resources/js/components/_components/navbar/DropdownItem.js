import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DropdownItem = ({ text, className, icon, path }) => {
    return (
        <>
        <Link className="item-link" to={path}>
        <Container className={className} fluid>
            <Container className="container-item-icon">
                <FontAwesomeIcon className="item-icon" icon={icon} />
            </Container>
            <Container className="container-item-text">
                <p className="item-text" >{text}</p>
            </Container>
        </Container>
        </Link>
        </>
    )
}

export default DropdownItem
