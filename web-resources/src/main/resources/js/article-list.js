/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"article_tool_tmpl" : $loc.tmpl + "article-tool.tmpl",
	"article_list_tmpl" : $loc.tmpl + "article-list.tmpl",
	"article_item_tmpl" : $loc.tmpl + "article-item.tmpl"
}

var article_list_prefs_defaults = { // Les filtres d'affichage de la liste d'articles par défaut.
	"standbys"      : "true",         // Afficher les articles à valider par défaut ?
	"others_drafts" : "false",        // Afficher les brouillons des autres par défaut ?
	"my_drafts"     : "true",         // Afficher mes brouillons par défaut ?
	"onlines"       : "true"          // Afficher les articles en ligne par défaut ?
}

var article_list_cfg = {
	"fade_duration" : 500,            // Integer   Duration for updated articles fade in/out. Default : 500
	"page_startup"  : false           // Internal  DO NOT CHANGE THIS !!!
};

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.article_list.title);
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
		"search_spacing"        : 4.0,    // Float    Space deduced from search input total width when shown (rem). Default : 2.0
		"search_load_delay"     : 1000,   // Integer  Time before search input expand on page load. Default : 1000
		"anim_duration"         : 500     // Integer  Time during which animations are played. Default : 500
	};
	var settings = $.extend({}, defaults, options);
	return {
		init: function() {
			// functions
			function open_filters(d, dd) {
				var d = $conf.js_fx ? (d || 0) : 0, dd = dd || 0;
				$("#filters_list").delay(dd).fadeIn(d);
			}
			function close_filters(d) {
				var d = $conf.js_fx ? (d || 0) : 0;
				$("#filters_list").fadeOut(d);
			}
			function open_search(d, f) {
				var d = $conf.js_fx ? (d || 0) : 0, f = f || false;
				if (f) { $("#search_filters").slideDown(d / 2) }
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#search_button").outerWidth(true)
				 - $("#filter_button").outerWidth(true)
				 - $("#write_article").outerWidth(true)
				 - (f ? settings.search_spacing.toPx() : (settings.search_spacing * 2).toPx()); // arbitrary safety spacing (2rem / 4rem)
				var h = $("#search_field").css("height");
				$("#search_field").css({ // reset css
					"width" : "0",
					"height" : "0",
					"margin-top" : parseFloat(h) / 2,
					"margin-left" : "0",
					"opacity" : "0"
				});
				$("#search_field").removeClass("hide");
				$("#search_field").animate({"width" : w, "height" : h, "margin-top" : "0", "opacity" : "1"}, d, function() {
					if (f) { $("#search").focus() } // focus search input
				});
			}
			function close_search(d) {
				var d = $conf.js_fx ? (d || 0) : 0;
				var m = $("#search_button").innerWidth();
				$("#search_filters").slideUp(d / 2);
				$("#search_field").animate({"width" : "0", "margin-left" : -m, "opacity" : "0"}, d, function() {
					$(this).addClass("hide");
				});
			}
			// events
			$("#search_button").click(function() {
				$("#search_filters").finish();
				$("#search_field").finish();
				$(this).toggleClass("active");
				$(this).blur()
				if ($(this).hasClass("active")) {
					if ($("#filter_button").hasClass("active")) {
						$("#filter_button").removeClass("active");
						close_filters();
					}
					open_search(settings.anim_duration, true);
				} else {
					close_search(settings.anim_duration);
				}
			});
			$("#filter_button").click(function() {
				$("#filters_list").finish();
				$(this).toggleClass("active");
				$(this).blur()
				if ($(this).hasClass("active")) {
					if ($("#search_button").hasClass("active")) {
						$("#search_button").removeClass("active");
						close_search(settings.anim_duration / 2);
						open_filters(settings.anim_duration / 2, settings.anim_duration /2);
					} else {
						open_filters(settings.anim_duration)
					}
				} else {
					close_filters(settings.anim_duration);
				}
			});
			$("#search_filters li a").click(function() {
				$(this).parent("li").siblings().children("a").removeClass("active");
				$(this).toggleClass("active");
				$(this).blur();
				var str = $("#search").val();
				var f = $(this).attr("data-search");
				if ($("#search").data("filter")) {
					str = str.replace($("#search").data("filter") + settings.search_delimiter, ""); // remove filter from search value
				}
				$("#search").data("filter", f);
				if ($(this).hasClass("active")) {
					str = f + settings.search_delimiter + str;
				} else {
					f = ""; // set search filter to empty
					$("#search").data("filter", f); // reset filter in search data
				}
				$("#search").val(str); // reset search value
				$("#search").focus(); // focus search input
				$("#search").selectText((f !== "" ? f.length + 1 : 0), str.length); // select search value in search input
			});
			$("#filters_list li a").click(function() {
				if ($("#filter_button").hasClass("orange")) {
					$("#filter_button").removeClass("orange");
					$("#articles_filters_alert").remove();
				}
				$(this).toggleClass("active");
				var c = $(this).clone();
				if ($(this).hasClass("active")) {
					if ($conf.js_fx) {
						$(this).animate({"opacity" : ".5"}, settings.anim_duration / 4).animate({"opacity" : "1"}, settings.anim_duration / 2);
					}
				} else {
					if ($conf.js_fx) {
						var x = $(this).offset().left;
						var y = $(this).offset().top;
						var w = $(this).outerWidth();
						c.css({"position" : "absolute", "left" : x, "top" : y, "padding" : ".5rem", "font-size" : ".9em", "z-index" : "10"})
						c.appendTo("body");
						c.addClass("label radius");
						c.animate({
							"left" : (x - w / 4).toString() + "px",
							"top" : (y - 16.0).toString() + "px",
							"padding" : ".75rem",
							"font-size" : "1.35em",
							"opacity" : ".75"
						}, settings.anim_duration / 4)
						.animate({"top" : (y + 8.0).toString() + "px", "opacity" : 0}, settings.anim_duration / 4, function() {
							c.remove();
						});
					}
				}
			});
			$("#search_filters").mouseenter(function() {
				$(this).data("hover", true);
			});
			$("#search_filters").mouseleave(function() {
				$(this).removeData("hover");
				if (!$("#search").is(":focus")) {
					$(this).slideUp($conf.js_fx ? settings.anim_duration / 2 : 0);
				}
			});
			$("#search").blur(function() {
				if ($("#search_filters").data("hover") !== true) {
					$("#search_filters").finish();
					if ($("#search_filters").is(":visible")) {
						$("#search_filters").slideUp($conf.js_fx ? settings.anim_duration / 2 : 0);
					}
				}
			});
			$("#search").focus(function() {
				$("#search_filters").finish();
				if ($("#search_filters").is(":hidden")) {
					$("#search_filters").slideDown($conf.js_fx ? settings.anim_duration / 2 : 0);
				}
			});
			$("#search").keyup(function(e) {
				var f = $("#search").data("filter") || "";
				var s = $(this).val().trim().replace(f + settings.search_delimiter, "");
				if (e.which == 27) { // Escape
					$("#search_button").removeClass("active");
					close_search(settings.anim_duration);
				} else if (e.which == 13) { // Enter
					if (s.length == 0) {
						$(this).set_validation(false, "Le champ de recherche est vide &hellip;");
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
						$(this).val((f !== "" ? f + settings.search_delimiter : "") + s); // reset search value in search input after chars replacement
						$(this).blur();
						// =========================================================
						// # Display articles with URL search params
						// =========================================================
						window.history.pushState("", "", "?" + (f !== "" ? f + "=" : "") + s.replace(/\s/g, "&")); // live update address bar without reloading document (HTML5 method)
						displayArticles("?" + f + "=" + s); // display articles with params
					}
				} else if (s == 0 || s.length > 2) {
					$(this).set_validation(true, null, {"cls_valid" : ""}); // reset validation
				}
			});
			$(window).resize(function() {
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#search_button").outerWidth(true)
				 - $("#filter_button").outerWidth(true)
				 - $("#write_article").outerWidth(true)
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
					var f = null;
					$("#search_filters li a").each(function() {
						if (p.hasOwnProperty($(this).attr("data-search"))) {
							$(this).addClass("active");
							f = $(this).attr("data-search");
							$("#search").data("filter", f);
						}
					});
					if (f == null) {
						$("#search").val(p[Object.keys(p)[0]].replace(/&/g, " ")); // feed search input with url search params (value only)
					} else {
						$("#search").val(f + settings.search_delimiter + p[f].replace(/&/g, " ")); // feed search input with url search params
					}
				}
				$("#search_button").toggleClass("active");
				setTimeout(function() {
					if (!$("#filter_button").hasClass("active")) {
						open_search(settings.anim_duration);
					}
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
		},
		init: function() {
			// vars
			var articles_filters_cfg = {
				"#standbys" : ".standby li",
				"#others_drafts" : ".draft .other",
				"#my_drafts" : ".draft .my",
				"#onlines" : ".online li"
			};
			// functions
			function set_user_prefs_articles_filters(obj) { // register user prefs for articles filters
				var obj = obj || articles_filters_cfg;
				var usr = {};
				for (n in obj) {
					usr[n.cut(1)] = $(n).hasClass("active") ? "true" : "false";
				}
				localStorage.setItem($prefs.articles_filters, JSON.stringify(usr));
			}
			function get_user_prefs_articles_filters(defaults) { // retrieve user prefs for articles filters
				var defaults = defaults || article_list_prefs_defaults;
				if (localStorage.getItem($prefs.articles_filters) == null) {
					return defaults;
				} else {
					return JSON.parse(localStorage.getItem($prefs.articles_filters));
				}
			}
			function check_filters_switches(obj) { // toggle articles lists visibility
				var obj = obj || articles_filters_cfg;
				for (key in obj) {
					if ($(key).length > 0) {
						if ($(key).hasClass("active")) {
							$(obj[key]).show();
						} else {
							$(obj[key]).hide();
						}
					}
				}
			}
			// events
			$("#filters_list").mouseleave(function() {
				set_user_prefs_articles_filters(); // register prefs
			});
			$("#standbys, #others_drafts, #my_drafts, #onlines").click(function() {
				check_filters_switches(); // check filters
			});
			// process
			var prefs = get_user_prefs_articles_filters(), k = 0;
			for (key in prefs) {
				if (prefs[key] == "true") {
					$("#" + key).addClass("active");
					if ($("#filters_list").find("#" + key).length > 0) {
						k++; // increment var if item exists and is set on
					}
				} else {
					$("#" + key).removeClass("active");
				}
			}
			if ((isRegAdmin() || isRegRedac()) && k == 0) { // all switches are off
				$("#filter_button").addClass("orange");
				if (!window.location.search) { // no search params in url -- open filters
					$("#filter_button").addClass("active");
					$("#filters_list").fadeIn($conf.js_fx ? 250 : 0);
				}
				createAlertBox($msg.article_no_filter, "articles_filters_alert", {"class" : "warning", "timeout" : $time.duration.alert});
			}
			check_filters_switches()
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function deleteArticle(id) {
	$.ajax({
		type : "DELETE",
		url : "/rest/articles/" + id,
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(noData, status, jqxhr) {
			$(".validate button[data-delete='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
				$(".validate button[data-delete='" + id + "']").parents("li").remove();
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$(".validate button[data-delete='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
					$(".validate button[data-delete='" + id + "']").parents("li").remove();
				});
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function validateArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/validate",
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-validate='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
				$(".validate button[data-validate='" + id + "']").parents("li").remove();
				processAfterValidation(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_deleted, null, {"class" : null, "timeout" : $time.duration.alert});
				$(".validate button[data-validate='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
					$(".validate button[data-validate='" + id + "']").parents("li").remove();
				});
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function inValidateArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/invalidate",
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterInValidation(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, null, {"class" : null, "timeout" : $time.duration.alert});
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				});
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function publishArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/publish",
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterPublish(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, null, {"class" : null, "timeout" : $time.duration.alert});
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				});
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function recallArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/recall",
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-recall='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
				$(".validate button[data-recall='" + id + "']").parents("li").remove();
				processAfterRecall(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offline, null, {"class" : null, "timeout" : $time.duration.alert});
				$(".validate button[data-recall='" + id + "']").parents("li").fadeOut($conf.js_fx ? article_list_cfg.fade_duration : 0, function() {
					$(".validate button[data-recall='" + id + "']").parents("li").remove();
				});
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

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
			// display article search empty message
			if (articles.length == 0) {
				createAlertBox($msg.article_search_empty, null, {"class" : "info", "icon" : "info", "icon_class" : null});
				// TODO : check filters
				// if no result with search filters then display warning
			}
			// set articles status
			var brouillons = articles.filter(function(n) {
				return n.status === "BROUILLON";
			});
			var aVerifier = articles.filter(function(n) {
				return n.status === "AVERIFIER";
			});
			var enLigne = articles.filter(function(n) {
				return n.status === "ENLIGNE";
			});
			/* UNUSED */
			/*
			var my_drafts = [], others_drafts = [];
			for (k in brouillons) {
				if (brouillons[k].profile.pseudo == window.localStorage.getItem($auth.user_name)) {
					my_drafts.push(brouillons[k])
				} else {
					others_drafts.push(brouillons[k])
				}
			}
			*/
			// sort articles
			brouillons.sort(function compare(a, b) {
				// si pas d'update, on test la date de création
				var aDate = a.updatedDate;
				var bDate = b.updatedDate;
				if (a.updatedDate === null) {
					aDate = a.createdDate;
				}
				if (b.updatedDate === null) {
					bDate = b.createdDate;
				}
				if (aDate > bDate)
					return -1;
				if (aDate < bDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			aVerifier.sort(function compare(a, b) {
				if (a.updatedDate > b.updatedDate)
					return -1;
				if (a.updatedDate < b.updatedDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			enLigne.sort(function compare(a, b) {
				if (a.publishedDate > b.publishedDate)
					return -1;
				if (a.publishedDate < b.publishedDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			// process articles
			var data = {"drafts" : brouillons, "toCheck" : aVerifier, "onLine" : enLigne};
			if (article_list_cfg.startup !== true) { // this is first launch of the page
				$("main > header").after(file_pool.article_tool_tmpl(data)).after(lb(1)); // process toolbar
			} else { // this is not first launch of the page, articles lists need to be flushed
				$(".articles-list").detach(); // clear articles list (if any)
			}
			processArticles(data); // always process articles
			if (article_list_cfg.startup !== true) { // this is first launch of the page
				article_list_tools.init(); // set up articles list tools
				article_list_prefs.init(); // set up articles list user prefs
				article_list_cfg.startup = true; // first launch has been done
				$(".tool-bar").svg_icons(); // reload icons only for toolbar
			}
			$("#articles").svg_icons(); // always reload icons only for articles
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

function processArticles(articles) {
	// insert articles list template
	$(".tool-bar").after(file_pool.article_list_tmpl(articles)).after(lb(1));
	// bind live events
	$("html").on("mouseenter", ".href-block", function() {
		$(this).find(".validate").show();
	});
	$("html").on("mouseleave", ".href-block", function() {
		$(this).find(".validate").hide();
	});
	// bind events
	$(".validate button[data-delete]").click(function() {
		deleteArticle($(this).attr("data-delete"));
	});
	$(".validate button[data-validate]").click(function() {
		validateArticle($(this).attr("data-validate"));
	});
	$(".validate button[data-invalidate]").click(function() {
		inValidateArticle($(this).attr("data-invalidate"));
	});
	$(".validate button[data-publish]").click(function() {
		publishArticle($(this).attr("data-publish"));
	});
	$(".validate button[data-recall]").click(function() {
		recallArticle($(this).attr("data-recall"));
	});
	$("#write_article").mouseenter(function() { // check if user is authenticated
		var fail = (function() {
			if ($("#user_connect").data("connected") == true) {
				$("#write_article").parent("dt").parent("dl").detach();
				set_user_connected(false); // set not connected
				disconnect($msg.disconnected); // disconnect
			}
		});
		checkAuthc(null, fail);
	});
}

function processAfterValidation(article) {
	$("#articles_standby").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1));
	$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
	$("#articles_standby li:first").fadeIn(article_list_cfg.fade_duration); // NEW : show article
	$("#articles_standby li:first .validate button[data-invalidate]").click(function() {
		inValidateArticle($(this).attr("data-invalidate"));
	});
	$("#articles_standby li:first .validate button[data-publish]").click(function() {
		publishArticle($(this).attr("data-publish"));
	});
}

function processAfterInValidation(article) {
	$("#articles_draft").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1));
	$("#articles_draft li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
	$("#articles_draft li:first").fadeIn(article_list_cfg.fade_duration); // NEW : show article
	$("#articles_draft li:first .validate button[data-validate]").click(function() {
		validateArticle($(this).attr("data-validate"));
	});
	$("#articles_draft li:first .validate button[data-delete]").click(function() {
		deleteArticle($(this).attr("data-delete"));
	});
}

function processAfterPublish(article) {
	$("#articles_publish").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1));
	$("#articles_publish li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
	$("#articles_publish li:first").fadeIn(article_list_cfg.fade_duration); // NEW : show article
	$("#articles_publish li:first .validate button[data-recall]").click(function() {
		recallArticle($(this).attr("data-recall"));
	});
}

function processAfterRecall(article) {
	processAfterValidation(article); //mêmes étapes qu'une validation
}

function obtenirParametre(sVar) {
	return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
