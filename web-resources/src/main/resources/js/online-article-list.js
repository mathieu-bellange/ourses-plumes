/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"online_article_mptl" : $loc.tmpl + "online-article.mptl"
}

var article_list_setup = {};

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			// Set page title
			set_page_title($nav.online_article_list.title);
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
					article_list_pages.reflow(); // clear pagination
					if (s.length == 0) {
						if (history.pushState){
							window.history.pushState("", "", location.pathname); // live update address bar without reloading document (HTML5 method)
						}
						displayArticles();
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
		fx_d    : 250    // [int]  Duration of animation effects (ms). Default : 250
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
				if ($conf.debug) {console.log("omg ! not enough content => launch again at once")};
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
			if ($conf.debug) {console.log(" *** pagination inialized")};// DEBUG
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

function displayArticles(url_params, page, callback) {
	var url_params = url_params || window.location.search, page = page || 0, callback = callback || function() {};
	create_loading_image(); // display loading image in any case
	$(".main-body").clear_alert_box(); // remove alert box if any
	if (isLocalHost && $conf.debug && $debug.db_wait) {
		wait_for_execution($debug.db_wait_time, function(){getArticles(url_params, page, callback)}, true); // delay process
	} else {
		getArticles(url_params, page, callback); // process articles list
	}
}

var articlesTimer = 1;
function getArticles(url_params, page, callback) {
	$.ajax({
		type : "GET",
		url : "/rest/articles" + url_params,
		headers : {"page" : page},
		beforeSend : function(request){header_authentication(request)},
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			delete_loading_image(); // delete loading image
			if (!article_list_setup.run) { // first time process
				$(".main-body")
					.prepend(file_pool.article_tool_tmpl(articles) + lb(1)) // process toolbar
					.append(file_pool.article_list_tmpl(articles)).after(lb(1)); // process article list
				article_list_tools.init(); // initialize articles list tools
				article_list_pages.init({"start" : articles.length < 8 ? false : true}); // initialize pagination
				article_list_setup.run = true; // register setup flag
			} else { // later time process
				// 1. clear article list on reflow
				if (page == 0) {
					$("#articles_publish").empty();
				}
				// 2. always feed article list
				articles.forEach(function(article) {
					$("#articles_publish").append(file_pool.article_item_tmpl(article)).after(lb(1));
				});
			}
			$(".main-body").svg_icons(); // always reload icons for main body
			callback();
			if (articles.length < 8) {
				article_list_pages.prompt(); // shutdown pagination process until reflow
				if (articles.length == 0) { // response null
					$(".main-body").create_alert_box($("#articles_publish").children().size() == 0 ? $msg.article_search_empty : $msg.article_search_last, null, {"class" : "info", "icon" : "info", "icon_class" : null, "insert" : "append"});
				}
			}
			$("li a").off();
			$("li a").on("click", function(){
				$.ajax({
					type : "PUT",
					url : "/rest/statistic?path=" + encodeURI($(this).attr("href")),
					contentType : "application/json; charset=utf-8",
					dataType : 'json'
				});
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 503) {
				setTimeout(function() {
					articlesTimer = articlesTimer * 10;
					displayArticles(url_params);
				}, articlesTimer);
			} else {
				delete_loading_image(); // delete loading image
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
