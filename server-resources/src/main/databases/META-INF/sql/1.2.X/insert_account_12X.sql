Insert into ourses_authentication_info
  (id, mail, credentials, version)
Values
  (-1, 'no_role@norole.com', ':p', 1);
Insert into profile
  (id, pseudo, description, path, pseudo_beautify, avatar_id, version)
Values
  (-1, 'no_role', 'no_role', '', 'no_role',0, 1);
Insert into bear_account
  (id, authc_info_id, authz_info_id, profile_id, version)
Values
  (-1,-1,1,-1,1);