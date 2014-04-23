/**
 * Les Ourses à plumes
 * Javascript Main File
 * Require jQuery Library, Includes Build and Core
 * ver. 0.0.3
 */

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */
/* NOTE
 * All instructions that need a refresh should be put below.
 * That is mainly for anything launched by a generated element.
 * It concerns append, prepend, wrap, before, after, insert, html, etc.
 * Anything created after loading. This is an IIFE.
 *
 * Events have to be separatly attached for now and the future
 * to a parent element (i.e. with 'on' or 'live' jQuery methods).
 */

var loap = (function() {
	return {
		init: function() {},
		update: function() {
			/* User Pictures Displayer */
			$("[data-image]").each(function() {
				var file = $(this).attr("data-image");
				var dir = $app_root + "img/";
				$(this).css("background-image", "url('" + dir + file + "')")
			});
		}
	};
}());
// $(document).ready(loap.update()); // TEMP : Launch after loading ; can't make a named function self-executing and reusable

/* ------------------------------------------------------------------ */
/* # Build */
/* ------------------------------------------------------------------ */

// Variables Declaration
var alert_box_template = doT.compile(loadfile($app_root + "tmpl/alert_box.tmpl"));

// Methods Declaration
function build_user_nav() {
	return doT.compile(loadfile($app_root + "tmpl/user_nav.tmpl"));
}

function header_authentication(xhr){
	if (window.localStorage.getItem($oursesAuthcToken) !== undefined){
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($oursesAuthcToken)); // set authc token
	}
}

function ajax_error(jqXHR, textStatus, errorThrown){
	if (jqXHR.status == 401){
		window.location.href = $login_page;
	}
}

// Process build
if ($css_fx == true) {$("body").addClass("css-fx");}

/* NOTE
 * Choice has been made to keep the two first <div> after <body> in
 * HTML files in order to handle none or multiple <section> cases and
 * prevent indent issues. The script seems to work properly that way.
 */

// create HTML skeleton
$("body").prepend("<div id='main' class='frame'>");
$("#main").append("<div class='main-pane'>");
$(".main-pane").append("<hr>");

// process templates
if ($dev_toolbar == true) {$("body").prepend(doT.compile(loadfile($app_root + "tmpl/toolbar.tmpl")));}
$("#main").prepend(doT.compile(loadfile($app_root + "tmpl/sidebar.tmpl")));
$(".main-pane").prepend(doT.compile(loadfile($app_root + "tmpl/header.tmpl")));
$(".main-pane").append(doT.compile(loadfile($app_root + "tmpl/footer.tmpl")));

// process slider template -- this is the tricky part
$(document).ready(function() {
	$(".fast-nav + hr").after(doT.compile(loadfile($app_root + "tmpl/news_list.tmpl")));
	$(".news-list").foundation("orbit"); // reload foundation ; Foundation need to be loaded one time before that for the list to appear inline
	$(window).resize(); // just a dummy instruction for getting the proper height
});

$("html").addClass(""); // TEMP

/* ------------------------------------------------------------------ */
/* # Active Section Toggler */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	var url = window.location.pathname;
	var q = /[a-zA-Z-_]*\.(?:html|htm)/;
	var page = url.match(q);
	var selector = location.hash // assumed it's section id
	if ($(selector).hasClass("hide")) { // Show active section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
	}
});

// Handle inner anchor click event ; need to check history.back() for inner anchors
$("html").on("click", "[href*='#']", function() {
	var arr = $(this).attr("href").split("#");
	var selector = "#" + arr[1];
	if ($(selector).hasClass("hide")) { // Show active section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
}
});

/* ------------------------------------------------------------------ */
/* # Toolbar */
/* ------------------------------------------------------------------ */


/* ================================================================== */
if (typeof $boot !== "undefined") { // TEMP
	/* Toolbar CSS Toggle Checker */
	$(document).ready(function() {
		if ($css_fx == false) {
			$("#_css_fx_toggle").addClass("active");
		}
	});
}
/* ================================================================== */

/* Toolbar Crystal Scheme Toggler */
$("#_crystal_scheme_toggle").click(function() {
	$(this).toggleClass("active");
	$("html").toggleClass("crystal");
});

