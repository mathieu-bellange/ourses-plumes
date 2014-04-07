/**
 * Les Ourses à plumes
 * Javascript Build
 * Require jQuery Library
 * ver. 0.0.2
 */

/* ------------------------------------------------------------------ */
/* # Methods Declaration */
/* ------------------------------------------------------------------ */

function build_user_nav() {
  return doT.compile(loadfile("tmpl/user_nav.tmpl"));
}

function build_connect_form() {
  return doT.compile(loadfile("tmpl/connect_form.tmpl"));
}

/* ------------------------------------------------------------------ */
/* # Build Processing */
/* ------------------------------------------------------------------ */
if ($css_fx == true) {$("body").addClass("css-fx");}

/* NOTE
 * Choice has been made to keep the two first <div> after <body> in
 * HTML files in order to handle none or multiple <section> cases and
 * prevent indent issues. The script seems to work properly that way.
 */

// add classes and attributes to static elements
$("body > div").addClass("frame");
$("body > div").attr("id", "main");
$("body > div > div").addClass("main-pane");

// define data
var header_data = JSON.parse(loadfile("json/header.json"));

// define templates
var toolbar_template = doT.compile(loadfile("tmpl/toolbar.tmpl")),
    sidebar_template = doT.compile(loadfile("tmpl/sidebar.tmpl")),
    header_template = doT.compile(loadfile("tmpl/header.tmpl")),
    footer_template = doT.compile(loadfile("tmpl/footer.tmpl"));

// process templates
if ($dev_toolbar == true) {$("body").prepend(toolbar_template);}
$("#main").prepend(sidebar_template);
$(".main-pane").prepend(header_template(header_data));
$(".main-pane").append(footer_template);
