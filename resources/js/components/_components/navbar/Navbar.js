import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import ProfileHeader from './ProfileHeader'
import DropdownItem from './DropdownItem'
import { v4 as uuidv4 } from "uuid";

import '../navbar/navbar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faAngleDown  } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom'
import { userContext } from '../../_services/context/userContext';


const navbar = ({firstname, lastname, pictureSource, role, profile_completed, id}) => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="py-2 site-navbar">
            <Container fluid>
                <Navbar.Brand className="brand-logo"><FontAwesomeIcon icon={faDumbbell} size="2x" color="white" /></Navbar.Brand>
                <Navbar.Brand className="brand-name" as={Link} to="/">E-GYM</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav key={uuidv4()} className="links-container">
                        <Nav.Item  className="nav-link" as={Link} to="/">Accueil</Nav.Item>
                        { role === 2 && <Nav.Item   className="nav-link" as={Link} to="/admin">Administrateur</Nav.Item>}
                        {(role === 2 || role === 3) &&
                        [<NavDropdown key={uuidv4()} title="Création" id="collasible-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/exercice">Exercice</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/creer-plan">Plan d'entrainement</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/equipement">Équipement</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/creer-article/0">Article</NavDropdown.Item>
                        </NavDropdown>]}
                        <Nav.Item className="nav-link" as={Link} key="creators" to="/professionnels">Les professionnels</Nav.Item>
                        <Nav.Item className="nav-link" as={Link} key="search" to="/rechercher">Rechercher du contenu</Nav.Item>
                    </Nav>
                    <Navbar.Collapse key={uuidv4()} className="justify-content-end">
                    <Nav key={uuidv4()}>
                    { firstname !== null ? [<NavDropdown key={uuidv4()} className="profile-dropdown" align="end" title={<ProfileHeader firstname={firstname} lastname={lastname} pictureSource={pictureSource} />}>
                                <NavDropdown.Item as={DropdownItem} text="Mon profil" path={profile_completed == 0 ? "/profil" : `/modifier-profil/${id}`} className="container-dropdown-item" icon={["fas", "user"]}></NavDropdown.Item>
                                <NavDropdown.Item as={DropdownItem} text="Mon contenu" path="/mon-contenu" className="container-dropdown-item" icon={["fas", "heart"]}></NavDropdown.Item>
                                <NavDropdown.Item as={DropdownItem} text="Carte membre" path="/carte-membre" className="container-dropdown-item" icon={["fas", "address-book"]}></NavDropdown.Item>
                                {role === 3 ? <NavDropdown.Item as={DropdownItem} text="Mes publications" path={`/auteur/${id}`} className="container-dropdown-item" icon={["fas", "atlas"]}></NavDropdown.Item> : ''}
                                <NavDropdown.Item as={DropdownItem} text="Déconnexion" path="/deconnexion" className="container-dropdown-item" icon={["fas", "sign-out-alt"]}></NavDropdown.Item>
                            </NavDropdown>] : [<>
                                <Nav.Item>
                            <Nav.Item  className="nav-link" as={Link} to="/inscription">S'inscrire</Nav.Item>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Item className="nav-link" as={Link} key="login" to="/connexion">Se connecter</Nav.Item>
                        </Nav.Item></>]}
                    </Nav>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default navbar
