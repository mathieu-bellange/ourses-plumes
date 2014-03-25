/*
 * VERSION
 * Les Ourses à plumes
 * Javascript Build
 * Required jQuery Library
 * ver. 0.0.2
 */

/* ------------------------------------------------------------------ */
/* # Tabulation
/* ------------------------------------------------------------------ */
function tab(n=0) {
  var s = new String;
  if (build_compress == false) {
    for (var i = 0; i < n; i++) {
      s += "\t";
    }
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* # Carriage Return Line Feed
/* ------------------------------------------------------------------ */
function ret(n=1, v="\n") {
  var s = new String;
  if (build_compress == false) {
    for (var i = 0; i < n; i++) {
      s += v;
    }
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* # Make List
/* ------------------------------------------------------------------ */
function mk_list(arr, t=0, lst="ul", cls=null, prp=null) {
  var itm = "li";
  var str = tab(t) + "<" + lst;
  // var str = "<" + lst;
  if (cls != null) {
    str += " class='" + cls + "'";
  }
  if (prp != null) {
    str += " " + prp;
  }
  str += ">" + ret();
  for (var i = 0; i < arr.length; i++) {
    str += tab(t+1) + "<" + itm + "";
    if (arr[i].parent_id != null) {
      str += " id='" + arr[i].parent_id + "'";
    }
    if (arr[i].parent_class != null) {
      str += " class='" + arr[i].parent_class + "'";
    }
    if (arr[i].parent_extra != null) {
      str += " " + arr[i].parent_extra;
    }
    str += ">";
    if (arr[i].item_href != null) {
      str += "<a href='" + arr[i].item_href + "'";
      if (arr[i].item_id != null) {
        str += " id='" + arr[i].item_id + "'";
      }
      if (arr[i].item_class != null) {
        str += " class='" + arr[i].item_class + "'";
      }
      if (arr[i].item_extra != null) {
        str += " " + arr[i].item_extra;
      }
      str += ">";
      if (arr[i].text != null) {
        str += arr[i].text;
      }
      str += "</a>";
    } else if (arr[i].item_id != null || arr[i].item_class != null || arr[i].item_extra != null) {
      str += "<span";
      if (arr[i].item_id != null) {
        str += " id='" + arr[i].item_id + "'";
      }
      if (arr[i].item_class != null) {
        str += " class='" + arr[i].item_class + "'";
      }
      if (arr[i].item_extra != null) {
        str += " " + arr[i].item_extra;
      }
      str += ">";
      if (arr[i].text != null) {
        str += arr[i].text;
      }
      str += "</span>";
    } else if (arr[i].text != null) {
      str += arr[i].text;
    }
    if (arr[i].extra != null) {
      str += ret();
      if (arr[i].extra == "headline") {
        str += tab(t+2) + "<div class='orbit-headline text-center'>" + ret();
        if (arr[i].title != null) {
          str += tab(t+3) + "<h1>" + arr[i].title + "</h1>" + ret();
          if (arr[i].subtitle != null) {
            str += tab(t+3) + "<h6>" + arr[i].subtitle + "</h6>" + ret();
          }
        } else if (arr[i].quote != null) {
          str += tab(t+3) + "<blockquote class='text-large'>" + ret() + tab(t+4) + arr[i].quote + ret();
          if (arr[i].cite != null) {
            str += tab(t+4) + "<cite>" + arr[i].cite + "</cite>" + ret();
          }
          str += tab(t+3) + "</blockquote>" + ret();
        }
        str += tab(t+2) + "</div>" + ret() + tab(t+1) + "</" + itm + ">";
      } else if (arr[i].extra == "image") {
        if (arr[i].img_src != null) {
          str += tab(t+2) + "<div class='orbit-image'>" + ret() + tab(t+3) + "<img src='img/" + arr[i].img_src + "'";
          if (arr[i].img_alt != null) {
            str += " alt='" + arr[i].img_alt;
          }
          str += "'>" + ret();
          str += tab(t+2) + "</div>" + ret();
        }
        if (arr[i].caption != null) {
          str += tab(t+2) + "<div class='orbit-caption'>" + ret();
          str += tab(t+3) + arr[i].caption + ret();
          str += tab(t+2) + "</div>" + ret();
        }
        str += tab(t+1) + "</" + itm + ">";
      } else {
        // str += tab(t+2) + arr[i].extra + ret() + tab(t+1) + "</" + itm + ">";
        str += arr[i].extra + ret() + tab(t+1) + "</" + itm + ">";
      }
    } else {
      str += "</" + itm + ">";
    }
    str += ret();
  }
  str += tab(t) + "</" + lst + ">";
  return str;
}

/* ------------------------------------------------------------------ */
/* # Array to String
/* ------------------------------------------------------------------ */
function arr_to_str(arr, div=ret()) {
  str = new String;
  for (var i = 0; i < arr.length; i++) {
    str += arr[i];
    if (i < arr.length - 1) {
      str += div;
    }
  }
  return str;
}

/* ------------------------------------------------------------------ */
/* # Lists */
/* ------------------------------------------------------------------ */
/* Allowed values are :
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

toolbar_css_debug_list = [];
toolbar_css_debug_list[0] = {"item_href" : null_link, "item_id" : "_css_debug_icons_toggle", "text" : "Icons"};
toolbar_css_debug_list[1] = {"item_href" : null_link, "item_id" : "_css_debug_nav_pane_toggle", "text" : "Nav Pane"};
toolbar_css_debug_list[2] = {"item_href" : null_link, "item_id" : "_css_debug_fast_nav_toggle", "text" : "Fast Nav"};
toolbar_css_debug_list[3] = {"item_href" : null_link, "item_id" : "_css_debug_site_nav_toggle", "text" : "Site Nav"};
toolbar_css_debug_list[4] = {"item_href" : null_link, "item_id" : "_css_debug_orbit_slider_toggle", "text" : "Orbit Slider"};
toolbar_css_debug_list[5] = {"item_href" : null_link, "item_id" : "_css_debug_breadcrumbs_toggle", "text" : "Breadcrumbs"};
toolbar_css_debug_list[6] = {"item_href" : null_link, "item_id" : "_css_debug_accessibility_toggle", "text" : "Accessibility"};
toolbar_css_debug_list[7] = {"item_href" : null_link, "item_id" : "_css_debug_user_account_toggle", "text" : "User Account"};
toolbar_css_debug_list[8] = {"item_href" : null_link, "item_id" : "_css_debug_article_toggle", "text" : "Articles"};
toolbar_css_debug_list[9] = {"item_href" : null_link, "item_id" : "_css_debug_articles_list_toggle", "text" : "Articles List"};
toolbar_css_debug_list[10] = {"item_href" : null_link, "item_id" : "_css_debug_comment_list_toggle", "text" : "Comments"};

toolbar_list = [];
toolbar_list[0] = {"item_href" : null_link, "item_extra" : "data-show='kitchen_sink'", "text" : "Kitchen Sink"};
toolbar_list[1] = {"item_href" : null_link, "item_id" : "_null_links_toggle", "text" : "Null Links"};
toolbar_list[2] = {"parent_class" : "has-dropdown", "item_href" : null_link, "text" : "CSS Debug", "extra" : mk_list(toolbar_css_debug_list, 7, "ul", "dropdown")};
toolbar_list[3] = {"item_href" : null_link, "item_id" : "_css_fx_toggle", "text" : "CSS effects"};
toolbar_list[4] = {"item_href" : null_link, "item_id" : "_toolbar_stick_toggle", "text" : "Toolbar"};
toolbar_list[5] = {"item_href" : null_link, "item_class" : "close", "extra" : tab(8) + "<span class='hide'>Close</span>"};

user_nav_list = [];
user_nav_list[0] = {"item_class" : "picture medium", "item_extra" : "data-image='usr/" + user_picture + ".jpg'", "text" : "Image"};
user_nav_list[1] = {"item_href" : null_link, "item_extra" : "data-show='user-profile'", "text" : "Mon profil"};
user_nav_list[2] = {"item_href" : null_link, "item_class" : "disabled", "text" : "R&eacute;diger un article"};
user_nav_list[3] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Publier un article"};
user_nav_list[4] = {"parent_class" : "text-small", "item_href" : null_link, "item_class" : "disabled", "text" : "<s>Modifier les cat&eacute;gories</s>"};
user_nav_list[5] = {"parent_class" : "text-small", "item_href" : null_link, "item_class" : "disabled", "text" : "<s>Modifier les rubriques</s>"};
user_nav_list[6] = {"item_href" : "accounts.html", "item_extra" : "data-show='user-list'", "text" : "Lister les comptes"};
user_nav_list[7] = {"item_href" : "bug-tracker.html", "item_extra" : "data-show='bug-tracker'", "text" : "Signaler un bug"};
user_nav_list[8] = {"parent_class" : "text-large", "item_href" : null_link, "item_class" : "connect-switch no-current red", "text" : "D&eacute;connexion"};

main_nav_sublist = [];
main_nav_sublist[0] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Br&egrave;ves"};
main_nav_sublist[1] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Reportages"};
main_nav_sublist[2] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Dossiers"};
main_nav_sublist[3] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Spotlights"};
main_nav_sublist[4] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Interviews"};
main_nav_sublist[5] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Tribunes"};
main_nav_sublist[6] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Revues du web"};

main_nav_list = [];
main_nav_list[0] = {"item_href" : null_link, "item_extra" : "data-show='home'", "text" : "&Eacute;dito"};
main_nav_list[1] = {"item_href" : null_link, "item_extra" : "data-show='latest'", "text" : "&Agrave; la une"};
main_nav_list[2] = {"item_href" : null_link, "item_extra" : "data-show='articles' data-roll='sub-list'", "text" : "Articles"};
main_nav_list[3] = {"parent_class" : "sub-list", "extra" : tab(7) + "<h5 class='hide'>Cat&eacute;gories</h5>" + ret() + mk_list(main_nav_sublist, 7, "ul", "hide")};
main_nav_list[4] = {"item_href" : null_link, "item_extra" : "data-show='agenda'", "text" : "Agenda"};
main_nav_list[5] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Nos amies"};
main_nav_list[6] = {"item_href" : "mailto:oursesaplumes@gmail.com", "item_class" : "no-current", "text" : "Contact"};

fast_nav_list = [];
fast_nav_list[0] = {"parent_class" : "orange", "item_href" : null_link, "item_class" : "disabled", "text" : "Luttes"};
fast_nav_list[1] = {"parent_class" : "magenta", "item_href" : null_link, "item_class" : "disabled", "text" : "Nos corps, nous-m&ecirc;mes"};
fast_nav_list[2] = {"parent_class" : "red", "item_href" : null_link, "item_class" : "disabled", "text" : "Intersectionnalit&eacute;"};
fast_nav_list[3] = {"parent_class" : "blue", "item_href" : null_link, "item_class" : "disabled", "text" : "International"};
fast_nav_list[4] = {"parent_class" : "cyan", "item_href" : null_link, "item_class" : "disabled", "text" : "&Eacute;ducation &amp; Culture"};
fast_nav_list[5] = {"parent_class" : "yellow", "item_href" : null_link, "item_class" : "disabled", "text" : "Id&eacute;es"};

news_list = [];
news_list[0] = {"parent_class" : null, "extra" : "headline", "title" : org_name, "subtitle" : app_name + " " + app_ver};
news_list[1] = {"parent_class" : "orange", "extra" : "headline", "quote" : "&ldquo;&#8239;Simple, forte, aimant l&rsquo;art et l&rsquo;id&eacute;al, brave et libre aussi, la femme de demain ne voudra ni dominer, ni &ecirc;tre domin&eacute;e.&#8239;&rdquo;", "cite" : "Louise Michel <small>(1830-1905)</small>"};
news_list[2] = {"parent_class" : "black", "extra" : "image", "img_src" : "pub/afp_mlf_1982_paris.jpg", "img_alt" : "AFP MLF 1982 Paris", "caption" : "Manifestation du MLF contre le travail &agrave; temps partiel, 6 mars 1982 &agrave; Paris, AFP-FAGET"};
news_list[3] = {"parent_class" : "magenta", "extra" : "headline", "quote" : "&ldquo;&#8239;F&eacute;minisme. Oui, je crois qu&rsquo;il est convenable, avant que de faire un enfant &agrave; une femme, de lui demander si elle le veut.&#8239;&rdquo;", "cite" : "Jules Renard <small>(1864-1910)</small>"};
news_list[4] = {"parent_class" : "black", "extra" : "image", "img_src" : "pub/afp_femen_2013_madrid.jpg", "img_alt" : "AFP Femen 2013 Madrid", "caption" : "Militantes du Femen devant une &eacute;glise, 23 d&eacute;cembre 2013 &agrave; Madrid, P.-P. Marcou pour AFP"};
news_list[5] = {"parent_class" : "red", "extra" : "headline", "quote" : "&ldquo;&#8239;Un homme sur deux est une femme.&#8239;&rdquo;", "cite" : "Slogan f&eacute;ministe, Ao&ucirc;t 1970"};
news_list[6] = {"parent_class" : "black", "extra" : "image", "img_src" : "pub/gouesse_femmes_solidaires_2011_paris.jpg", "img_alt" : "Gouesse Femmes solidaires 2011 Paris", "caption" : "Femmes solidaires, Journ&eacute;e internationale de la femme, 5 mars 2011 &agrave; Paris, Julien Gouesse"};
news_list[7] = {"parent_class" : "cyan", "extra" : "headline", "quote" : "&ldquo;&#8239;Le nouvel homme a r&eacute;solu &agrave; sa fa&ccedil;on le nouveau partage des t&acirc;ches&#8239;: Occupe-toi de tout et je ferai le reste.&#8239;&rdquo;", "cite" : "Mich&egrave;le Fitoussi, &Eacute;ditorialiste &agrave; Elle"};
news_list[8] = {"parent_class" : "black", "extra" : "image", "img_src" : "pub/mouzon_la_barbe_2012_paris.jpg", "img_alt" : "Mouzon La Barbe 2012 Paris", "caption" : "Action du groupe f&eacute;ministe La Barbe, 14 juillet 2012 &agrave; Paris (Place de la Nation), C&eacute;line Mouzon"};

breadcrumbs_list = [];
breadcrumbs_list[0] = {"parent_class" : "unavailable", "text" : "Les Ourses &agrave; plumes"};
breadcrumbs_list[1] = {"item_href" : null_link, "item_extra" : "data-show='about'", "text" : "&Agrave; propos"};
breadcrumbs_list[2] = {"parent_class" : "current", "item_href" : null_link, "text" : "Avertissement"};

accessibility_list = [];
accessibility_list[0] = {"item_href" : null_link, "item_class" : "icon-textinc small", "text" : "Plus grand"};
accessibility_list[1] = {"item_href" : null_link, "item_class" : "icon-textdec small", "text" : "Plus petit"};
accessibility_list[2] = {"item_href" : "javascript:print()", "text" : "<span class='icon-print small'>Imprimer</span>"};

site_nav_list = [];
site_nav_list[0] = {"item_href" : null_link, "item_extra" : "data-show='about'", "text" : "&Agrave; propos"};
site_nav_list[1] = {"item_href" : null_link, "item_class" : "disabled", "text" : "Mentions l&eacute;gales"};
site_nav_list[2] = {"parent_class" : "no-bullet", "item_href" : "mailto:oursesaplumes@gmail.com", "item_class" : "icon-mail large white disabled", "text" : "Contact"};
site_nav_list[3] = {"parent_class" : "no-bullet", "item_href" : null_link, "item_class" : "icon-twitter large white disabled", "text" : "Twitter"};
site_nav_list[4] = {"parent_class" : "no-bullet", "item_href" : null_link, "item_class" : "icon-facebook large white disabled", "text" : "Facebook"};

/* ------------------------------------------------------------------ */
/* # THE Very Big Mess !!
/* ------------------------------------------------------------------ */

/* Meta Tags */
meta = [
  tab(2) + "<meta name='author' content='" + org_name + "'>",
  tab(2) + "<meta name='application-name' content='" + app_name + "'>",
  tab(2) + "<meta name='keywords' content='" + arr_to_str(app_kwd, ", ") + "'>",
  tab(2) + "<meta name='description' content='" + app_desc + "'>",
  tab(2) + "<meta name='generator' content='" + app_genr + "'>"
];

/* ------------------------------------------------------------------ */

/* Dev Toolbar */
toolbar = [
  tab(2) + "<div id='toolbar' class='hide-for-print hide'>",
  tab(3) + "<div class='top-bar' data-topbar>",
  tab(4) + "<ul class='title-area'>",
  tab(5) + "<li class='name'>",
  tab(6) + "<h1><a href='#toolbar'>Dev Toolbar</a></h1>",
  tab(5) + "</li>",
  tab(4) + "</ul>",
  tab(4) + "<section class='top-bar-section'>", // BUG : Redundant LF Here !! Maybe another Foundation Bullshit ... cf. infra
  tab(5) + "<nav class='toolbar-nav'>",
  mk_list(toolbar_list, 6, "ul", "right"),
  tab(5) + "</nav>",
  tab(4) + "</section>", // BUG : Missing LF here !! Maybe another Foundation Bullshit ... cf. supra
  tab(3) + "</div>",
  tab(2) + "</div>"
];

/* ------------------------------------------------------------------ */

/* Title */
title = [
  tab(3) + "<h1 class='text-center print-only'>Les Ourses &agrave; plumes</h1>",
  tab(3) + "<h4 class='text-center print-only'>http://www.ourses-plumes.fr</h4>"
];

/* Search */
search = [
  tab(4) + "<h4 class='hide'>Recherche</h4>",
  tab(4) + "<div id='_search_form' class='row collapse search'>",
  tab(5) + "<div class='column'>",
  tab(6) + "<input type='text' placeholder='Rechercher&hellip;'>",
  tab(5) + "</div>",
  tab(5) + "<div class='hide'>",
  tab(6) + "<button class='button postfix'>Rechercher</button>",
  tab(5) + "</div>",
  tab(4) + "</div>"
];

/* Logo */
logo = [
  tab(4) + "<div class='logo'>",
  tab(5) + "<a href='#main' data-show='home'><span></span></a>",
  tab(4) + "</div>"
];

/* Connect Launcher */
connect = [
  tab(4) + "<h4 class='connect-launcher'><a href='javascript:void(0);' data-reveal-id='_connect_modal' data-reveal>Connexion</a></h4>"
];

/* Connect Modal */
connect_modal = [
  tab(4) + "<div id='_connect_modal' class='reveal-modal small-modal' data-reveal>",
  tab(5) + "<h4>Se connecter</h4>",
  tab(5) + "<form data-abide>",
  tab(6) + "<fieldset>",
  tab(7) + "<legend>Authentification</legend>",
  tab(7) + "<div class='row collapse'>",
  tab(8) + "<div class='column small-12'>",
  tab(9) + "<input id='user_login' type='text' placeholder='Nom d&rsquo;utilisatrice ou adresse e-mail' required pattern='alpha'>",
  tab(9) + "<small class='error'>Identifiant requis&nbsp;!</small>",
  tab(8) + "</div>",
  tab(8) + "<div class='column small-8'>",
  tab(9) + "<input id='user_password' type='password' placeholder='Mot de passe' required pattern='alpha'>",
  tab(9) + "<small class='error'>Mot de passe requis&nbsp;!</small>",
  tab(8) + "</div>",
  tab(8) + "<div class='column small-4'>",
  tab(9) + "<button class='connect-switch button small postfix'>Connexion</button>",
  tab(8) + "</div>",
  tab(7) + "</div>",
  tab(6) + "</fieldset>",
  tab(5) + "</form>",
  tab(5) + "<a class='close-reveal-modal'></a>",
  tab(4) + "</div>"
];

/* User Nav */
user_nav = [
  tab(4) + "<nav class='user-nav hide'>",
  tab(5) + "<h3 class='hide'>Menu utilisateur</h3>",
  tab(5) + "<h4 class='user-name'>" + user_name + "</h4>",
  mk_list(user_nav_list, 5, "ul", "clearfix"),
  tab(4) + "</nav>",
  tab(4) + "<hr>"
];

/* Main Nav */
main_nav = [
  tab(4) + "<h3 class='hide'>Menu principal</h3>",
  tab(4) + "<h4 class='hide'>Sections</h4>",
  tab(4) + "<nav class='main-nav'>",
  mk_list(main_nav_list, 5),
  tab(4) + "</nav>"
];

sidebar = [
  arr_to_str(title),
  tab(3) + "<aside class='nav-pane text-center hide-for-print'>",
  tab(4) + "<h2 class='hide'>Navigation interne</h2>",
  tab(4) + "<h3 class='hide'>Fonctionnalit&eacute;s</h3>",
  arr_to_str(search),
  arr_to_str(logo),
  arr_to_str(connect),
  arr_to_str(connect_modal), // TEMP
  arr_to_str(user_nav),
  arr_to_str(main_nav),
  tab(3) + "</aside>"
];

/* ------------------------------------------------------------------ */

/* Fast Nav */
fast_nav = [
  tab(5) + "<h5 class='hide'>Rubriques</h5>",
  tab(5) + "<nav class='fast-nav'>",
  mk_list(fast_nav_list, 6, "ul", "inline-list"),
  tab(5) + "</nav>",
  tab(5) + "<hr class='hide'>"
];

/* News List */
news = [
  tab(5) + "<h2 class='hide'>Actualit&eacute,s</h2>",
  tab(5) + "<div class='news-list hide-for-small'>",
  mk_list(news_list, 6, "ol", null, "data-orbit data-options='animation_speed: 375; slide_number_text: sur; slide_number: false; bullets: false; timer: false;'"),
  tab(5) + "</div>",
  tab(5) + "<hr class='hide'>"
];

/* Breadcrumbs */
breadcrumbs = [
  tab(5) + "<h4 class='hide'>Fil d&rsquo;Ariane</h4>",
  mk_list(breadcrumbs_list, 5, "ul", "breadcrumbs"),
];

/* Accessibility */
accessibility = [
  tab(5) + "<h4 class='hide'>Accessibilit&eacute;</h4>",
  tab(5) + "<div class='accessibility'>",
  mk_list(accessibility_list, 6, "ul", "inline-list"),
  tab(5) + "</div>"
];

/* Header */
header = [
  tab(4) + "<header class='header text-center hide-for-print'>",
  arr_to_str(fast_nav),
  arr_to_str(news),
  arr_to_str(breadcrumbs),
  arr_to_str(accessibility),
  tab(4) + "</header>",
  tab(4) + "<hr>"
];

/* ------------------------------------------------------------------ */

/* Site Navigation */
site_nav = [
  tab(5) + "<h2 class='hide'>Navigation externe</h2>",
  tab(5) + "<h3 class='hide'>Menu de site</h3>",
  tab(5) + "<nav class='site-nav'>",
  mk_list(site_nav_list, 6),
  tab(5) + "</nav>"
];

/* Copyright */
copyright = [
  tab(5) + "<div class='end-notes'>Copyright &copy; 2014 Les Ourses &agrave; plumes</div>"
];

/* Footer */
footer = [
  tab(1) + "<hr class='hide'>", // BUG : Inherit tabs from parent - 1 (adjust std - 3)
  tab(4) + "<footer class='footer text-center hide-for-print'>",
  arr_to_str(site_nav),
  arr_to_str(copyright),
  tab(4) + "</footer>",
  tab(3) + "</div>"
];

/* ------------------------------------------------------------------ */
/* # Process Build */
/* ------------------------------------------------------------------ */
$("head meta[name='viewport']").after(ret() + arr_to_str(meta));
$("body").prepend(ret() + arr_to_str(toolbar));
$("#main").prepend(ret() + arr_to_str(sidebar));
$(".main-pane").prepend(ret() + arr_to_str(header));
$(".main-pane").append(arr_to_str(footer));
