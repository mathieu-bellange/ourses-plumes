Insert into ourse_security_token
   (login, token, expiration_date)
 Values
   ('jpetit@gmail.com', 'token','2077-01-01 00:00:00'),
   ('jpetit@gmail.com', 'redac','2077-01-01 00:00:00'),
   ('mbellange@gmail.com', 'admin','2077-01-01 00:00:00'),
   ('mbellange@gmail.com', 'profile_to_update','2077-01-01 00:00:00'),
   ('it_test_expired', 'token_bis','2010-01-01 00:00:00'),
   ('nadejda@gmail.com', 'token_to_delete','2018-01-01 00:00:00'),
   ('account_to_update@gmail.com', 'token_account_update','2018-01-01 00:00:00');
   
Insert into ourses_authorization_info
   (id, roles_for_db)
 Values
   (1, 'Administratrice'),
   (2, 'Rédactrice');

Insert into ourses_authentication_info
   (id, mail,credentials,version)
 Values
   (1, 'mbellange@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
   (2, 'jpetit@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
   (3, 'nadejda@pussyriot.ru', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 1),
   (4, 'to_delete@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
   (5, 'account_to_update@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1);

   Insert into avatar
	(id,path)
 Values
 	(0,'usr/usr-default.jpg');
 	
Insert into profile
   (id, pseudo, description,path,pseudo_beautify,avatar_id,version)
 Values
   (1, 'mbellange', 'trop musclé','/profils/mbellange','mbellange',0, 1),
   (2, 'jpetit', 'trop sexy','/profils/jpetit','jpetit',0, 1),
   (3, 'Nadejda', 'The media is an important weapon for an activist in today&rsquo;s Russia, [&hellip;] It&rsquo;s a wonderful example of how the civil society can be put to work.','/profils/nadejda','nadejda',0, 1),
   (4, 'to_delete', 'Ce compte est supprimé pendant les tests','/profils/to-delete','to-delete',0, 1),
   (5, 'to_update', 'Ce compte est update pendant les tests','/profils/to-update','to-update',0, 1),
   (6, 'Ourse du Cheshire', 'Cette ourse sait garder le sourire, mais sait aussi montrer les dents. Membre d''un collectif de fac - et personnellement confrontée au sexisme et à la lesbophobie - elle n''hésite pas à jouer des griffes dans les luttes féministes et LGBTI-Q. Plus largement, elle s''implique 
			dans la luttes contre les différentes formes d''oppression, du racisme et post-colonialisme au capitalisme. Quand elle ne bat pas le pavé, elle passe bien trop de temps devant un écran 
			d''ordinateur ou derrière un comic ou un livre... Il était donc grand temps qu''elle pose ses 
			pattes sur un clavier pour militer comme ça aussi.','/profils/ourse-du-cheshire','ourse-du-cheshire',0, 0);
			
			
Insert into social_link
	(id,network,social_user,profile_id)
values
	(1,'facebook','user_facebook_1',1),
	(2,'twitter','user_twitter_1',1),
	(3,'mail','mon mail',1),
	(4,'facebook','user_facebook_2',2),
	(5,'twitter','user_twitter_2',2);

Insert into bear_account
   (id, authc_info_id, authz_info_id, profile_id, version)
 Values
   (1, 1, 1, 1, 1),
   (2, 2, 2, 2, 1),
   (3, 3, 1, 3, 1),
   (4, 4, 2, 4, 1),
   (5, 5, 2, 5, 1);
COMMIT;
