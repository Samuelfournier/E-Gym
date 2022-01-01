import { React, useContext } from 'react'
import { Container, Image } from 'react-bootstrap'
import '../navbar/navbar.css'
import { userContext } from '../../_services/context/userContext'

const ProfileHeader = ({ firstname, lastname, pictureSource }) => {

    return (
        <Container className="profile-container" fluid>
            <Container className="profile-name-container">
                <p className="profile-name">{firstname} {lastname}</p>
            </Container>
            <Container className="profile-image-container">
                <Image src={pictureSource} className="profile-image" roundedCircle />
            </Container>
        </Container>
    )
}

export default ProfileHeader
