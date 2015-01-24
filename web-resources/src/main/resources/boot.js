/**
 * Les Ourses à plumes
 * Javascript Loader
 * No dependency
 * ver. 1.0.3
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
	"d_name"             : "http://www.ourses-plumes.org/",       // String   Organization domain name.
	"mail"               : "mailto:oursesaplumes@gmail.com",      // String   Organization mail.
	"newsletter"         : null,                                  // String   Organization newsletter.
	"mailinglist"        : null,                                  // String   Organization mailinglist.
	"twitter"            : "https://twitter.com/OursesaPlumes",
	"facebook"           : "https://www.facebook.com/pages/Les-Ourses-%C3%A0-plumes/223829591145074",
	"wordpress"          : "http://incubateurdesourses.wordpress.com/"
};

/* Application */
$app = {
	"name"               : "Webzine féministe",                   // String   Application name.
	"ver"                : "1.0.3",                               // String   Application version.
	"stage"              : "dev",                                 // String   Application stage. Allowed values are "dev" or "rtw" (release to web).
	"kwd"                : ["Webzine", "Féminisme"],              // Array    Application key words for browsers.
	"desc"               : "Un webzine féministe.",               // String   Application description for browsers.
	"genr"               : null,                                  // String   Application generator name for browsers (i.e. the software used for building the application).
	"root"               : isFileProtocol ? "" : "/",             // String   Application base URL. Default : "/"
};

/* Authentication */
$auth = {
	"token"              : "oursesAuthcToken",                    // String   Local storage key of the authentication token. Default : "oursesAuthcToken"
	"user_name"          : "oursesUserPseudo",                    // String   Local storage key of the user name. Default : "oursesUserPseudo"
	"user_role"          : "oursesUserRole",                      // String   Local storage key of the user role. Default : "oursesUserRole"
	"account_id"         : "oursesAccountId",                     // String   Local storage key of the user account id. Default : "oursesAccountId"
	"profile_id"         : "oursesProfileId",                     // String   Local storage key of the user profile id. Default : "oursesProfileId"
	"avatar_path"        : "oursesAvatarPath",                    // String   Local storage key of the avatar path. Default : "oursesAvatarPath"
};

/* Build */
$build = {
	"compress"           : $app.stage == "rtw" ? true : false,    // Boolean  Compress generated content (i.e. remove tabs and line ends). Default : true
	"toolbar"            : $app.stage == "rtw" ? false : true,    // Boolean  Create dev toolbar. Default : false
	"container"          : true,                                  // Boolean  Generate container elements (i.e. sidebar, header, footer). Default : true
	"icons"              : true,                                  // Boolean  Create SVG icons. Default : true
	"slider"             : false,                                 // Boolean  Create Foundation orbit slider. Default : true
};

/* Configuration */
$conf = {
	"free_log"           : $app.stage == "dev" ? true : false,    // Boolean  Disable abide validation for logger. Default : false
	"lib_ext"            : $app.stage == "dev" ? "" : ".min",     // String   JS libraries additional extension. Default : ".min"
	"css_debug"          : false,                                 // Boolean  Enable CSS debug on HTML elements (i.e. show background masks for all pages). Default : false
	"css_fx"             : true,                                  // Boolean  Enable CSS effects on HTML elements (i.e. multiple backgrounds, transitions, animations, box shadows, text shadows and ribbons). Default : true
	"svg_fx"             : true,                                  // Boolean  Enable SVG effects on icons (i.e. blur, glow, shadow and bevel). Default : true
	"js_fx"              : true,                                  // Boolean  Enable fading, sliding and scrolling effects through script (like jQuery.fx.off). Default : true
	"page_title"         : true,                                  // Boolean  Display page title. If set to 'false' the organization name only will appear in the title bar. Default : true
	"redir_param"        : "?redirection=",                       // String   Parameter added to the login page URL for the redirection. Default : "?redirection="
	"role_admin"         : "admin",                               // String   Administrator user level access key. Default : "admin"
	"role_redac"         : "writer"                               // String   Moderator user level access key. Default : "writer"
}

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
	"upperCaseMonths" : [
		"Janvier",                                                  // String   Set January literal.
		"Février",                                                  // String   Set February literal.
		"Mars",                                                     // String   Set March literal.
		"Avril",                                                    // String   Set April literal.
		"Mai",                                                      // String   Set May literal.
		"Juin",                                                     // String   Set June literal.
		"Juillet",                                                  // String   Set July literal.
		"Août",                                                     // String   Set August literal.
		"Septembre",                                                // String   Set September literal.
		"Octobre",                                                  // String   Set October literal.
		"Novembre",                                                 // String   Set November literal.
		"Décembre"   
	],
	"duration" : {                                                // Object   Global durations.
		"fx"          : 500,                                        // Integer  Effects duration in milliseconds. Default : 500
		"alert"       : 2500,                                       // Integer  Alerts duration in milliseconds. Default : 2500
		"check"       : 1000,                                       // Integer  Check duration in milliseconds. Default : 1000
		get fx_short() {return this.fx / 2},                        // Function Return short effects duration. Default {return this.fx / 2}
		get fx_long() {return this.fx * 2},                         // Function Return long effects duration. Default {return this.fx * 2}
		get alert_short() {return this.alert / 2},                  // Function Return short alert duration. Default {return this.alert / 2}
		get alert_long() {return this.alert * 2}                    // Function Return long alert duration. Default {return this.alert * 2}
	}
}

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
}

