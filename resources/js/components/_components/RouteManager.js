import axios from 'axios';
import { React, useEffect, useState } from 'react'
import { Route, Redirect, withRouter, useParams } from 'react-router-dom'
import Cookies from 'js-cookie';

const RouteManager = ({ component: Component, path, ...rest }) => {

    const [componentToRender, setcomponentToRender] = useState({ Component: null, ready: false });

    useEffect(() => {
            getUserInformation().then((res => {
                setcomponentToRender({ Component: res, ready: true });
            }));
    }, [window.location.href])


    const isUserLoggedIn = async () => {

        try{
            let tokenAuth = await axios.get('/sanctum/csrf-cookie');
        }
        catch(error)
        {
            console.log(error.response);
        }

        let cookie = Cookies.get('egym_user_logged_in');
        let userInfo;
        if (cookie) {

            try {
                userInfo = await axios.get('/api/user');
            }
            catch(error)
            {

                if (error.response.status === 401 || 419) {
                    Cookies.remove("egym_user_logged_in");
                    userInfo = null;
                    await axios.post("/api/logout");
                }

                return <Redirect to={{ pathname: "/connexion" }} />;

            }


        }
        else {
            userInfo = null;
        }


        if (userInfo === null) {
            // setuserInformation({loggedIn: false, user: null, ready: true});
            return { loggedIn: false, info: null };
        }

        // setuserInformation({loggedIn: true, user: userInfo.data, ready: true});
        return { loggedIn: true, info: userInfo.data };
    }

    //verify if the user is the author of the trainingProgram or the article
    const isUserAuthorized = async (user_id) => {
        var id = rest.computedMatch.params.id;

        if (id == 0) 
            return true;
            
        var response = "";
        response = await axios.get(`/api/content/${id}/author`);

        if (response.data.id != "") {
            if (response.data.id == user_id) {
                return true;
            }
        }

        return false;
    }

    const getUserInformation = async (props) => {
        const user = await isUserLoggedIn();

        if (user.loggedIn && user.info.profile_completed == false && user.info.payment_accepted == true && path != '/profil' && path != '/deconnexion') {
            return <Redirect to={{ pathname: '/profil' }} />
        }

        if (user.loggedIn && user.info.payment_accepted == false && path != '/paiement' && path != '/deconnexion') {
            return <Redirect to={{ pathname: '/paiement' }} />
        }


        switch (path) {

            case '/admin': {
                if (!user.loggedIn) {
                    return <Redirect to={{ pathname: "/connexion" }} />;
                }

                if (user.info.role_id === 2) {
                    return <Component {...props} user={user.info} />;
                }

                return <Redirect to={{ pathname: "/" }} />;
            }

            case '/creer': {
                if (!user.loggedIn) {
                    return <Redirect to={{ pathname: "/connexion" }} />;
                }

                if (user.info.role_id === 2 || user.info.role_id === 3) {
                    return <Component {...props} user={user.info} />;
                }

                return <Redirect to={{ pathname: "/" }} />;
            }

            case '/profil': {
                if (!user.loggedIn) {
                    return <Redirect to={{ pathname: "/connexion" }} />;
                }

                if (user.info.profile_completed == 1) {
                    return <Redirect to={{ pathname: "/" }} />;
                }

                return <Component {...props} user={user.info} />;
            }

            case "/carte-membre": {
                if (!user.loggedIn) {
                    return <Redirect to={{ pathname: "/connexion" }} />;
                }

                return <Component {...props} user={user.info} />;
            }

            case '/inscription': {
                if (user.loggedIn) {
                    return <Redirect to={{ pathname: "/" }} />;
                }

                return <Component {...props} />;
            }

            case '/deconnexion': {
                //log user out
                Cookies.remove("egym_user_logged_in"); //delete cookie
                await axios.post("/api/logout");
                return <Redirect to={{ pathname: "/" }} />;
            }

            case '/connexion': {
                if (user.loggedIn) {
                    return <Redirect to={{ pathname: "/" }} />;
                }

                return <Component {...props} />;
            }

            case '/paiement': {
                if (!user.loggedIn) {
                    return <Redirect to={{ pathname: "/" }} />;
                }

                if (user.info.payment_accepted == false) {
                    return <Component {...props} user={user.info} />;
                }

                return <Redirect to={{ pathname: "/" }} />;
            }

            case '/mot-de-passe-oublie': {
                if (user.loggedIn) {
                    return <Redirect to={{ pathname: "/" }} />;
                }

                return <Component {...props} />;
            }

            case '/reinitialisation-mot-de-passe': {
                //if (userInformation.loggedIn && userInformation.ready) {
                //return <Component {...props} />
                //}

                return <Component {...props} />; //<Redirect to={{ pathname: '/' }} />
            }

            case '/creer-article/:id': {
                var isAuthorized = await isUserAuthorized(user.info.id);
                if (user.info.role_id === 2 || user.info.role_id === 3 && isAuthorized) {
                    return <Component {...props} user={user.info} />
                }

                return <Redirect to={{ pathname: '/' }} />
            }

            case '/creer-plan': {
                if (user.info.role_id === 2 || user.info.role_id === 3) {
                    return <Component {...props} user={user.info} />;
                }

                return <Redirect to={{ pathname: "/" }} />;
            }

            case '/plan/:id/modifier': {
                var isAuthorized = await isUserAuthorized(user.info.id);
                if (user.info.role_id === 2 || user.info.role_id === 3 && isAuthorized) {
                    return <Component {...props} user={user.info} />
                }

                return <Redirect to={{ pathname: '/' }} />
            }

            case '/mon-contenu': {

                if (!user.loggedIn) {
                    return <Redirect to={{ pathname: "/connexion" }} />;
                }

                return <Component {...props} user={user.info} />;
            }

            case '/exercice': {
                if(user.loggedIn)
                {
                    if (user.info.role_id === 2 || user.info.role_id === 3) {
                        return <Component {...props} user={user.info} />
                    }
                }

                return <Redirect to={{ pathname: '/connexion' }} />
            }

            case '/equipement': {
                if (user.loggedIn) {
                    if (user.info.role_id === 2 || user.info.role_id === 3) {
                        return <Component {...props} user={user.info} />;
                    }
                }

                return <Redirect to={{ pathname: "/connexion" }} />;
            }

            case "/modifier-profil/:id": {
                const UserId = rest.computedMatch.params.id;

                if (UserId == user.info.id ) {
                    return <Component {...props} user={user.info} />
                }
                else {
                    if(user.info.role_id === 2) return <Component {...props} user={user.info} />
                }

                return <Redirect to={{ pathname: "/" }} />;
            }
            default: {
                return <Component user={user.info} />;
            }
        }
    }


    return (

        <Route {...rest} render={props => {

            return componentToRender.ready && componentToRender.Component

        }} />

    )
}

export default withRouter(RouteManager);
