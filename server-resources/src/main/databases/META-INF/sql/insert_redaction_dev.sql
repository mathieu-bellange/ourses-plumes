Insert into category
  (id, category)
Values
  (1,  'Brève'),
  (2,  'Reportage'),
  (3,  'Spotlights'),
  (4,  'Interview'),
  (5,  'Tribune'),
  (6,  'Revue du web'),
  (7,  'Retour de terrain'),
  (8,  'Forme libre'),
  (9,  'Chronique'),
  (10, 'Portrait'),
  (11, 'Article d''analyse'),
  (12, 'Critique'),
  (13, 'Billet d''humeur'),
  (14, 'Diaporama'),
  (15, 'Dessin');

Insert into rubrique
  (id, rubrique, classe, path)
Values
  (1, 'Luttes', 'struggles', 'luttes'),
  (2, 'Nos corps, nous-mêmes', 'ourbody', 'nos-corps'),
  (3, 'Intersectionnalité', 'intersec', 'intersectionnalite'),
  (4, 'International', 'internat', 'international'),
  (5, 'Education & Culture', 'educult', 'education-culture'),
  (6, 'Idées', 'ideas', 'idees');

Insert into tag
  (id, tag)
Values
  (1, 'tag 1'),
  (2, 'tag 2'),
  (3, 'sexisme'),
  (4, 'jeux vidéos'),
  (5, 'machisme'),
  (6, 'homophobie'),
  (7, 'sept'),
  (8, 'amphibien'),
  (9, 'amphipode'),
  (10, 'amphithéatre'),
  (11, 'amphore'),
  (12, 'amphotère'),
  (13, 'amplificateur'),
  (14, 'ampoule'),
  (15, 'amputation'),
  (16, 'band apart'),
  (17, 'bandage'),
  (18, 'bande'),
  (19, 'bandeau'),
  (20, 'banderole'),
  (21, 'bandit'),
  (22, 'jeu video'),
  (23, 'jeux-vidéos'),
  (24, 'jeux  vidéos'),
  (25, 'jeux videos'),
  (26, 'jeux_vidéos'),
  (27, 'zizanie'),
  (28, 'zizi'),
  (29, 'zizi mou'),
  (30, 'zizou');

Insert into article
  (id, title, description, body, published_date, created_date, updated_date, profile_id, category_id, rubrique_id, status, path, title_beautify)
