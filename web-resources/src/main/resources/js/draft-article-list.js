/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"draft_article_mptl" : $loc.tmpl + "draft-article.mptl"
}

var article_list_prefs_defaults = { // Les filtres d'affichage de la liste d'articles par défaut.
	"standbys"      : "true",         // Afficher les articles à valider par défaut ?
	"other_drafts"  : "false",        // Afficher les brouillons des autres par défaut ?
	"owner_drafts"  : "true",         // Afficher mes brouillons par défaut ?
	"onlines"       : "true"          // Afficher les articles en ligne par défaut ?
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
			set_page_title($nav.draft_article_list.title);
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
		"anim_duration"         : 250     // Integer  Time during which animations are played. Default : 375
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
			// events
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
						}, settings.anim_duration / 2)
						.animate({"top" : (y + 8.0).toString() + "px", "opacity" : 0}, settings.anim_duration / 2, function() {
							c.remove();
						});
					}
				}
			});
			$(window).resize(function() {
				var w = $(".tool-bar").innerWidth() // compute search input width
				 - $("#filter_button").outerWidth(true)
				 - $("#write_article").outerWidth(true)
				 - settings.search_spacing.toPx(); // arbitrary safety spacing (2rem)
			});
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
				"#other_drafts" : ".draft .other",
				"#owner_drafts" : ".draft .owner",
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
			$("#standbys, #other_drafts, #owner_drafts, #onlines").click(function() {
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
			if ((OursesSecurity.isUserAdmin() || OursesSecurity.isUserWriter()) && k == 0) { // all switches are off
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

var article_list_dialogs = (function() {
	// Configuration
	var cfg = {
		"min_age"   : 1,                   // Integer  Year variation toward past (n - 1). Default : 1
		"max_age"   : 1,                   // Integer  Year variation toward future (n + 1). Default : 1
		"pub_name"  : "#publishing_box",   // Selector Publishing box element identifier. Default : "#publishing_box"
		"pub_day"   : "#publishing_day",   // Selector Day combo box identifier. Default : "#publishing_day"
		"pub_month" : "#publishing_month", // Selector Month combo box identifier. Default : "#publishing_month"
		"pub_year"  : "#publishing_year",  // Selector Year combo box identifier. Default : "#publishing_year"
		"pub_hour"  : "#publishing_hour",  // Selector Hour combo box identifier. Default : "#publishing_hour"
		"fld_name"  : "#folder_box"        // Selector Folder box element identifier. Default : "#folder_box"
	};
	// Variables
	var c, id, obj;
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	var hour = date.getHours();
	return {
		output_publishing : function() {
			var d = parseInt(obj.find(cfg.pub_day).val());
			var m = parseInt(obj.find(cfg.pub_month + " option:selected").attr("id"));
			var y = parseInt(obj.find(cfg.pub_year).val());
			var h = parseInt(obj.find(cfg.pub_hour).val());
			publishArticle(id, new Date(y, m, d, h)); // publish article at differed date
		},
		output_folder : function() {
			// ===============================================================
			var fld = obj.find("#folder_select option:selected");
			if (fld.is(":enabled")) {
				$("[data-folder='" + id + "']").attr("data-folder-id", fld.attr("data-id"));
				alert("article " + id + " put to folder " + fld.attr("data-id"));
			}
			// ===============================================================
			// # TODO : AJAX
			// ===============================================================
			// - success : update article's folder
			// - fail    : display error alert
			// ===============================================================
		},
		build_publishing : function() {
			obj = $(cfg.pub_name);
			obj.find("[data-submit-publish]").attr("data-submit-publish", id);
			obj.svg_icons(); // reload svg icons
			for (i = 1; i <= 31; i++) { // Build days
				var e = $("<option>");
				if (i == day) { e.attr("selected", true) }
				obj.find(cfg.pub_day).append(e.html(i));
			}
			for (i in $time.months) { // Build months
				var e = $("<option>", {"id": i});
				if (i == month) { e.attr("selected", true) }
				obj.find(cfg.pub_month).append(e.html($time.months[i].capitalize()));
			}
			for (i = year - cfg.min_age; i <= year + cfg.max_age; i++) { // Build years
				var e = $("<option>");
				if (i == year) { e.attr("selected", true) }
				obj.find(cfg.pub_year).append(e.html(i));
			}
			for (i = 0; i < 24; i++) { // Build hours
				var e = $("<option>");
				if (i == hour) { e.attr("selected", true) }
				obj.find(cfg.pub_hour).append(e.html(i.toString().format(2) + ":00"));
			}
		},
		build_folder : function() {
			obj = $(cfg.fld_name);
			obj.find("[data-submit-folder]").attr("data-submit-folder", id);
			$(".spring-box.folder").svg_icons(); // reload svg icons
			// ===============================================================
			// # TODO : AJAX
			// ===============================================================
			// - success : get folders list
			// - fail    : display error alert
			// ===============================================================
			var db_folders = [
				{"id" : "1", "name" : "Dossier 1"},
				{"id" : "2", "name" : "Dossier 2"},
				{"id" : "3", "name" : "Dossier 3"},
				{"id" : "4", "name" : "Dossier 4"}
			];
			// ===============================================================
			// # TODO : AJAX
			// ===============================================================
			// - success : 1. append folders list in select
			//             2. select the article's folder if any
			// - fail    : display alert error
			// ===============================================================
			var fld_opts = "";
			for (i in db_folders) {
				var sel = "";
				if ($("[data-folder='" + id +"']").attr("data-folder-id") == db_folders[i].id) {
					sel = " selected";
				}
				fld_opts += "<option data-id='" + db_folders[i].id + "'" + sel + ">" + db_folders[i].name + "</option>";
			}
			obj.find("#folder_select").append(fld_opts);
			// ===============================================================
		},
		init : function(o) {
			var self = this;
			function show_bar(o) {
				o.attr("disabled", true); // disable calling element
				o.parent(".validate").addClass("show");
			}
			function hide_bar(o) {
				o.removeAttr("disabled");
				o.parent(".validate").removeClass("show");
				if (!o.parent(".validate").is(":hover")) {
					o.parent(".validate").fadeOut($conf.js_fx ? "fast" : 0);
				}
			}
			$(document).on("click", "[data-submit-publish], [data-submit-folder], .validate button, .tool-bar", function() {
				spring_box.close($(".spring-box")); // close spring box
			});
			$(document).on("click", "[data-publish]", function() {
				c = $(this);
				id = c.attr("data-publish"); // transfer article id through a variable
				show_bar(c); // lock button bar
				spring_box.create(c, {"box_id" : "publishing_box", "box_class" : "publish", "box_html" : file_pool.publishing_box_tmpl(), "box_focus" : ".success", "on_opened" : self.build_publishing, "on_close" : function() {hide_bar(c)}}); // create spring box
			});
			$(document).on("click", "[data-folder]", function() {
				c = $(this);
				id = c.attr("data-folder"); // transfer article id through a variable
				show_bar(c); // lock button bar
				spring_box.create(c, {"box_id" : "folder_box", "box_class" : "folder", "box_html" : file_pool.folder_box_tmpl(), "box_focus" : ".close", "on_opened" : self.build_folder, "on_close" : function() {hide_bar(c)}}); // create spring box
			});
			$(document).on("click", "[data-submit-publish]", function() {
				self.output_publishing(); // submit publishing
			});
			$(document).on("click", "[data-submit-folder]", function() {
				self.output_folder(); // submit folder
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function confirmDelete(id) {
	if (typeof(id) !== "undefined" && id > 0) { // Check article id validity
		if ($conf.confirm_delete.draft) {
			// Confirm Delete Draft
			var modal_options = {
				"text" : $msg.confirm_delete.draft,
				"class" : "panel radius",
				"on_confirm" : function() {
					deleteArticle(id) // delete article
				}
			};
			$("#articles").create_confirmation_modal(modal_options);
		} else {
			deleteArticle(id) // delete article
		}
	}
}

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

function publishArticle(id, publishedDate) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/publish",
		data : JSON.stringify(publishedDate),
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
var articlesTimer = 1;
function displayArticles(url_params) {
	var url_params = url_params || window.location.search;
	$.ajax({
		type : "GET",
		url : "/rest/articles/draft",
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
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
				$(".main-body").append(file_pool.article_tool_tmpl(data) + lb(1)); // process toolbar
			} else { // this is not first launch of the page, articles lists need to be flushed
				$(".article-list").detach(); // clear articles list (if any)
			}
			processArticles(data); // always process articles
			if (article_list_cfg.startup !== true) { // this is first launch of the page
				article_list_tools.init(); // set up articles list tools
				article_list_prefs.init(); // set up articles list user prefs
				//publishing_box.init(); // set up publishing box
				article_list_dialogs.init(); // set up dialogs for drafts
				article_list_cfg.startup = true; // first launch has been done
				$(".tool-bar").svg_icons(); // reload icons only for toolbar
			}
			$("#articles").svg_icons(); // always reload icons only for articles
			// display article search empty message
			if (articles.length == 0) {
				$(".main-body").create_alert_box($msg.article_search_empty, null, {"class" : "info", "icon" : "info", "icon_class" : null, "insert" : "append"});
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

function processArticles(articles) {
	// insert articles list template
	$(".tool-bar").after(file_pool.article_list_tmpl(articles)).after(lb(1));
	// bind live events
	$("html").on("mouseenter", ".over-block", function() {
		$(this).find(".validate").show();
	});
	$("html").on("mouseleave", ".over-block", function() {
		if (!$(this).find(".validate").hasClass("show")) {
			$(this).find(".validate").hide();
		}
	});
	// List events
	$(".validate button[data-delete]").click(function() {
		confirmDelete($(this).attr("data-delete"));
	});
	$(".validate button[data-validate]").click(function() {
		validateArticle($(this).attr("data-validate"));
	});
	$(".validate button[data-invalidate]").click(function() {
		inValidateArticle($(this).attr("data-invalidate"));
	});
	$(".validate button[data-publish]").click(function() {
		// publishArticle($(this).attr("data-publish"));
	});
	$(".validate button[data-recall]").click(function() {
		recallArticle($(this).attr("data-recall"));
	});
	// Toolbar events
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
	$("#articles_standby li:first").svg_icons(); // refresh svg icons for newly created article item
	$("#articles_standby li:first").fadeIn(article_list_cfg.fade_duration); // show article
	$("#articles_standby li:first .validate button[data-invalidate]").click(function() {
		inValidateArticle($(this).attr("data-invalidate"));
	});
}

function processAfterInValidation(article) {
	$("#articles_draft").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1));
	$("#articles_draft li:first").svg_icons(); // refresh svg icons for newly created article item
	var o = $("#articles_draft li:first"), p = $prefs.articles_filters;
	if ((o.hasClass("owner") && get_pref(p, "owner_drafts") == "true")
	 || (o.hasClass("other") && get_pref(p, "other_drafts") == "true")) {
		$("#articles_draft li:first").fadeIn(article_list_cfg.fade_duration); // show article
	}
	$("#articles_draft li:first .validate button[data-validate]").click(function() {
		validateArticle($(this).attr("data-validate"));
	});
	$("#articles_draft li:first .validate button[data-delete]").click(function() {
		confirmDelete($(this).attr("data-delete"));
	});
}

function processAfterPublish(article) {
	var elems = $("#articles_publish li");
	elems.each(function(elem) {
		var date = new Date(parseInt($(this).attr("data-published"), 10));
		if (date < article.publishedDate) {
			$(this).before(file_pool.article_item_tmpl(article)).prepend(lb(1));
			$(this).prev().svg_icons(); // refresh svg icons for newly created article item
			$(this).prev().fadeIn(article_list_cfg.fade_duration); // show article
			$(this).prev().find(".validate button[data-recall]").click(function() {
				recallArticle($(this).attr("data-recall"));
			});
			return false
		}
	});
}

function processAfterRecall(article) {
	processAfterValidation(article); // mêmes étapes qu'une validation
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
