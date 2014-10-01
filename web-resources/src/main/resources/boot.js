/**
 * Les Ourses à plumes
 * Javascript Loader
 * No dependency
 * ver. 1.0.2
 */

/* ------------------------------------------------------------------ */
/* # Public methods */
/* ------------------------------------------------------------------ */

function isFileProtocol() {
	if (window.location.href.split("/")[0].slice(0,4) === "file") {
		return true;
	}
}

function isLocalHost() {
	if (window.location.hostname === "localhost") {
		return true;
	}
}

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
	"ver"                : "1.0.2",                               // String   Application version.
	"stage"              : "dev",                                 // String   Application stage. Allowed values are "dev", "test" or "rtw" (release to web).
	"kwd"                : ["Webzine", "Féminisme"],              // Array    Application key words for browsers.
	"desc"               : "Un webzine féministe.",               // String   Application description for browsers.
	"genr"               : null,                                  // String   Application generator name for browsers (i.e. the software used for building the application).
	"root"               : isFileProtocol() ? "" : "/",           // String   Application base URL. Default : "/"
};

/* Authentication */
$auth = {
	"token"              : "oursesAuthcToken",                    // String   Local storage key of the authentication token. Default : "oursesAuthcToken"
	"user_name"          : "oursesUserPseudo",                    // String   Local storage key of the user name. Default : "oursesUserPseudo"
	"user_role"          : "oursesUserRole",                      // String   Local storage key of the user role. Default : "oursesUserRole"
	"account_id"         : "oursesAccountId",                     // String   Local storage key of the user account id. Default : "oursesAccountId"
	"profile_id"         : "oursesProfileId",                     // String   Local storage key of the user profile id. Default : "oursesProfileId"
	"avatar_path"        : "oursesAvatarPath",                    // String   Local storage key of the avatar path. Default : "oursesAvatarPath"
	"redir_param"        : "?redirection=",                       // String   Parameter added to the login page URL for the redirection. Default : "?redirection="
	"role_admin"         : "admin",                               // String   Administrator user level access key. Default : "admin"
	"role_redac"         : "writer"                               // String   Moderator user level access key. Default : "writer"
};

/* Build */
$build = {
	"compress"           : $app.stage == "rtw" ? true : false,    // Boolean  Compress generated content (i.e. remove tabs and line ends). Default : true
	"container"          : true,                                  // Boolean  Generate container elements (i.e. sidebar, header, footer). Default : true
	"toolbar"            : $app.stage == "rtw" ? false : true,    // Boolean  Create dev toolbar. Default : false
	"icons"              : true                                   // Boolean  Create SVG icons. Default : true
};

/* Configuration */
$conf = {
	"free_log"           : $app.stage == "dev" ? true : false,    // Boolean  Disable abide validation for logger. Default : false
	"lib_ext"            : $app.stage == "dev" ? "" : ".min",     // String   JS libraries additional extension. Default : ".min"
	"css_fx"             : true,                                  // Boolean  Enable CSS effects on HTML elements (i.e. multiple backgrounds, transitions, animations, box shadows, text shadows and ribbons). Default : true
	"svg_fx"             : true,                                  // Boolean  Enable SVG effects on icons (i.e. blur, glow, shadow and bevel). Default : true
	"js_fx"              : true,                                  // Boolean  Enable fading, sliding and scrolling effects through script (like jQuery.fx.off). Default : true
	"page_title"         : true,                                  // Boolean  Display page title. If set to 'false' the organization name only will appear in the title bar. Default : true
	"null_links"         : "javascript:void(0)"                   // String   Set the hypertext referer for null links. Default : "javascript:void(0)" * UNUSED (for now)
}

/* Constants */
$const = {
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
	]
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
	"tag_dup"               : "Cette &eacute;tiquette a d&eacute;j&agrave; &eacute;t&eacute; choisie.",
	"tag_max"               : "Maximum de tags autoris&eacute;s atteint.",
	"char_illegal"          : "Caract&egrave;re invalide&thinsp;!",
	"form_invalid"          : "Le formulaire que vous avez soumis est invalide et n&rsquo;a pas pu &ecirc;tre envoy&eacute;.",
	"form_incomplete"       : "Le formulaire que vous avez soumis est incomplet et n&rsquo;a pas &eacute;t&eacute; envoy&eacute;.",
	"article_deleted"       : "Cet article n&rsquo;existe plus, il a &eacute;t&eacute; supprim&eacute;.",
	"article_offcheck"      : "Cet article n&rsquo;est plus &agrave; v&eacute;rifier, vous pouvez raffra&icirc;chir la page pour voir les derniers changements.",
	"article_offline"       : "Cet article n&rsquo;est plus en ligne, vous pouvez raffra&icirc;chir la page pour voir les derniers changements.",
	"account_updated"       : "Compte mis &agrave; jour avec succ&egrave;s",
	"sumething_weird"       : "Un esp&egrave;ce de truc vraiment chelou s&rsquo;est produit. Veuillez &eacute;teindre votre ordinateur et faire le poirier en attendant les secours."
};

