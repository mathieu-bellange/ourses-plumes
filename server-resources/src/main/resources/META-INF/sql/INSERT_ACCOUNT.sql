  Insert into ourses_authorization_info
   (id, roles_for_db)
 Values
   (1, 'Administratrice'),
   (2, 'Rédactrice');
   
Insert into ourses_authentication_info
   (id, mail,credentials)
 Values
   (1, 'mbellange@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170'),
   (2, 'jpetit@gmail.com', '894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170');
   
Insert into profile
   (id, pseudo, description)
 Values
   (1, 'mbellange', 'trop musclé'),
   (2, 'jpetit', 'trop sexy');
   
Insert into bear_account
   (id, authc_info_id, authz_info_id, profile_id)
 Values
   (1, 1, 1, 1),
   (2, 2, 2, 2);   
COMMIT;
