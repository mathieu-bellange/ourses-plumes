Insert into category
   (id, category)
 Values
   (1, 'Brèves'),
   (2, 'Reportage'),
   (3, 'Dossier'),
   (4, 'Spotlights'),
   (5, 'Interview'),
   (6, 'Tribune'),
   (7, 'Revue du web');

Insert into rubrique
   (id, rubrique)
 Values
   (1, 'Luttes'),
   (2, 'Nos corps, nous-mêmes'),
   (3, 'Intersectionnalité'),
   (4, 'International'),
   (5, 'Education & Culture'),
   (6, 'Idées');

Insert into tag
   (id, tag)
 Values
   (1, 'Tag 1'),
   (2, 'Tag 2');
   
Insert into article
	(id,title,description,body,published_date,profile_id,category_id,rubrique_id,status)
Values
	(1,'titre','description','body','2077-01-01 00:00:00',2,1,1,0),
	(2,'titre','description','body','2077-01-01 00:00:00',2,1,2,1),
	(3,'titre','description','body','2077-01-01 00:00:00',1,2,3,0);
	
Insert into article_tag
   (id, tag_id,article_id)
 Values
   (1, 1, 1);