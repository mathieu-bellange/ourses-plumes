Insert into ourse_security_token
  (id, login, token, expiration_date)
Values
  (1, 'jpetit@gmail.com', 'token', '2077-01-01 00:00:00'),
  (2, 'jpetit@gmail.com', 'redac', '2077-01-01 00:00:00'),
  (3, 'mbellange@gmail.com', 'admin', '2077-01-01 00:00:00'),
  (4, 'mbellange@gmail.com', 'profile_to_update', '2077-01-01 00:00:00'),
  (5, 'mbellange@gmail.com', 'token_expire', '2010-01-01 00:00:00'),
  (6, 'it_test_expired', 'token_bis', '2010-01-01 00:00:00'),
  (7, 'nadejda@pussyriot.ru', 'token_to_delete', '2018-01-01 00:00:00'),
  (8, 'account_to_update@gmail.com', 'token_account_update', '2018-01-01 00:00:00'),
  (9, 'odc@gmail.com', 'token_odc', '2077-01-01 00:00:00');

Insert into ourses_authorization_info
  (id, roles_for_db, label)
Values
  (1, 'admin','Administratrice'),
  (2, 'writer','R&eacute;dactrice');

Insert into ourses_authentication_info
  (id, mail, credentials, version)
Values
  (0, 'm@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
  (1, 'mbellange@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
  (2, 'jpetit@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
  (3, 'nadejda@pussyriot.ru', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 1),
  (4, 'to_delete@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
  (5, 'account_to_update@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
  (6, 'odc@gmail.com', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 1);

Insert into avatar
  (id,path)
Values
  (0, '/img/usr/usr-default.jpg');

Insert into profile
  (id, pseudo, description, path, pseudo_beautify, avatar_id, version)
Values
  (0, 'Ourses à plumes','Test','/profils/ourses-plumes','ourses-plumes',0,0),
  (1, 'mbellange', 'test compte admin', '/profils/mbellange', 'mbellange', 0, 1),
  (2, 'jpetit', 'test compte redac', '/profils/jpetit', 'jpetit', 0, 1),
  (3, 'Nadejda', 'The media is an important weapon for an activist in today&rsquo;s Russia, [&hellip;] It&rsquo;s a wonderful example of how the civil society can be put to work.', '/profils/nadejda', 'nadejda', 0, 1),
  (4, 'to_delete', 'Ce compte est supprim&eacute; pendant les tests', '/profils/to-delete', 'to-delete', 0, 1),
  (5, 'to_update', 'Ce compte est update pendant les tests', '/profils/to-update', 'to-update', 0, 1),
  (6, 'Ourse du Cheshire', 'Cette ourse sait garder le sourire, mais sait aussi montrer les dents. Membre d''un collectif de fac - et personnellement confront&eacute;e au sexisme et &agrave; la lesbophobie - elle n''h&eacute;site pas &agrave; jouer des griffes dans les luttes f&eacute;ministes et LGBTI-Q. Plus largement, elle s''implique 
    dans la luttes contre les diff&eacute;rentes formes d''oppression, du racisme et post-colonialisme au capitalisme. Quand elle ne bat pas le pav&eacute;, elle passe bien trop de temps devant un &eacute;cran 
    d''ordinateur ou derri&egrave;re un comic ou un livre... Il &eacute;tait donc grand temps qu''elle pose ses 
    pattes sur un clavier pour militer comme &ccedil;a aussi.', '/profils/ourse-du-cheshire', 'ourse-du-cheshire', 0, 0);

Insert into social_link
  (id, network, social_user, profile_id)
Values
  (1, 'facebook', 'user_facebook_1', 1),
  (2, 'twitter', 'user_twitter_1', 1),
  (3, 'mail', 'mon mail', 1),
  (4, 'facebook', 'user_facebook_2', 2),
  (5, 'twitter', 'user_twitter_2', 2);

Insert into bear_account
  (id, authc_info_id, authz_info_id, profile_id, version)
Values
  (0, 0, 1, 0, 1),
  (1, 1, 1, 1, 1),
  (2, 2, 2, 2, 1),
  (3, 3, 1, 3, 1),
  (4, 4, 2, 4, 1),
  (5, 5, 2, 5, 1),
  (6, 6, 1, 6, 1);

Commit;