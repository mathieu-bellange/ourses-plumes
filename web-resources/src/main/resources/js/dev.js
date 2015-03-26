/**
 * Les Ourses à plumes
 * Dev Javascript File
 * Require jQuery Library
 * Require Javascript Main File
 */

/* ------------------------------------------------------------------ */
/* # Toolbar */
/* ------------------------------------------------------------------ */

/* Toolbar Activator */
var toolbar_show = {
	"index" : 0,
	"timer" : NaN,
	"delay" : 500
};
$(document).on("keydown", function(event) {
	if ((event.which == 68 && toolbar_show.index == 0) || (event.which == 69 && toolbar_show.index == 1)) { // D OR E
		toolbar_show.index++;
		toolbar_show.timer = setTimeout(function() {
			toolbar_show.index = 0;
		}, toolbar_show.delay);
	}
	else if (event.which == 86 && toolbar_show.index == 2) { // V
		clearTimeout(toolbar_show.timer);
		if ($("#_toolbar_stick_toggle").hasClass("active")) {
			if ($("#toolbar").hasClass("hide")) {
				$(".frame").css("margin-top", "45px");
			} else {
				$(".frame").css("margin-top", "0");
			}
		}
		$("#toolbar").toggleClass("hide");
		toolbar_show.index = 0;
	} else {
		toolbar_show.index = 0;
	}
});

/* Toolbar Effects Toggler */
$("html").on("click", "#_css_fx_toggle, #_svg_fx_toggle, #_js_fx_toggle", function() {
	$(this).toggleClass("active");
	var str = $(this).attr("id").replace("_toggle", "").cut(1);
	var val = $(this).hasClass("active") ? true : false;
	set_pref($prefs.app_conf, str, val); // set user pref
	$conf[str] = val; // overwrite global conf
});
$("html").on("click", "#_css_fx_toggle", function() {
	$("body").toggleClass("css-fx");
});
$("html").on("click", "#_svg_fx_toggle", function() {
	createAlertBox("Configuration de l&rsquo;affichage modifi&eacute;e. Rechargement de la page n&eacute;cessaire.", "alert_conf", {"class" : "warning", "timeout" : $time.duration.alert});
});

/* Toolbar CSS Debug Toggler */
$("html").on("click", "[id^='_css_debug_']", function() {
	if (!$(this).hasClass("disabled")) {
		$(this).toggleClass("active");
		$("body").toggleClass("css-debug");
	}
});

/* Toolbar Stick Toggler */
$("html").on("click", "#_toolbar_stick_toggle", function() {
	$(this).toggleClass("active");
	$("#toolbar").toggleClass("fixed");
	var n = $(".frame").css("margin-top") != "45px" ? "45px" : 0;
	$(".frame").css("margin-top", n);
});

/* Close Toolbar Toggler */
$("html").on("click", "#toolbar .close", function() {
	if ($(".frame").css("margin-top") != 0) {
		$(".frame").css("margin-top", 0)
	}
	$("#toolbar").addClass("hide");
});
