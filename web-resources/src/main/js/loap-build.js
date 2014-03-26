/*
 * VERSION
 * Les Ourses à plumes
 * Javascript Build
 * Required jQuery Library
 * ver. 0.0.2
 */

/* ------------------------------------------------------------------ */
/* # Public variables initialization */
/* ------------------------------------------------------------------ */
/* Allowed values in lists are :
 * parent_id
 * parent_class
 * parent_extra (e.g. data-topbar)
 * item_href
 * item_id
 * item_class
 * item_extra (e.g. data-show='layer')
 * text
 * extra (e.g. <h4>Title</h4>)
 */

var toolbar_css_debug_list = [
  {item_href: $null_link, item_id: "_css_debug_icons_toggle", text: "Icons"},
  {item_href: $null_link, item_id: "_css_debug_nav_pane_toggle", text: "Nav Pane"},
  {item_href: $null_link, item_id: "_css_debug_fast_nav_toggle", text: "Fast Nav"},
  {item_href: $null_link, item_id: "_css_debug_site_nav_toggle", text: "Site Nav"},
  {item_href: $null_link, item_id: "_css_debug_orbit_slider_toggle", text: "Orbit Slider"},
  {item_href: $null_link, item_id: "_css_debug_breadcrumbs_toggle", text: "Breadcrumbs"},
  {item_href: $null_link, item_id: "_css_debug_accessibility_toggle", text: "Accessibility"},
  {item_href: $null_link, item_id: "_css_debug_user_account_toggle", text: "User Account"},
  {item_href: $null_link, item_id: "_css_debug_article_toggle", text: "Articles"},
  {item_href: $null_link, item_id: "_css_debug_articles_list_toggle", text: "Articles List"},
  {item_href: $null_link, item_id: "_css_debug_comment_list_toggle", text: "Comments"}
];

var toolbar_list = [
  {item_href: $null_link, item_extra: "data-show='kitchen_sink'", text: "Kitchen Sink"},
  {item_href: $null_link, item_id: "_null_links_toggle", text: "Null Links"},
  {parent_class: "has-dropdown", item_href: $null_link, text: "CSS Debug", extra: mk_list(toolbar_css_debug_list, 7, "ul", "dropdown")},
  {item_href: $null_link, item_id: "_css_fx_toggle", text: "CSS effects"},
  {item_href: $null_link, item_id: "_toolbar_stick_toggle", text: "Toolbar"},
  {item_href: $null_link, item_class: "close", extra: tb(8) + "<span class='hide'>Close</span>"}
];

var user_nav_list = [
  {item_class: "picture medium", item_extra: "data-image='usr/" + $user_picture + "'", text: "Image"},
  {item_href: $null_link, item_extra: "data-show='user-profile'", text: "Mon profil"},
  {item_href: $null_link, item_class: "disabled", text: "R&eacute;diger un article"},
  {item_href: $null_link, item_class: "disabled", text: "Publier un article"},
  {parent_class: "text-small", item_href: $null_link, item_class: "disabled", text: "<s>Modifier les cat&eacute;gories</s>"},
  {parent_class: "text-small", item_href: $null_link, item_class: "disabled", text: "<s>Modifier les rubriques</s>"},
  {item_href: "accounts.html", item_extra: "data-show='user-list'", text: "Lister les comptes"},
  {item_href: "bug-tracker.html", item_extra: "data-show='bug-tracker'", text: "Signaler un bug"},
  {parent_class: "text-large", item_href: $null_link, item_class: "connect-switch no-current red", text: "D&eacute;connexion"}
];

var main_nav_sublist = [
  {item_href: $null_link, item_class: "disabled", text: "Br&egrave;ves"},
  {item_href: $null_link, item_class: "disabled", text: "Reportages"},
  {item_href: $null_link, item_class: "disabled", text: "Dossiers"},
  {item_href: $null_link, item_class: "disabled", text: "Spotlights"},
  {item_href: $null_link, item_class: "disabled", text: "Interviews"},
  {item_href: $null_link, item_class: "disabled", text: "Tribunes"},
  {item_href: $null_link, item_class: "disabled", text: "Revues du web"}
];

var main_nav_list = [
  {item_href: $null_link, item_extra: "data-show='home'", text: "&Eacute;dito"},
  {item_href: $null_link, item_extra: "data-show='latest'", text: "&Agrave; la une"},
  {item_href: $null_link, item_extra: "data-show='articles' data-roll='sub-list'", text: "Articles"},
  {parent_class: "sub-list", extra: tb(7) + "<h5 class='hide'>Cat&eacute;gories</h5>" + lb() + mk_list(main_nav_sublist, 7, "ul", "hide")},
  {item_href: $null_link, item_extra: "data-show='agenda'", text: "Agenda"},
  {item_href: $null_link, item_class: "disabled", text: "Nos amies"},
  {item_href: "mailto:oursesaplumes@gmail.com", item_class: "no-current", text: "Contact"}
];

