Insert into OURSE_AUTHC_TOKEN
   (login, token, expiration_date)
 Values
   ('it_test_ok', 'token','2077-01-01 00:00:00'),
   ('it_test_expired', 'token_bis','2010-01-01 00:00:00');
   
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
   (3, 'yoda@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1),
   (4, 'to_delete@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170', 1);

Insert into profile
   (id, pseudo, description,version)
 Values
   (1, 'mbellange', 'trop musclé', 1),
   (2, 'jpetit', 'trop sexy', 1),
   (3, 'yoda', 'trop zen', 1),
   (4, 'to_delete', 'Ce compte est supprimé pendant les tests', 1);

Insert into bear_account
   (id, authc_info_id, authz_info_id, profile_id, version)
 Values
   (1, 1, 1, 1, 1),
   (2, 2, 1, 2, 1),
   (3, 3, 1, 3, 1),
   (4, 4, 2, 4, 1);
COMMIT;