Values
  (1, 'titre 1', 'description', '<p>body</p>', null, '2014-05-01', null, 2, 1, 1, 0, '/articles/1', 'titre-1'),
  (2, 'titre 2', 'description', '<p>body</p>', null, '2014-02-02', '2014-02-02', 2, 1, 2, 1, '/articles/2', 'titre-2'),
  (3, 'titre 3', 'description', '<p>body</p>', null, '2014-01-04', null, 1, 2, 3, 0, '/articles/3', 'titre-3'),
  (4, 'titre 4', 'description', '<p>body</p>', null, '2014-03-01', null, 2, 2, 3, 0, '/articles/4', 'titre-4'),
  (5, 'titre 5', 'description', '<p>body</p>', null, '2014-12-01', '2014-12-01', 2, 2, 3, 1, '/articles/5', 'titre-5'),
  (6, 'titre 6', 'description', '<p>body</p>', null, '2014-01-05', '2014-01-06', 2, 2, 3, 1, '/articles/6', 'titre-6'),
  (7, 'titre 7', 'to delete', '<p>body</p>', null, '2014-11-01', '2014-11-05', 2, 2, 3, 0, '/articles/7', 'titre-7'),
  (8, 'titre 8', 'cannot delete', '<p>body</p>', null, '2014-01-27', '2014-02-05', 2, 2, 3, 1, '/articles/8', 'titre-8'),
  (9, 'titre 9', 'invalidate', '<p>body</p>', null, '2014-08-07', '2014-08-09', 2, 2, 3, 1, '/articles/9', 'titre-9'),
  (10, 'titre 10', 'not_invalidate', '<p>body</p>', null, '2014-06-01', '2014-06-01', 2, 2, 3, 0, '/articles/10', 'titre-10'),
  (11, 'titre 11', 'get', '<p>body</p>', '2077-01-01 08:00:00', '2014-04-11', '2014-04-11', 2, 2, 3, 2, '/articles/intersectionnalite/1/titre-11', 'titre-11'),
  (12, 'titre 12', 'get draft', '<p>body</p>', null, '2014-07-24', '2014-07-24', 2, 2, 3, 0, '/articles/12', 'titre-12'),
  (13, 'titre 13', 'get validate', '<p>body</p>', null, '2014-09-13', '2014-09-15', 2, 2, 3, 1, '/articles/13', 'titre-13'),
  (14, 'titre 14', 'en ligne au 01/01/2010', '<p>body</p>', '2010-01-01 07:00:00', '2014-02-06', '2014-01-05', 3, 6, 5, 2, '/articles/education-culture/2/titre-14', 'titre-14'),
  (15, 'titre 15', 'en ligne au 14/03/1982', '<p>body</p>', '1982-03-14 14:00:00', '2014-10-21', '2014-01-05', 2, 5, 4, 2, '/articles/international/3/titre-15', 'titre-15'),
  (16, 'titre 16', 'en ligne au 25/02/2007', '<p>body</p>', '2007-02-25 09:00:00', '2014-11-13', '2014-01-05', 2, 4, 4, 2, '/articles/international/4/titre-16', 'titre-16'),
  (17, 'titre 17', 'desc', '<p>body</p>', null, '2014-11-13', '2014-01-05', 2, 4, 4, 0, '/articles/international/titre-17', 'titre-17'),
  (18, 'titre 18', 'invalidate own', '<p>body</p>', null, '2014-11-13', '2014-01-05', 2, 4, 4, 1, '/articles/18', 'titre-18'),
  (19, 'titre 19', 'invalidate another', '<p>body</p>', null, '2014-11-13', '2014-01-05', 1, 4, 4, 1, '/articles/19', 'titre-19'),
  (20, 'titre 20', 'desc', '<p>recall own</p>', '2013-11-13 20:00:00', '2013-11-13', '2013-01-05', 2, 4, 1, 2, '/articles/luttes/5/titre-20', 'titre-20'),
  (21, 'titre 21', 'desc', '<p>recall another</p>', '2013-11-13 12:00:00', '2013-11-13', '2013-01-05', 1, 4, 4, 2, '/articles/international/6/titre-21', 'titre-21'),
  (22, 'Brouillon de Nadejda', 'desc', '<p>recall another</p>', null, '2014-09-01', null, 3, 1, 4, 0, '/articles/22', 'brouillon-de-nadejda'),
  (23, 'Sexisme dans les jeux-vidéos, une critique impossible ?',
    'Ces dernières années sur le net et dans les milieux féministes anglophones et francophones, des débats et discussions sont nés autour de la question des représentations sexistes dans les jeux-vidéos et des comportements sexistes parmi les joueurs. Les réactions de rejet particulièrement virulentes de la part de ceux qui se sentent mis en cause, comme on a pu le constater suite aux déchaînements qu’ont subis entres autres Anita Sarkeesian et Mar-Lard, conduisent cependant à s’interroger sur la possibilité même de mener une telle réflexion.', 
    '<h4>Une industrie au sexisme bien ancré.</h4>
    <p>L’industrie vidéo-ludique représente aujourd’hui un marché important du point de vue du chiffre d’affaires mondial (environ 66 milliards de dollars en 2013) et du nombre de joueu-ses-rs (<a href="http://www.snjv.org/data/document/livre-blanc2.pdf">31 millions rien qu’en France, dont 52 % de joueuses</a>). </p>
    <p>C’est une industrie dominée par les hommes, qui y occupent 88 % des postes en 2013 et qui gagnent davantage, les salaires féminins étant en moyenne inférieurs de 27 %. Mais c’est aussi un milieu où les représentations sexistes et misogynes sont très bien ancrées.</p>
    <p>Comme l’explique très bien Mar_Lard dans son <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier/">article</a> des plus complets <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier/#chap2">les concepteurs et créateurs</a> font montre dans leurs propos de stéréotypes sexistes très ancrés qui considèrent les personnages féminins comme des êtres forcément plus faibles, guidés par l’émotion plutôt que la logique, et dont l’intérêt réside surtout dans la satisfaction sexuelle qu’elles sont en mesure d’apporter aux joueurs (forcément envisagés comme mâles et hétérosexuels). Cela se reflète bien sûr dans les jeux produits où les personnages de femmes correspondant presque exclusivement à un petit nombre de <a href="http://tvtropes.org/pmwiki/pmwiki.php/Fr/Schema">schémas</a>, ou “<a href="http://tvtropes.org/pmwiki/pmwiki.php/Main/Trope">tropes</a>”.</p>
    <div class="callout cyan">Les femmes y sont montrées comme des êtres vénaux, idiots, incompétents et des objets sexuels.</div>
    <p>En dehors des œuvres elles-mêmes, la promotion qui les accompagne est souvent la démonstration d’un sexisme crasse. Les femmes y sont montrées comme des êtres vénaux, idiots, incompétents et des objets sexuels, ou bien on tente de leurs vendre des jeux qui leur sont spécialement destinés et qui font appel à tous les stéréotypes possibles en matière de centres d’intérêt ou d’esthétique genrés. Or, on est ici dans un média de masse, générant des bénéfices énormes, les équipements (consoles, accessoires) et les jeux s’accompagnent donc de publicité dont la diffusion massive touche la société bien plus largement que le cercle des joueurs.</p>
    <p>De même, <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier/#chap3">la presse spécialisée</a>, qui fonctionne en lien très étroit avec l’industrie, est loin d’être en reste comme l’article de Joystick ayant suscité l’ire de Mar-lard le montre bien.</p>
    <h4>Des joueurs qui défendent avec force l’hétéro-patriarcat</h4>
    <p>Deux femmes donc, l’une anglophone l’autre francophone, qui sont toutes deux passionnées de pop-culture au sens large :la culture de masse moderne, qui réunit certains genres (de l’imaginaire, du policier,… ) et certains médias (les comics et la bande dessinée, les films à gros budget, les jeux vidéo, les jeux de rôle, la littérature de ’’de genre’’,…) ainsi que la technophile et la culture informatique. Elles sont féministes et se sont attachées à analyser et critiquer ces stéréotypes et représentations genrées et sexistes dans des œuvres et dans une ’’communauté’’ geek auxquelles elles se sentent par ailleurs appartenir et à laquelle elles tiennent.</p>
    <div class="callout cyan">Elle est la cible d’un déchaînement d’attaques comprenant des insultes anonymes en commentaires, des menaces de viol, de mort.</div>
    <p>La première, Anita Sarkeesian, est une blogueuse-vidéo ayant étudié les sciences politiques et sociales et spécialisée dans l’analyse des médias. à ce titre elle réalise une série de vidéos analysant les <a href="http://tvtropes.org/pmwiki/pmwiki.php/Main/Trope">Tropes</a> sur les femmes dans la culture populaire sur son site <a href="http://www.feministfrequency.com/">FeministFrequency</a>. C’est à l’occasion de sa campagne Kickstarter en mai 2012 pour obtenir un financement participatif afin de pouvoir tourner plusieurs vidéos sur le sexisme dans les jeux vidéo qu’elle est la cible d’un déchaînement d’attaques comprenant des insultes anonymes en commentaires, des menaces de viol, de mort, la diffusion de photomontage la montrant victime de violences, y compris sexuelles, mais aussi des attaques matérielles contre son site internet (attaques DoS), hack de ses comptes Twitter et Google. Il y eut même des tentatives pour diffuser ses informations personnelles telles qu’adresse et numéro de téléphone. Tout cela pour avoir osé proposer de faire une analyse textuelle et iconographique des jeux vidéos d’un point de vue féministe.</p>
    <p>En France le débat sur le sexisme dans les jeux-vidéo et dans le milieu geek en général est beaucoup moins développé qu’aux USA et c’est une féministe française, joueuse et qui travaille dans le jeu-vidéo, connue sous le pseudo de Mar_Lard qui a fortement contribué à le déclencher, un peu malgré elle au départ, en publiant en août 2012 un « <a href="http://cafaitgenre.org/2012/08/18/joystick-apologie-du-viol-et-culture-du-machisme/">coup de gueule</a> » dénonçant un article du magazine de jeux-vidéo Joystick dans lequel, au prétexte de parler du dernier Tomb Raider, un journaliste se répandait pendant des milliers de signes sur le plaisir qu’il prenait aux scènes de viol et de domination qui « remettaient à sa place » l’héroïne trop indépendante à ses yeux. Les réactions furent là aussi très violentes, que ce soit dans les centaines de commentaires (laissés ouverts intentionnellement, pour faire la démonstration des réactions misogynes et violentes que Mar_Lard anticipait, même si elle ne se doutait pas de l’ampleur qu’elles prendraient) où là aussi les menaces de mort et de viols furent légion, ou même directement par SMS, certains ayant réussi à se procurer son numéro de téléphone et à accéder à des photos privées de la joueuse. Très nombreuses furent aussi les attaques remettant en cause la légitimité de Mar_Lard et celle de la question même du sexisme dans les jeux vidéo.</p>
    <p> Suite à cela, Mar_Lard passa plusieurs mois à élaborer un <a href="http://cafaitgenre.org/2013/03/16/sexisme-chez-les-geeks-pourquoi-notre-communaute-est-malade-et-comment-y-remedier">article fleuve</a> faisant la démonstration édifiante de l’hétéro-sexisme systémique des diverses facettes de la ’’communauté geek’’. Cet article aussi suscita nombre de réactions violentes et indignées (indignées que Mar_Lard ose parler du problème), et fut repris par la presse généraliste.</p>
    <p>La violence assez incroyable qui s’est manifestée à ces occasions explique en grande partie pourquoi, alors qu’elles ne sont plus vraiment minoritaires d’un point de vue numérique les joueuses (en 2012 elles constituent <a href="http://www.theesa.com/facts/pdfs/esa_ef_2012.pdf">47 % des joueu-ses-urs au niveau mondial</a>), sont si invisibles. Beaucoup d’entre-elles choisissent en effet de ne pas se révéler comme joueuses, voire de se faire passer en ligne pour des joueurs hommes afin de pouvoir profiter de leur loisir en paix sans être victime de harcèlement sexuel systématique et constant.</p>
    <div class="callout cyan">Les insultes homophobes sont la base du vocabulaire dans les jeux en réseau.</div>
    <p>L’espace vidéo-ludique est donc loin d’être un espace social <em>safe</em> (où l’on se sent en sécurité). Ce sexisme brutal se manifeste aussi par une homophobie banale ou revendiquée. Le personnage principal des jeux vidéo les plus valorisés par la ’’communauté des joueurs’’ (ceux qui se sentent les seuls légitimes, qui considèrent le média vidéo-ludique comme étant le leur et devant répondre à leurs attentes à eux seuls, et qui sont les plus audibles) c’est à dire les FPS, jeux de guerre et jeux d’infiltration, correspondent à l’archétype du mâle blanc hétérosexuel viril, violent et dominant qui est si présent dans les œuvres culturelles en général. Quand il en sort, les réactions des joueurs sont toujours violentes, cherchant à exclure de ce média tous ceux qui ne correspondent pas. Les insultes homophobes sont la base du vocabulaire dans les jeux en réseau, et quand un développeur un peu innovant comme BioWare ose proposer la possibilité d’arcs narratifs impliquant des couples de même sexe cela suscite des protestations très bruyantes.</p>
    <p>Le sujet du sexisme, de l’homophobie et des représentations stéréotypées dans les jeux vidéo et dans la communauté est très vaste, et les articles et vidéos et <a href="http://cafaitgenre.org/tag/jeux-video/">Mar-Lard</a> et <a href="http://www.feministfrequency.com/category/video-games/">Anita Sarkeesian</a> sont à ce sujet passionnants et édifiants.</p>
    <h4>Un combat qui reste à mener</h4>
    <p>La question est loin d’être anecdotique, d’une part parce que comme on l’a vu, les jeux vidéos, mais aussi de façon plus large le web, constituent des espaces sociaux dont l’importance et le rôle sont croissants dans la société et parce qu’ils représentent des opportunités créatrices d’une grande richesse dont il est intolérable que certainEs soient ainsi excluEs, et qu’il faut donc en continuer la critique politique et le combat pour l’ouvrir aux différentes minorités.</p>
    <p>Mais aussi parce que, au-delà du jeu vidéo lui-même, les violences sexistes qui s’y déroulent sont un exemple très révélateur de la façon dont les comportements sexistes, méprisants, paternalistes participent d’un système d’exclusion des femmes d’un lieu social Comme certains le revendiquent d’ailleurs explicitement.</p>', 
    '2014-09-01 07:00:00', '2014-02-01', '2014-02-05', 6, 4, 5, 2, '/articles/education-culture/6/sexisme-dans-les-jeux-videos-une-critique-impossible', 'sexisme-dans-les-jeux-videos-une-critique-impossible'),
   (24, 'Revue du web', 'desc', '<p>une revue du web</p>', '2014-09-01 13:00:00', '2014-09-01', null, 3, 6, 1, 2, '/articles/luttes/7/revue-du-web', 'revue-du-web'),
   (25, 'Dernière revue du web', 'desc', '<p>la dernière revue du web</p>', '2014-11-23 12:30:00', '2014-09-01', null, 3, 6, 1, 2, '/articles/luttes/8/revue-du-web', 'revue-du-web-last');

Insert into article_tag
  (id, tag_id, article_id)
Values
  (1, 1, 1),
  (2, 1, 7),
  (3, 1, 11),
  (4, 2, 11),
  (5, 3, 17),
  (6, 4, 17),
  (7, 5, 17),
  (8, 6, 17),
  (9, 2, 14),
  (10, 2, 12),
  (11, 7, 7),
  (12, 1, 15),
  (13, 2, 15),
  (14, 4, 15),
  (15, 3, 16),
  (16, 4, 16),
  (17, 5, 16),
  (18, 7, 16),
  (19, 2, 20),
  (20, 7, 20),
  (21, 7, 21);
  
Insert into article_coauthor
  (id,article_id,profile_id)
Values
  (1,24,1),
  (2,24,2),
  (4,1,1);

Insert into old_path
  (id,article_id,path)
Values
  (1,16,'/articles/international/9/old_path');
