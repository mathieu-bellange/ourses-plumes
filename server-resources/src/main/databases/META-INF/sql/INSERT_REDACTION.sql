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
   (id, rubrique, classe)
 Values
   (1, 'Luttes','struggles'),
   (2, 'Nos corps, nous-mêmes', 'ourbody'),
   (3, 'Intersectionnalité', 'intersec'),
   (4, 'International', 'internat'),
   (5, 'Education & Culture', 'educult'),
   (6, 'Idées', 'ideas');

Insert into tag
   (id, tag)
 Values
   (1, 'Tag 1'),
   (2, 'Tag 2');
   
Insert into article
	(id,title,description,body,published_date,profile_id,category_id,rubrique_id,status,path)
Values
	(1,'titre 1','description','body','2077-01-01 00:00:00',2,1,1,0,'/articles/1'),
	(2,'titre 2','description','body','2077-01-01 00:00:00',2,1,2,1,'/articles/2'),
	(3,'titre 3','description','body','2077-01-01 00:00:00',1,2,3,0,'/articles/3'),
	(4,'titre 4','description','body','2077-01-01 00:00:00',2,2,3,0,'/articles/4'),
	(5,'titre 5','description','body','2077-01-01 00:00:00',2,2,3,1,'/articles/5'),
	(6,'titre 6','description','body','2077-01-01 00:00:00',2,2,3,1,'/articles/6'),
	(7,'titre 7','to delete','body','2077-01-01 00:00:00',2,2,3,0,'/articles/7'),
	(8,'titre 8','cannot delete','body','2077-01-01 00:00:00',2,2,3,1,'/articles/8'),
	(9,'titre 9','invalidate','body','2077-01-01 00:00:00',2,2,3,1,'/articles/9'),
	(10,'titre 10','not_invalidate','body','2077-01-01 00:00:00',2,2,3,0,'/articles/10'),
	(11,'titre 11','get','body','2077-01-01 00:00:00',2,2,3,2,'/articles/intersectionnalité/titre-11'),
	(12,'titre 12','get draft','body','2077-01-01 00:00:00',2,2,3,0,'/articles/12'),
	(13,'titre 13','get validate','body','2077-01-01 00:00:00',2,2,3,1,'/articles/13'),
	(14,'titre 14','en ligne au 01/01/2010','body','2010-01-01 00:00:00',3,7,5,2,'/articles/education/titre-14'),
	(15,'titre 15','en ligne au 14/03/1982','body','1982-03-14 00:00:00',2,6,1,2,'/articles/luttes/titre-15'),
	(16,'titre 16','en ligne au 25/02/2007','body','2007-02-25 00:00:00',2,4,4,2,'/articles/international/titre-16');
	
Insert into article_tag
   (id, tag_id,article_id)
 Values
   (1, 1, 1),
   (2, 1, 7),
   (3, 1, 11),
   (4, 2, 11);