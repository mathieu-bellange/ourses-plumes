/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"draft_article_mptl" : $loc.tmpl + "draft-article.mptl"
}

var article_list_setup = {
	"fx_d" : 500 // [int] Duration for flushed and renewed articles fade in/out (ms). Default : 500
};

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			// Set page title
			set_page_title($nav.draft_article_list.title);
			// Process
			displayArticles(); // process articles list
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
	var defs = { // Les filtres d'affichage de la liste d'articles par défaut.
		"standbys"      : "true",         // Afficher les articles à valider par défaut ?
		"other_drafts"  : "false",        // Afficher les brouillons des autres par défaut ?
		"owner_drafts"  : "true",         // Afficher mes brouillons par défaut ?
		"onlines"       : "true"          // Afficher les articles en ligne par défaut ?
	};
	var list = {
		"#standbys"     : ".standby > li",
		"#other_drafts" : ".draft .other",
		"#owner_drafts" : ".draft .owner",
		"#onlines"      : ".online > li"
	};
	return {
		get : function(obj) { // retrieve user prefs for articles filters
			var opts = opts || defs;
			if (localStorage.getItem($prefs.articles_filters) == null) {
				return opts;
			} else {
				return JSON.parse(localStorage.getItem($prefs.articles_filters));
			}
		},
		set : function(obj) { // register user prefs for articles filters
			var obj = obj || list, usr = {};
			for (n in obj) {
				usr[n.cut(1)] = $(n).hasClass("active") ? "true" : "false";
			}
			localStorage.setItem($prefs.articles_filters, JSON.stringify(usr));
		},
		match : function(obj) { // check if any article is visible
			var obj = obj || list, a = 0, b = 0;
			for (key in obj) {
				if ($(obj[key]).filter(":visible").length == 0) {a++} b++;
			} if (a < b) {return true}
		},
		refresh : function(obj) { // toggle articles lists visibility
			var obj = obj || list;
			for (key in obj) {
				if ($(key).length > 0) {
					$(key).hasClass("active") ? $(obj[key]).show() : $(obj[key]).hide()
				}
			}
		},
		reset : function(obj) {
			localStorage.removeItem($prefs.articles_filters);
		},
		init : function() {
			var self = this;
			$(document).on("mouseleave", "#filters_list", function() {
				self.set(); // register prefs
			});
			$(document).on("click", "#standbys, #other_drafts, #owner_drafts, #onlines", function() {
				self.refresh(); // check filters
			});
			var prefs = self.get();
			for (key in prefs) { // setup filters buttons
				prefs[key] == "true" ? $("#" + key).addClass("active") : $("#" + key).removeClass("active");
			}
		}
	}
}());