var fast_nav_list = [
  {parent_class: "orange", item_href: $null_link, item_class: "disabled", text: "Luttes"},
  {parent_class: "magenta", item_href: $null_link, item_class: "disabled", text: "Nos corps, nous-m&ecirc;mes"},
  {parent_class: "red", item_href: $null_link, item_class: "disabled", text: "Intersectionnalit&eacute;"},
  {parent_class: "blue", item_href: $null_link, item_class: "disabled", text: "International"},
  {parent_class: "cyan", item_href: $null_link, item_class: "disabled", text: "&Eacute;ducation &amp; Culture"},
  {parent_class: "yellow", item_href: $null_link, item_class: "disabled", text: "Id&eacute;es"}
];

var news_list = [
  {parent_class: null, extra: "headline", title: $org_name, subtitle: $app_name + " " + $app_ver},
  {parent_class: "orange", extra: "headline", quote: "&ldquo;&#8239;Simple, forte, aimant l&rsquo;art et l&rsquo;id&eacute;al, brave et libre aussi, la femme de demain ne voudra ni dominer, ni &ecirc;tre domin&eacute;e.&#8239;&rdquo;", cite: "Louise Michel <small>(1830-1905)</small>"},
  {parent_class: "black", extra: "image", img_src: "pub/afp_mlf_1982_paris.jpg", img_alt: "AFP MLF 1982 Paris", caption: "Manifestation du MLF contre le travail &agrave; temps partiel, 6 mars 1982 &agrave; Paris, AFP-FAGET"},
  {parent_class: "magenta", extra: "headline", quote: "&ldquo;&#8239;F&eacute;minisme. Oui, je crois qu&rsquo;il est convenable, avant que de faire un enfant &agrave; une femme, de lui demander si elle le veut.&#8239;&rdquo;", cite: "Jules Renard <small>(1864-1910)</small>"},
  {parent_class: "black", extra: "image", img_src: "pub/afp_femen_2013_madrid.jpg", img_alt: "AFP Femen 2013 Madrid", caption: "Militantes du Femen devant une &eacute;glise, 23 d&eacute;cembre 2013 &agrave; Madrid, P.-P. Marcou pour AFP"},
  {parent_class: "red", extra: "headline", quote: "&ldquo;&#8239;Un homme sur deux est une femme.&#8239;&rdquo;", cite: "Slogan f&eacute;ministe, Ao&ucirc;t 1970"},
  {parent_class: "black", extra: "image", img_src: "pub/gouesse_femmes_solidaires_2011_paris.jpg", img_alt: "Gouesse Femmes solidaires 2011 Paris", caption: "Femmes solidaires, Journ&eacute;e internationale de la femme, 5 mars 2011 &agrave; Paris, Julien Gouesse"},
  {parent_class: "cyan", extra: "headline", quote: "&ldquo;&#8239;Le nouvel homme a r&eacute;solu &agrave; sa fa&ccedil;on le nouveau partage des t&acirc;ches&#8239;: Occupe-toi de tout et je ferai le reste.&#8239;&rdquo;", cite: "Mich&egrave;le Fitoussi, &Eacute;ditorialiste &agrave; Elle"},
  {parent_class: "black", extra: "image", img_src: "pub/mouzon_la_barbe_2012_paris.jpg", img_alt: "Mouzon La Barbe 2012 Paris", caption: "Action du groupe f&eacute;ministe La Barbe, 14 juillet 2012 &agrave; Paris (Place de la Nation), C&eacute;line Mouzon"}
];

var breadcrumbs_list = [
  {parent_class: "unavailable", text: "Les Ourses &agrave; plumes"},
  {item_href: $null_link, item_extra: "data-show='about'", text: "&Agrave; propos"},
  {parent_class: "current", item_href: $null_link, text: "Avertissement"}
];

var accessibility_list = [
  {item_href: $null_link, item_class: "icon-textinc small", text: "Plus grand"},
  {item_href: $null_link, item_class: "icon-textdec small", text: "Plus petit"},
  {item_href: "javascript:print()", text: "<span class='icon-print small'>Imprimer</span>"}
];

var site_nav_list = [
  {item_href: $null_link, item_extra: "data-show='about'", text: "&Agrave; propos"},
  {item_href: $null_link, item_class: "disabled", text: "Mentions l&eacute;gales"},
  {parent_class: "no-bullet", item_href: "mailto:oursesaplumes@gmail.com", item_class: "icon-mail large white disabled", text: "Contact"},
  {parent_class: "no-bullet", item_href: $null_link, item_class: "icon-twitter large white disabled", text: "Twitter"},
  {parent_class: "no-bullet", item_href: $null_link, item_class: "icon-facebook large white disabled", text: "Facebook"}
];