/* Files */
$file = {
	"icons"                 : $img.ui + "ui-iconset.svg",         // String   Store URL of SVG icons file. Default : "/img/ui/ui-iconset.svg"
	"icons_fx"              : $loc.css + "icons-fx.css"           // String   Store URL of SVG icons effects file. Default : "/css/icons-fx.css"
};

/* Messages */
$msg = {
	"error"                 : "Une erreur technique s&rsquo;est produite. Veuillez pr&eacute;venir l&rsquo;administateur du site.",
	"saving"                : "Enregistrement&hellip;",
	"checking"              : "V&eacute;rification&hellip;",
	"connected"             : "Vous avez &eacute;t&eacute; connect&eacute;e au serveur.", // <br>Un rafra&icirc;chissement de la page peut &ecirc;tre n&eacute;cessaire.
	"disconnected"          : "Vous avez &eacute;t&eacute; d&eacute;connect&eacute;e du serveur.", // <br>Veillez &agrave; enregistrer toute modification en cours avant de rafra&icirc;chir la page.
	"user_connected"        : "Vous &ecirc;tes maintenant connect&eacute;e.",
	"user_disconnected"     : "Vous &ecirc;tes maintenant d&eacute;connect&eacute;e.",
	"session_expired"       : "Votre session a expir&eacute; et vous avez &eacute;t&eacute; d&eacute;connect&eacute;e du serveur.",
	"tag_dup"               : "Cette &eacute;tiquette a d&eacute;j&agrave; &eacute;t&eacute; choisie.",
	"tag_max"               : "Maximum de tags&thinsp;!",
	"char_illegal"          : "Caract&egrave;re invalide&thinsp;!",
	"form_sent"             : "Le formulaire que vous avez soumis a bien &eacute;t&eacute; envoy&eacute;&thinsp;!",
	"form_valid"            : "Le formulaire que vous avez soumis est correct et a &eacute;t&eacute; envoy&eacute;&thinsp;!",
	"form_invalid"          : "Le formulaire que vous avez soumis est incorrect et n&rsquo;a pas pu &ecirc;tre envoy&eacute;.",
	"form_incomplete"       : "Le formulaire que vous avez soumis est incomplet et n&rsquo;a pas &eacute;t&eacute; envoy&eacute;.",
	"email_dup"             : "Le message a d&eacute;jà &eacute;t&eacute; envoy&eacute; à cette adresse.",
	"email_sent"            : "Le message &eacute;lectronique a correctement &eacute;t&eacute; envoy&eacute;.",
	"email_empty"           : "L&rsquo;adresse &eacute;lectronique est vide&thinsp;&hellip;",
	"email_invalid"         : "L&rsquo;adresse &eacute;lectronique est incorrecte&thinsp;!",
	"account_updated"       : "Compte mis &agrave; jour avec succ&egrave;s",
	"account_deleted"       : "Compte supprim&eacute;&thinsp;!",
	"article_deleted"       : "Cet article n&rsquo;existe plus, il a &eacute;t&eacute; supprim&eacute;.",
	"article_offcheck"      : "Cet article n&rsquo;est plus &agrave; v&eacute;rifier, vous pouvez raffra&icirc;chir la page pour voir les derniers changements.",
	"article_offline"       : "Cet article n&rsquo;est plus en ligne, vous pouvez raffra&icirc;chir la page pour voir les derniers changements.",
	"article_search_empty"  : "Aucun article ne correspond aux crit&egrave;res de recherche.",
	"article_no_filter"     : "Vous n&rsquo;avez aucun filtre s&eacute;lectionn&eacute; pour l&rsquo;affichage des articles.",
	"sumething_weird"       : "Un esp&egrave;ce de truc vraiment chelou s&rsquo;est produit. Veuillez &eacute;teindre votre ordinateur et faire le poirier en attendant les secours."
};

