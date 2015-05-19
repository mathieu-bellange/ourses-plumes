/**
 * Les Ourses à plumes
 * Javascript Loader
 * No dependency
 * ver. 1.1.0
 */

/* ------------------------------------------------------------------ */
/* # Private variables */
/* ------------------------------------------------------------------ */

var isFileProtocol = (function() {
	if (window.location.href.split("/")[0].slice(0,4) === "file") {
		return true;
	}
}());

var isLocalHost = (function() {
	if (window.location.hostname === "localhost") {
		return true;
	}
}());

/* ------------------------------------------------------------------ */
/* # Public variables */
/* ------------------------------------------------------------------ */

/* Organization */
$org = {
	"name"               : "Les Ourses à plumes",                 // String   Organization name.
	"mail"               : "oursesaplumes at gmail dot com",      // String   Organization mail.
	"domain"             : "http://www.lesoursesaplumes.com",     // String   Organization domain.
	"newsletter"         : null,                                  // String   Organization newsletter.
	"mailinglist"        : null,                                  // String   Organization mailinglist.
	"twitter"            : "https://twitter.com/OursesaPlumes",
	"facebook"           : "https://www.facebook.com/pages/Les-Ourses-%C3%A0-plumes/223829591145074",
	"wordpress"          : "http://incubateurdesourses.wordpress.com/",
};

/* Application */
$app = {
	"stage"              : "dev",                                 // String   Application stage. Allowed values are "dev" or "rtw" (release to web).
	"ver"                : "1.2.0",                               // String   Application version.
	"name"               : "Webzine féministe",                   // String   Application name.
	"kwd"                : ["Webzine", "Féminisme"],              // Array    Application key words for browsers.
	"desc"               : "Un webzine féministe.",               // String   Application description for browsers.
	"genr"               : null,                                  // String   Application generator name for browsers (i.e. the software used for building the application).
	"root"               : isFileProtocol ? "" : "/"              // String   Application base URL. Default : "/"
};

$api = {
	"twitter"            : {"src" : "http://platform.twitter.com/widgets.js", "id" : "twitter-wjs"},
	"facebook"           : {"src" : "//connect.facebook.net/fr_FR/sdk.js", "id" : "facebook-jssdk"},
	"google"             : {"src" : "https://apis.google.com/js/platform.js"},
	"linkedin"           : {"src" : "//platform.linkedin.com/in.js"}
}

/* Authentication */
$auth = {
	"is_authenticated"   : "isAuthenticated",                     // Boolean  Cookie key of the user state connection. Default : "isAuthenticated"
	"token_id"           : "oursesAuthcTokenId",                  // Long     Cookie key of the authentication token. Default : "oursesAuthcTokenId"
	"token"              : "oursesAuthcToken",                    // String   Local storage key of the authentication token. Default : "oursesAuthcToken"
	"user_name"          : "oursesUserPseudo",                    // String   Cookie key of the user name. Default : "oursesUserPseudo"
	"user_role"          : "oursesUserRole",                      // String   Cookie key of the user role. Default : "oursesUserRole"
	"account_id"         : "oursesAccountId",                     // Long     Local storage key of the user account id. Default : "oursesAccountId"
	"profile_id"         : "oursesProfileId",                     // Long     Local storage key of the user profile id. Default : "oursesProfileId"
	"avatar_path"        : "oursesAvatarPath",                    // String   Cookie key of the avatar path. Default : "oursesAvatarPath"
	"remember_me"        : "oursesRememberMe"                     // boolean  Cookie key of the remember me. Default : "oursesRememberMe"
};

/* Build */
$build = {
	"compress"           : $app.stage == "rtw" ? true : false,    // Boolean  Compress generated content (i.e. remove tabs and line ends). Default : true
	"toolbar"            : isFileProtocol ? true : false,         // Boolean  Create dev toolbar. Default : false
	"container"          : true,                                  // Boolean  Generate container elements (i.e. sidebar, header, footer). Default : true
	"icons"              : true,                                  // Boolean  Create SVG icons. Default : true
	"timeline"           : true,                                  // Boolean  Create Twitter timeline widget on home page. Default : true
	"likebox"            : false                                  // Boolean  Create Facebook likebox widget on home page. Default : false
};

/* Debug */
$debug = {
	"free_log"           : true,                                  // Boolean  Disable abide validation for logger. Default : false
	"db_wait"            : true,                                  // Boolean  Simulate database request time. Default : false
	"db_wait_time"       : 2000                                   // Integer  Dummy request time. Default : 2000
}