/* Toolbar Null Links Toggler */
$("#_null_links_toggle").click(function() {
	if (!$(this).hasClass("active")) {
		// Navs
		$("nav ul li .disabled").addClass("not-disabled");
		$("nav ul li[class^='icon-'] .disabled").parent("li").addClass("enabled"); // Navs Icons
		$("nav ul li .disabled").removeClass("disabled");
		// Accessibility Icons
		$(".accessibility ul li .disabled").addClass("enabled");
		$(".accessibility ul li .disabled").addClass("not-disabled");
		$(".accessibility ul li .disabled").removeClass("disabled");
		// Sub Navigation
		$(".sub-nav dd .disabled").addClass("enabled");
		$(".sub-nav dd .disabled").addClass("not-disabled");
		$(".sub-nav dd .disabled").removeClass("disabled");
		// Pagination
		$(".pagination li .disabled").addClass("enabled");
		$(".pagination li .disabled").addClass("not-disabled");
		$(".pagination li .disabled").removeClass("disabled");
	} else {
		// Navs
		$("nav ul li .not-disabled").addClass("disabled");
		$("nav ul li[class^='icon-'] .not-disabled").parent("li").removeClass("enabled"); // Navs Icons
		$("nav ul li .not-disabled").removeClass("not-disabled");
		// Accessibility Icons
		$(".accessibility ul li .not-disabled").addClass("disabled");
		$(".accessibility ul li .not-disabled").removeClass("enabled");
		$(".accessibility ul li .not-disabled").removeClass("not-disabled");
		// Sub Navigation
		$(".sub-nav dd .not-disabled").addClass("disabled");
		$(".sub-nav dd .not-disabled").removeClass("enabled");
		$(".sub-nav dd .not-disabled").removeClass("not-disabled");
		// Pagination
		$(".pagination li .not-disabled").addClass("disabled");
		$(".pagination li .not-disabled").removeClass("enabled");
		$(".pagination li .not-disabled").removeClass("not-disabled");
	}
	$(this).toggleClass("active");
});

/* Toolbar CSS Effects Toggler */
$("#_css_fx_toggle").click(function() {
	$(this).toggleClass("active");
	$("body").toggleClass("css-fx");
});

/* Toolbar CSS Debug Toggler */
$("#_css_debug_icons_toggle").click(function() {
	$(this).toggleClass("active");
	$("[class*='icon-']").toggleClass("css-debug");
});
$("#_css_debug_nav_pane_toggle").click(function() {
	$(this).toggleClass("active");
	$(".nav-pane").toggleClass("css-debug");
});
$("#_css_debug_fast_nav_toggle").click(function() {
	$(this).toggleClass("active");
	$(".fast-nav").toggleClass("css-debug");
});
$("#_css_debug_site_nav_toggle").click(function() {
	$(this).toggleClass("active");
	$(".site-nav").toggleClass("css-debug");
});
$("#_css_debug_orbit_slider_toggle").click(function() {
	$(this).toggleClass("active");
	$(".orbit-container").toggleClass("css-debug");
});
$("#_css_debug_breadcrumbs_toggle").click(function() {
	$(this).toggleClass("active");
	$(".breadcrumbs").toggleClass("css-debug");
});
$("#_css_debug_accessibility_toggle").click(function() {
	$(this).toggleClass("active");
	$(".accessibility").toggleClass("css-debug");
});
$("#_css_debug_user_account_toggle").click(function() {
	$(this).toggleClass("active");
	$("#user-profile").toggleClass("css-debug");
});
$("#_css_debug_article_toggle").click(function() {
	$(this).toggleClass("active");
	$("article").toggleClass("css-debug");
});
$("#_css_debug_articles_list_toggle").click(function() {
	$(this).toggleClass("active");
	$(".articles-list").toggleClass("css-debug");
});
$("#_css_debug_comment_list_toggle").click(function() {
	$(this).toggleClass("active");
	$(".comment-list").toggleClass("css-debug");
});