/* ------------------------------------------------------------------ */
/* # Private variables initialization */
/* ------------------------------------------------------------------ */

/* Dev Toolbar */
var toolbar = [
  tb(2) + "<div id='toolbar' class='hide-for-print'>",
  tb(3) + "<div class='top-bar' data-topbar>",
  tb(4) + "<ul class='title-area'>",
  tb(5) + "<li class='name'>",
  tb(6) + "<h1><a href='#toolbar'>Dev Toolbar</a></h1>",
  tb(5) + "</li>",
  tb(4) + "</ul>",
  tb(4) + "<section class='top-bar-section'>", // BUG : Redundant LF Here !! Maybe another Foundation Bullshit ... cf. infra
  tb(5) + "<nav class='toolbar-nav'>",
  mk_list(toolbar_list, 6, "ul", "right"),
  tb(5) + "</nav>",
  tb(4) + "</section>", // BUG : Missing LF here !! Maybe another Foundation Bullshit ... cf. supra
  tb(3) + "</div>",
  tb(2) + "</div>"
];

/* Title */
var title = [
  tb(3) + "<h1 class='text-center print-only'>Les Ourses &agrave; plumes</h1>",
  tb(3) + "<h4 class='text-center print-only'>http://www.ourses-plumes.fr</h4>"
];

/* Search */
var search = [
  tb(4) + "<h4 class='hide'>Recherche</h4>",
  tb(4) + "<div id='_search_form' class='row collapse search'>",
  tb(5) + "<div class='column'>",
  tb(6) + "<input type='text' placeholder='Rechercher&hellip;'>",
  tb(5) + "</div>",
  tb(5) + "<div class='hide'>",
  tb(6) + "<button class='button postfix'>Rechercher</button>",
  tb(5) + "</div>",
  tb(4) + "</div>"
];

/* Logo */
var logo = [
  tb(4) + "<div class='logo'>",
  tb(5) + "<a href='#main' data-show='home'><span></span></a>",
  tb(4) + "</div>"
];

/* Connect Launcher */
var connect_launcher = [
  tb(4) + "<h4 class='connect-launcher'><a href='javascript:void(0);' data-reveal-id='_connect_modal' data-reveal>Connexion</a></h4>"
];

/* Connect Modal */
var connect_modal = [
  tb(4) + "<div id='_connect_modal' class='reveal-modal small-modal' data-reveal>",
  tb(5) + "<h4>Se connecter</h4>",
  tb(5) + "<a class='close-reveal-modal'></a>",
  tb(4) + "</div>"
];

/* Connect Form */
var connect_form = [
  tb(5) + "<form data-abide>",
  tb(6) + "<fieldset>",
  tb(7) + "<legend>Authentification</legend>",
  tb(7) + "<div class='row collapse'>",
  tb(8) + "<div class='column small-12'>",
  tb(9) + "<input id='user_login' type='text' placeholder='Nom d&rsquo;utilisatrice ou adresse e-mail' required pattern='alpha'>",
  tb(9) + "<small class='error'>Identifiant requis&nbsp;!</small>",
  tb(8) + "</div>",
  tb(8) + "<div class='column small-8'>",
  tb(9) + "<input id='user_password' type='password' placeholder='Mot de passe' required pattern='alpha'>",
  tb(9) + "<small class='error'>Mot de passe requis&nbsp;!</small>",
  tb(8) + "</div>",
  tb(8) + "<div class='column small-4'>",
  tb(9) + "<button class='connect-switch button small postfix'>Connexion</button>",
  tb(8) + "</div>",
  tb(7) + "</div>",
  tb(6) + "</fieldset>",
  tb(5) + "</form>"
];

/* User Nav */
var user_nav = [
  tb(4) + "<nav class='user-nav'>",
  tb(5) + "<h3 class='hide'>Menu utilisateur</h3>",
  tb(5) + "<h4 class='user-name'>" + $user_name + "</h4>",
  mk_list(user_nav_list, 5, "ul", "clearfix"),
  tb(4) + "</nav>"
];

/* Main Nav */
var main_nav = [
  tb(4) + "<hr>",
  tb(4) + "<h3 class='hide'>Menu principal</h3>",
  tb(4) + "<h4 class='hide'>Sections</h4>",
  tb(4) + "<nav class='main-nav'>",
  mk_list(main_nav_list, 5),
  tb(4) + "</nav>"
];