/* Configuration */
$conf = {
	"lib_ext"            : $app.stage == "dev" ? "" : ".min",     // String   JS libraries additional extension. Default : ".min"
	"debug"              : $app.stage == "dev" ? true : false,    // Boolean  Turn on/off debug mode. Default : false
	"css_debug"          : false,                                 // Boolean  Enable CSS debug on HTML elements (i.e. show background masks for all pages). Default : false
	"css_fx"             : true,                                  // Boolean  Enable CSS effects on HTML elements (i.e. multiple backgrounds, transitions, animations, box shadows, text shadows and ribbons). Default : true
	"svg_fx"             : true,                                  // Boolean  Enable SVG effects on icons (i.e. blur, glow, shadow and bevel). Default : true
	"js_fx"              : true,                                  // Boolean  Enable fading, sliding and scrolling effects through script (like jQuery.fx.off). Default : true
	"page_title"         : true,                                  // Boolean  Display page title. If set to 'false' the organization name only will appear in the title bar. Default : true
	"redir_param"        : "?redirection=",                       // String   Parameter added to the login page URL for the redirection. Default : "?redirection="
	"role_admin"         : "admin",                               // String   Administrator user level access key. Default : "admin"
	"role_redac"         : "writer",                              // String   Moderator user level access key. Default : "writer"
	"timeline"           : {                                      // Object   Twitter timeline configuration hash.
		"theme"            : "light",                               // String   Style scheme used with Twitter timeline (n.b. API based). Default : "light"
		"link_color"       : "#666688",                             // String   Color of the Twitter timeline links. Default : "#666688"
		"border_color"     : "#c0c0c0",                             // String   Color of the Twitter timeline borders. Default : "#dcdcdc"
		"tweet_limit"      : 4                                      // Integer  Number of items shown in Twitter timeline. Default : 4
	},
	"confirm_delete"     : {                                      // Object   Confirm delete configuration hash.
		"avatar"           : true,                                  // Boolean  Confirm delete avatar. Default : true
		"account"          : true,                                  // Boolean  Confirm delete account. Default : true
		"draft"            : true,                                  // Boolean  Confirm delete draft. Default : true
		"faq"              : true,                                  // Boolean  Confirm delete faq. Default : true
		"date_event"       : true,                                 // Boolean  Confirm delete date event. Default : true
		"folder"           : true                                   // Boolean  Confirm delete folder. Default : true
	},
	"confirm_remove"     : {                                      // Object   Confirm remove configuration hash.
		"folder_article"   : false                                  // Boolean  Confirm remove folder article. Default : false
	}
};

/* Time */
$time = {
	"days" : [                                                    // Array    Define literals for days.
		"lundi",                                                    // String   Set Monday literal.
		"mardi",                                                    // String   Set Tuesday literal.
		"mercredi",                                                 // String   Set Wenesday literal.
		"jeudi",                                                    // String   Set Thursday literal.
		"vendredi",                                                 // String   Set Friday literal.
		"samedi",                                                   // String   Set Saturday literal.
		"dimanche",                                                 // String   Set Sunday literal.
	],
	"months" : [                                                  // Array    Define literals for months.
		"janvier",                                                  // String   Set January literal.
		"février",                                                  // String   Set February literal.
		"mars",                                                     // String   Set March literal.
		"avril",                                                    // String   Set April literal.
		"mai",                                                      // String   Set May literal.
		"juin",                                                     // String   Set June literal.
		"juillet",                                                  // String   Set July literal.
		"août",                                                     // String   Set August literal.
		"septembre",                                                // String   Set September literal.
		"octobre",                                                  // String   Set October literal.
		"novembre",                                                 // String   Set November literal.
		"décembre"                                                  // String   Set December literal.
	],
	"duration" : {                                                // Object   Global durations.
		"fx_short"    : 250,                                        // Integer  Short effects duration in milliseconds. Default : 500
		"fx"          : 500,                                        // Integer  Effects duration in milliseconds. Default : 500
		"fx_long"     : 1000,                                       // Integer  Long effects duration in milliseconds. Default : 500
		"alert_short" : 1250,                                       // Integer  Short alert duration in milliseconds. Default : 500
		"alert"       : 2500,                                       // Integer  Alerts duration in milliseconds. Default : 2500
		"alert_long"  : 5000,                                       // Integer  Long alert duration in milliseconds. Default : 500
		"check"       : 1000                                        // Integer  Check duration in milliseconds. Default : 1000
	}
};

