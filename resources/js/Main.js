import { React } from "react";
import { Switch } from "react-router-dom";
import RouteManager from "./components/_components/RouteManager";
import Home from "./components/home/Home";
import Create from "./components/content-creation/creation_test";
import Admin from "./components/admin dashboard/AdminDashboard";
import NotFoundPage from "./components/404/NotFoundPage";
import Payment from "./components/payments/Payment";
import Reinitialisation from "./components/password_reset/Reinitialisation";
import Register from "./components/register/Register";
import ForgottenPassword from "./components/forgotten_password/ForgottenPassword";
import Login from "./components/Login/Login";
import Profil from "./components/Profile/Profil";
import modifyProfile from "./components/Profile/modifyProfile/modifyProfile";
import MainContentPage from "./components/MainContentPage/MainContentPage";
// Exemple route
import DetailsPlan from './components/MainContentPage/TestRedirectPlan';
import DetailsArticle from './components/MainContentPage/TestRedirectBlog';
import AuthorPage from './components/MainContentPage/TestRedirectAuthor';
import Article from './components/article/Article';
import Exercice from './components/Exercice/Exercice';
import TrainingProgramCreation from './components/trainingProgram/creation/TrainingProgramCreation'
import TrainingProgramConsultation from './components/trainingProgram/consultation/TrainingProgramConsultation'
import TrainingProgramModification from './components/trainingProgram/creation/TrainingProgramModification'
import Equipement from './components/Equipement/Equipement';
import ContentCreatorPage from './components/ContentCreatorPage/ContentCreator';
import MemberCard from "./components/Member-card/memberCard";
import MyContent from './components/MyContentPage/MyContent';
//import Category from './components/Category/Category';

const Main = () => {
    return (
        <Switch>
            <RouteManager exact path="/" component={Home} />                                                {/* done */}
            <RouteManager exact path="/connexion" component={Login} />                                      {/* done */}
            <RouteManager exact path="/deconnexion" />                                                      {/* not done */}
            <RouteManager exact path="/professionnels" component={ContentCreatorPage} />                    {/* not done will be done in sprint 2 */}
            <RouteManager exact path="/inscription" component={Register} />
            <RouteManager exact path="/rechercher" component={MainContentPage} />                            {/* not done will be done in sprint 2 */}
            <RouteManager exact path="/profil" component={Profil} />                                        {/* done */}
            <RouteManager exact path="/admin" component={Admin} />                                          {/* done */}
            <RouteManager exact path="/exercice" component={Exercice} />
            <RouteManager exact path="/equipement" component={Equipement} />
            <RouteManager exact path="/creer" component={Create} />                                         {/* done */}
            <RouteManager exact path='/reinitialisation-mot-de-passe' component={Reinitialisation} />       {/* done */}
            <RouteManager exact path='/mot-de-passe-oublie' component={ForgottenPassword} />                {/* done */}
            <RouteManager exact path='/paiement' component={Payment} />                                     {/* done */}
            <RouteManager exact path='/creer-article' component={Article} />                                {/* done */}
            <RouteManager exact path='/creer-plan' component={TrainingProgramCreation} />
            <RouteManager exact path="/plan/:id/modifier" component={TrainingProgramCreation} />
            <RouteManager exact path="/plan/:id" component={TrainingProgramConsultation} />
            <RouteManager exact path="/article/:id" component={DetailsArticle} />
            <RouteManager exact path="/auteur/:id" component={AuthorPage} />                                      {/* en cours */}
            <RouteManager exact path='/creer-article' component={Article} />
            <RouteManager exact path="/reinitialisation-mot-de-passe" component={Reinitialisation}/>{/* done */}
            <RouteManager exact path="/creer-article/:id" component={Article} />
            <RouteManager exact path="/mon-contenu" component={MyContent} />
            <RouteManager path="/modifier-profil/:id" component={modifyProfile} />
            <RouteManager path="/carte-membre" component={MemberCard} />


            <RouteManager path="*" component={NotFoundPage} />
        </Switch>
    );
};

export default Main;