/* Navigation */
$nav = {
	"about"                 : {"url" : "/faq",               "title" : "FAQ"},
	"account_list"          : {"url" : "/comptes",           "title" : "Lister les comptes"},
	"account_add"           : {"url" : null,                 "title" : "Ajouter un compte"},
	"account_edit"          : {"url" : "/parametres/compte", "title" : "Mon compte"},
	"agenda"                : {"url" : null,                 "title" : "Agenda"},
	"article_list"          : {"url" : "/articles",          "title" : "Tous les articles"},
	"article_view"          : {"url" : null,                 "title" : null},
	"article_add"           : {"url" : "/articles/nouveau",  "title" : "Écrire un article"},
	"article_edit"          : {"url" : null,                 "title" : "Modifier un article"},
	"bug_add"               : {"url" : "/bug/nouveau",       "title" : "Signaler un bug"},
	"contact"               : {"url" : null,                 "title" : "Nous contacter"},
	"error"                 : {"url" : null,                 "title" : "Erreur"},
	"home"                  : {"url" : "/",                  "title" : "Accueil"},
	"login"                 : {"url" : "/connexion",         "title" : "Connexion"},
	"partners"              : {"url" : null,                 "title" : "Nos copines"},
	"profile_view"          : {"url" : null,                 "title" : null},
	"profile_edit"          : {"url" : "/parametres/profil", "title" : "Mon profil"},
	"privacy_policy"        : {"url" : null,                 "title" : "Politique de confidentialité"},
	"terms_of_use"          : {"url" : null,                 "title" : "Conditions d'utilisation"},
	"thanks"                : {"url" : null,                 "title" : "Remerciements"}
};

/* Prefs */
$prefs = {
	"app_conf"              : "oursesUserPrefsAppConf",           // String   Local storage key of the application configuration user preferences. Default : "oursesUserPrefsAppConf"
	"articles_filters"      : "oursesUserPrefsFiltersArticles"    // String   Local storage key of the articles filters user preferences. Default : "oursesUserPrefsFiltersArticles"
};

/* ------------------------------------------------------------------ */
/* # Prebuild processing */
/* ------------------------------------------------------------------ */

/* Prebuild vars */
var IE_conditional_comments = [
	lb() + tb(3) + "<style type='text/css'>.gradient{filter:none;}</style>",
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
	{elem: "link", attr: {href: $loc.css + "normalize.css", rel: "stylesheet"}},
	{elem: "link", attr: {href: $loc.css + "foundation.css", rel: "stylesheet"}},
	{elem: "link", attr: {href: $loc.css + "loap-main.css", rel: "stylesheet"}},
	{elem: "link", attr: {href: $loc.css + "loap-fx.css", rel: "stylesheet"}},
	{elem: "script", attr: {src: $loc.js + "modernizr/modernizr" + $conf.lib_ext +".js"}},
	{elem: "script", attr: {src: $loc.js + "jquery/jquery-2.x" + $conf.lib_ext + ".js"}},
	{elem: "script", attr: {src: $loc.js + "jquery/jquery.autosize" + $conf.lib_ext + ".js"}},
	{elem: "script", attr: {src: $loc.js + "dot/dot" + $conf.lib_ext + ".js"}},
	{elem: "script", attr: {src: $loc.js + "conf-dot.js"}},
	{elem: "!--[lt IE 9]", text: IE_conditional_comments[1] + lb() + tb(2) + "<![endif]-->"},
	{elem: "!--[gt IE 9]", text: IE_conditional_comments[2] + lb() + tb(2) + "<![endif]-->"}
];
var body_tags = [
	{elem: "script", attr: {src: $loc.js + "loap.js"}},
	{elem: "script", attr: {src: $loc.js + "foundation/foundation.lib.js"}},
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
		body_tags.splice(-1, 0, {elem: "script", attr: {src: $loc.js + script}});
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

var xhr = (function() {
	if (typeof XMLHttpRequest !== "undefined") {
		if (isFileProtocol() && navigator.appName == "Microsoft Internet Explorer") {
			return new ActiveXObject("Microsoft.XMLHTTP") // Internet Explorer > 9 from local files
		} else {
			return new XMLHttpRequest(); // Firefox, Chrome, Opera
		}
	} else if (typeof ActiveXObject !== "undefined") {
		return new ActiveXObject("Microsoft.XMLHTTP"); // Internet Explorer < 9
	} else {
		console.log("File loading failed. XMLHttpRequest and ActiveXObject deactivated or not supported.");
	}
}());

/*
 * NOTE
 * Below is a simple synchronous file loader.
 * The function has been named accordingly to doT.js
 */

function loadfile(file, async, method, send, response) {
var async = async || false, method = method || "GET", send = send || null, response = response || "text"; // default params
	if (typeof xhr !== "undefined") {
		xhr.open(method, file, async); // define request arguments
		xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); // set request MIME type
		if (navigator.appName != "Microsoft Internet Explorer") { // request plain text for any browser except IE
			xhr.overrideMimeType("text/plain"); // prevent request header bugs
		}
		try {
			xhr.send(send); // send request to server
		} catch(err) {
			console.log(file + " not found.\n " + err); // log server error
		}
		if (response == "xml") {
			return xhr.responseXML; // return XML response from server
		} else {
			return xhr.responseText; // return Plain Text response from server
		}
	} else {
		console.log(file + " loading failed. XMLHttpRequest not supported."); // log client error
	}
}