/* Navigation */
$nav = {
	"about"                 : {"url" : "/faq",                 "title" : "FAQ"},
	"account_list"          : {"url" : "/comptes",             "title" : "Lister les comptes"},
	"account_create"        : {"url" : null,                   "title" : "Ajouter un compte"},
	"account_edit"          : {"url" : "/parametres/compte",   "title" : "Mon compte"},
	"agenda"                : {"url" : "/agenda",              "title" : "Agenda"},
	"online_article_list"   : {"url" : "/articles",            "title" : "Tous les articles"},
	"draft_article_list"    : {"url" : "/parametres/articles", "title" : "Mes articles"},
	"article_view"          : {"url" : null,                   "title" : null},
	"article_add"           : {"url" : "/articles/nouveau",    "title" : "Écrire un article"},
	"article_edit"          : {"url" : null,                   "title" : "Modifier un article"},
	"bug_report"            : {"url" : "/bug/nouveau",         "title" : "Signaler un bug"},
	"contact"               : {"url" : null,                   "title" : "Nous contacter"},
	"error"                 : {"url" : null,                   "title" : "Erreur"},
	"home"                  : {"url" : "/",                    "title" : "Accueil"},
	"login"                 : {"url" : "/connexion",           "title" : "Connexion"},
	"partners"              : {"url" : null,                   "title" : "Nos copines"},
	"profile_view"          : {"url" : null,                   "title" : null},
	"profile_edit"          : {"url" : "/parametres/profil",   "title" : "Mon profil"},
	"privacy_policy"        : {"url" : null,                   "title" : "Politique de confidentialité"},
	"terms_of_use"          : {"url" : null,                   "title" : "Conditions d'utilisation"},
	"thanks"                : {"url" : null,                   "title" : "Remerciements"}
};

/* Preferences */
$prefs = {
	"app_conf"              : "oursesUserPrefsAppConf",           // String   Local storage key of the application configuration user preferences. Default : "oursesUserPrefsAppConf"
	"articles_filters"      : "oursesUserPrefsFiltersArticles"    // String   Local storage key of the articles filters user preferences. Default : "oursesUserPrefsFiltersArticles"
};

