/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

set_page_title($nav.home.title);

$("main > header").after(loadfile($loc.tmpl + "index.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// AJAX stuff goes here

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

// vars
var limit_items = 5;
var list_selector = "#changes_list";
var more_selector = "#show_more";
var less_selector = "#show_less";

var index = 0; // internal

$(document).ready(function() {
	$(list_selector + " li:gt(" + (limit_items - 1) + ")").hide();
	if ($(list_selector + " li").length >= limit_items) {
		$conf.js_fx ? $(more_selector).fadeIn(250) : $(more_selector).show();
	}
});

$("html").on("click", more_selector, function() {
	if (!$(list_selector + " li").last().is(":visible")) {
		index += 1;
		if ($conf.js_fx) {
			$(list_selector + " li:lt(" + (limit_items * index + 1) + ")").slideUp(250);
			$(list_selector + " li:gt(" + (limit_items * index - 1) + ")").slideDown(250);
			$(list_selector + " li:gt(" + (limit_items * (index + 1) - 1) + ")").slideUp(250);
		} else {
			$(list_selector + " li:lt(" + (limit_items * index + 1) + ")").hide();
			$(list_selector + " li:gt(" + (limit_items * index - 1) + ")").show();
			$(list_selector + " li:gt(" + (limit_items * (index + 1) - 1) + ")").hide();
		}
	}
	if (($(list_selector + " li").length / limit_items) > (index) && ($(list_selector + " li").length / limit_items) <= (index + 1)) {
		$conf.js_fx ? $(this).fadeOut(250) : $(this).hide();
	}
	if (index > 0) {
		$conf.js_fx ? $(less_selector).fadeIn(250) : $(less_selector).show();
	}
});

$("html").on("click", less_selector, function() {
	if (index == 1) {
		index -= 1;
		if ($conf.js_fx) {
			$(list_selector + " li:lt(" + (limit_items + 1) + ")").slideDown(250);
			$(list_selector + " li:gt(" + (limit_items - 1) + ")").slideUp(250);
			$(this).fadeOut(250);
		} else {
			$(list_selector + " li:lt(" + (limit_items + 1) + ")").show();
			$(list_selector + " li:gt(" + (limit_items - 1) + ")").hide();
			$(this).hide();
		}
	} else if (!$(list_selector + " li").first().is(":visible")) {
		index -= 1;
		if ($conf.js_fx) {
			$(list_selector + " li:lt(" + (limit_items * index + 1) + ")").slideUp(250);
			$(list_selector + " li:gt(" + (limit_items * index - 1) + ")").slideDown(250);
			$(list_selector + " li:gt(" + (limit_items * (index + 1) - 1) + ")").slideUp(250);
		} else {
			$(list_selector + " li:lt(" + (limit_items * index + 1) + ")").hide();
			$(list_selector + " li:gt(" + (limit_items * index - 1) + ")").show();
			$(list_selector + " li:gt(" + (limit_items * (index + 1) - 1) + ")").hide();
		}
	}
	setTimeout(function() {
		if (!$(list_selector + " li").last().is(":visible")) {
			$conf.js_fx ? $(more_selector).fadeIn(250) : $(more_selector).show();
		}
	}, 250);
});