function clear_user_info() {
	window.localStorage.removeItem($auth.token);
	window.localStorage.removeItem($auth.user_name);
	window.localStorage.removeItem($auth.user_role);
	window.localStorage.removeItem($auth.account_id);
	window.localStorage.removeItem($auth.profile_id);
	window.localStorage.removeItem($auth.avatar_path);
}

/* ------------------------------------------------------------------ */
/* # Security */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Les fonctions ci-dessous contrôlent l'authentification du client.
 * Elles doivent être invoquées avant le chargement du contenu protégé.
 *
 * WARNING
 * À appeler en HTTPS pour ne pas transporter le token en clair.
 */

function isAuthenticated() {
	if (typeof xhr !== "undefined") {
		var redirection = window.location.pathname;
		xhr.open("GET", "/rest/authc/connected", false); // define request arguments
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // set request MIME type
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($auth.token)); // set authc token
		try {
			xhr.send(null); // send request to server
			if (xhr.status == 401){
				console.log("Unauthorized ! Redirect to the login page."); // unauthorized
				var loginParam = $auth.redir_param + redirection;
				window.location.href = $nav.login.url + loginParam;
				clear_user_info();
			}
		} catch(err) {
			console.log("HTTP request failed.\n " + err); // log server error
		}
	} else {
		console.log("XMLHttpRequest not supported."); // log client error
	}
}

function isAdministratrice() {
	if (typeof xhr !== "undefined") {
		var redirection = window.location.pathname;
		xhr.open("GET", "/rest/authz/isadmin", false); // define request arguments
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // set request MIME type
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($auth.token)); // set authc token
		try {
			xhr.send(null); // send request to server
			if (xhr.status == 401){
				console.log("Unauthorized ! Redirect to the login page."); // unauthorized
				var loginParam = $auth.redir_param + redirection;
				window.location.href = $nav.login.url + loginParam;
				clear_user_info();
			}
			else if (xhr.status == 403){
				console.log("Forbidden ! Redirect to the login page."); // unauthorized
				window.location.href = $nav.home.url;
			}
		} catch(err) {
			console.log("HTTP request failed.\n " + err); // log server error
		}
	} else {
		console.log("XMLHttpRequest not supported."); // log client error
	}
}

function isRedactrice() {
	if (typeof xhr !== "undefined") {
		var redirection = window.location.pathname;
		xhr.open("GET", "/rest/authz/isredac", false); // define request arguments
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // set request MIME type
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($auth.token)); // set authc token
		try {
			xhr.send(null); // send request to server
			if (xhr.status == 401){
				console.log("Unauthorized ! Redirect to the login page."); // unauthorized non connecté
				var loginParam = $auth.redir_param + redirection;
				window.location.href = $nav.login.url + loginParam;
				clear_user_info();
			}
			else if (xhr.status == 403){
				console.log("Forbidden ! Redirect to the login page."); // unauthorized pas les droits requis
				window.location.href = $nav.home.url;
			}
		} catch(err) {
			console.log("HTTP request failed.\n " + err); // log server error
		}
	} else {
		console.log("XMLHttpRequest not supported."); // log client error
	}
}
