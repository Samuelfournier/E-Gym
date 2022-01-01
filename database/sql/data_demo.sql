INSERT INTO `e-gym`.countries (name)
VALUES ('Canada');


INSERT INTO `e-gym`.provinces (name, country_id)
VALUES ('Québec', 1);


INSERT INTO `e-gym`.user_status (name)
VALUES ('Actif');
INSERT INTO `e-gym`.user_status (name)
VALUES ('Inactif');


INSERT INTO `e-gym`.user_roles (name, description)
VALUES ('Client', 'Un client abonné');
INSERT INTO `e-gym`.user_roles (name, description)
VALUES ('Admin', 'Administrateur de la platforme');


INSERT INTO `e-gym`.tokens (code, expiration_date ,is_used ,batch)
VALUES ('abc1232', NOW(),0,1);




INSERT INTO `e-gym`.users (firstname , title ,email , email_verified_at , password , lastname , description , payment_accepted, profile_completed,
id_client_square, google_client, facebook_client, role_id, user_status_id, province_id)
VALUES ('Bob', 'Titre prestigieux','bob@bob.ca', NOW(), 'Bob123', 'Bobinette', 'And ... i .... am Ironm... Bob bobinete', 1, 1 , 'aaaaaaaa', 0 , 0 , 1, 1, 1 );



INSERT INTO `e-gym`.type_subscriptions (name)
VALUES ('Consultant');
INSERT INTO `e-gym`.type_subscriptions (name)
VALUES ('Créateur');



INSERT INTO `e-gym`.activities
(name, description)
VALUES('Soccer', 'Le sport du Soccer');


INSERT INTO `e-gym`.positions
(name, description, activity_id)
VALUES('Attaquant', ' attaquant cool', 1);


INSERT INTO `e-gym`.type_publications
(name)
VALUES('plan d''entrainement');
INSERT INTO `e-gym`.type_publications
(name)
VALUES('Articles');



INSERT INTO `e-gym`.categories
(name, description)
VALUES('Physique', 'Pour les activités physique');


INSERT INTO `e-gym`.type_visibilities
(name, description)
VALUES('Gratuit', 'Pour tous, même les non abonnés');

INSERT INTO `e-gym`.type_visibilities
(name, description)
VALUES('Payant', 'Pour tous, même les non abonnés');


INSERT INTO `e-gym`.equipments
(name, description)
VALUES('Altères', 'Altères de marque IGA');

INSERT INTO `e-gym`.equipments
(name, description)
VALUES('barre', 'Barre de marque Granola');


INSERT INTO `e-gym`.exercices
(name, description)
VALUES('Bicep guy', 'Tu va devenir gros big bro');

INSERT INTO `e-gym`.exercices
(name, description)
VALUES('tricep guy', 'Tu va devenir petit big bro');


INSERT INTO `e-gym`.equipment_exercices
(equipment_id, exercice_id)
VALUES(1, 1);

INSERT INTO `e-gym`.equipment_exercices
(equipment_id, exercice_id)
VALUES(2, 1);


INSERT INTO `e-gym`.trainings
(duration, tempo, nb_serie, nb_repetition, resting_time, exercice_id)
VALUES('00:00:10', '2-1-2', 3, 1, '00:00:01', 1);


INSERT INTO `e-gym`.trainings
(duration, tempo, nb_serie, nb_repetition, resting_time, exercice_id)
VALUES('00:00:10', '2-1-2', 3, 1, '00:0:01', 2);



INSERT INTO `e-gym`.publications
(title, overview,  category_id, type_visibility_id, position_id, type_publication_id)
VALUES('Mon premier plan dentrainement', 'Plan vraiment cool',  1, 1, 1, 1);




INSERT INTO `e-gym`.publications
(title, content, time_total,tags, overview, category_id, type_visibility_id, position_id, type_publication_id)
VALUES('Mon premier article', 'Voici le contenu de mon article', 10,
'cool tags', 'Article sur les attaquants de soccer',  1, 1, 1, 2);


INSERT INTO `e-gym`.weeks
(no_week, description, publication_id)
VALUES(1, 'Description semaine 1', 1);


INSERT INTO `e-gym`.sessions
(no_session, no_week,  week_id)
VALUES(1, 1, 1);

INSERT INTO `e-gym`.sessions
(no_session, no_week,  week_id)
VALUES(2, 1, 1);

INSERT INTO `e-gym`.session_trainings
(session_id, training_id)
VALUES(1, 1);

INSERT INTO `e-gym`.session_trainings
(session_id, training_id)
VALUES(2, 2);


INSERT INTO `e-gym`.user_publications
(user_id, publication_id, completed_sequence, type_subscription_id)
VALUES(1, 1, 0, 2);

INSERT INTO `e-gym`.user_publications
(user_id, publication_id, completed_sequence, type_subscription_id)
VALUES(1, 2, 0, 1);


INSERT INTO `e-gym`.user_positions
(user_id, position_id)
VALUES(1, 1);

INSERT INTO `e-gym`.publications
(title, content, tags, overview, category_id, type_visibility_id, position_id, type_publication_id)
VALUES('Mon 3e article', 'Voici le contenu de mon article 3',
'cool tags 2', 'Article sur les attaquants de soccer 3',  1, 1, 1, 2);


INSERT INTO `e-gym`.user_publications
(user_id, publication_id, completed_sequence, type_subscription_id)
VALUES(1, 3, 0, 2);