-- Commande à rouler pour le group by, reset la connextion à MYSQL pour que ça fonctionne
SET GLOBAL sql_mode
=
(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));


/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR QUERY UN PLAN DÉTAILLÉ                      */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS detailed_training_programs;
CREATE VIEW detailed_training_programs
AS
    select pub.id , pub.title, pub.content, pub.tags, up.completed_sequence, pub.overview, pub.media, pub.time_total, pub.created_at , cat.id as 'categorie_id' , pos.id as 'position_id', act.id as 'activite_id', w.id as 'week_id',  w.no_week, w.description as 'week_description'
, s.id as 'session_id', s.no_session
, tr.id as 'training_id', tr.duration, tr.tempo , tr.nb_serie, tr.nb_repetition, tr.resting_time, tr.`order`
, e.name as 'exercice', e.id as 'exercice_id'
, GROUP_CONCAT(eq.name) as equipement
, CONCAT(u.lastname,' ',u.firstname) as 'author', u.id as 'author_id'
    from publications as pub
        left join categories cat on cat.id = pub.category_id
        left join positions pos on pos.id = pub.position_id
        left join activities act on act.id = pos.activity_id
        left join weeks w on w.publication_id = pub.id
        left join sessions s on s.week_id = w.id
        left join session_trainings st on st.session_id = s.id
        left join trainings tr on tr.id = st.training_id
        left join exercices e on e.id = tr.exercice_id
        left join equipment_exercices ee on ee.exercice_id = e.id
        left join .equipments eq on eq.id = ee.equipment_id
        left join user_publications up on up.publication_id = pub.id and up.type_subscription_id = 2
        left join users u on u.id = up.user_id
    where pub.type_publication_id = 1
        and up.type_subscription_id = 2
        and pub.deleted_at is NULL
    group by s.id, tr.id, e.id, pub.id;


/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR QUERY UN ARTICLE DÉTAILLÉ                   */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS detailed_articles;
CREATE VIEW detailed_articles
AS
    select pub.id , pub.title, pub.content, pub.tags, pub.overview, pub.media, pub.type_visibility_id, pub.created_at
, cat.name as 'categorie' , pos.name as 'position', act.name as 'activite', CONCAT(u.lastname,' ',u.firstname) as 'author', u.title as 'title_author'
, u.media as 'media_author', u.description as 'desc_author', u.id as 'author_id'
    from publications as pub
        left join categories cat on cat.id = pub.category_id
        left join positions pos on pos.id = pub.position_id
        left join activities act on act.id = pos.activity_id
        left join user_publications up on up.publication_id = pub.id and up.type_subscription_id = 2
        left join users u on u.id = up.user_id
    where pub.type_publication_id = 2
        and up.type_subscription_id = 2
        AND pub.deleted_at IS NULL;



/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR LA VERSION CARD DES PLAN D'ENTRAINEMENT     */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS card_training_programs;
CREATE VIEW card_training_programs
AS
    select pub.id , pub.title, pub.tags, pub.overview, pub.media_card , pub.time_total, pub.type_visibility_id, pub.created_at , cat.name as 'categorie' , pos.name as 'position', act.name as 'activite' , COUNT(distinct w.no_week) as 'nb_of_weeks'
, CONCAT(u.lastname,' ',u.firstname) as 'author', u.id as 'id_author'
    from publications as pub
        left join categories cat on cat.id = pub.category_id
        left join positions pos on pos.id = pub.position_id
        left join activities act on act.id = pos.activity_id
        left join weeks w on w.publication_id = pub.id
        left join sessions s on s.week_id = w.id
        left join user_publications up on up.publication_id = pub.id and up.type_subscription_id = 2
        left join users u on u.id = up.user_id
    where pub.type_publication_id = 1
        and up.type_subscription_id = 2
        AND pub.deleted_at IS NULL
    group by pub.id;



/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR LA VERSION CARD DES articles                */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS card_articles;
CREATE VIEW card_articles
AS
    select pub.id , pub.title, pub.tags, pub.media_card , pub.overview, pub.type_visibility_id, pub.created_at
, cat.name as 'categorie' , pos.name as 'position', act.name as 'activite', CONCAT(u.lastname,' ',u.firstname) as 'author', u.id as 'id_author'
    from publications as pub
        left join categories cat on cat.id = pub.category_id
        left join positions pos on pos.id = pub.position_id
        left join activities act on act.id = pos.activity_id
        left join user_publications up on up.publication_id = pub.id and up.type_subscription_id = 2
        left join users u on u.id = up.user_id
    where pub.type_publication_id = 2
        and up.type_subscription_id = 2
        AND pub.deleted_at IS NULL;


