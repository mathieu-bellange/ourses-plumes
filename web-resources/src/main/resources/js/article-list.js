/* ------------------------------------------------------------------ */
/* # Public vars */
/* ------------------------------------------------------------------ */

var article_list_prefs_defaults = { // Les filtres d'affichage de la liste d'articles par défaut.
	"standbys" : "true",                   // Afficher les articles à valider par défaut ?
	"others_drafts" : "false",             // Afficher les brouillons des autres par défaut ?
	"my_drafts" : "true",                  // Afficher mes brouillons par défaut ?
	"onlines" : "true"                     // Afficher les articles en ligne par défaut ?
}

/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var short_article_tmpl = doT.compile(loadfile($loc.tmpl + "article-item.tmpl"));
var articles_tmpl = doT.compile(loadfile($loc.tmpl + "article-list.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var article_list_tools = (function() {
	return {
		init: function() {
			// methods
			function open_filters(d, dd) {
				var d = $conf.js_fx ? (d || 0) : 0, dd = dd || 0;
				$("#filters_list").delay(dd).fadeIn(d);
			}
			function close_filters(d) {
				var d = $conf.js_fx ? (d || 0) : 0;
				$("#filters_list").fadeOut(d);
			}
			function open_search(d) {
				var d = $conf.js_fx ? (d || 0) : 0;
				$("#search_filters").slideDown(d / 2);
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#search_button").outerWidth(true)
				 - $("#filter_button").outerWidth(true)
				 - $("#write_article").outerWidth(true)
				 - (2.0 * $("html").css("font-size").replace("px", "")); // arbitrary safety spacing (2rem)
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
					$("#search").focus(); // focus search input
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
					open_search(500);
				} else {
					close_search(500);
				}
			});
			$("#filter_button").click(function() {
				$("#filters_list").finish();
				$(this).toggleClass("active");
				$(this).blur()
				if ($(this).hasClass("active")) {
					if ($("#search_button").hasClass("active")) {
						$("#search_button").removeClass("active");
						close_search(250);
						open_filters(250, 250);
					} else {
						open_filters(500)
					}
				} else {
					close_filters(500);
				}
			});
			$("#search_filters li a").click(function() {
				$(this).parent("li").siblings().children("a").removeClass("active");
				$(this).toggleClass("active");
				$(this).blur();
				var str = $("#search").val();
				var f = $(this).attr("data-search");
				if ($("#search").data("filter")) {
					str = str.replace($("#search").data("filter"), ""); // clear search filter
				}
				$("#search").data("filter", f);
				if ($(this).hasClass("active")) {
					str = f + str;
					$("#search").val(str);
				} else {
					$("#search").val(str);
					f = "";
				}
				$("#search").focus();
				$("#search").selectText(f.length, str.length);
			});
			$("#filters_list li a").click(function() {
				if ($("#filter_button").hasClass("orange")) {
					$("#filter_button").removeClass("orange");
					$("#articles_filters_alert").fadeOut($conf.js_fx ? 250 : 0, function() {
						$("#articles_filters_alert").remove();
					});
				}
				$(this).toggleClass("active");
				var c = $(this).clone();
				if ($(this).hasClass("active")) {
					if ($conf.js_fx) {
						$(this).animate({"opacity" : ".5"}, 125).animate({"opacity" : "1"}, 250);
					}
				} else {
					if ($conf.js_fx) {
						var x = $(this).offset().left;
						var y = $(this).offset().top;
						var w = $(this).outerWidth();
						c.css({"position" : "absolute", "left" : x, "top" : y, "padding" : ".5rem", "font-size" : ".9em", "z-index" : "10"})
						c.appendTo("body");
						c.addClass("label radius");
						c.animate({"left" : (x - w / 4).toString() + "px", "top" : (y - 16.0).toString() + "px", "padding" : ".75rem", "font-size" : "1.35em"}, 125).animate({"top" : (y - 8.0).toString() + "px", "opacity" : 0}, 250, function() {
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
					$(this).slideUp($conf.js_fx ? 250 : 0);
				}
			});
			$("#search").blur(function() {
				if ($("#search_filters").data("hover") !== true) {
					$("#search_filters").finish();
					if ($("#search_filters").is(":visible")) {
						$("#search_filters").slideUp($conf.js_fx ? 250 : 0);
					}
				}
			});
			$("#search").focus(function() {
				$("#search_filters").finish();
				if ($("#search_filters").is(":hidden")) {
					$("#search_filters").slideDown($conf.js_fx ? 250 : 0);
				}
			});
			$("#search").keyup(function(e) {
				var f = $("#search").data("filter") || "";
				var s = $(this).val().replace(f, "");
				if (e.which == 27) { // Escape
					$("#search_button").removeClass("active");
					close_search(500);
				} else if (e.which == 13) { // Enter
					if (s.trim().length == 0) {
						$(this).set_validation(false, "Le champ de recherche est vide &hellip;");
					} else if (s.trim().length > 0 && s.trim().length <= 2) {
						$(this).set_validation(false, "La recherche doit comporter au moins trois lettres.");
					} else {
						$(this).val((f !== "" ? f : "") + s.trim());
						$(this).blur();
						// =========================================================
						// # HERE : search is OK -- put you want below ;)
						// ---------------------------------------------------------
						alert("Vous avez recherché '" + s.trim() + "'" + (f !== "" ? " dans les " + f.trunc(f.length - 1) + "s" : "") + "."); // DEBUG
						// =========================================================
					}
				} else if (s.trim() == 0 || s.trim().length > 2) {
					$(this).set_validation(true, null, {"cls_valid" : ""});
				}
			});
			$(window).resize(function() {
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#search_button").outerWidth(true)
				 - $("#filter_button").outerWidth(true)
				 - $("#write_article").outerWidth(true)
				 - (2.0 * $("html").css("font-size").replace("px", "")); // arbitrary safety spacing (2rem)
				$("#search_field").css("width", w);
			});
			// process
			$("#search").val(""); // clear search input on page load (i.e. prevent search filters bugs)
		}
	}
}());

var article_list_prefs = (function() {
	return {
		update: function() {
			var user_name = window.localStorage.getItem($auth.user_name);
			$("#articles_draft .author").each(function() {
				if ($(this).text() != user_name) {
					$(this).parents("li").addClass("other");
					if ($("#filters_list #others_drafts").parent("dd").hasClass("active")) {
						$(this).parents("li").show();
					} else {
						$(this).parents("li").hide();
					}
				}
			});
		},
		reset: function() {
			localStorage.removeItem($prefs.articles_filters);
		},
		init: function() {
			// vars
			var articles_filters_cfg = {
				"#standbys" : ".standby li",
				"#others_drafts" : ".draft li.other",
				"#my_drafts" : ".draft li:not(.other)",
				"#onlines" : ".articles-list:not(.draft):not(.standby) li"
			};
			// methods
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
			this.update(); // set others drafts
			var prefs = get_user_prefs_articles_filters(), k = 0;
			for (key in prefs) {
				if (prefs[key] == "true") {
					$("#" + key).addClass("active");
				} else {
					$("#" + key).removeClass("active");
					if ($("#filters_list").find("#" + key).length > 0) {
						k++;
					}
				}
			}
			if (isAdmin() || isRedac()) {
				if ($("#filters_list").children().size() <= k) { // all switches are off
					$("#filter_button").addClass("active orange");
					$("#filters_list").fadeIn($conf.js_fx ? 250 : 0);
					createAlertBox("Vous n&rsquo;avez aucun filtre s&eacute;lectionn&eacute; pour l&rsquo;affichage des articles.", "warning", "articles_filters_alert");
				}
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
			if ($conf.js_fx) {
				$(".validate button[data-delete='" + id + "']").parents("li").fadeOut("slow", function() {
					$(".validate button[data-delete='" + id + "']").parents("li").remove();
				});
			} else {
				$(".validate button[data-delete='" + id + "']").parents("li").remove();
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				if ($conf.js_fx) {
					$(".validate button[data-delete='" + id + "']").parents("li").fadeOut("slow", function() {
						$(".validate button[data-delete='" + id + "']").parents("li").remove();
					});
				} else {
					$(".validate button[data-delete='" + id + "']").parents("li").remove();
				}
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
			if ($conf.js_fx) {
				$(".validate button[data-validate='" + id + "']").parents("li").fadeOut("slow", function() {
					$(".validate button[data-validate='" + id + "']").parents("li").remove();
					processAfterValidation(article);
					$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
				});
			} else {
				$(".validate button[data-validate='" + id + "']").parents("li").remove();
				processAfterValidation(article);
				$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_deleted, "default");
				if ($conf.js_fx) {
					$(".validate button[data-validate='" + id + "']").parents("li").fadeOut("slow", function() {
						$(".validate button[data-validate='" + id + "']").parents("li").remove();
					});
				} else {
					$(".validate button[data-validate='" + id + "']").parents("li").remove();
				}
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
			if ($conf.js_fx) {
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
					processAfterInValidation(article);
					$("#articles_draft li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
				});
			} else {
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterInValidation(article);
				$("#articles_draft li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, "default");
				if ($conf.js_fx) {
					$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
						$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
					});
				} else {
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				}
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
			if ($conf.js_fx) {
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
					processAfterPublish(article);
					$("#articles_publish li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
				});
			} else {
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterPublish(article);
				$("#articles_publish li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, "default");
				if ($conf.js_fx) {
					$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
						$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
					});
				} else {
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				}
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
			if ($conf.js_fx) {
				$(".validate button[data-recall='" + id + "']").parents("li").fadeOut("slow", function() {
					$(".validate button[data-recall='" + id + "']").parents("li").remove();
					processAfterRecall(article);
					$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
				});
			} else {
				$(".validate button[data-recall='" + id + "']").parents("li").remove();
				processAfterRecall(article);
				$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			}
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offline, "default");
				if ($conf.js_fx) {
					$(".validate button[data-recall='" + id + "']").parents("li").fadeOut("slow", function() {
						$(".validate button[data-recall='" + id + "']").parents("li").remove();
					});
				} else {
					$(".validate button[data-recall='" + id + "']").parents("li").remove();
				}
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function displayArticles() {
	$.ajax({
		type : "GET",
		url : "/rest/articles" + window.location.search,
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			var brouillons = articles.filter(function(n) {
				return n.status === "BROUILLON";
			});
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
			var aVerifier = articles.filter(function(n) {
				return n.status === "AVERIFIER";
			});
			aVerifier.sort(function compare(a, b) {
				if (a.updatedDate > b.updatedDate)
					return -1;
				if (a.updatedDate < b.updatedDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			var enLigne = articles.filter(function(n) {
				return n.status === "ENLIGNE";
			});
			enLigne.sort(function compare(a, b) {
				if (a.publishedDate > b.publishedDate)
					return -1;
				if (a.publishedDate < b.publishedDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			processArticles({"drafts" : brouillons, "toCheck" : aVerifier, "onLine" : enLigne});
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

function processArticles(articles) {
	// insert template
	$("main > header").after(articles_tmpl(articles));
	// events
	$("html").on("mouseenter", ".href-block", function() {
		$(this).find(".validate").show();
	});
	$("html").on("mouseleave", ".href-block", function() {
		$(this).find(".validate").hide();
	});
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
	$("#write_article").mouseenter(function() {
		isAuthenticated(); // WARNING : synchronous authentication request ; should slow down the app badly
	});
	// init
	set_page_title($nav.article_list.title);
	article_list_tools.init(); // set up articles list tools
	article_list_prefs.init(); // set up articles list user prefs
	$(document).foundation(); // reload all Foundation plugins
	loap.update(); // reload loap plugins
}

function processAfterValidation(article) {
	$("#articles_standby").prepend(short_article_tmpl(article));
	$("#articles_standby li:first .validate button[data-invalidate]").click(function() {
		inValidateArticle($(this).attr("data-invalidate"));
	});
	$("#articles_standby li:first .validate button[data-publish]").click(function() {
		publishArticle($(this).attr("data-publish"));
	});
}

function processAfterInValidation(article) {
	$("#articles_draft").prepend(short_article_tmpl(article));
	$("#articles_draft li:first .validate button[data-validate]").click(function() {
		validateArticle($(this).attr("data-validate"));
	});
	$("#articles_draft li:first .validate button[data-delete]").click(function() {
		deleteArticle($(this).attr("data-delete"));
	});
	article_list_prefs.update(); // update articles list user prefs
}

function processAfterPublish(article) {
	$("#articles_publish").prepend(short_article_tmpl(article));
	$("#articles_publish li:first .validate button[data-recall]").click(function() {
		recallArticle($(this).attr("data-recall"));
	});
}

function processAfterRecall(article) {
	//mêmes étapes qu'une validation
	processAfterValidation(article);
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayArticles();
});