/* Toolbar Stick Toggler */
$("#_toolbar_stick_toggle").click(function() {
	$(this).toggleClass("active");
	$("#toolbar").toggleClass("fixed");
	if ($("#main").css("margin-top") != "45px") {
		$("#main").css("margin-top", "45px");
	} else {
		$("#main").css("margin-top", 0);
	}
});

/* Close Toolbar Toggler */
$("#toolbar .close").click(function() {
	if ($("#main").css("margin-top") != 0) {
		$("#main").css("margin-top", 0);
	}
	$("#toolbar").addClass("hide");
});

/* ------------------------------------------------------------------ */
/* # Connect */
/* ------------------------------------------------------------------ */

///* Connect Visibility Switcher */
//function connect() {
//
//	// Toggle Launcher Visibility
//	$(".connect-launcher").toggleClass("hide");
//
//
///* ================================================================== */
//	if (typeof $boot !== "undefined") { // TEMP
//		if ($("#main").hasClass("connect")) { // TEMP : Temporary way of holding disconnection ; should delete content and redirect
//			// Destroy User Navigation
//			$(".user-nav").detach();
//		} else {
//			// Build User Navigation
//			$(".nav-pane hr").first().before(build_user_nav());
//			$(".user-nav").foundation();
//			loap.update(); // TEMP TEST
//		}
//	}
///* ================================================================== */
//
//	// Toggle User Navigation Visibility
//	$(".user-nav").toggleClass("hide"); // UNUSED : but provides old visibility toogle method compatibility
//
//	// Set Connect Class
//	$("#main").toggleClass("connect"); // Connection tag -- rather ugly ... better store data or variable
//
//	// Toggle Comment List Editing Features Visibility
//	$(".comment-list .connect").toggleClass("hide");
//	$(".comment-list .reply").toggleClass("hide");
//	if ($(".comment-list .comment .column:nth-child(2)").hasClass("medium-8")) {
//		$(".comment-list .comment .column:nth-child(2)").removeClass("medium-8");
//		$(".comment-list .comment .column:nth-child(2)").addClass("medium-11");
//	} else {
//		$(".comment-list .comment .column:nth-child(2)").removeClass("medium-11");
//		$(".comment-list .comment .column:nth-child(2)").addClass("medium-8");
//	}
//	$(".comment-list .comment .column:nth-child(3)").toggleClass("hide");
//	$(".comment-list .warning").toggleClass("hide");
//
//	// Hide User Connected Sections
//	if (!$("#main").hasClass("connect")) { // TEMP : Temporary way of holding disconnection ; should delete content and redirect
//		$("[id^='user-']").addClass("hide"); // Hide any user-* section
//		$(".user-nav a").removeClass("current"); // Remove current tag for all anchors in user-nav
//		$(".breadcrumbs").empty(); // Clean Breadcrumbs
//		// $("#home").removeClass("hide"); // Show Home
//		// $(".breadcrumbs").append("<li class='unavailable'><a href='javascript:void(0)' data-show='home'>&Eacute;dito</a></li>"); // Append home level 1
//	}
//}

/* Connect Switcher Click Event */
// $(".connect-switch").click(connect); // UNUSED
$("html").on("click", ".connect-switch", connect); // Attach event to html for future elements

/* Connect click Event */
$("#_connect_modal").on("click", function(){
	window.location.href="/connexion";
});


/* ------------------------------------------------------------------ */
/* # Main Navigation */
/* ------------------------------------------------------------------ */

/* Main Navigation Sub List Visibility Toggler */
/*
$(".main-nav [data-roll='sub-list']").mouseenter(function() {
	var handler = $(this);
	handler.data("hover", true);
	main_nav_sub_list_open_timeout = setTimeout(function() {
		if (handler.data("hover") == true) {
			$(".main-nav .sub-list ul").slideDown("fast");
		}
	}, 400);
});
$(".main-nav .sub-list ul").mouseenter(function() {
	$(this).data("hover", true);
});
$(".main-nav").mouseenter(function() {
	clearTimeout(main_nav_sub_list_close_timeout);
});
$(".main-nav").mouseleave(function() {
	main_nav_sub_list_close_timeout = setTimeout(function() {
		if ($(".main-nav .sub-list ul").data("hover") != true) {
			$(".main-nav .sub-list ul").slideUp("fast");
		}
	}, 400);
});
$(".main-nav [data-roll='sub-list']").mouseleave(function() {
	$(".main-nav .sub-list ul").data("hover", false);
	clearTimeout(main_nav_sub_list_open_timeout);
});
$(".main-nav .sub-list ul").mouseleave(function() {
	$(this).data("hover", false);
});
*/