var article_list_diags = (function() {
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

var article_list_pages = (function() {
	// defaults
	var defs = {
		auto    : true,  // [bool] Increment pages on document bottom. Default : true
		start   : true,  // [bool] Update component on initialization. Default : true
		limit   : 4,     // [int]  Number of times to request server on document bottom. Default : 4
		offset  : 16,    // [int]  Arbitrary value for triggering the document bottom (px). Default : 16
		timeout : 2000,  // [int]  Time to wait before requesting server again after an error occured (ms). Default : 2000
		intval  : 1500,  // [int]  Interval at which document height is requested by script for changes (ms). Default : 1500
		delay   : 1000,  // [int]  Waiting time before checking window resize again after a first trigger (ms). Default : 1000
		fx_d    : 250    // [int]  Duration of JS effects (ms). Default : 250
	};
	// internals
	var page = 0;
	var stop = false;
	var busy = false;
	var posy = null;
	var loop = null;
	var conf;
	return {
		get_page : function() {return page},
		prompt : function() {
			// 1. yield process
			stop = true;
			// 2. max-up limit
			conf.limit = page;
			// 3. remove more result
			delete_show_more();
		},
		reflow : function() {
			// 1. reset page
			page = 0;
			// 2. reset limit
			conf.limit = defs.limit;
			// 3. unleash process
			stop = false;
		},
		request : function() {
			var self = this;
			displayArticles(null, page, function() {self.update()});
		},
		update : function() {
			var self = this;
			if ($conf.debug) {console.log("server response : OK => process articles")} // DEBUG
			page++; // increment index
			if (conf.auto && $(document).height() <= $(window).height()
			 && page < conf.limit) {
				console.log("omg ! not enough content => launch again at once");
				stop = true; // yield process
				self.request();
			} else if (!conf.auto || page >= conf.limit) {
				stop = true; // yield process
				delete_show_more();
				create_show_more();
			} else {
				stop = false; // unleash fiber
			}
		},
		init : function(opts) {
			var self = this;
			conf = $.extend({}, defs, opts);
			posy = $(document).scrollTop();
			if ($conf.debug) {console.log(" *** pagination inialized")} // DEBUG
			if (conf.auto) {
				// -------------------------------------------------------------
				// * A. Bind window scroll event
				// -------------------------------------------------------------
				$(window).on("scroll.pagination", function() {
					if (stop) {return} // return on stop defined
					// 1. check scroll direction
					var last_pos = posy;
					posy = null;
					if ($(document).scrollTop() < last_pos) {
						if ($conf.debug) {console.log("upward => break")} // DEBUG
						return;
					} else {
						if ($conf.debug) {console.log("downward => continue")} // DEBUG
						// 2. check if window bottom is reached
						if ($(document).scrollTop() >= $(document).height() - $(window).height() - conf.offset) {
							if ($conf.debug) {console.log(" *** window bottom reached")} // DEBUG
							stop = true; // break scroll check
							// 3. request AJAX and deactivate check until server response
							if ($conf.debug) {console.log("send request to server...")} // DEBUG
							self.request();
						}
					}
				});
				// -------------------------------------------------------------
				// * B. Bind window resize event
				// -------------------------------------------------------------
				$(window).on("resize.pagination", function() {
					// handle odd case of screen increased (i.e. scrollbar disappeared),
					// play just once below a certain amount of time (i.e. prevent multiple triggerings at once bugs)
					if (!busy) {
						busy = true; // switch flag
						if ($(document).height() <= $(window).height()
								&& page < conf.limit) {
							if ($conf.debug) {console.log("window height increased => request server for one more page")} // DEBUG
							stop = true;
							self.request();
						}
						setTimeout(function() {busy = false}, conf.delay); // reset flag
					}
				});
				// -------------------------------------------------------------
				// * C. Loop checking document height
				// -------------------------------------------------------------
				loop = setInterval(function() {
					if (page >= conf.limit) {
						// destroy interval upon reaching max pages
						if ($conf.debug) {console.log("clear interval")} // DEBUG
						clearInterval(loop);
					} else if (!stop) {
						// check document height and request if needed
						if ($(document).height() <= $(window).height()) {
							if ($conf.debug) {console.log("document height changes detected by interval => request server for one more page")} // DEBUG
							stop = true;
							self.request();
						}
					}
				}, conf.intval);
			}
			$(document).on("click.pagination", "#show_more a", function() {
				if ($conf.debug) {console.log("asking for more => proceed now without delay")} // DEBUG
				self.request();
			});
			if (conf.start) {self.update()} else {self.prompt()}
		},
		kill : function() {
			// 1. shutdown
			this.prompt();
			// 2. unbind namespace
			$(document, window).off(".pagination");
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

function flushArticle(sel, callback) {
	var callback = callback || function(){};
	$(".validate").find(sel).closest("li").fadeOut($conf.js_fx ? article_list_setup.fx_d : 0, function() {
		$(".validate").find(sel).closest("li").remove();
		callback();
	});
}

function deleteArticle(id) {
	var sel = "[data-delete='" + id + "']";
	$.ajax({
		type : "DELETE",
		url : "/rest/articles/" + id,
		beforeSend : function(request){header_authentication(request)},
		contentType : "application/json; charset=utf-8",
		success : function(noData, status, jqxhr) {
			flushArticle(sel);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				flushArticle(sel);
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function validateArticle(id) {
	var sel = "[data-validate='" + id + "']";
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/validate",
		beforeSend : function(request){header_authentication(request)},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			flushArticle(sel, function() {processAfterValidation(article)});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_deleted, null, {"class" : null, "timeout" : $time.duration.alert});
				flushArticle(sel);
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function inValidateArticle(id) {
	var sel = "[data-invalidate='" + id + "']";
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/invalidate",
		beforeSend : function(request){header_authentication(request)},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			flushArticle(sel, function() {processAfterInValidation(article)});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, null, {"class" : null, "timeout" : $time.duration.alert});
				flushArticle(sel);
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function publishArticle(id, publishedDate) {
	var sel = "[data-invalidate='" + id + "']";
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/publish",
		data : JSON.stringify(publishedDate),
		beforeSend : function(request){header_authentication(request)},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			flushArticle(sel, function() {processAfterPublish(article)});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offcheck, null, {"class" : null, "timeout" : $time.duration.alert});
				flushArticle(sel);
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function recallArticle(id) {
	var sel = "[data-recall='" + id + "']";
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/recall",
		beforeSend : function(request){header_authentication(request)},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			flushArticle(sel, function() {processAfterRecall(article)});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				createAlertBox($msg.article_offline, null, {"class" : null, "timeout" : $time.duration.alert});
				flushArticle(sel);
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function displayArticles(url_params, page, callback) {
	var url_params = url_params || window.location.search, page = page || 0, callback = callback || function() {};
	create_loading_image(); // display loading image in any case
	if (isLocalHost && $conf.debug && $debug.db_wait) {
		wait_for_execution($debug.db_wait_time, function(){getArticles(url_params, page, callback)}, true); // delay process
	} else {
		getArticles(url_params, page, callback); // process articles list
	}
}

var articlesTimer = 1;
function getArticles(url_params, page, callback) {
	clearTimeout(article_list_setup.check_filters); // clear check filters timeout
	$.ajax({
		type : "GET",
		url : "/rest/articles/draft",
		headers : {"page" : page},
		beforeSend : function(request){header_authentication(request)},
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
			/* UNUSED : articles already ordered */
			/*
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
			*/
			// process articles
			var data = {"drafts" : brouillons, "toCheck" : aVerifier, "onLine" : enLigne};
			if (!article_list_setup.run) { // first launch
				$(".main-body").append(file_pool.article_tool_tmpl(data) + lb(1)); // process toolbar
				article_list_tools.init(); // initialize articles list tools
				article_list_prefs.init(); // initialize articles list user prefs
				article_list_diags.init(); // initialize dialogs for drafts
			}
			processArticles(data, callback); // process process articles
			$(".main-body").svg_icons(); // always reload icons for main body
			if (articles.length == 0) { // no more article in db
				article_list_pages.kill(); // destroy pagination process
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 503) {
				setTimeout(function() {
					articlesTimer = articlesTimer * 10;
					displayArticles();
				}, articlesTimer);
			} else {
				delete_loading_image(); // delete loading image
			}
		},
		dataType : "json"
	});
}

function processArticles(articles, callback) {
	var callback = callback || function(){};
	delete_loading_image(); // delete loading image
	if (!article_list_setup.run) { // first time process
		$(".main-body").append(file_pool.article_list_tmpl(articles)).after(lb(1));
		article_list_pages.init(); // initialize pagination
		article_list_setup.run = true; // register setup flag
		// * Article list events
		$(".article-list")
			// Display live events
			.on("mouseenter", ".over-block", function() {$(this).find(".validate").show()})
			.on("mouseleave", ".over-block", function() {$(this).find(".validate").not(".show").hide()})
			// Publishing live events
			.on("click", ".validate [data-delete]", function() {confirmDelete($(this).attr("data-delete"))})
			.on("click", ".validate [data-validate]", function() {validateArticle($(this).attr("data-validate"))})
			.on("click", ".validate [data-invalidate]", function() {inValidateArticle($(this).attr("data-invalidate"))})
			.on("click", ".validate [data-recall]", function() {recallArticle($(this).attr("data-recall"))});
		// * Toolbar events
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
	} else { // later time process
		articles.drafts.forEach(function(article) {
			$("#articles_draft").append(file_pool.article_item_tmpl(article)).after(lb(1));
		});
		articles.toCheck.forEach(function(article) {
			$("#articles_standby").append(file_pool.article_item_tmpl(article)).after(lb(1));
		});
		articles.onLine.forEach(function(article) {
			$("#articles_publish").append(file_pool.article_item_tmpl(article)).after(lb(1));
		});
	}
	article_list_prefs.refresh(); // update user prefs on articles
	article_list_setup.check_filters = setTimeout(function() { // check filters
		if (article_list_prefs.match()) {
			$("#filter_button").removeClass("orange"); // reset css
			$("#articles_filters_alert").remove(); // remove alert
		} else {
			$("#filter_button").addClass("active orange"); // set css
			$("#filters_list").fadeIn($conf.js_fx ? article_list_setup.fx_d / 2 : 0); // show filters
			createAlertBox($msg.article_no_filter, "articles_filters_alert", {"class" : "warning", "scroll" : false}); // create alert
		}
	}, $conf.js_fx ? article_list_setup.fx_d * 2 : 0);
	callback();
}

function processAfterValidation(article) {
	$("#articles_standby").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1));
	var o = $("#articles_standby li:first");
	o.svg_icons(); // refresh svg icons for newly created article item
	if ($("#standbys").hasClass("active")) {
		o.fadeIn(article_list_setup.fx_d); // show article
	}
}

function processAfterInValidation(article) {
	$("#articles_draft").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1));
	var o = $("#articles_draft li:first");
	o.svg_icons(); // refresh svg icons for newly created article item
	if (o.hasClass("owner") && $("#owner_drafts").hasClass("active")
	 || o.hasClass("other") && $("#other_drafts").hasClass("active")) {
		$("#articles_draft li:first").fadeIn(article_list_setup.fx_d); // show article
	}
}

function processAfterPublish(article) {
	var elems = $("#articles_publish li");
	elems.each(function(elem) {
		var date = new Date(parseInt($(this).attr("data-published"), 10));
		if (date < article.publishedDate) {
			$(this).before(file_pool.article_item_tmpl(article)).prepend(lb(1));
			$(this).prev().svg_icons(); // refresh svg icons for newly created article item
			if ($("#onlines").hasClass("active")) {
				$("#articles_draft li:first").fadeIn(article_list_setup.fx_d); // show article
				$(this).prev().fadeIn(article_list_setup.fx_d); // show article
			}
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