/* Regular Expressions */
$regx = {
	/* -------------------------------------------------------------------
	 * # Multiple parts template pattern
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
	 * # Email address regular expression syntax
	 * -------------------------------------------------------------------
	 * local part = accept any char separated by dot not including whitespaces, quotation marks, parenthesis, slashes, brackets, commas or arobase
	 * second-level domain = at least one defined, max two defined, no length restriction
	 * top-level domain = must be defined, min one char, max four chars
	 */
	"email" : /^(([^\s\"\'\(\)\[\]\/\\<>,;:@\.]+\.?)?[^\s\"\'\(\)\[\]\/\\<>,;:@\.])+@([\w\d]+\.){1,2}[\w\d]{1,4}$/i, // Regexp
	/* -------------------------------------------------------------------
	 * # Tags accepted characters list
	 * -------------------------------------------------------------------
	 * below is the allowed chars pattern
	 */
	"tags" : /[^\w\d\s\+\-\:\%\&\€\?\!\'\’\éêèëàâäùûüîïôœ]+/i // Regexp
}

/* REST */
$rest = {
	"authc"                 : "/rest/authc/connected",            // String   URL for REST service connected. Default : "/rest/authc/connected"
	"admin"                 : "/rest/authz/isadmin",              // String   URL for REST service isadmin. Default : "/rest/authz/isadmin"
	"redac"                 : "/rest/authz/isredac"               // String   URL for REST service isredac. Default : "/rest/authz/isredac"
}

/* ------------------------------------------------------------------ */
/* # Prebuild processing */
/* ------------------------------------------------------------------ */

/* Prebuild vars */
var IE_conditional_comments = [
	lb() + tb(3) + "<style type='text/css'>.gradient{filter:none;}</style>"
];
var head_tags = [
	{elem: "meta", attr: {charset: "utf-8"}},
	{elem: "meta", attr: {name: "viewport", content: "width=device-width, initial-scale=1.0"}},
	{elem: "meta", attr: {name: "author", content: $org.name}},
	{elem: "meta", attr: {name: "application-name", content: $app.name}},
	{elem: "meta", attr: {name: "keywords", content: $app.kwd.toString()}},
	{elem: "meta", attr: {name: "description", content: $app.desc}},
	{elem: "meta", attr: {name: "generator", content: $app.genr}},
	{elem: "title", text: $org.name},
	{elem: "link", attr: {href: $img.ui + "icon-loap.png", rel: "icon", type: "image/x-icon"}},
	{elem: "link", attr: {href: $loc.css + "foundation.css", rel: "stylesheet"}},
	{elem: "link", attr: {href: $loc.css + "loap-main.css", rel: "stylesheet"}},
	{elem: "link", attr: {href: $loc.css + "loap-fx.css", rel: "stylesheet"}},
	{elem: "script", attr: {src: $loc.js + "modernizr/modernizr" + $conf.lib_ext +".js"}},
	{elem: "script", attr: {src: $loc.js + "jquery/jquery-2.x" + $conf.lib_ext + ".js"}},
	{elem: "script", attr: {src: $loc.js + "jquery/jquery.autosize" + $conf.lib_ext + ".js"}},
	{elem: "script", attr: {src: $loc.js + "dot/dot" + $conf.lib_ext + ".js"}},
	// -------------------------------------------------------------------
	// NOTE : IE execute in-page script before external scripts ... so in-page customized dot settings are not allowed
	// -------------------------------------------------------------------
	// {elem: "script", text: lb() + tb(3) + "doT.templateSettings.varname = 'data';" + lb() + tb(3) + "doT.templateSettings.strip = false;" + lb() + tb(2)},
	// -------------------------------------------------------------------
	{elem: "script", attr: {src: $loc.js + "conf-dot.js"}}, // IE Fix
	{elem: "!--[lt IE 9]", text: IE_conditional_comments[0] + lb() + tb(2) + "<![endif]-->"}
];
var body_tags = [
	{elem: "script", attr: {src: $loc.js + "loap.js"}},
	{elem: "script", attr: {src: $loc.js + "foundation/foundation.lib.js", defer: "true" }},
];

/* Prebuild methods */
function p_char(n, c) { // Print Character (n.b. for local use only)
	var s = "";
	if ($build.compress == false) {
		for (var i = 0; i < n; i++) {
			s += c;
		}
	}
	return s;
}

function tb(n, c) { // Tabulation (alias)
	var n = n || 1, c = c || "\t"; // default params
	return p_char(n, c);
}

function lb(n, c) { // Line Break (alias)
	var n = n || 1, c = c || "\n"; // default params
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

/* Check if user name is registred in local storage */
function isRegAuthc() {
	if (hasStorage && localStorage.getItem($auth.token) !== null) {
		return true;
	}
}

/* Check if user role is registred as an admin in local storage */
function isRegAdmin() {
	if (hasStorage && localStorage.getItem($auth.user_role) !== null && localStorage.getItem($auth.user_role) == $conf.role_admin) {
		return true;
	}
}

/* Check if user role is registred as a writer in local storage */
function isRegRedac() {
	if (hasStorage && localStorage.getItem($auth.user_role) !== null && localStorage.getItem($auth.user_role) == $conf.role_redac) {
		return true;
	}
}

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
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($auth.token)); // set authc token
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