/* ------------------------------------------------------------------ */
/* # Breadcrumbs */
/* ------------------------------------------------------------------ */

function refresh_breadcrumbs(selector) {
	// Selector comes from breadcrumbs
	if (selector.parents("ul").hasClass("breadcrumbs")) {
		var index = ($(".breadcrumbs li").index(selector.parent("li")));
		$(".breadcrumbs li:gt(" + (index) + ")").remove();
		selector.parent("li").addClass("current");
	}
	// Selector comes from a nav
	else if (selector.parent("li").parent("ul").parent().is("nav")) {
		switch(selector.parent("li").parent("ul").parent("nav").attr("class")) {
			case "toolbar-nav":
				var str = "Dev Tools";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
			case "user-nav":
				var str = "Nadejda"; // TEMP : need to retrieve username somehow
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
			case "main-nav":
				$(".breadcrumbs").empty(); // Erase level 1 and above
				// If is sub-list
					// Erase level 2 and above
				break;
			case "fast-nav":
				// Erase level 2 and above
				break;
			case "site-nav":
				var str = "Les Ourses &agrave; plumes";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
		}
		var str = selector.text();
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
	// Selector comes from an articles-list
	else if (selector.parent("div").parent("li").parent("ul").hasClass("articles-list")) {
		switch(selector.parent("div").parent("li").parent("ul").parent("section").attr("id")) {
			case "latest":
				var str = "&Agrave; la une";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
			case "articles":
				var str = "Articles";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
		}
		var str = $("#" + selector.attr("data-show") + " h2 > span").text().slice(0, -1); // TEMP
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
	// Selector comes from user-list
	else if (selector.parents("section").attr("id") == "user-list") {
		$(".breadcrumbs li:last-child").removeClass("current");
		var str = $("#" + selector.attr("data-show") + " h2").text(); // TEMP
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
	// Selector comes from an article
	else if (selector.parents("article").hasClass("article")) {
		$(".breadcrumbs li:last-child").removeClass("current");
		var str = $("#" + selector.attr("data-show") + " h2").text(); // TEMP
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
}

/* ------------------------------------------------------------------ */
/* # Accessibility */
/* ------------------------------------------------------------------ */

$(".accessibility .icon-textinc").click(function() {
	if ($(".accessibility .icon-textdec").hasClass("active")) {
		$(".accessibility .icon-textdec").removeClass("active");
		$("section").removeClass("text-small");
	}
	$(this).toggleClass("active");
	$(this).blur();
	$("section").toggleClass("text-large");
});
$(".accessibility .icon-textdec").click(function() {
	if ($(".accessibility .icon-textinc").hasClass("active")) {
		$(".accessibility .icon-textinc").removeClass("active");
		$("section").removeClass("text-large");
	}
	$(this).toggleClass("active");
	$(this).blur();
	$("section").toggleClass("text-small");
});

/* ------------------------------------------------------------------ */
/* # User Pictures */
/* ------------------------------------------------------------------ */

/* UNUSED : put to top in update */
/*
$("[data-image]").each(function() {
	var file = $(this).attr("data-image");
	var dir = "img/";
	$(this).css("background-image", "url('" + dir + file + "')")
});
*/

/* ------------------------------------------------------------------ */
/* # Accordions */
/* ------------------------------------------------------------------ */

/* Accordion Active Toggler */
$(".accordion dd > a").click(function() {
	$(this).parent("dd").siblings().children().removeClass("active");
	$(this).toggleClass("active");
});

/* ------------------------------------------------------------------ */
/* # Sub Navigation */
/* ------------------------------------------------------------------ */

/* Sub Navigation Toggler */
$(".sub-nav dd a").click(function() {
	if (!$(this).parent("dd").hasClass("unavailable")) {
		if (!$(this).hasClass("disabled")) {
			$(this).parent("dd").siblings().removeClass("active");
			$(this).parent("dd").toggleClass("active");
		}
	}
});

/* ------------------------------------------------------------------ */
/* # Pagination */
/* ------------------------------------------------------------------ */

/* Pagination Toggler */
$(".pagination li a").click(function() {
	if (!$(this).parent("li").hasClass("unavailable")) {
		if (!$(this).hasClass("disabled")) {
			$(this).parent("li").siblings().removeClass("current");
			$(this).parent("li").toggleClass("current");
		}
	}
});

/* ------------------------------------------------------------------ */
/* # Date Table */
/* ------------------------------------------------------------------ */

$("html").on("mouseenter", ".date-table .href-block.has-event", function() {
	$(this).addClass("mouseenter");
	var handler = $(this);
	handler.data("hover", true);
	setTimeout(function() {
		if (handler.data("hover") == true) {
			handler.css("width", handler.outerWidth());
			handler.css("position", "absolute");
			handler.css("z-index", "10");
			handler.children(".event-list").slideDown("fast");
		}
	}, 400);
});
$("html").on("mouseleave", ".date-table .href-block.has-event", function() {
	$(this).data("hover", false);
	$(this).removeClass("mouseenter");
	$(this).children(".event-list").slideUp("slow", function() {
		$(this).css("position", "relative");
		$(this).css("z-index", "auto");
	});
});

/* ------------------------------------------------------------------ */
/* # Comments */
/* ------------------------------------------------------------------ */

/* Comment Visibility Toggler */
$(".comment-toggle a").click(function() {
	$(this).toggleClass("active");
	$(".comment-list").toggleClass("hide");
});

/* ------------------------------------------------------------------ */
/* # Site Navigation */
/* ------------------------------------------------------------------ */

// Disabled Flag for Pseudo-element :before
/* UNUSED -- Get Fucky feat. Farrel Williams */
/*
$(document).ready(function() {
	$(".site-nav ul li .disabled").parent("li:before").css("opacity", .5);
});
*/

/* ------------------------------------------------------------------ */
/* # Links Display Switchers */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$("[data-show]").click(function() {
	var selector = "#" + $(this).attr("data-show")
	if ($(selector).hasClass("hide")) {
		// Display section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
		// Refresh Breadcrumbs
		refresh_breadcrumbs($(this));
	}
});
*/

/* Attach event for now and the future to 'html' */
$("html").on("click", "[data-show]", function() {
	var selector = "#" + $(this).attr("data-show")
	if ($(selector).hasClass("hide")) {
		// Display section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
		// Refresh Breadcrumbs
		refresh_breadcrumbs($(this));
	}
});

/* ------------------------------------------------------------------ */
/* # Links Current Switchers */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$("[class*='-nav'] ul li a").click(function() { // WARNING : [class$='-nav'] is false if any class is put after (e.g. 'hide')
	var selector = $(this);
	if (!selector.hasClass("no-current")) {
		if (!selector.hasClass("disabled")) {
			$("[class*='-nav'] ul li a").removeClass("current") // WARNING : [class$='-nav'] is false if any class is put after (e.g. 'hide')
		}
		selector.not(".disabled").addClass("current");
	}
});
*/

/* Attach event for now and the future to 'html' */
$("html").on("click", "[class*='-nav'] ul li a", function() {
	var selector = $(this);
	if (!selector.hasClass("no-current")) {
		if (!selector.hasClass("disabled")) {
			$("[class*='-nav'] ul li a").removeClass("current");
		}
		selector.not(".disabled").addClass("current");
	}
});

/* ------------------------------------------------------------------ */
/* # Initialize */
/* ------------------------------------------------------------------ */

/* TEMP : Empty for now */

/* ================================================================== */
/* Trying to hide the slider display ol/ul to bar ...
 * Need to edit the 'news-list' class for the element getting the
 * styles before class 'orbit-slider' is put to DOM.
 * OR !!! Manually set the orbit-slider class => DONT WORK
 */
// $(".news-list").removeClass("hide");
// $(".news-list").addClass("hide-for-small");
/* ================================================================== */