/* Location */
$loc = {                                                        // Object   Set application path to files.
	"js"                    : $app.root + "js/",                  // String   Path to scripts. Default : "/js/"
	"css"                   : $app.root + "css/",                 // String   Path to style sheets. Default : "/css/"
	"img"                   : $app.root + "img/",                 // String   Path to images. Default : "/img/"
	"fnt"                   : $app.root + "fnt/",                 // String   Path to web fonts. Default : "/fnt/"
	"json"                  : $app.root + "json/",                // String   Path to JSON objects. Default : "/json/"
	"tmpl"                  : $app.root + "tmpl/"                 // String   Path to templates. Default : "/tmpl/"
};

/* Images */
$img = {
	"pub"                   : $loc.img + "pub/",                  // String   Path to public images. Default : "/img/pub/"
	"svg"                   : $loc.img + "svg/",                  // String   Path to scalable vectors graphics. Default : "/img/svg/"
	"ui"                    : $loc.img + "ui/",                   // String   Path to user interface graphics. Default : "/img/ui/"
	"usr"                   : $loc.img + "usr/",                  // String   Path to user pictures. Default : "/img/usr/"
	"web"                   : $loc.img + "web/"                   // String   Path to web images. Default : "/img/web/"
};

/* Files */
$file = {
	"icons"                 : $img.svg + "icons.svg",             // String   Store URL of SVG icons file. Default : "/svg/icons.svg"
	"icons_fx"              : $img.svg + "icons.css"              // String   Store URL of SVG icons effects file. Default : "/css/icons-fx.css"
};