/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR LA VERSION CARD DES articles et des plans   */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS card_articles_and_trainings;
CREATE VIEW card_articles_and_trainings
AS
    select pub.id, tp.id as 'type_id' , pub.title, pub.tags, pub.overview, pub.media_card , pub.time_total, pub.type_visibility_id, date(pub.created_at) as 'created_at' ,
        cat.id as 'categorie_id', cat.name as 'categorie' , pos.id as 'position_id' , pos.name as 'position', act.id as 'activite_id' , act.name as 'activite'
    , COUNT(distinct w.no_week) as 'nb_of_weeks'
	, CONCAT(u.lastname,' ',u.firstname) as 'author', u.id as 'id_author'
    from publications as pub
        left join type_publications tp on tp.id = pub.type_publication_id
        left join categories cat on cat.id = pub.category_id
        left join positions pos on pos.id = pub.position_id
        left join activities act on act.id = pos.activity_id
        left join weeks w on w.publication_id = pub.id
        left join sessions s on s.week_id = w.id
        left join user_publications up on up.publication_id = pub.id and up.type_subscription_id = 2
        left join users u on u.id = up.user_id
    where up.type_subscription_id = 2
        AND pub.deleted_at IS NULL
    group by pub.id;




/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR LES CARDS DE 'NOS PROFESSIONNELS            */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS content_creator_list;
create view content_creator_list
as
    select id, concat(u.firstname, ' ', u.lastname) as fullName, u.title, u.created_at, u.media, u.gender
    from users u
    where u.role_id = 3
    and u.deleted_at is null;

/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*        VIEW POUR LE NOMBRE DE PUBLICATIONS ET                  */
/*        DE COLLABORATEURS EN LIEN AVEC UNE CATÉGORIE            */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
drop view pub_creator_category_list;
create view pub_creator_category_list
as
    select id, concat(u.firstname, ' ', u.lastname) as fullName, u.title, u.created_at, u.media, u.gender
    from users u
    where u.role_id = 3
    and u.deleted_at is null;


/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*          VIEW POUR LES CARDS DE 'MON CONTENU' avec auteur      */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS card_my_content_list;
create view card_my_content_list
AS
    select up.user_id, up.publication_id, up.deleted_at, up.completed_sequence,
        up.type_subscription_id, up.created_at as 'date_liked', p.title, p.overview, p.media_card, p.type_publication_id, p.created_at , p.time_total ,
        COUNT(s.no_session) as 'total_sessions',
        COUNT(distinct w.no_week) as 'nb_of_weeks',
        up2.user_id as 'id_author',
        concat(u.firstname, ' ', u.lastname) as 'author',
        cat.name as 'categorie',
        pos.name as 'position',
        act.name as 'activite'
    from user_publications up
        left join publications p on p.id = up.publication_id
        left join weeks w on w.publication_id = p.id
        left join sessions s on s.week_id = w.id
        left join user_publications up2 on up2.publication_id = up.publication_id AND up2.type_subscription_id = 2
        left join users u on u.id = up2.user_id
        left join categories cat on cat.id = p.category_id
        left join positions pos on pos.id = p.position_id
        left join activities act on act.id = pos.activity_id
        WHERE up.deleted_at is null AND p.deleted_at is null
        group by  up.publication_id, up.user_id;

/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*  VIEW POUR LES EXERCICES AINSI QUE LES ÉQUIPEMENTS NÉCESSAIRES */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/

drop view  IF EXISTS exercices_with_equipements;
create view exercices_with_equipements
AS
    select e.id, e.name, e.description, e.media, e.user_id, eq.id as 'equipment_id',
    eq.name as 'equipment_name', eq.description as 'equipment_description'
    from exercices e
    left join equipment_exercices ee on ee.exercice_id = e.id
    left join equipments eq on eq.id = ee.equipment_id
    order by e.id;
    WHERE up.deleted_at is null AND p.deleted_at is null
    group by  up.publication_id, up.user_id;


/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*              VIEW POUR LA PAGE MODIFIER LE PROFIL              */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS user_infos;
CREATE VIEW user_infos
AS
    select u.id, u.firstname, u.email, u.lastname, u.birthdate, u.gender, u.title,
    u.media, u.description, u.id_client_square, u.id_card_square, u.id_subscription_square, u.role_id, u.facebook_link, u.instagram_link, u.linkedin_link,
    CASE
        WHEN u.user_status_id = 1 THEN true
        ELSE false
    END AS 'status'
    , p.id as 'province_id' , p.name as 'province_name', c.id as 'country_id' , c.name  as 'country_name'
    ,   GROUP_CONCAT(up.position_id) as 'positions'
    from users u
    left join provinces p on u.province_id = p.id
    left join countries c on p.country_id = c.id
    left join user_positions up on up.user_id = u.id
    group by u.id;


/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
/*              VIEW POUR compter le nombre semaine et seance     */
/*----------------------------------------------------------------*/
/*----------------------------------------------------------------*/
DROP VIEW IF EXISTS info_duration_plan;
CREATE VIEW info_duration_plan
AS
select pub.id, pub.title 
, COUNT(distinct w.no_week) as 'nb_of_weeks'
, COUNT(distinct s.no_session) as 'nb_of_sessions'
from publications as pub
    left join type_publications tp on tp.id = pub.type_publication_id
    left join weeks w on w.publication_id = pub.id
    left join sessions s on s.week_id = w.id
where tp.id = 1
    AND pub.deleted_at IS NULL
group by pub.id;