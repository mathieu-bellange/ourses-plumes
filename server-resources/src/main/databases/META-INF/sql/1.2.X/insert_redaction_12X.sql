Insert into tag
  (id, tag)
Values
  (0, 'no_tag');
  
/* 
 * Récupération des articles sans co-auteures
 * 
 * 
 * select article.id from article left outer join article_coauthor on article.id = article_coauthor.article_id where article.id not in (select distinct article_id from article_coauthor) and article.status = 2 order by article.id asc;
 * 
 * 
 * 
 * 
 * */  

insert into article_coauthor
	(id, article_id, profile_id)
Values
(1,110,-1),
(2,111,-1),
(3,112,-1),
(4,130,-1),
(5,150,-1),
(6,151,-1),
(7,191,-1),
(8,192,-1),
(9,250,-1),
(10,310,-1),
(11,350,-1),
(12,352,-1),
(13,410,-1),
(14,430,-1),
(15,431,-1),
(16,432,-1),
(17,433,-1),
(18,510,-1),
(19,530,-1),
(20,550,-1),
(21,551,-1),
(22,570,-1),
(23,590,-1),
(24,610,-1),
(25,630,-1),
(26,650,-1),
(27,651,-1),
(28,670,-1),
(29,690,-1),
(30,710,-1),
(31,730,-1),
(32,750,-1),
(33,751,-1),
(34,770,-1),
(35,790,-1),
(36,810,-1),
(37,830,-1),
(38,831,-1),
(39,850,-1),
(40,870,-1),
(-4,871,-1),
(41,910,-1),
(42,911,-1),
(43,931,-1),
(44,970,-1),
(45,990,-1),
(46,1010,-1),
(47,1012,-1),
(48,1030,-1),
(49,1090,-1),
(50,1091,-1),
(51,1110,-1),
(53,1130,-1),
(55,1150,-1),
(57,1170,-1),
(58,1190,-1),
(59,1210,-1),
(60,1230,-1),
(-1,1250,-1),
(-2,1270,-1),
(-3,1272,-1);


/*
 * Récupération des articles sans tags
 * 
 * select article.id from article left outer join article_tag on article.id = article_tag.article_id where article.id not in (select distinct article_id from article_tag) and article.status = 2 order by article.id asc;
 * 
 */
insert into article_tag
	(id, article_id, tag_id)
Values
(1,110,0),
(2,112,0),
(3,130,0),
(4,150,0),
(5,151,0),
(6,192,0),
(7,291,0),
(8,350,0),
(9,352,0),
(10,751,0),
(11,1071,0);