/* Messages */
$msg = {
	"compatibility_warning" : "Vous utilisez un navigateur obsol&egrave;te ou non support&eacute;. Certaines fonctionnalit&eacute;s susceptibles de cr&eacute;er une faille de s&eacute;curit&eacute; ont &eacute;t&eacute; d&eacute;sactiv&eacute;es.",
	"error"                 : "Une erreur technique s&rsquo;est produite. Veuillez pr&eacute;venir l&rsquo;administateur du site.",
	"saving"                : "Enregistrement&hellip;",
	"checking"              : "V&eacute;rification&hellip;",
	"connected"             : "Vous avez &eacute;t&eacute; connect&eacute;e au serveur.", // <br>Un rafra&icirc;chissement de la page peut &ecirc;tre n&eacute;cessaire.
	"disconnected"          : "Vous avez &eacute;t&eacute; d&eacute;connect&eacute;e du serveur.", // <br>Veillez &agrave; enregistrer toute modification en cours avant de rafra&icirc;chir la page.
	"user_connected"        : "Vous &ecirc;tes maintenant connect&eacute;e.",
	"user_disconnected"     : "Vous &ecirc;tes maintenant d&eacute;connect&eacute;e.",
	"session_expired"       : "Votre session a expir&eacute; et vous avez &eacute;t&eacute; d&eacute;connect&eacute;e du serveur.",
	"tag_dup"               : "Cette &eacute;tiquette a d&eacute;j&agrave; &eacute;t&eacute; choisie.",
	"tag_max"               : "Maximum de tags&nbsp;!",
	"char_illegal"          : "Caract&egrave;re invalide&nbsp;!",
	"show_more"             : "Plus de r&eacute;sultats",
	"faq_deleted"           : "FAQ supprim&eacute;e&nbsp;!",
	"form_sent"             : "Le formulaire que vous avez soumis a bien &eacute;t&eacute; envoy&eacute;&nbsp;!",
	"form_valid"            : "Le formulaire que vous avez soumis est correct et a &eacute;t&eacute; envoy&eacute;&nbsp;!",
	"form_invalid"          : "Le formulaire que vous avez soumis est incorrect et n&rsquo;a pas pu &ecirc;tre envoy&eacute;.",
	"form_incomplete"       : "Le formulaire que vous avez soumis est incomplet et n&rsquo;a pas &eacute;t&eacute; envoy&eacute;.",
	"field_required"        : "Ce champ doit &ecirc;tre renseign&eacute;&nbsp;!",
	"field_invalid"         : "Ce champ n&rsquo;est pas valide&nbsp;!",
	"field_incomplete"      : "Ce champ est incomplet&nbsp;!",
	"email_dup"             : "Le message a d&eacute;jà &eacute;t&eacute; envoy&eacute; à cette adresse.",
	"email_sent"            : "Le message &eacute;lectronique a correctement &eacute;t&eacute; envoy&eacute;.",
	"email_empty"           : "L&rsquo;adresse &eacute;lectronique est vide&nbsp;&hellip;",
	"email_invalid"         : "L&rsquo;adresse &eacute;lectronique est incorrecte&nbsp;!",
	"password_show"         : "Voir le mot de passe",
	"password_hide"         : "Cacher le mot de passe",
	"account_updated"       : "Compte mis &agrave; jour avec succ&egrave;s",
	"account_deleted"       : "Compte supprim&eacute;&nbsp;!",
	"article_deleted"       : "Cet article n&rsquo;existe plus, il a &eacute;t&eacute; supprim&eacute;.",
	"article_offcheck"      : "Cet article n&rsquo;est plus &agrave; v&eacute;rifier, vous pouvez raffra&icirc;chir la page pour voir les derniers changements.",
	"article_offline"       : "Cet article n&rsquo;est plus en ligne, vous pouvez raffra&icirc;chir la page pour voir les derniers changements.",
	"article_search_last"   : "Plus aucun article &agrave; afficher.",
	"article_search_empty"  : "Aucun article ne correspond aux crit&egrave;res de recherche.",
	"article_no_filter"     : "Vous n&rsquo;avez aucun filtre s&eacute;lectionn&eacute; pour l&rsquo;affichage des articles.",
	"date_event_empty"      : "Pas d&rsquo;&eacute;v&egrave;nement pr&eacute;vu ce jour.",
	"confirm_action"        : "&Ecirc;tes-vous certaine de vouloir faire cela&nbsp;?",
	"confirm_delete"        : {
		"avatar"              : "&Ecirc;tes-vous certaine de vouloir supprimer votre image utilisatrice&nbsp;?<br>Cette action est irr&eacute;versible.",
		"account"             : "&Ecirc;tes-vous certaine de vouloir supprimer ce compte&nbsp;?<br>Cette action est irr&eacute;versible.",
		"my_account"          : "&Ecirc;tes-vous certaine de vouloir supprimer votre compte&nbsp;?<br>Cette action est irr&eacute;versible.",
		"draft"               : "&Ecirc;tes-vous certaine de vouloir supprimer ce brouillon&nbsp;?<br>Cette action est irr&eacute;versible.",
		"faq"                 : "&Ecirc;tes-vous certaine de vouloir supprimer cette FAQ&nbsp;?<br>Cette action est irr&eacute;versible.",
		"date_event"          : "&Ecirc;tes-vous certaine de vouloir supprimer cet &eacute;v&egrave;nement&nbsp;?<br>Cette action est irr&eacute;versible.",
		"account_articles"    : {
			"input_p"           : "Supprime d&eacute;finitivement tous %1 articles%2.",
			"label_p"           : "Supprimer tous %1 articles%2",
			"helpz_p"           : "Si coch&eacute;, tous %1 articles en ligne, en cours de validation et les brouillons%2 seront d&eacute;finitivement supprim&eacute;s. Si d&eacute;coch&eacute;, tous les articles en ligne seront affect&eacute;s au compte global Les Ourses &agrave; plumes et resteront accessibles depuis le site."
		}
	},
	"confirm_remove_p"      : "&Ecirc;tes-vous certaine de vouloir retirer %1&nbsp;?",
	"confirm_delete_p"      : "&Ecirc;tes-vous certaine de vouloir supprimer %1&nbsp;?<br>Cette action est irr&eacute;versible.",
	"removed_p"             : "%1 <strong>%2</strong> retir&eacute%3;&nbsp;!",
	"deleted_p"             : "%1 <strong>%2</strong> supprim&eacute%3;&nbsp;!",
	"sumething_weird"       : "Un esp&egrave;ce de truc vraiment chelou s&rsquo;est produit. Veuillez &eacute;teindre votre ordinateur et faire le poirier en attendant les secours."
};

