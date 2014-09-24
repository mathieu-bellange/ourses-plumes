Insert into ourses_authorization_info
  (id, roles_for_db)
Values
  (1, 'admin','Administratrice'),
  (2, 'writer','R&eacute;dactrice');

Insert into ourses_authentication_info
  (id, mail, credentials, version)
Values
  (1, 'ourses.plumes@gmail.com', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 0),
  (2, 'delphine.dauvergne@gmail.com', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 0),
  (3, 'chloe.sorbonne@gmail.com', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 0),
  (4, 'anais.sidhoum@gmail.com', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 0),
  (5, 'julie.marie1403@gmail.com', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 0);

Insert into avatar
  (id,path)
Values
  (0, '/img/usr/usr-default.jpg');

Insert into profile
  (id, pseudo, description, path, pseudo_beautify, avatar_id, version)
Values
  (1, 'Ourses Développeurs', '', '/profils/ourses-développeurs', 'ourses-développeurs', 0, 0),
  (2, 'Ourse Malléchée', 'Journaliste, cette ourse adore écrire sur les thématiques qui lui tiennent à coeur : injustices, discriminations, santé, féminisme... A son tableau de chasse, on trouve notamment la Bourse AJIS (qui récompense un article sur une thématique sociale). De formation littéraire, c’est 
	une droguée de lecture et d’écriture. Militante féministe et politique à ses heures perdues (ou gagnées !), elle a fait également partie d’un syndicat étudiant il y a quelques années. Cette ourse est une gourmande qui ne résiste jamais à un chocolat, ou à un pot de miel... 
	Curieuse de tout, elle traîne ses pattes sur les réseaux sociaux à la recherche de la moindre info. Taquine, elle aime embêter les autres ourses. Elle est aussi connue pour ses grognements et son caractère persévérant. Elle ne lâche rien.', '/profils/ourse-malléchée', 'ourse-malléchée', 0, 0),
  (3, 'Ourse Printanière', 'Militante dans l’âme, cette ourse est révoltée par l’injustice du monde et rêve de lendemains qui chantent. Sans avoir fait les études qu’il faut, elle se plonge dans les lectures pour trouver des mots compliqués qui lui parlent : autoorganisation, intersectionnalité, autoémancipation des oppriméEs... Elle s’est engagée corps et âme dans la politique et le syndicalisme depuis 
	plusieurs années, se spécialisant presque malgré elle sur les questions féministes et LGBTI-Q (c’est vrai qu’à l’extrême-gauche on devient vite spécialiste!), tout en cherchant à faire le lien avec la lutte antiraciste et la lutte des classes, mais aussi la lutte écologique !
	Affamée de savoirs et dansant de joie dans les luttes, cette ourse est connue pour son organisation sans faille et pour son exigence, et pour son sens de l’hospitalité.', '/profils/ourse-printanière', 'ourse-printanière', 0, 0),
  (4, 'Ourse du Cheshire', 'Cette ourse sait garder le sourire, mais sait aussi montrer les dents. Membre d''un collectif de fac - et personnellement confront&eacute;e au sexisme et &agrave; la lesbophobie - elle n''h&eacute;site pas &agrave; jouer des griffes dans les luttes f&eacute;ministes et LGBTI-Q. Plus largement, elle s''implique 
    dans la luttes contre les diff&eacute;rentes formes d''oppression, du racisme et post-colonialisme au capitalisme. Quand elle ne bat pas le pav&eacute;, elle passe bien trop de temps devant un &eacute;cran 
    d''ordinateur ou derri&egrave;re un comic ou un livre... Il &eacute;tait donc grand temps qu''elle pose ses 
    pattes sur un clavier pour militer comme &ccedil;a aussi.', '/profils/ourse-du-cheshire', 'ourse-du-cheshire', 0, 0),
  (5, 'jpetit', null, '/profils/jpetit', 'jpetit', 0, 0);

Insert into bear_account
  (id, authc_info_id, authz_info_id, profile_id, version)
Values
  (1, 1, 1, 1, 0),
  (2, 2, 1, 2, 0),
  (3, 3, 1, 3, 0),
  (4, 4, 1, 4, 0),
  (5, 5, 2, 5, 0);

Commit;