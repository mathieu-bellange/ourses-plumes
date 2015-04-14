/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"online_article_mptl" : $loc.tmpl + "online-article.mptl"
}

var article_list_cfg = {
	"fade_duration" : 500,            // Integer   Duration for updated articles fade in/out. Default : 500
	"page_startup"  : false           // Internal  Start up flag ; do not change this. Default : false
};

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.online_article_list.title);
			/* Process */
			displayArticles();
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var article_list_tools = (function(options) {
	var defaults = {
		"search_delimiter"      : ":",    // String   Delimiter used between search filter and search value in search input. Default : ":"
		"search_spacing"        : 1.5,    // Float    Space deduced from search input total width when shown (rem). Default : 1.5
		"search_load_delay"     : 0,      // Integer  Time before search input expand on page load. Default : 0
		"anim_duration"         : 375     // Integer  Time during which animations are played. Default : 375
	};
	var settings = $.extend({}, defaults, options);
	return {
		init: function() {
			// functions
			function open_search(d, f) {
				var d = $conf.js_fx ? (d || 0) : 0, f = f || false;
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#search_button").outerWidth(true)
				 - (f ? settings.search_spacing.toPx() : (settings.search_spacing * 2).toPx()); // arbitrary safety spacing (2rem / 4rem)
				var h = $("#search").css("height");
				$("#find").hide();
				$("#search").css("height", "100%");
				$("#search_field").css({ // reset css
					"width" : "0",
					"height" : "0",
					"margin-top" : parseFloat(h) / 2,
					"margin-left" : "0",
					"opacity" : "0"
				});
				$("#search_field").removeClass("hide");
				$("#search_field").animate({"width" : w, "height" : h, "margin-top" : "0", "opacity" : "1"}, d, function() {
					$("#search").css("height", "");
					$("#find").fadeIn(d);
					if (f) { $("#search").focus() } // focus search input
				});
			}
			function close_search(d) {
				var d = $conf.js_fx ? (d || 0) : 0;
				var m = $("#search_button").innerWidth();
				$("#search_field").animate({"width" : "0", "margin-left" : -m, "opacity" : "0"}, d, function() {
					$(this).addClass("hide");
				});
			}
			// events
			$("#search_button").click(function() {
				$("#search_field").finish();
				$(this).toggleClass("active");
				$(this).blur();
				if ($(this).hasClass("active")) {
					open_search(settings.anim_duration, true);
				} else {
					close_search(settings.anim_duration);
				}
			});
			$("#find").click(function() {
				$(function() {
					e = $.Event("keyup");
					e.which = 13; // 0
					$("#search").trigger(e); // force keyup 13 (i.e. valid search field)
				});
			});
			$("#search").keyup(function(e) {
				var f = "criteria";
				var s = $(this).val().trim().replace(f + settings.search_delimiter, "");
				if (e.which == 27) { // Escape
					$("#search_button").removeClass("active");
					close_search(settings.anim_duration);
				} else if (e.which == 13) { // Enter
					if (s.length == 0) {
						if (history.pushState){
							window.history.pushState("", "", location.pathname); // live update address bar without reloading document (HTML5 method)
						}
						displayArticles("");
					} else if (s.length > 0 && s.length <= 2) {
						$(this).set_validation(false, "La recherche doit comporter au moins trois lettres.");
					// ===========================================================
					// # Check illegal chars */
					// ===========================================================
					// forbidden chars -- '?', '&',  '=' (replaced by whitespaces below)
					// illegal chars   -- '/', '\', '@' (warn user)
					// special chars   -- ':', ',' ';' (delimiters are allowed but not yet implemented)
					} else if (/[\/\\@]/.test(s)) {
						$(this).set_validation(false, $msg.char_illegal);
					} else {
						// =========================================================
						// # Replace forbidden and special chars
						// =========================================================
						s = s.replace(/[\?=]/g, "").replace(/[\s&]+/, " ");
						$(this).blur();
						// =========================================================
						// # Display articles with URL search params
						// =========================================================
						if (history.pushState){
							window.history.pushState("", "", "?" + (f !== "" ? f + "=" : "") + s.replace(/\s/g, "+")); // live update address bar without reloading document (HTML5 method)
						}
						displayArticles("?" + f + "=" + s); // display articles with params
					}
				} else if (s == 0 || s.length > 2) {
					$(this).set_validation(true, null, {"cls_valid" : ""}); // reset validation
				}
			});
			$(window).resize(function() {
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#search_button").outerWidth(true)
				 - settings.search_spacing.toPx(); // arbitrary safety spacing (2rem)
				$("#search_field").css("width", w);
			});
			// ===============================================================
			// Retrieve URL search params
			// ===============================================================
			var p = get_url_search_params();
			if (p !== null) {
				if (typeof p === "string") { // this is a search query
					$("#search").val(p.replace(/&/g, " ")); // feed search input with url search query
				} else if (typeof p === "object") { // this is search params (i.e. specifier + search query)
					$("#search").val(p[Object.keys(p)[0]].replace(/&/g, " ")); // feed search input with url search params (value only)
				}
				$("#search_button").toggleClass("active");
				setTimeout(function() {
					open_search(settings.anim_duration);
				}, settings.search_load_delay);
			} else {
				$("#search").val(""); // clear search input (i.e. prevent any filtering bug)
			}
		}
	}
}());

var article_list_prefs = (function() {
	return {
		reset: function() {
			localStorage.removeItem($prefs.articles_filters);
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */
var articlesTimer = 1;
function displayArticles(url_params) {
	var url_params = url_params || window.location.search;
	$.ajax({
		type : "GET",
		url : "/rest/articles" + url_params,
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			articles.sort(function compare(a, b) {
				if (a.publishedDate > b.publishedDate)
					return -1;
				if (a.publishedDate < b.publishedDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			if (article_list_cfg.startup !== true) { // this is first launch of the page
				$(".main-body").append(file_pool.article_tool_tmpl(articles) + lb(1)); // process toolbar
			} else { // this is not first launch of the page, articles lists need to be flushed
				$(".article-list").detach(); // clear articles list (if any)
			}
			$(".tool-bar").after(file_pool.article_list_tmpl(articles)).after(lb(1));
			if (article_list_cfg.startup !== true) { // this is first launch of the page
				article_list_tools.init(); // set up articles list tools
				article_list_cfg.startup = true; // first launch has been done
				$(".tool-bar").svg_icons(); // reload icons only for toolbar
			}
			$("#articles").svg_icons(); // always reload icons only for articles
			// display article search empty message
			if (articles.length == 0) {
				$(".main-body").create_alert_box($msg.article_search_empty, null, {"class" : "info", "icon" : "info", "icon_class" : null, "insert" : "append"});
			} else {
				$("#alert_box").fadeOut(function() {
					$("#alert_box").remove();
				});
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 503){
				setTimeout(function(){
					articlesTimer = articlesTimer * 10;
					displayArticles(url_params);
				}, articlesTimer);
				
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
