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
   (id, rubrique, classe, path)
 Values
   (1, 'Luttes','struggles', 'luttes'),
   (2, 'Nos corps, nous-mêmes', 'ourbody', 'nos-corps'),
   (3, 'Intersectionnalité', 'intersec', 'intersectionnalité'),
   (4, 'International', 'internat','international'),
   (5, 'Education & Culture', 'educult', 'éducation-culture'),
   (6, 'Idées', 'ideas','idées');

Insert into tag
   (id, tag)
 Values
   (1, 'Tag 1'),
   (2, 'Tag 2'),
   (3, 'Sexisme'),
   (4, 'Jeux vid&eacute;os'),
   (5, 'Machisme'),
   (6, 'Homophobie');
   
Insert into article
	(id,title,description,body,published_date,created_date,updated_date,profile_id,category_id,rubrique_id,status,path,title_beautify)
Values
	(1,'titre 1','description','body',null,'2014-05-01',null,2,1,1,0,'/articles/1','titre-1'),
	(2,'titre 2','description','body',null,'2014-02-02','2014-02-02',2,1,2,1,'/articles/2','titre-2'),
	(3,'titre 3','description','body',null,'2014-01-04',null,1,2,3,0,'/articles/3','titre-3'),
	(4,'titre 4','description','body',null,'2014-03-01',null,2,2,3,0,'/articles/4','titre-4'),
	(5,'titre 5','description','body',null,'2014-12-01','2014-12-01',2,2,3,1,'/articles/5','titre-5'),
	(6,'titre 6','description','body',null,'2014-01-05','2014-01-06',2,2,3,1,'/articles/6','titre-6'),
	(7,'titre 7','to delete','body',null,'2014-11-01','2014-11-05',2,2,3,0,'/articles/7','titre-7'),
	(8,'titre 8','cannot delete','body',null,'2014-01-27','2014-02-05',2,2,3,1,'/articles/8','titre-8'),
	(9,'titre 9','invalidate','body',null,'2014-08-07','2014-08-09',2,2,3,1,'/articles/9','titre-9'),
	(10,'titre 10','not_invalidate','body',null,'2014-06-01','2014-06-01',2,2,3,0,'/articles/10','titre-10'),
	(11,'titre 11','get','body','2077-01-01','2014-04-11','2014-04-11',2,2,3,2,'/articles/intersectionnalité/titre-11','titre-11'),
	(12,'titre 12','get draft','body',null,'2014-07-24','2014-07-24',2,2,3,0,'/articles/12','titre-12'),
	(13,'titre 13','get validate','body',null,'2014-09-13','2014-09-15',2,2,3,1,'/articles/13','titre-13'),
	(14,'titre 14','en ligne au 01/01/2010','body','2010-01-01','2014-02-06','2014-01-05',3,7,5,2,'/articles/éducation-culture/titre-14','titre-14'),
	(15,'titre 15','en ligne au 14/03/1982','body','1982-03-14','2014-10-21','2014-01-05',2,6,1,2,'/articles/luttes/titre-15','titre-15'),
	(16,'titre 16','en ligne au 25/02/2007','body','2007-02-25','2014-11-13','2014-01-05',2,4,4,2,'/articles/international/titre-16','titre-16'),
	(17,'titre 17','desc','body',null,'2014-11-13','2014-01-05',2,4,4,0,'/articles/international/titre-17','titre-17'),
	(18,'Sexisme dans les jeux-vid&eacute;os, une critique impossible&nbsp;?',
		'Ces derni&egrave;res ann&eacute;es sur le net et dans les milieux f&eacute;ministes anglophones et francophones, des d&eacute;bats et discussions sont n&eacute;s autour de la question des repr&eacute;sentations sexistes dans les jeux-vid&eacute;os et des comportements sexistes parmi les joueurs. Les r&eacute;actions de rejet particuli&egrave;rement virulentes de la part de ceux qui se sentent mis en cause, comme on a pu le constater suite aux d&eacute;cha&icirc;nements qu&rsquo;ont subis entres autres Anita Sarkeesian et Mar-Lard, conduisent cependant &agrave; s&rsquo;interroger sur la possibilit&eacute; m&ecirc;me de mener une telle r&eacute;flexion.',
		'<h4 class="cyan">Une industrie au sexisme bien ancr&eacute;.</h4>
								<p>L&rsquo;industrie vid&eacute;o-ludique repr&eacute;sente aujourd&rsquo;hui un march&eacute; important du point de vue du chiffre d&rsquo;affaires mondial (environ 66 milliards de dollars en 2013) et du nombre de joueu-ses-rs (<a href="http://www.snjv.org/data/document/livre-blanc2.pdf">31 millions rien qu&rsquo;en France, dont 52&nbsp;% de joueuses</a>). </p>
								<p>C&rsquo;est une industrie domin&eacute;e par les hommes, qui y occupent 88&nbsp;% des postes en 2013 et qui gagnent davantage, les salaires f&eacute;minins &eacute;tant en moyenne inf&eacute;rieurs de 27&nbsp;%. Mais c&rsquo;est aussi un milieu o&ugrave; les repr&eacute;sentations sexistes et misogynes sont tr&egrave;s bien ancr&eacute;es.</p>
								<p>Comme l&rsquo;explique tr&egrave;s bien Mar_Lard dans son <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier/">article</a> des plus complets <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier/#chap2">les concepteurs et cr&eacute;ateurs</a> font montre dans leurs propos de st&eacute;r&eacute;otypes sexistes tr&egrave;s ancr&eacute;s qui consid&egrave;rent les personnages f&eacute;minins comme des &ecirc;tres forc&eacute;ment plus faibles, guid&eacute;s par l&rsquo;&eacute;motion plutôt que la logique, et dont l&rsquo;int&eacute;r&ecirc;t r&eacute;side surtout dans la satisfaction sexuelle qu&rsquo;elles sont en mesure d&rsquo;apporter aux joueurs (forc&eacute;ment envisag&eacute;s comme m&acirc;les et h&eacute;t&eacute;rosexuels). Cela se refl&egrave;te bien s&ucirc;r dans les jeux produits o&ugrave; les personnages de femmes correspondant presque exclusivement &agrave; un petit nombre de <a href="http://tvtropes.org/pmwiki/pmwiki.php/Fr/Schema">sch&eacute;mas</a>, ou &ldquo;<a href="http://tvtropes.org/pmwiki/pmwiki.php/Main/Trope">tropes</a>&rdquo;.</p>
								<div class="callout cyan">Les femmes y sont montr&eacute;es comme des &ecirc;tres v&eacute;naux, idiots, incomp&eacute;tents et des objets sexuels.</div>
								<p>En dehors des &oelig;uvres elles-m&ecirc;mes, la promotion qui les accompagne est souvent la d&eacute;monstration d&rsquo;un sexisme crasse. Les femmes y sont montr&eacute;es comme des &ecirc;tres v&eacute;naux, idiots, incomp&eacute;tents et des objets sexuels, ou bien on tente de leurs vendre des jeux qui leur sont sp&eacute;cialement destin&eacute;s et qui font appel &agrave; tous les st&eacute;r&eacute;otypes possibles en mati&egrave;re de centres d&rsquo;int&eacute;r&ecirc;t ou d&rsquo;esth&eacute;tique genr&eacute;s. Or, on est ici dans un m&eacute;dia de masse, g&eacute;n&eacute;rant des b&eacute;n&eacute;fices &eacute;normes, les &eacute;quipements (consoles, accessoires) et les jeux s&rsquo;accompagnent donc de publicit&eacute; dont la diffusion massive touche la soci&eacute;t&eacute; bien plus largement que le cercle des joueurs.</p>
								<p>De m&ecirc;me, <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier/#chap3">la presse sp&eacute;cialis&eacute;e</a>, qui fonctionne en lien tr&egrave;s &eacute;troit avec l&rsquo;industrie, est loin d&rsquo;&ecirc;tre en reste comme l&rsquo;article de Joystick ayant suscit&eacute; l&rsquo;ire de Mar-lard le montre bien.</p>
								<h4 class="cyan">Des joueurs qui d&eacute;fendent avec force l&rsquo;h&eacute;t&eacute;ro-patriarcat</h4>
								<p>Deux femmes donc, l&rsquo;une anglophone l&rsquo;autre francophone, qui sont toutes deux passionn&eacute;es de pop-culture au sens large&#8239;:la culture de masse moderne, qui r&eacute;unit certains genres (de l&rsquo;imaginaire, du policier,&hellip; ) et certains m&eacute;dias (les comics et la bande dessin&eacute;e, les films &agrave; gros budget, les jeux vid&eacute;o, les jeux de rôle, la litt&eacute;rature de &rsquo;&rsquo;de genre&rsquo;&rsquo;,&hellip;) ainsi que la technophile et la culture informatique. Elles sont f&eacute;ministes et se sont attach&eacute;es &agrave; analyser et critiquer ces st&eacute;r&eacute;otypes et repr&eacute;sentations genr&eacute;es et sexistes dans des &oelig;uvres et dans une &rsquo;&rsquo;communaut&eacute;&rsquo;&rsquo; geek auxquelles elles se sentent par ailleurs appartenir et &agrave; laquelle elles tiennent.</p>
								<div class="callout cyan">Elle est la cible d&rsquo;un d&eacute;cha&icirc;nement d&rsquo;attaques comprenant des insultes anonymes en commentaires, des menaces de viol, de mort.</div>
								<p>La premi&egrave;re, Anita Sarkeesian, est une blogueuse-vid&eacute;o ayant &eacute;tudi&eacute; les sciences politiques et sociales et sp&eacute;cialis&eacute;e dans l&rsquo;analyse des m&eacute;dias. &agrave; ce titre elle r&eacute;alise une s&eacute;rie de vid&eacute;os analysant les <a href="http://tvtropes.org/pmwiki/pmwiki.php/Main/Trope">Tropes</a> sur les femmes dans la culture populaire sur son site <a href="http://www.feministfrequency.com/">FeministFrequency</a>. C&rsquo;est &agrave; l&rsquo;occasion de sa campagne Kickstarter en mai 2012 pour obtenir un financement participatif afin de pouvoir tourner plusieurs vid&eacute;os sur le sexisme dans les jeux vid&eacute;o qu&rsquo;elle est la cible d&rsquo;un d&eacute;cha&icirc;nement d&rsquo;attaques comprenant des insultes anonymes en commentaires, des menaces de viol, de mort, la diffusion de photomontage la montrant victime de violences, y compris sexuelles, mais aussi des attaques mat&eacute;rielles contre son site internet (attaques DoS), hack de ses comptes Twitter et Google. Il y eut m&ecirc;me des tentatives pour diffuser ses informations personnelles telles qu&rsquo;adresse et num&eacute;ro de t&eacute;l&eacute;phone. Tout cela pour avoir os&eacute; proposer de faire une analyse textuelle et iconographique des jeux vid&eacute;os d&rsquo;un point de vue f&eacute;ministe.</p>
								<p>En France le d&eacute;bat sur le sexisme dans les jeux-vid&eacute;o et dans le milieu geek en g&eacute;n&eacute;ral est beaucoup moins d&eacute;velopp&eacute; qu&rsquo;aux USA et c&rsquo;est une f&eacute;ministe fran&ccedil;aise, joueuse et qui travaille dans le jeu-vid&eacute;o, connue sous le pseudo de Mar_Lard qui a fortement contribu&eacute; &agrave; le d&eacute;clencher, un peu malgr&eacute; elle au d&eacute;part, en publiant en ao&ucirc;t 2012 un &laquo&#8239;<a href="http://cafaitgenre.org/2012/08/18/joystick-apologie-du-viol-et-culture-du-machisme/">coup de gueule</a>&#8239;&raquo d&eacute;non&ccedil;ant un article du magazine de jeux-vid&eacute;o Joystick dans lequel, au pr&eacute;texte de parler du dernier Tomb Raider, un journaliste se r&eacute;pandait pendant des milliers de signes sur le plaisir qu&rsquo;il prenait aux sc&egrave;nes de viol et de domination qui &laquo&#8239;remettaient &agrave; sa place&#8239;&raquo l&rsquo;h&eacute;roïne trop ind&eacute;pendante &agrave; ses yeux. Les r&eacute;actions furent l&agrave; aussi tr&egrave;s violentes, que ce soit dans les centaines de commentaires (laiss&eacute;s ouverts intentionnellement, pour faire la d&eacute;monstration des r&eacute;actions misogynes et violentes que Mar_Lard anticipait, m&ecirc;me si elle ne se doutait pas de l&rsquo;ampleur qu&rsquo;elles prendraient) o&ugrave; l&agrave; aussi les menaces de mort et de viols furent l&eacute;gion, ou m&ecirc;me directement par SMS, certains ayant r&eacute;ussi &agrave; se procurer son num&eacute;ro de t&eacute;l&eacute;phone et &agrave; acc&eacute;der &agrave; des photos priv&eacute;es de la joueuse. Tr&egrave;s nombreuses furent aussi les attaques remettant en cause la l&eacute;gitimit&eacute; de Mar_Lard et celle de la question m&ecirc;me du sexisme dans les jeux vid&eacute;o.</p>
								<p> Suite &agrave; cela, Mar_Lard passa plusieurs mois &agrave; &eacute;laborer un <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier">article fleuve</a> faisant la d&eacute;monstration &eacute;difiante de l&rsquo;h&eacute;t&eacute;ro-sexisme syst&eacute;mique des diverses facettes de la &rsquo;&rsquo;communaut&eacute; geek&rsquo;&rsquo;. Cet article aussi suscita nombre de r&eacute;actions violentes et indign&eacute;es (indign&eacute;es que Mar_Lard ose parler du probl&egrave;me), et fut repris par la presse g&eacute;n&eacute;raliste.</p>
								<p>La violence assez incroyable qui s&rsquo;est manifest&eacute;e &agrave; ces occasions explique en grande partie pourquoi, alors qu&rsquo;elles ne sont plus vraiment minoritaires d&rsquo;un point de vue num&eacute;rique les joueuses (en 2012 elles constituent <a href="http://www.theesa.com/facts/pdfs/esa_ef_2012.pdf">47&nbsp;% des joueu-ses-urs au niveau mondial</a>), sont si invisibles. Beaucoup d&rsquo;entre-elles choisissent en effet de ne pas se r&eacute;v&eacute;ler comme joueuses, voire de se faire passer en ligne pour des joueurs hommes afin de pouvoir profiter de leur loisir en paix sans &ecirc;tre victime de harc&egrave;lement sexuel syst&eacute;matique et constant.</p>
								<div class="callout cyan">Les insultes homophobes sont la base du vocabulaire dans les jeux en r&eacute;seau.</div>
								<p>L&rsquo;espace vid&eacute;o-ludique est donc loin d&rsquo;&ecirc;tre un espace social <em>safe</em> (o&ugrave; l&rsquo;on se sent en s&eacute;curit&eacute;). Ce sexisme brutal se manifeste aussi par une homophobie banale ou revendiqu&eacute;e. Le personnage principal des jeux vid&eacute;o les plus valoris&eacute;s par la &rsquo;&rsquo;communaut&eacute; des joueurs&rsquo;&rsquo; (ceux qui se sentent les seuls l&eacute;gitimes, qui consid&egrave;rent le m&eacute;dia vid&eacute;o-ludique comme &eacute;tant le leur et devant r&eacute;pondre &agrave; leurs attentes &agrave; eux seuls, et qui sont les plus audibles) c&rsquo;est &agrave; dire les FPS, jeux de guerre et jeux d&rsquo;infiltration, correspondent &agrave; l&rsquo;arch&eacute;type du m&acirc;le blanc h&eacute;t&eacute;rosexuel viril, violent et dominant qui est si pr&eacute;sent dans les &oelig;uvres culturelles en g&eacute;n&eacute;ral. Quand il en sort, les r&eacute;actions des joueurs sont toujours violentes, cherchant &agrave; exclure de ce m&eacute;dia tous ceux qui ne correspondent pas. Les insultes homophobes sont la base du vocabulaire dans les jeux en r&eacute;seau, et quand un d&eacute;veloppeur un peu innovant comme BioWare ose proposer la possibilit&eacute; d&rsquo;arcs narratifs impliquant des couples de m&ecirc;me sexe cela suscite des protestations tr&egrave;s bruyantes.</p>
								<p>Le sujet du sexisme, de l&rsquo;homophobie et des repr&eacute;sentations st&eacute;r&eacute;otyp&eacute;es dans les jeux vid&eacute;o et dans la communaut&eacute; est tr&egrave;s vaste, et les articles et vid&eacute;os et <a href="http://cafaitgenre.org/tag/jeux-video/">Mar-Lard</a> et <a href="http://www.feministfrequency.com/category/video-games/">Anita Sarkeesian</a> sont &agrave; ce sujet passionnants et &eacute;difiants.</p>
								<h4 class="cyan">Un combat qui reste &agrave; mener</h4>
								<p>La question est loin d&rsquo;&ecirc;tre anecdotique, d&rsquo;une part parce que comme on l&rsquo;a vu, les jeux vid&eacute;os, mais aussi de fa&ccedil;on plus large le web, constituent des espaces sociaux dont l&rsquo;importance et le rôle sont croissants dans la soci&eacute;t&eacute; et parce qu&rsquo;ils repr&eacute;sentent des opportunit&eacute;s cr&eacute;atrices d&rsquo;une grande richesse dont il est intol&eacute;rable que certainEs soient ainsi excluEs, et qu&rsquo;il faut donc en continuer la critique politique et le combat pour l&rsquo;ouvrir aux diff&eacute;rentes minorit&eacute;s.</p>
								<p>Mais aussi parce que, au-del&agrave; du jeu vid&eacute;o lui-m&ecirc;me, les violences sexistes qui s&rsquo;y d&eacute;roulent sont un exemple tr&egrave;s r&eacute;v&eacute;lateur de la fa&ccedil;on dont les comportements sexistes, m&eacute;prisants, paternalistes participent d&rsquo;un syst&egrave;me d&rsquo;exclusion des femmes d&rsquo;un lieu social Comme certains le revendiquent d&rsquo;ailleurs explicitement.</p>',
		'2014-09-01','2014-02-01','2014-02-05',6,4,5,2,'/articles/éducation-culture/sexisme-dans-les-jeux-vid&eacute;os-une-critique-impossible','sexisme-dans-les-jeux-vidéos-une-critique-impossible');
	
Insert into article_tag
   (id, tag_id,article_id)
 Values
   (1, 1, 1),
   (2, 1, 7),
   (3, 1, 11),
   (4, 2, 11),
   (5, 3, 17),
   (6, 4, 17),
   (7, 5, 17),
   (8, 6, 17),
   (9, 2, 14);