/* Navigation */
$nav = {
	"account_list"          : {"url" : "/comptes",                 "title" : "Lister les comptes"},
	"account_create"        : {"url" : null,                       "title" : "Ajouter un compte"},
	"account_edit"          : {"url" : "/parametres/compte",       "title" : "Mon compte"},
	"agenda"                : {"url" : "/agenda",                  "title" : "Agenda"},
	"agenda_edit"           : {"url" : "/parametres/agenda",       "title" : "Modifier l'agenda"},
	"online_article_list"   : {"url" : "/articles",                "title" : "Tous les articles"},
	"draft_article_list"    : {"url" : "/parametres/articles",     "title" : "Mes articles"},
	"dashboard_stats"       : {"url" : "/parametres/statistiques",  "title" : "Statistiques"},
	"article_view"          : {"url" : null,                       "title" : null},
	"article_add"           : {"url" : "/articles/nouveau",        "title" : "Écrire un article"},
	"article_edit"          : {"url" : null,                       "title" : "Modifier un article"},
	"folder_view"           : {"url" : null,                       "title" : "Dossiers"},
	"folder_edit"           : {"url" : null,                       "title" : "Modifier les dossiers"},
	"bug_report"            : {"url" : "/bug/nouveau",             "title" : "Signaler un bug"},
	"password_reset"        : {"url" : "/parametres/motdepasse",   "title" : "Réinitialiser son mot de passe"},
	"contact"               : {"url" : null,                       "title" : "Nous contacter"},
	"error"                 : {"url" : null,                       "title" : "Erreur"},
	"home"                  : {"url" : "/",                        "title" : "Accueil"},
	"login"                 : {"url" : "/connexion",               "title" : "Connexion"},
	"partners"              : {"url" : null,                       "title" : "Nos copines"},
	"profile_view"          : {"url" : null,                       "title" : null},
	"profile_edit"          : {"url" : "/parametres/profil",       "title" : "Mon profil"},
	"faq"                   : {"url" : "/faq",                     "title" : "FAQ"},
	"faq_edit"              : {"url" : "/parametres/faq",          "title" : "FAQ"},
	"thanks"                : {"url" : "/remerciements",           "title" : "Remerciements"},
	"legal_notice"          : {"url" : "/service/mentions",        "title" : "Mentions légales"},
	"terms_of_use"          : {"url" : "/service/utilisation",     "title" : "Conditions d'utilisation"},
	"privacy_policy"        : {"url" : "/service/confidentialite", "title" : "Politique de confidentialité"},
	"password_renew"        : {"url" : null,                       "title" : "Renouveller son mot de passe"}
};

/* Preferences */
$prefs = {
	"app_conf"              : "oursesUserPrefsAppConf",           // String   Local storage key of the application configuration user preferences. Default : "oursesUserPrefsAppConf"
	"articles_filters"      : "oursesUserPrefsFiltersArticles"    // String   Local storage key of the articles filters user preferences. Default : "oursesUserPrefsFiltersArticles"
};

