/* ------------------------------------------------------------------ */
/* # Internal */
/* ------------------------------------------------------------------ */

var articles_filters_prefs_defaults = { // Les filtres d'affichage de la liste d'articles par défaut.
	"#standbys" : "true",                 // - Afficher les articles à valider par défaut ?
	"#others_drafts" : "false",           // - Afficher les brouillons des autres par défaut ?
	"#my_drafts" : "true",                // - Afficher mes brouillons par défaut ?
	"#onlines" : "true"                   // - Afficher les articles en ligne par défaut ?
}

/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var short_article_tmpl = doT.compile(loadfile($loc.tmpl + "shortArticle.tmpl"));
var articles_tmpl = doT.compile(loadfile($loc.tmpl + "articles.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var articles_filters = (function() {
	return {
		update : function() {
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
		init : function() {
			// vars
			var articles_filters_cfg = {
				"#standbys" : ".standby",
				"#others_drafts" : ".draft .other",
				"#my_drafts" : ".draft li:not(.other)",
				"#onlines" : ".articles-list:not(.draft):not(.standby)"
			};
			// methods
			function set_user_prefs_articles_filters(obj) { // register user prefs for articles filters in browser local storage
				var obj = obj || articles_filters_cfg;
				var usr = {};
				for (n in obj) {
					usr[n] = $(n).parent("dd").hasClass("active") ? "true" : "false";
				}
				localStorage.setItem($prefs.articles_filters, JSON.stringify(usr));
			}
			function get_user_prefs_articles_filters(defaults) { // retrieve user prefs for articles filters in browser local storage
				var defaults = defaults || articles_filters_prefs_defaults;
				if (localStorage.getItem($prefs.articles_filters) == null) {
					return defaults;
				} else {
					return JSON.parse(localStorage.getItem($prefs.articles_filters));
				}
			}
			function check_filters_switches(obj) { // toggle articles lists visibility according to filters
				var obj = obj || articles_filters_cfg;
				for (key in obj) {
					if ($(key).length > 0) { // if togger exists (n.b. role check is made in the template)
						if ($(key).parent("dd").hasClass("active")) {
							$(obj[key]).show();
						} else {
							$(obj[key]).hide();
						}
					}
				}
			}
			// events
			$("#filter_icon").click(function() {
				$("#filter_icon").toggleClass("active");
				$("#filter_icon").blur();
			});
			$("#filters_list").mouseenter(function() {
				isAuthenticated(); // WARNING : synchronous authentication request ; should slow down the app badly
				$(this).find("dd").finish();
				$conf.js_fx ? $(this).find("dd").fadeIn(250) : $(this).find("dd").show();
			});
			$("#filters_list").mouseleave(function() {
				set_user_prefs_articles_filters(); // register articles filters into user prefs on mouse leave
				if (!$("#filter_icon").hasClass("active")) {
					$conf.js_fx ? $(this).find("dd").fadeOut(500) : $(this).find("dd").hide();
				}
			});
			$("html").on("click", "#standbys, #others_drafts, #my_drafts, #onlines", function() { // filters togglers events
				$(this).parent("dd").toggleClass("active");
				check_filters_switches();
			});
			// init
			this.update(); // set others drafts
			var obj = get_user_prefs_articles_filters();
			for (key in obj) { // set articles list visibility according to user prefs
				if (obj[key] == "true") {
					$(key).parent("dd").addClass("active");
				} else {
					$(key).parent("dd").removeClass("active");
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
			$(".validate button[data-delete='" + id + "']").parents("li").fadeOut("slow", function() {
				$(".validate button[data-delete='" + id + "']").parents("li").remove();
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$(".validate button[data-delete='" + id + "']").parents("li").fadeOut("slow", function() {
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
			$(".validate button[data-validate='" + id + "']").parents("li").fadeOut("slow", function() {
				$(".validate button[data-validate='" + id + "']").parents("li").remove();
				processAfterValidation(article);
				$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_deleted, "default");
				$(".validate button[data-validate='" + id + "']").parents("li").fadeOut("slow", function() {
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
			$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterInValidation(article);
				$("#articles_draft li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, "default");
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
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
			$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterPublish(article);
				$("#articles_publish li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, "default");
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function() {
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
			$(".validate button[data-recall='" + id + "']").parents("li").fadeOut("slow", function() {
				$(".validate button[data-recall='" + id + "']").parents("li").remove();
				processAfterRecall(article);
				$("#articles_standby li:first .summary").svg_icons(); // NEW : refresh svg icons of summary's newly created article
			});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offline, "default");
				$(".validate button[data-recall='" + id + "']").parents("li").fadeOut("slow", function() {
					$(".validate button[data-recall='" + id + "']").parents("li").remove();
				});
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
		url : "/rest/articles",
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
	articles_filters.init(); // set articles filtering
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
	articles_filters.update(); // update articles filters
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
