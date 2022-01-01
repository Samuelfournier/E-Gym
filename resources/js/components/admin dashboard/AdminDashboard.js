import { React, useState } from 'react'
import { Row, Col, Container } from "react-bootstrap";
import Footer from '../_components/Footer/Footer'
import Header from '../_components/Header/Header'
import Category from '../Category/Category'
import Register_specialist from '../register/Register_specialist'
import Sports from './Sports/Sports'
import './admin.css'
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';

// Components
import Tokens from './promocode/tokens';
import Users from './users/Users';

/**
 * GUIDE D'UTILISATION
 *
 * 1. créer son components sans header et footer et l'importer
 * 2. Ajouter dans le Component LeftMenu un object comme les autres dans le array menuItems
 * 3. Ajouter un case que les autres dans le switch de la méthode handleComponentchange avefc la même valeur que vous avez mis dans le array menuItems
 */

export default function AdminDashboard({ user }) {

    const [currentComponent, setCurrentComponent] = useState({value: 'Utilisateurs', component: <Users/>});
    const history = useHistory();

    const handleComponentchange = (newValue) => {

        if (newValue === currentComponent.value) return;

        let userInfo =  axios.get('/api/user').then(response => {

            switch (newValue)
            {

                case 'sports': {
                    setCurrentComponent({value:newValue, component: <Sports />});
                    return;
                }

                case 'utilisateurs': {
                    setCurrentComponent({value:newValue, component: <Users />});
                    return;
                }

                case 'dashboard': {
                    setCurrentComponent({value:newValue, component: <Dashboard />});
                    return;
                }

                case 'categories': {
                    setCurrentComponent({value:newValue, component: <Category />});
                    return;
                }

                case 'contentCreator': {
                    setCurrentComponent({value:newValue, component: <Register_specialist />});
                    return;
                }

                case 'tokens': {
                    setCurrentComponent({value:newValue, component: <Tokens />});
                    return;
                }

            }

        }).catch(error => {

            if (error.response.status === 401 || error.response.status == 419) {
                Cookies.remove("egym_user_logged_in");
                axios.post("/api/logout").then(response =>{
                    history.push('/connexion');
                });
            }
        });

    }


    // Render
    return (
        <>
            <Header user={user} />
            <Container fluid>
                <Row className="g-4 justify-content-center">
                    <Col lg={2} >
                        <LeftMenu handleComponentchange={handleComponentchange} />
                    </Col>
                    <Col lg={10}>
                        <Row className="g-4 justify-content-center">
                            {currentComponent.component}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    )
}


const LeftMenu = ({ handleComponentchange }) => {

    const menuItems = [
        {
            name: 'Utilisateurs',
            value: 'utilisateurs'
        },
        {
            name: 'Catégorie',
            value: 'categories'
        },
        {
            name: 'Création de spécialiste',
            value: 'contentCreator'
        },
        {
            name: 'Sports',
            value: 'sports'
        },
        {
            name: 'Codes',
            value: 'tokens'
        }
    ]

    const handleOnClick = (value) => {
        handleComponentchange(value);
    }


    return (
        <>
            {
                menuItems.map((item, idx) => {
                    return (

                        <Row key={idx} onClick={() => handleOnClick(item.value)} className="justify-content-start p-4 left-menu-admin fs-3" >
                            {item.name}
                        </Row>

                    )
                })
            }
        </>
    )
}




/**
 *
 * Voici des exemples des components qui sera dans le dashboard SEULEMENT DES EXEMPLES
 *
 * Créer les vrai Component et les importer
 */

const Dashboard = () => {
    return (
        <div>Dashboard</div>
    )

}






const User = () => {
    return (
        <div>User</div>
    )
}


const Token = () => {
    return (
        <div>Token</div>
    )
}
