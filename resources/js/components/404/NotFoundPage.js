import React from 'react'
import Header from '../_components/Header/Header'
import Footer from '../_components/Footer/Footer'
import { Container } from 'react-bootstrap'
import '../404/404.css'

const NotFoundPage = ({user}) => {
    return (
        <>
        <Header user={user} />
        <Container className="body-container" fluid>
            <Container className="text-container">
                <h1>404</h1>
                <h2>Page not found !</h2>
            </Container>
        </Container>
        <Footer />
        </>
    )
}

export default NotFoundPage
