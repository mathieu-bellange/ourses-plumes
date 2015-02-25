/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"online_article_mptl" : $loc.tmpl + "online-article.mptl",
	"widget_timeline_tmpl" : $loc.tmpl + "widget-timeline.tmpl",
	"widget_likebox_tmpl"  : $loc.tmpl + "widget-likebox.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			// Set page title
			set_page_title($nav.home.title);
			// Get templates
			displayArticles();
		},
		init : function() {
			// EMPTY
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Components */
/* ------------------------------------------------------------------ */

var block_list = (function() {
	// Configuration
	var cfg = {
		"list_name"    : ".article-list",         // [sel] The element targeted by the component. Default : ".article-list"
		"item_name"    : ".block",                // [sel] The element's child targeted by the component. Default : ".block"
		"base_name"    : ".over-block",           // [sel] The inner element that will be resized (can be the item itself). Default : ".href-block"
		"desc_name"    : ".summary",              // [sel] A inner text element that can be adjusted in length. Default : ".summary"
		"desc_max_len" : 256,                     // [int] Maximum number of characters of the description (0 for none). Default : 384
		"desc_max_str" : "&nbsp;&hellip;",        // [str] Pattern for description replacement on maximum size reaching. Default : "&nbsp;&hellip;"
		"reload_delay" : 250                      // [int] Time before component reloads after a screen width change (milliseconds). Default : 250
	};
	// Instance variables
	var list = null;
	var item = null;
	var base = null;
	// Instance functions
	function get_num_by_line() {
		return Math.floor(list.outerWidth() / item.width()); // Compute number of items by line
	}
	// Instance methods
	return {
		update : function() {
			var i = 0, a = [], z = item.size(), n = get_num_by_line();
			item.each(function() {
				var desc = $(this).find(cfg.desc_name);
				// Truncate description
				if (cfg.desc_max_len > 0 && desc.text().length > cfg.desc_max_len) {
					desc.html(desc.text().trunc(cfg.desc_max_len) + cfg.desc_max_str)
				}
				// Equalize minimal height
				if (n > 1) {
					// Register item base height
					a.push($(this).find(cfg.base_name).outerHeight());
					if ((i > 0 && (i + 1) % n == 0) || (i == z - 1)) {
						a.sort(function(min, max) {return max-min});
						// Set maximum items base height for the current line
						var h = a.shift().toString().toRem() + "rem";
						// Get items range (i.e. all items indexes of current line)
						var i_min = (i == z - 1 && (i + 1) % n != 0 ? (z - 1) - ((i + 1) % n) : i - n);
						var i_max = (i + 1);
						var i_start = i_min <= 0 ? "" : ":gt(" + i_min + ")";
						var i_end = ":lt(" + i_max + ")";
						// Set item average height for items on current line
						list.find(cfg.item_name + i_start + i_end + " " + cfg.base_name).css("min-height", h);
						a = []; // Reset items base height array
					}
				}
				i++; // Increment items index
			});
		},
		init : function() {
			// Initialize
			list = $(cfg.list_name);
			item = list.find($(cfg.item_name));
			base = list.find($(cfg.base_name));
			var self = this, t = 0;
			// Execution
			list.data("num_by_line", get_num_by_line()); // Register number of items by line for later
			self.update();
			// Document events
			$(window).resize(function() {
				var n = get_num_by_line();
				if (list.data("num_by_line") != n) {
					list.data("num_by_line", n);
					clearTimeout(t);
					t = setTimeout(function() {
						base.css("min-height", ""); // Reset items base height
						self.update(); // Reload component
					}, cfg.reload_delay);
				}
			});
		}
	}
}());

var widgets = (function() {
	return {
		customize : function() {
			var o = "iframe.twitter-timeline"; // target selector
			var d = 250; // check for widget every 250 milliseconds
			var t = 5000; // end checking after 5 seconds
			var l = setInterval(function() {
				if ($(o).length > 0 && $(o).css("width") == "282px") {
					$(o).css("width", "100%"); // set full width style
					$(o).attr("height", ""); // reset height attribute (i.e. fix wrong shape bug)
					clearInterval(l); // clear interval
					clearTimeout(x); // clear timeout
				}
			}, d);
			var x = setTimeout(function() {
				clearInterval(l); // clear interval
			}, t);
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayArticles() {
	$.ajax({
		type : "GET",
		url : "/rest/articles/last",
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			$(".main-body").append(file_pool.article_list_tmpl(articles) + lb(1));
			displayLastWebReview(); // get last web review
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

function displayLastWebReview() {
	$.ajax({
		type : "GET",
		url : "/rest/articles/last/review",
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$("#articles_publish").prepend(file_pool.article_item_tmpl(article)).prepend(lb(1)); // preprend last web review
			$("#articles_publish > li").first().addClass("hide"); // EDIT : add class 'hide' instead of 'web-review'
			$("#articles_publish > li").not(":first").addClass("block"); // set up block list classes
			$("#articles_publish")
				.wrap("<div class='row collapse'></div>") // add row wrapper
				.wrap("<div class='column small-24 large-16'></div>"); // add column wrapper with padding fix
			displaySocialNetwork();
			$("#articles").svg_icons(); // always reload icons only for articles
			block_list.init(); // initialize block list component
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status !== 404){
				createAlertBox();
			}
			displaySocialNetwork();
			$("#articles").svg_icons(); // always reload icons only for articles
			block_list.init(); // initialize block list component
		},
		dataType : "json"
	});
}

function displaySocialNetwork(){
	if ($build.timeline && isComputer()) {
		$("head").append("<script src='https://platform.twitter.com/widgets.js' id='twitter-wjs'></script>").append(lb(1)); // insert Twitter widget API
		var timeline = $("<div class='column small-24 large-8'>").html(file_pool.widget_timeline_tmpl());
		$("#articles").find(".row").first().append(timeline); // append Twitter timeline to first row in section
		widgets.customize(); // apply custom settings
	}
	if ($build.likebox && isComputer() && Modernizr.mq("(min-width: 640px)")) { // display Facebook likebox only on small width and above devices (i.e. faces overflow bug fix)
		$("#articles").append(file_pool.widget_likebox_tmpl()).append(lb(1)); // append Facebook likebox to section
	}
}