/* Regular Expressions */
$regx = {
	/* -------------------------------------------------------------------
	 * ! Multiple parts template pattern
	 * -------------------------------------------------------------------
	 * expression used to delimitate multiple templates from one file
	 * will return a compilation function appended to file_pool on launch
	 * {{% template_name}}
	 *   template_content
	 * {{%}}
	 * document.write(file_pool.template_name(data));
	 */
	"mptl" : /\t*\{\{%\s(\S+)\s?\}\}[\r|\n]?([\s\S]+?)[\r|\n]?\t*\{\{%\}\}/gim, // Regexp
	/* -------------------------------------------------------------------
	 * ! Email address regular expression syntax
	 * -------------------------------------------------------------------
	 * local part = accept any char separated by dot not including whitespaces, quotation marks, parenthesis, slashes, brackets, commas or arobase
	 * second-level domain = at least one defined, max two defined, no length restriction
	 * top-level domain = must be defined, min one char, max four chars
	 */
	"email" : /^(([^\s\"\'\(\)\[\]\/\\<>,;:@\.]+\.?)?[^\s\"\'\(\)\[\]\/\\<>,;:@\.])+@([\w\d]+\.){1,2}[\w\d]{1,4}$/i, // Regexp
	/* -------------------------------------------------------------------
	 * ! Tags input accepted characters list (used in article-edit.js)
	 * -------------------------------------------------------------------
	 * below is the allowed chars pattern ; anything else will be considered has illegal
	 */
	"tags" : /[^\w\d\s\+\-\:\%\&\€\?\!\'\’\éêèëàâäùûüîïôœ]+/i // Regexp
};

/* Characters */
$chars = {
	"illegal" : {
		"&" : "&amp;",
		"(<{2,3}|-{1,2}<|={1,2}<)" : "&larr;",
		"(>{2,3}|-{1,2}>|={1,2}>)" : "&rarr;",
		"<" : "&lt;",
		">" : "&gt;"
	},
	"format_enc" : {
		"(http://[^\\s\\r\\n\\t\\f]*)" : "<a href=$1 target=_blank>$1</a>",
		"\\*([^\\*]*)\\*" : "<strong>$1</strong>",
		"\\^([^\\^]*)\\^" : "<em>$1</em>",
		"~([^~]*)~" : "<del>$1</del>"
	},
	"format_dec" : {
		"<a[^>]*>([^<]*)<\\/a>" : "$1",
		"<strong>([^<]*)<\\/strong>" : "*$1*",
		"<em>([^<]*)<\\/em>" : "^$1^",
		"<del>([^<]*)<\\/del>" : "~$1~"
	},
	"punctuation" : {
		'"\'(\\S)' : "&laquo;&#8239;$1",
		'(\\S)\'"' : "$1&#8239;&raquo;",
		"(\\S)'(\\S)" : "$1&rsquo;$2",
		"'(\\S)" : "&lsquo;$1",
		"(\\S)'" : "$1&rsquo;",
		'"(\\S)' : "&ldquo;$1",
		'(\\S)"' : "$1&rdquo;",
		"(\\w)\\s?:\\s" : "$1&#8239;: ",
		"\\s!" : "&nbsp;!",
		"\\s\\?" : "&nbsp;?",
		"\\.\\.\\." : "&hellip;",
		"--" : "&mdash;",
		"-" : "&ndash;"
	},
	"diacritical" : {
		"à" : "&agrave;",
		"À" : "&Agrave;",
		"â" : "&acirc;",
		"Â" : "&Acirc;",
		"ä" : "&auml;",
		"Ä" : "&Auml;",
		"ç" : "&ccedil;",
		"Ç" : "&Ccedil;",
		"é" : "&eacute;",
		"É" : "&Eacute;",
		"è" : "&egrave;",
		"É" : "&Eacute;",
		"ê" : "&ecirc;",
		"Ê" : "&Ecirc;",
		"ë" : "&euml;",
		"Ë" : "&Euml;",
		"î" : "&icirc;",
		"Î" : "&Icirc;",
		"ï" : "&iuml;",
		"Ï" : "&Iuml;",
		"ô" : "&ocirc;",
		"Ô" : "&Ocirc;",
		"ö" : "&ouml;",
		"Ö" : "&Ouml;",
		"ù" : "&ugrave;",
		"Ù" : "&Ugrave;",
		"û" : "&ucirc;",
		"Û" : "&Ucirc;",
		"ü" : "&uuml;",
		"Ü" : "&Uuml;",
		"ae" : "&aelig;",
		"Ae" : "&AElig;",
		"oe" : "&oelig;",
		"Oe" : "&OElig;"
	}
};

/* REST */
$rest = {
	"authc"                 : "/rest/authc/connected",            // String   URL for REST service connected. Default : "/rest/authc/connected"
	"admin"                 : "/rest/authz/isadmin",              // String   URL for REST service isadmin. Default : "/rest/authz/isadmin"
	"redac"                 : "/rest/authz/isredac"               // String   URL for REST service isredac. Default : "/rest/authz/isredac"
};

/* ------------------------------------------------------------------ */
/* # Prebuild processing */
/* ------------------------------------------------------------------ */

/* Prebuild vars */
var head_tags = [
	// -------------------------------------------------------------------
	// # Meta Charset
	// -------------------------------------------------------------------
	{elem: "meta", attr: {charset: "utf-8"}},
	// -------------------------------------------------------------------
	// # Meta Viewport
	// -------------------------------------------------------------------
	{elem: "meta", attr: {name: "viewport", content: "width=device-width, initial-scale=1.0"}},
	// -------------------------------------------------------------------
	// # Meta Indexing * UNUSED
	// -------------------------------------------------------------------
	// {elem: "meta", attr: {name: "author", content: $org.name}},
	// {elem: "meta", attr: {name: "application-name", content: $app.name}},
	// {elem: "meta", attr: {name: "generator", content: $app.genr}},
	// {elem: "meta", attr: {name: "keywords", content: $app.kwd.toString()}},
	// -------------------------------------------------------------------
	// # Meta Description (used by crawlers)
	// -------------------------------------------------------------------
	{elem: "meta", attr: {name: "description", content: $app.desc}},
	// -------------------------------------------------------------------
	// # Meta Open Graph
	// -------------------------------------------------------------------
	{elem: "meta", attr: {property: "og:url", content: $org.domain}},
	{elem: "meta", attr: {property: "og:title", content: $org.name}},
	{elem: "meta", attr: {property: "og:image", content: $org.domain + $img.pub + "loap_share_picture.jpg"}},
	{elem: "meta", attr: {property: "og:description", content: $app.desc}},
	// -------------------------------------------------------------------
	// # Meta Twitter
	// -------------------------------------------------------------------
	{elem: "meta", attr: {name: "twitter:card", content: "summary_large_image"}},
	{elem: "meta", attr: {name: "twitter:site", content: "@OursesaPlumes"}},
	{elem: "meta", attr: {name: "twitter:image:src", content: $org.domain + $img.pub + "loap_share_picture.jpg"}},
	{elem: "meta", attr: {name: "twitter:description", content: $app.desc}},
	// -------------------------------------------------------------------
	// # Document Title
	// -------------------------------------------------------------------
	{elem: "title", text: $org.name},
	// -------------------------------------------------------------------
	// # Document Favicon
	// -------------------------------------------------------------------
	{elem: "link", attr: {href: $img.ui + "icon-loap.png", rel: "icon", type: "image/x-icon"}},
];
var body_tags = [];
if (isFileProtocol) {
	var head_tags_ext = [
		{elem: "link", attr: {href: $loc.css + "foundation.css", rel: "stylesheet"}},
		{elem: "link", attr: {href: $loc.css + "loap.css", rel: "stylesheet"}},
		{elem: "link", attr: {href: $loc.css + "dev.css", rel: "stylesheet"}},
		{elem: "script", attr: {src: $loc.js + "modernizr/modernizr" + $conf.lib_ext +".js"}},
		{elem: "script", attr: {src: $loc.js + "jquery/jquery-2.x" + $conf.lib_ext + ".js"}},
		{elem: "script", attr: {src: $loc.js + "jquery/jquery.autosize" + $conf.lib_ext + ".js"}},
		{elem: "script", attr: {src: $loc.js + "dot/dot" + $conf.lib_ext + ".js"}},
		{elem: "script", attr: {src: $loc.js + "conf-dot.js"}},
		{elem: "script", attr: {src: $loc.js + "cookies.js"}},
	];
	head_tags = head_tags.concat(head_tags_ext);
	body_tags = [
		{elem: "script", attr: {src: $loc.js + "dev.js"}},
		{elem: "script", attr: {src: $loc.js + "loap.js"}},
		{elem: "script", attr: {src: $loc.js + "foundation/foundation.lib.js", defer: "true" }},
	];
}

/* Prebuild methods */
function p_char(n, c) { // Print Character (n.b. for local use only)
	var s = "";
	if (!$build.compress) {
		for (var i = 0; i < n; i++) {s += c}
	}
	return s;
}

function tb(n, c) { // Tabulation (alias)
	var n = n || 1, c = c || "\t";
	return p_char(n, c);
}

function lb(n, c) { // Line Break (alias)
	var n = n || 1, c = c || "\n";
	return p_char(n, c);
}

function b_html(array) { // Build HTML Elements
	var str = "";
	for (index in array) {
		str += lb() + tb(2) + "<" + array[index].elem;
		for (param in array[index].attr) {
			if (array[index].attr[param] != null) {
				str += " " + param + "='" + array[index].attr[param] + "'";
			}
		}
		str += ">";
		if (typeof array[index].text !== "undefined") {
			str += array[index].text;
		}
		if (array[index].elem == "script") {
			str += "</script>";
		} else if (array[index].elem == "title") {
			str += "</title>";
		}
	}
	return str;
}

function load(script) { // Define Postbuild Processing
	if (typeof script !== "undefined") {
		if (typeof script == "string") {
			body_tags.splice(0, 0, {elem: "script", attr: {src: $loc.js + script}});
		} else if (typeof script == "object") {
			for (k in script) {
				body_tags.splice(0, 0, {elem: "script", attr: {src: $loc.js + script[k]}});
			}
		}
	}
	document.write(b_html(body_tags));
}

/* Process Prebuild */
document.write(b_html(head_tags));

/* ------------------------------------------------------------------ */
/* # XMLHttpRequest */
/* ------------------------------------------------------------------ */
/*
 * WARNING 
 * Below is an extension of XmlHttpRequest object's protoype.
 * It is just a custom sendAsBindary method for domain purpose.
 */

XMLHttpRequest.prototype.sendAsRawData = function(sData) {
	var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
	for (var nIdx = 0; nIdx < nBytes; nIdx++) {
		ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
	}
	this.send(ui8Data);
};

/*
 * NOTE
 * Below is a simple HTTP file request object.
 */

function getXHR() {
	if (typeof XMLHttpRequest !== "undefined") {
		if (isFileProtocol && navigator.appName == "Microsoft Internet Explorer") {
			return new ActiveXObject("Microsoft.XMLHTTP") // Internet Explorer > 9 from local files
		} else {
			return new XMLHttpRequest(); // Firefox, Chrome, Opera
		}
	} else if (typeof ActiveXObject !== "undefined") {
		return new ActiveXObject("Microsoft.XMLHTTP"); // Internet Explorer < 9
	} else {
		console.log("File loading failed. XMLHttpRequest and ActiveXObject deactivated or not supported.");
	}
}

/*
 * NOTE
 * Below is a simple synchronous file loader.
 * The function has been named accordingly to doT.js
 */

function loadfile(url, callback) {
	var callback = callback || function(response) {return response};
	var xhr = getXHR();
	if (typeof xhr !== "undefined") {
		xhr.open("GET", url, true); // define request arguments
		xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); // set request MIME type
		if (navigator.appName != "Microsoft Internet Explorer" && xhr.overrideMimeType) { // request plain text for any browser except IE
			xhr.overrideMimeType("text/plain"); // prevent request header bugs
		}
		if (navigator.appName == "Microsoft Internet Explorer" || !xhr.addEventListener) { // if IE then use onreadystatechange() instead of addEventListener and .responseText instead of .response
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && (isFileProtocol || xhr.status == 200)) {
					callback(xhr.responseText);
				}
			}
		} else { // should be ok on any other browser
			xhr.addEventListener("load", function() {
				if (this.readyState == 4 && (isFileProtocol || this.status == 200)) {
					callback(this.response);
				}
			}, false);
		}
		try {
			xhr.send(); // send request to server
		} catch(err) {
			console.log(url + " not found.\n" + err); // log server error
			callback(""); // return empty -- if no file is found, then nothing will be processed but the script execution won't be stopped
		}
	}
}

/* ------------------------------------------------------------------ */
/* # Security */
/* ------------------------------------------------------------------ */

/* Declare web storage support */
var hasStorage = (function() {
	return typeof window.localStorage !== "undefined" ? true : false;
}());

/* Clear user local storage from registred globals */
function clearStorage(hash) {
	var hash = hash || $auth;
	for (n in hash) {
		localStorage.removeItem(hash[n]);
	}
}

/*
 * NOTE
 * Les fonctions ci-dessous contrôlent l'authentification du client.
 * Elles doivent être invoquées avant le chargement du contenu protégé.
 *
 * WARNING
 * À appeler en HTTPS pour ne pas transporter le token en clair.
 */

function checkAuthz(url, redir, flush) {
	var url = url || $rest.authc, redir = redir || false, flush = flush || false;
	var xhr = getXHR();
	if (typeof xhr !== "undefined") {
		var loc = window.location.pathname;
		xhr.open("GET", url, false); // define request arguments
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // set request MIME type
		xhr.setRequestHeader("Authorization", UserSession.getUserToken()); // set authc token
		try {
			xhr.send(null); // send request to server
			if (xhr.status == 401) {
				console.log("Unauthorized ! Redirect to the login page."); // unauthorized
				if (redir) { window.location.href = $nav.login.url + $conf.redir_param + loc }
				if (flush) { clearStorage() }
			} else if (xhr.status == 403) {
				console.log("Forbidden ! Redirect to the home page."); // forbidden
				if (redir) { window.location.href = $nav.home.url }
			}
		} catch(err) { console.log("HTTP request failed.\n" + err) } // log server error
	} else { console.log("XMLHttpRequest not supported.") } // log client error
}
function checkAuth() {
	checkAuthz(null, true, true);
}
function checkRole(role) {
	var url = (role == $conf.role_admin ? $rest.admin : $rest.redac);
	checkAuthz(url, true, true);
}