var sidebar = [
  arr_to_str(title),
  tb(3) + "<aside class='nav-pane text-center hide-for-print'>",
  tb(4) + "<h2 class='hide'>Navigation interne</h2>",
  tb(4) + "<h3 class='hide'>Fonctionnalit&eacute;s</h3>",
  arr_to_str(search),
  arr_to_str(logo),
  arr_to_str(connect_launcher), // TEMP
  arr_to_str(connect_modal), // TEMP
  // arr_to_str(user_nav), // TEMP
  arr_to_str(main_nav),
  tb(3) + "</aside>"
];

/* Fast Nav */
var fast_nav = [
  tb(5) + "<h5 class='hide'>Rubriques</h5>",
  tb(5) + "<nav class='fast-nav'>",
  mk_list(fast_nav_list, 6, "ul", "inline-list"),
  tb(5) + "</nav>",
  tb(5) + "<hr class='hide'>"
];

/* News List */
var news = [
  tb(5) + "<h2 class='hide'>Actualit&eacute,s</h2>",
  tb(5) + "<div class='news-list hide-for-small'>",
  mk_list(news_list, 6, "ol", null, "data-orbit data-options='animation_speed: 375; slide_number_text: sur; slide_number: false; bullets: false; timer: false;'"),
  tb(5) + "</div>",
  tb(5) + "<hr class='hide'>"
];

/* Breadcrumbs */
var breadcrumbs = [
  tb(5) + "<h4 class='hide'>Fil d&rsquo;Ariane</h4>",
  mk_list(breadcrumbs_list, 5, "ul", "breadcrumbs"),
];

/* Accessibility */
var accessibility = [
  tb(5) + "<h4 class='hide'>Accessibilit&eacute;</h4>",
  tb(5) + "<div class='accessibility'>",
  mk_list(accessibility_list, 6, "ul", "inline-list"),
  tb(5) + "</div>"
];

/* Header */
var header = [
  tb(4) + "<header class='header text-center hide-for-print'>",
  arr_to_str(fast_nav),
  arr_to_str(news),
  arr_to_str(breadcrumbs),
  arr_to_str(accessibility),
  tb(4) + "</header>",
  tb(4) + "<hr>"
];

/* Site Navigation */
var site_nav = [
  tb(5) + "<h2 class='hide'>Navigation externe</h2>",
  tb(5) + "<h3 class='hide'>Menu de site</h3>",
  tb(5) + "<nav class='site-nav'>",
  mk_list(site_nav_list, 6),
  tb(5) + "</nav>"
];

/* Copyright */
var copyright = [
  tb(5) + "<div class='end-notes'>Copyright &copy; 2014 Les Ourses &agrave; plumes</div>"
];

/* Footer */
var footer = [
  tb(1) + "<hr class='hide'>", // BUG : Inherit tabs from parent - 1 (adjust std - 3)
  tb(4) + "<footer class='footer text-center hide-for-print'>",
  arr_to_str(site_nav),
  arr_to_str(copyright),
  tb(4) + "</footer>",
  tb(3) + "</div>"
];

/* ------------------------------------------------------------------ */
/* # Methods declaration */
/* ------------------------------------------------------------------ */

/* NOTE
 * Below are aliases for global scope calling.
 */
function build_connect_form() {
  return arr_to_str(connect_form);
}
function build_user_nav() {
  return arr_to_str(user_nav);
}

/* ------------------------------------------------------------------ */
/* # Process Build */
/* ------------------------------------------------------------------ */
if ($css_fx == true) {$("body").addClass("css-fx");}

// $("section").before("<div id='main' class='frame'>" + lb() + tb(3) + "<div class='main-pane'>" + lb()); // BUG : tag autoclosure cause misordering
// $("section").after("</div></div>"); // BUG : cf. supra
// $("section").wrap("<div id='main' class='frame'><div class='main-pane'></div></div>"); // BUG : won't work if no or multiple <section>
// $("body").wrapInner("<div id='main' class='frame'><div class='main-pane'></div></div>"); // BUG : body scripts won't be at the bottom anymore
// $("body").prepend("<div id='main' class='frame'><div class='main-pane'>"); // BUG : tag autoclosure cause misordering
// $("body").append("</div></div>"); // BUG : cf. supra

/* NOTE
 * Choice has been made to keep the two first <div> after <body> in
 * HTML files in order to handle none or multiple <section> cases and
 * prevent indent issues. The script seems to work properly that way.
 */
$("body > div").addClass("frame");
$("body > div").attr("id", "main");
$("body > div > div").addClass("main-pane");

if ($dev_toolbar == true) {$("body").prepend(lb() + arr_to_str(toolbar));}
$("#main").prepend(lb() + arr_to_str(sidebar));
$(".main-pane").prepend(lb() + arr_to_str(header));
$(".main-pane").append(arr_to_str(footer));
