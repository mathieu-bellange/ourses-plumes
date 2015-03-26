/**
 * Les Ourses à plumes
 * Javascript Main File
 * Require jQuery Library
 * ver. 1.1.0
 */

/* ------------------------------------------------------------------ */
/* # Core */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Below is a minimalistic proto type check shorthand.
 * This is not a tribute to neither Malcom nor Angus Young.
 * 'is_def(typeof var)' returns 'true' or 'false' (without ref error).
 */

/* Is Defined */
function is_def(type) {
	return type !== "undefined";
}

/* ------------------------------------------------------------------ */
/* # Protos */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Below are private javascript prototypes extensions.
 * They must be called before anything else.
 * Well, at least if you can catch the rime of an ancient mariner ...
 */

/* Cut string
 * Remove characters from a string up to an end point
 * and return the result.
 * "momolebite".cut(4) returns "lebite"
 * "momolebite".cut(-4) returns "momole"
 */
String.prototype.cut = function(start) {
	// return this.substr(start, this.length);
	return (start < 0 ? this.substr(0, this.length + start) : this.substr(start, this.length));
};

/* Truncate string
 * Remove all characters from a string begining at a starting point
 * and return the result.
 * "momolebite".trunc(4) returns "momo"
 * "momolebite".trunc(-4) returns "bite"
 */
String.prototype.trunc = function(end) {
	return (end < 0 ? this.substr(end, this.length) : this.substr(0, end));
};

/* Capitalize string
 * Convert the very first letter of a string to upper case.
 * "momolebite".capitalize() returns "Momolebite"
 * "MO MOLE BITE".capitalize() returns "Mo mole bite"
 */
String.prototype.capitalize = function() {
	return (this.trunc(1).toUpperCase() + this.cut(1).toLowerCase());
};

/* Format string numeric
 * Fill a string with pattern up to length (default pattern is "0").
 * "7".format(3) returns "007"
 * "lebite".format(9, "mo") returns "momolebite"
 */
String.prototype.format = function(l, p) {
	var p = p || "0", s = this;
	while (s.length < l) { s = p + s }
	return s;
};

/* Format string literal
 * Fill a formatted string with pattern object or string.
 * "%2-%1-%3".sprintf(["momo", "le"]) returns "le-momo-"
 * "%3 no %1".sprintf("momo") returns " no momo"
 */
String.prototype.sprintf = function(a) {
	var a = a || [], s = this;
	if (typeof(a) === "string") {s = s.replace("%1", a)} else {
	for (n in a) {s = s.replace("%" + (parseInt(n) + 1).toString(), a[n])}}
	return s.replace(/%[\d]+/g, "");
};

/* Encode string to UTF-8 */
String.prototype.encode = function() {
	return unescape(encodeURIComponent(this));
};

/* Decode string from UTF-8 */
String.prototype.decode = function() {
	return decodeURIComponent(escape(this));
};

/* Unbind email address
 * Replace separators from a valid email address by whitespaced strings.
 * "gizmo@mogwai.ch".unbind_email() returns "gizmo at mogwai dot ch"
 */
String.prototype.unbind_postmail = function() {
	return this.replace(/@/g, " at ").replace(/\./g, " dot ");
};

/* Rebind email address
 * Replace whitespaced strings from an unbound email address by valid separators.
 * "gizmo at mogwai dot ch".rebind_email() returns "gizmo@mogwai.ch"
 */
String.prototype.rebind_postmail = function() {
	return this.replace(/ at /g, "@").replace(/ dot /g, ".");
};

/* Get postmaster (from an email address)
 * Returns a valid email address local part.
 * "gizmo@mogwai.ch".get_postmaster() returns "gizmo"
 */
String.prototype.get_postmaster = function() {
	return this.split("@")[0];
};

/* Get postdomain (from an email address)
 * Returns a valid email address domain part.
 * "gizmo@mogwai.ch".get_postdomain() returns "mogwai.ch"
 */
String.prototype.get_postdomain = function() {
	return this.split("@")[1];
};

/* String to Document Root EM unit
 * Convert pixel string or numeric to root EM float.
 * "20px" returns 1.25
 */
String.prototype.toRem = function() {
	var n = parseFloat(this.replace("px", ""));
	var r = parseFloat(window.getComputedStyle(document.querySelector("body")).getPropertyValue("font-size").replace("px", ""));
	return (n / r);
};

/* Numeric to Pixel unit
 * Convert root EM numeric to pixel integer.
 * 1.25 returns 20
 */
Number.prototype.toPx = function() {
	var n = this;
	var r = parseFloat(window.getComputedStyle(document.querySelector("body")).getPropertyValue("font-size").replace("px", ""));
	return (n * r);
};

/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loap_pool = {
//"varname"                       : "filename" (which be replaced in object by file text/plain content on execution)
	"dev_toolbar_tmpl"              : $loc.tmpl + "_dev_toolbar.tmpl",
	"ui_plugins_mptl"               : $loc.tmpl + "ui_plugins.mptl",
	"user_nav_tmpl"                 : $loc.tmpl + "user-nav.tmpl",
	"frame_tmpl"                    : $loc.tmpl + "frame.tmpl",
	"icons_fx_file"                 : $file.icons_fx,
	"icons_file"                    : $file.icons
};
var loax_pool = loax_pool || null;
var file_pool = $.extend({}, loap_pool, loax_pool);

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */
/*
 * NOTE
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
		build : function() {
			// Apply css debug
			if ($conf.css_debug) {$("body").addClass("css-debug")}
			// Apply css fx
			if ($conf.css_fx) {$("body").addClass("css-fx")}
			// Build container
			if ($build.container) {
				// Apply standard layout (i.e. two columns view)
				$("body").addClass("standard-layout");
				// Prepend frame
				$("body").prepend(file_pool.frame_tmpl).prepend(lb(1));
			}
			// Build toolbar template
			if ($build.toolbar) {$("body").prepend(file_pool.dev_toolbar_tmpl).prepend(lb(1))}
			// Build icons
			if ($build.icons) {
				// Prepend SVG effects
				if ($conf.svg_fx) {
					$("body").prepend(tb(2) + "<style type='text/css'>" + lb(1) + file_pool.icons_fx_file + lb(1) + tb(2) + "</style>").prepend(lb(1))
				}
				// Prepend SVG icons
				$("body").prepend(file_pool.icons_file).prepend(lb(1));
			}
			compatibilityWarning(); // user warning for compatibilities issues
		},
		update : function() {
			$(document).svg_icons(); // WARNING : set svg icons for whole document
			$(document).user_pictures(); // WARNING : set user pictures for whole document
		},
		init : function() {
			/* Load components */
			this.update();
			$(document).placeholder(); // set placeholder for whole document
			$(document).zlider(); // launch zlider for whole document
			/* Apply user settings */
			check_user_connected();
			set_toolbar_prefs();
			user_menu.init(); // setup user menu
			check_current_page(); // check_current page
		}
	};
}());

/* ------------------------------------------------------------------ */
/* # Files Loader */
/* ------------------------------------------------------------------ */

$.holdReady(true); // hold document ready event

(function() {
	// vars
	var files_readied = 0; // internal -- number of files to load
	var files_ready   = 0; // internal -- number of files loaded
	// functions
	function checkReady() {
		files_ready++;
		if (files_ready == files_readied) {
			loap.build(); // process primary build
			if (typeof loax !== "undefined" && loax.hasOwnProperty("build")) {
				loax.build(); // process auxiliary build
			}
			$.holdReady(false); // release document ready event
		}
	}
	function setFileCallback(varname) {
		return function(XHRresponse) {
			if (file_pool[varname].trunc(-4) == "tmpl") {
				file_pool[varname] = doT.compile(XHRresponse);
			} else if (file_pool[varname].trunc(-4) == "mptl") {
				var r = XHRresponse.split($regx.mptl);
				for (var i = 0; i < r.length - 3; i += 3) {
					file_pool[r[i+1]] = doT.compile(r[i+2]);
				}
			} else if (file_pool[varname].trunc(-4) == "json") {
				file_pool[varname] = JSON.parse(XHRresponse);
			} else {
				file_pool[varname] = XHRresponse;
			}
			checkReady();
		}
	}
	// process
	for (key in file_pool) { files_readied++ }
	for (varname in file_pool) {
		loadfile(file_pool[varname], setFileCallback(varname));
	}
}());

/* ------------------------------------------------------------------ */
/* # Plugins */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Below are methods and jQuery extensions required by the module.
 * They have to be called before anything else.
 * Be carefull with them or beware Bilbo Baggin's mighty wrath !
 */

/* Force Focus */
jQuery.fn.extend({
	force_focus : function() {
		this.focus();
		if ($conf.js_fx) {
			this
				.animate({"opacity" : ".25"}, $time.duration.fx_short / 2)
				.animate({"opacity" : "1"}, $time.duration.fx_short);
		}
	}
});

/* Toggle Tabnav */
jQuery.fn.extend({
	disable_tabnav : function() {
		$(this).find("[tabindex]").each(function() {
			$(this).data("tabindex", $(this).attr("tabindex"));
			$(this).attr("tabindex", "-1");
		});
		$(this).find("a").attr("tabindex", "-1");
	},
	renable_tabnav : function() {
		$(this).find("a").each(function() {
			if (!$(this).data("tabindex")) {
				$(this).removeAttr("tabindex");
			}
		});
		$(this).find("[tabindex]").each(function() {
			$(this).attr("tabindex", $(this).data("tabindex"));
		});
	}
});

/* Cursor Position */
jQuery.fn.extend({
	select_text : function(start, end) {
		end = end || false;
		obj = this.first().get(0);
		obj.focus();
		obj.setSelectionRange(start, end || start);
	}
});

/* Scroll To */
jQuery.fn.extend({
	scroll_to : function(opts) {
		var defs = {
			"fx_d"    : 0,          // Integer   Duration of scroll effect in milliseconds. Default : 0
			"spacing" : 0           // Integer   Additional spacing added to scroll in pixel. Default : 0
		};
		var cfg = $.extend({}, defs, opts);
		var obj = this; // internal
		if (obj.offset().top + obj.height() > $(window).height() + $(document).scrollTop()) { // scroll down
			$("html, body").animate({ // NOTE : 'html' for FF/IE and 'body' for Chrome
				scrollTop : obj.offset().top + obj.outerHeight() - $(window).height() + cfg.spacing
			}, $conf.js_fx ? cfg.fx_d : 0);
		} else if (obj.offset().top < $(document).scrollTop()) { // scroll up
			$("html, body").animate({ // NOTE : 'html' for FF/IE and 'body' for Chrome
				scrollTop : obj.offset().top - cfg.spacing
			}, $conf.js_fx ? cfg.fx_d : 0);
		}
	}
});

/* Update separators */
jQuery.fn.extend({
	update_separators : function(next, last) {
		var next = next || ", ", last = last || "&nbsp;et ";
		$(this).find(".separator").html(next)
		$(this).find(".separator:last").html(last)
	}
});

/* Reload (Foundation) Tooltip
 * NOTE : This a Foundation only extension.
 * It handles tooltips for elements with ID defined or not.
 */
jQuery.fn.extend({
	reload_tooltip : function(tip) {
		var tip = tip || "";
		$(this).each(function() {
			var selector = ($(this).attr("id") !== undefined ? "[data-selector='" + $(this).attr("id") + "']" : "[id='" + $(this).attr("data-selector") + "']");
			tip !== "" ? $(selector).html(tip + "<span class='nub'></span>") : $(selector).remove();
		});
	}
});

/* Placeholder
 * Fake 'placeholder' attribute for compatibility purpose.
 * 1. Set data-placeholder="myString"
 * 2. Set data-placeholder and manually feed the element with <p class="placeholder">myString</p>. (e.g. inline-editor -- doesn't support custom data-* attributes)
 */
jQuery.fn.extend({
	placeholder : function(opts) {
		// vars
		var defs = {
			"tag" : "span",                         // String    The tag of the placeholder element. Default : "span"
			"attr" : "data-placeholder",            // String    Attribute name of the placeholder element. Default : "data-placeholder"
			"class" : "placeholder",                // String    Class name of the placeholder element. Default : "placeholder"
			"delay" : 10                            // Integer   Timeout before checking empty field value on blur (ms). Default : 10
		};
		var cfg = $.extend({}, defs, opts);
		var t = 0;
		// functions
		function removePlaceholder(obj) {
			if (obj.data("placeholder_value") === undefined) {
				obj.data("placeholder_value", obj.find("." + cfg.class).text()); // store placeholder
				obj.find("." + cfg.class).remove();
			}
		}
		// loop
		$(this).each(function () {
			// events
			$(this).on("focusin", "[" + cfg.attr + "]", function() {
				clearTimeout(t);
				removePlaceholder($(this)); // erase placeholder
			});
			$(this).on("keypress", "[" + cfg.attr + "]", function(event) {
				if (event.which !== 9) { // Tab
					removePlaceholder($(this)); // erase placeholder
				}
			});
			$(this).on("blur", "[" + cfg.attr + "]", function() {
				var self = $(this);
				t = setTimeout(function() {
					if (!$("#cke_inline_editor").is(":visible")) {
						if (self.find("iframe").length == 0 && self.text().trim().length == 0) {
							self.html("<" + cfg.tag + " class='" + cfg.class + "'>" + self.data("placeholder_value") + "</" + cfg.tag + ">"); // append placeholder
							self.removeData("placeholder_value");
						}
					}
				}, cfg.delay);
			});
			// init
			$("[" + cfg.attr + "]").each(function() {
				if ($(this).attr(cfg.attr) !== "") {
					$(this).html("<span class='" + cfg.class + "'>" + $(this).attr(cfg.attr) + "</span>");
				}
			});
		});
	}
});

/* User Pictures */
jQuery.fn.extend({
	user_pictures : function(opts) {
		// Variables
		var defs = {
			attr : "data-image",  // String  Define the data attribute containing image URL. Default : "data-image"
		};
		var cfg = $.extend({}, defs, opts);
		// Loop
		$(this).each(function() {
			var obj = $(this).find("[" + cfg.attr + "]");
			obj.each(function() {
				var file = $(this).attr(cfg.attr);
				$(this).css("background-image", "url('" + file + "')")
			});
		});
	}
});

/* SVG Icons */
jQuery.fn.extend({
	svg_icons : function(opts) {
		// Variables
		var defs = {
			s_null : true,                          // Boolean   Set icons display size to zero (i.e. hide SVG on plain HTML). Default : true
			s_default : 48,                         // Integer   Default icons display size in px. Default : 48
			s_tiny : 24,                            // Integer   Tiny icons display size in px. Default : 24
			s_small : 32,                           // Integer   Small icons display size in px. Default : 32
			s_medium : 40,                          // Integer   Medium icons display size in px. Default : 48
			s_large : 56,                           // Integer   Large icons display size in px. Default : 64
			s_huge : 80,                            // Integer   Huge icons display size in px. Default : 80
			i_selector : "[class*='icon-']",        // String    Define the original icon selector. Default : [class*='icon-']
			i_classmatch : /icon-[a-z]*/,           // Regexp    Define the SVG icon id match from attribute class. Default : /icon-[a-z]*/
			i_classname : "icon",                   // String    Define the output SVG icon holder class. Default : "icon"
			i_classes : {                           // Object    Colored icons associative array (i.e. "icon_name" : "color")
				"struggles" : "orange",               // Default : "orange"
				"ourbody" : "fuschia",                // Default : "fuschia"
				"intersec" : "red",                   // Default : "red"
				"internat" : "blue",                  // Default : "blue"
				"educult" : "turquoise",              // Default : "turquoise"
				"ideas" : "golden",                   // Default : "golden"
				"syndicate" : "honey",                // Default : "honey"
				"twitter" : "skyblue",                // Default : "skyblue"
				"facebook" : "royalblue",             // Default : "royalblue"
				"googleplus" : "firered",             // Default : "firered"
				"tumblr" : "royalblue",               // Default : "royalblue"
				"linkedin" : "electricblue",          // Default : "electricblue"
				"pinterest" : "firered",              // Default : "firered"
				"stumbleupon" : "gingerred"           // Default : "gingerred"
			}
		};
		var cfg = $.extend({}, defs, opts);
		// Loop
		$(this).each(function() {
			// Define object
			var obj = $(this).find(cfg.i_selector);
			obj.each(function() {
				// Retrieve icon hypertext reference from object class
				var c = $(this).attr("class").match(cfg.i_classmatch).toString();
				var i = c.substr(5, c.length);
				var k = cfg.i_classname;
				// Define icon color class from icon hypertext reference
				if (cfg.i_classes.hasOwnProperty(i)) {
					k += " " + cfg.i_classes[i];
				}
				// Set svg element width and height attributes
				var s = cfg.s_default;
				if (cfg.s_null == true) {s = 0}
				else if ($(this).hasClass("tiny")) {s = cfg.s_tiny}
				else if ($(this).hasClass("small")) {s = cfg.s_small}
				else if ($(this).hasClass("medium")) {s = cfg.s_medium}
				else if ($(this).hasClass("large")) {s = cfg.s_large}
				else if ($(this).hasClass("huge")) {s = cfg.s_huge}
				// Define svg icon html code
				var h = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" focusable='false' viewBox='0 0 48 48' width='" + s + "' height='" + s + "'><use xlink:href='#" + c + "'></use></svg>";
				// Append svg icon html code
				$(this).removeClass(c);
				$(this).addClass(k);
				$(this).prepend(h);
			});
		});
	}
});

/* Options Select */
jQuery.fn.extend({
	options_select : function(opts) {
		// vars
		var defs = {
			"select"          : ".select",                  // String   Selector of the value holder element. Default : "span"
			"options"         : ".options",                 // String   Selector of the list of choices itself. Default : "ul"
			"slide_duration"  : "fast",                     // Integer  Length of the sliding effect in milliseconds. Default : "fast"
			"scroll_duration" : 500,                        // Integer  Length of the scrolling effect in milliseconds. Default : 500
			"scroll_spacing"  : 0                           // Integer  Size of the scrolling spacing in pixels. Default : 0
		};
		var cfg = $.extend({}, defs, opts);
		// loop
		$(this).each(function () {
			// vars
			var self = this;
			// set initially selected value if any
			if ($(this).find(cfg.options + " > li").hasClass("selected")) {
				var str = $(this).find(cfg.options + " > li.selected").text();
				$(this).find(cfg.select).text(str);
			}
			// prevent options list from being selected
			$(this).attr("onSelectStart", "return false"); // IE 9
			$(this).css({
				"-ms-user-select" : "none", // IE 10+
				"-moz-user-select" : "none", // Firefox
				"-webkit-user-select" : "none" // Chrome 6.0, Safari 3.1, Opera 15.0
			});
			// bind events
			$(this).bind({
				blur: function() {
					$(this).data("last_value", $(this).find(cfg.options + " > li.selected").index()); // register last value
					$conf.js_fx ? $(this).find(cfg.options).slideUp(cfg.slide_duration) : $(this).find(cfg.options).hide();
				},
				keydown: function(e) {
					if (e.which == 13) { // Enter
						$(this).blur();
					}
					else if (e.which == 27) { // Escape
						var q = $(this).data("last_value");
						if (typeof(q) !== "undefined" && q != -1) {
							$(this).find(cfg.options + " > li").removeClass("selected");
							$(this).find(cfg.options + " > li").eq(q).addClass("selected");
							var s = $(this).find(cfg.options + " > li.selected").text();
							$(this).find(cfg.select).text(s);
						}
					}
					else if (e.which == 32) { // Space
						if ($conf.js_fx) {
							$(this).find(cfg.options).slideToggle(cfg.slide_duration, function() {
								$(self).scroll_to({"spacing" : $(self).find(cfg.select).outerHeight()});
							});
						} else {
							$(this).find(cfg.options).toggle();
							$(self).scroll_to({"spacing" : $(self).find(cfg.select).outerHeight()});
						}
					}
					else if (e.which >= 33 && e.which <= 36 || e.which == 38 || e.which == 40) { // PageUp, PageDown, End, Home or Up or Down
						e.preventDefault();
						var index = $(this).find(cfg.options + " > li.selected").index();
						if (index == -1) {
							$(this).find(cfg.options + " > li").not(".disabled").first().addClass("selected");
							index = 0;
						}
						if (e.which == 33 || e.which == 36) { // PageUp or Home
							$(this).find(cfg.options + " > li").removeClass("selected");
							$(this).find(cfg.options + " > li").first().addClass("selected");
						}
						if (e.which == 34 || e.which == 35) { // PageDown or End
							$(this).find(cfg.options + " > li").removeClass("selected");
							$(this).find(cfg.options + " > li").last().addClass("selected");
						}
						if (e.which == 38 && index - 1 >= 0) { // Up
							$(this).find(cfg.options + " > li:eq(" + index + ")").prevAll("li:not(.disabled)").first().addClass("selected");
							if ($(this).find(cfg.options + " > li:eq(" + index + ")").prevAll("li:not(.disabled)").first().hasClass("selected")) {
								$(this).find(cfg.options + " > li:eq(" + index + ")").removeClass("selected");
							}
						}
						if (e.which == 40 && index + 1 < $(this).find(cfg.options + " > li").length) { // Down
							$(this).find(cfg.options + " > li:eq(" + index + ")").nextAll("li:not(.disabled)").first().addClass("selected");
							if ($(this).find(cfg.options + " > li:eq(" + index + ")").nextAll("li:not(.disabled)").first().hasClass("selected")) {
								$(this).find(cfg.options + " > li:eq(" + index + ")").removeClass("selected");
							}
						}
						// scrolling
						if ($(this).find(cfg.options + " > li").hasClass("selected")) {
							var str = $(this).find(cfg.options + " > li.selected").text();
							$(this).find(cfg.select).text(str);
							if ($(this).find(cfg.options + " > li.selected").is(":first-child")) {
								$(this).find(cfg.select).scroll_to({"fx_d" : $time.duration.fx_short, "spacing" : $(this).find(cfg.select).outerHeight()});
							} else if ($(this).find(cfg.options + " > li.selected").is(":last-child")) {
								$(this).find(cfg.options + " > li.selected").scroll_to({"fx_d" : $time.duration.fx_short, "spacing" : $(this).find(cfg.select).outerHeight()});
							} else {
								$(this).find(cfg.options + " > li.selected").scroll_to();
							}
						}
					}
				}
			});
			$(this).on("click", cfg.select, function() {
				if ($conf.js_fx) {
					$(this).next(cfg.options).slideToggle(cfg.slide_duration, function() {
						$(self).scroll_to({"spacing" : $(self).find(cfg.select).outerHeight()});
					});
				} else {
					$(this).next(cfg.options).toggle();
					$(self).scroll_to({"spacing" : $(self).find(cfg.select).outerHeight()});
				}
			});
			$(this).on("click", cfg.options + " > li", function() {
				if (!$(this).hasClass("disabled")) {
					var str = $(this).text();
					$(this).addClass("selected");
					$(this).siblings().removeClass("selected");
					$(this).parent(cfg.options).prev(cfg.select).text(str);
					$conf.js_fx ? $(this).parent(cfg.options).slideToggle(cfg.slide_duration) : $(this).parent(cfg.options).toggle();
				}
			});
		});
	}
});

/* Custom Slider */
jQuery.fn.extend({
	zlider: function(opts) {
		var defs = {
			"prev_selector"  : ".prev",        // Selector  Forward controller. Default : ".prev"
			"next_selector"  : ".next",        // Selector  Backward controller. Default : ".next"
			"ctrl_selector"  : "span",         // Selector  Inner controller element. Default : "span"
			"inner_selector" : "ul",           // Selector  Inside box (i.e. the sliding content). Default : ".fast-nav ul"
			"item_selector"  : "li",           // Selector  Items contained by the inner box. Default : "li"
			"link_selector"  : "a",            // Selector  Links contained by each item. Default : "a"
			"slide_duration" : 125,            // Duration  Length of the sliding effect. Default : 125
			"resize_timeout" : 500,            // Duration  Time before slider is reset after window resize. Default : 500
			"extra_spacing"  : 1,              // Integer   Additional safety spacing added to inside box (px). Default : 1
		};
		cfg = $.extend({}, defs, opts);
		$("[data-zlider]").each(function() {
			// vars
			var resize_count = 0;
			var slide_count = 0;
			var slide_step = 0;
			var inner_left = 0;
			var inner_width = 0;
			var self = $(this);
			// functions
			function get_items_width(list, item, include_margin) { // obj, selector, [boolean]
				var include_margin = include_margin || true, n = 0;
				list.find(item).each(function() {
					n += $(this).outerWidth(include_margin);
				});
				return n;
			}
			function set_items_focusability(list, item, width) { // obj, selector, numeric
				var min_x = list.offset().left;
				var max_x = list.offset().left + width;
				list.find(item).each(function() {
					var x = $(this).offset().left;
					if (x > min_x && x < max_x) {
						$(this).find(cfg.link_selector).removeAttr("tabindex");
					} else {
						$(this).find(cfg.link_selector).attr("tabindex", "-1");
					}
				});
			}
			function setup(obj) {
				var outer_width = get_items_width(obj, cfg.item_selector); // internal ; compute total width
				if (obj.width() < outer_width) { // setup component if needed
					$(".prev, .next").show(); // show slider controls
					// define vars
					var prev = {
						"width" : obj.find(cfg.prev_selector).width(),
						"padding" : parseFloat(obj.find(cfg.prev_selector).css("padding-right"))
					};
					var next = {
						"width" : obj.find(cfg.next_selector).width(),
						"padding" : parseFloat(obj.find(cfg.next_selector).css("padding-left"))
					};
					inner_left = prev.width;
					inner_width = obj.width() - (prev.width + next.width + prev.padding + next.padding);
					// proceed positioning and sizing
					obj.find(cfg.inner_selector).css("left", inner_left);
					obj.find(cfg.inner_selector).css("width", outer_width + cfg.extra_spacing);
					obj.find(cfg.next_selector).find(cfg.ctrl_selector).addClass("disabled");
					obj.find(cfg.prev_selector).find(cfg.ctrl_selector).removeClass("disabled");
					obj.find(cfg.prev_selector).css({"padding-right" : "0", "background" : "none"});
					slide_step = Math.floor(outer_width / inner_width); // compute sliding steps
					set_items_focusability(obj, cfg.item_selector, inner_width); // set items focusability
				} else {
					obj.find(cfg.prev_selector + ", " + cfg.next_selector).hide();
					obj.find(cfg.inner_selector).css("width", "auto");
					obj.find(cfg.inner_selector).css("left", "0");
					slide_count = 0; // reset count
				}
			}
			function slide(obj, dir, e) { // obj, forward|backward, mouse|keyboard
				var dir_selector = (dir == "forward" ? cfg.next_selector : cfg.prev_selector);
				var reverse_selector = (dir == "forward" ? cfg.prev_selector : cfg.next_selector);
				var e_event = (e == "mouse" ? "mousedown" : "keydown");
				obj.find(reverse_selector + " " + cfg.ctrl_selector).removeClass("disabled");
				dir == "forward" ? obj.find(dir_selector).css({"padding-left" : "", "background" : ""}) : obj.find(dir_selector).css({"padding-right" : "", "background" : ""});
				if (!obj.find(dir_selector).hasClass("disabled")) {
					obj.find(dir_selector).find(cfg.ctrl_selector).data(e_event, true);
					if (dir == "forward" ? slide_count < 0 : slide_count > -slide_step) {
						dir == "forward" ? slide_count++ : slide_count--;
						inner_left = (dir == "forward" ? inner_left + inner_width : inner_left - inner_width);
						obj.find(cfg.inner_selector).animate({"left" : inner_left}, $conf.js_fx ? cfg.slide_duration : 0, function() {
							set_items_focusability(obj, "li", inner_width);
							if (dir == "forward" ? slide_count < 0 : slide_count > -slide_step) {
								if ($conf.js_fx) {
									if (obj.find(dir_selector).find(cfg.ctrl_selector).data(e_event) == true) {
										if (e_event == "mousedown") {
											obj.find(dir_selector).find(cfg.ctrl_selector).mousedown();
										} else if (e_event == "keydown") {
											obj.find(dir_selector).find(cfg.ctrl_selector).keydown();
										}
									}
								}
							} else {
								obj.find(dir_selector).find(cfg.ctrl_selector).addClass("disabled");
								dir == "forward" ? obj.find(reverse_selector).css({"padding-right" : "0", "background" : "none"}) : obj.find(reverse_selector).css({"padding-left" : "0", "background" : "none"});
							}
						});
					} else {
						obj.find(dir_selector).find(cfg.ctrl_selector).addClass("disabled");
						dir == "forward" ? obj.find(reverse_selector).css({"padding-right" : "0", "background" : "none"}) : obj.find(reverse_selector).css({"padding-left" : "0", "background" : "none"});
					}
				}
			}
			// events
			$(this).find(cfg.prev_selector + " " + cfg.ctrl_selector).mousedown(function() {
				slide(self, "backward", "mouse");
			});
			$(this).find(cfg.next_selector + " " + cfg.ctrl_selector).mousedown(function() {
				slide(self, "forward", "mouse");
			});
			$(this).find(cfg.prev_selector + " " + cfg.ctrl_selector + ", " + cfg.next_selector + " " + cfg.ctrl_selector).mouseup(function() {
				$(this).removeData("mousedown");
			});
			$(this).find(cfg.prev_selector + " " + cfg.ctrl_selector).keydown(function(e) {
				if (e.which == 13) { // Enter
					slide(self, "backward", "keyboard");
				}
			});
			$(this).find(cfg.next_selector + " " + cfg.ctrl_selector).keydown(function(e) {
				if (e.which == 13) { // Enter
					slide(self, "forward", "keyboard");
				}
			});
			$(this).find(cfg.prev_selector + " " + cfg.ctrl_selector + ", " + cfg.next_selector + " " + cfg.ctrl_selector).keyup(function(e) {
				if (e.which == 13) { // Enter
					$(this).removeData("keydown");
				}
			});
			$(window).resize(function() {
				if (resize_count == 0) {
					resize_count++;
					setTimeout(function() {
						resize_count = 0;
						setup(self);
					}, cfg.resize_timeout);
				}
			});
			setup($(this)); // init
		});
	}
});

/* Autocomplete */
jQuery.fn.extend({
	autocomplete : function(opts) {
		// vars
		var defs = {
			"selector"                 : ".autocomplete",  // String   Selector of the element containing the <ul> feeded by the autocomplete. Default : ".autocomplete"
			"start_chars_num"          : 3,                // Integer  The number of characters from which the autocomplete begins. Default : 3
			"max_displayed_items"      : 6,                // Integer  The number of displayed items in the autocomplete suggestions box. Default : 6
			"white_spaces_replacement" : " ",              // String   Whites spaces are replaced by that string. Default : " "
			"accepted_chars_list"      : $regx.tags        // Regexp   The valid characters pattern.
		};
		var cfg = $.extend({}, defs, opts);
		var i = cfg.start_chars_num; // internal
		// functions
		function check_error(sel) {
			if (cfg.accepted_chars_list.test($(sel).val())) {
				$(sel).set_validation(false, $msg.char_illegal);
			} else if ($(sel).val().trim().length == 0) {
				$(sel).set_validation(null);
			} else {
				$(sel).set_validation(true);
			}
		}
		// loop
		$(this).each(function() {
			var self = $(this);
			var sel = $(this).nextAll(cfg.selector).first(); // this is suggestion list container
			// events
			$(this).bind({
				focus : function() {
					sel.removeClass("hide");
					check_error(this); // check error
				},
				blur : function() {
					$(this).val($(this).val().trim()); // remove white spaces
					$(this).val($(this).val().replace(/\s+/g, cfg.white_spaces_replacement)); // replace white spaces
					sel.addClass("hide");
					check_error(this); // check error
				},
				keydown : function(e) {
					if (e.which == 27) { // Escape
						$(this).blur();
					} else if (e.which == 33 || e.which == 34 || e.which == 38 || e.which == 40) { // PageUp or PageDown or or Up or Down
						e.preventDefault();
						index = 0;
						var index = sel.find("ul > li.selected").index();
						if (index == -1) {
							sel.find("ul > li").not(".hide").first().addClass("selected");
						}
						if (e.which == 33) { // PageUp
							sel.find("ul > li").removeClass("selected");
							sel.find("ul > li").not(".hide").first().addClass("selected");
						}
						if (e.which == 34) { // PageDown
							sel.find("ul > li").removeClass("selected");
							sel.find("ul > li").not(".hide").last().addClass("selected");
						}
						if (e.which == 38 && index - 1 >= 0) { // Up
							sel.find("ul > li:eq(" + index + ")").prevAll("li:not('.hide')").first().addClass("selected");
							if (sel.find("ul > li:eq(" + index + ")").prevAll("li:not('.hide')").first().hasClass("selected")) {
								sel.find("ul > li:eq(" + index + ")").removeClass("selected");
							}
						}
						if (e.which == 40) { // Down
							sel.find("ul > li:eq(" + index + ")").nextAll("li:not('.hide')").first().addClass("selected");
							if (sel.find("ul > li:eq(" + index + ")").nextAll("li:not('.hide')").first().hasClass("selected")) {
								sel.find("ul > li:eq(" + index + ")").removeClass("selected");
							}
						}
						var s = sel.find("ul > li.selected").text();
						$(this).val(s);
						// scroll to selected item
						if (sel.find("ul > li").hasClass("selected")) {
							if (sel.find("ul > li").not(".hide").first().hasClass("selected")) {
								$(this).scroll_to({"fx_d" : $time.duration.fx_short, "spacing" : $(this).outerHeight()});
							} else if (sel.find("ul > li").not(".hide").last().hasClass("selected")) {
								sel.find("ul > li.selected").scroll_to({"fx_d" : $time.duration.fx_short, "spacing" : $(this).outerHeight()});
							} else {
								sel.find("ul > li.selected").scroll_to();
							}
						}
					}
				},
				keyup : function(e) {
					if (e.which !== 13) { // NOT Enter
						check_error(this);
					}
					if ((e.which >= 48 && e.which <= 57) || (e.which >= 64 && e.which <= 90) || (e.which >= 96 && e.which <= 105) || e.which == 32 || e.which == 8 || e.which == 46) { // From 0 to 9 or from A to Z or from Numpad 0 to Numpad 9 or Space or Backspace or Del
						sel.find("ul > li").removeClass("selected"); // unselect all
						if (e.which == 8 || e.which == 46) { // Backspace or Del
							if (i > 0) {
								i -= 1;
							}
						}
						if ($(this).val().length >= cfg.start_chars_num) {
							var k = 0;
							var m = $(this).val();
							i = $(this).val().length;
							sel.find("ul > li").each(function() {
								var r = $(this).text().slice(0, i);
								if (r.toLowerCase() == m.toLowerCase() && k < cfg.max_displayed_items) {
									var str = $(this).text();
									var html = "<mark>" + str.slice(0, i) + "</mark>" + str.substr(i, str.length);
									$(this).html(html);
									$(this).removeClass("hide");
									k++;
								} else {
									$(this).addClass("hide");
								}
							});
							// scroll
							if (sel.offset().top + sel.height() > $(window).height() + $(document).scrollTop()) {
								sel.find("ul > li:visible").last().scroll_to({"fx_d" : $time.duration.fx, "spacing" : $(this).outerHeight()});
							} else {
								sel.parent().scroll_to({"fx_d" : $time.duration.fx, "spacing" : $(this).outerHeight()});
							}
						} else {
							sel.find("ul > li").each(function() {
								$(this).addClass("hide"); // hide all autocompletion items
							});
						}
					}
				},
			});
			sel.on("mouseenter", "ul > li", function() {
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
				self.val($(this).text());
				check_error(self); // check error
			});
			sel.on("mouseleave", "ul > li", function() {
				$(this).removeClass("selected");
			});
			// init
			sel.find("ul > li").each(function() {
				$(this).addClass("hide"); // hide all autocompletion items (if any)
			});
		});
	}
});

/* Set Validation */
jQuery.fn.extend({
	set_validation : function(is_valid, err_msg, opts) {
		// vars
		var err_msg = err_msg || undefined;
		var defs = {
			cls_label    : "error",         // String  The class of an invalid field label. Default : "error"
			cls_valid    : "valid",         // String  The class of a valid field. Default : "valid"
			cls_invalid  : "wrong",         // String  The class of an invalid field. Default : "wrong"
			cls_abiding  : "loading",       // String  The class of an abiding validation field. Default : "loading"
			err_selector : "small.error"    // String  The selector of the element holding the error message. Default : "small.error"
		};
		var cfg = $.extend({}, defs, opts);
		// loop
		$(this).each(function () {
			if (is_valid == true) {
				$(this).removeAttr("data-invalid"); // Remove Foundation abide validation data attribute
				$(this).removeClass(cfg.cls_invalid + " " + cfg.cls_abiding);
				$(this).addClass(cfg.cls_valid);
				$("[for='" + $(this).attr("id") + "']").removeClass(cfg.cls_label);
				$(this).nextAll(cfg.err_selector).first().addClass("hide");
			} else if (is_valid == false) {
				$(this).attr("data-invalid", true); // Define Foundation abide validation data attribute
				$(this).removeClass(cfg.cls_valid + " " + cfg.cls_abiding);
				$(this).addClass(cfg.cls_invalid);
				$("[for='" + $(this).attr("id") + "']").addClass(cfg.cls_label);
				if (err_msg !== undefined) {
					$(this).nextAll(cfg.err_selector).first().html(err_msg);
				}
				$(this).nextAll(cfg.err_selector).first().removeClass("hide");
			} else if (typeof is_valid !== "undefined") {
				$(this).removeAttr("data-invalid"); // Remove Foundation abide validation data attribute
				$(this).removeClass(cfg.cls_valid + " " + cfg.cls_invalid + " " + cfg.cls_abiding);
				$("[for='" + $(this).attr("id") + "']").removeClass(cfg.cls_label);
				$(this).nextAll(cfg.err_selector).first().addClass("hide");
			} else {
				$(this).removeClass(cfg.cls_valid + " " + cfg.cls_invalid);
				$(this).addClass(cfg.cls_abiding);
				setTimeout(function() {
					$(this).removeClass(cfg.cls_abiding);
				}, 1000);
			}
		});
	}
});

/* Field Validity */
jQuery.fn.extend({
	/* Is (field) Valid ?
	 * This jQuery method match all jQuery data 'valid' flag
	 * and return false if any is not valid.
	 */
	is_valid : function() { // Is Valid
		var value = true;
		$(this).each(function() {
			if ($(this).data("valid") != true) {value = false}
		}); return value;
	},
	/* Set (field) validity
	 * This jQuery method register jQuery data 'valid' flag
	 * and create an error box if field is not valid.
	 */
	set_validity : function(flag, msg) { // Set validity
		var msg = msg || $msg.field_invalid;
		$(this).each(function() {
			var obj = $(this);
			obj.removeData("valid"); // reset jQuery data
			switch (flag) {
				case false:
					obj.data("valid", false); // match against jQuery data
					obj.addClass("wrong"); // add styles
					if (obj.next(".error").length == 0) { // insert error box
						obj.after(file_pool.error_box_tmpl({"class" : "", "text" : msg})); // insert confirmation_bar template
					} else { // update error message
						obj.next(".error").show().html(msg);
					}
					break;
				case true:
					obj.data("valid", true); // match against jQuery data
					obj.next(".error").detach(); // remove error box
				default:
					obj.removeClass("wrong"); // remove styles
					obj.next(".error").hide(); // hide error box
			}
		});
	},
	/* Clean (field) value
	 * This jQuery method removes whitespaces at the begining and the end
	 * of a field value according to his type and returns the result.
	 */
	clean_value : function() {
		var str = "";
		$(this).each(function() {
			var obj = $(this);
			// 1. Reset field value without whitespaces according to type
			if (obj.is("input") || obj.is("textarea") || obj.is("select")) {
				// HTML field
				str = obj.val().trim();
				obj.val(str); // reset field value
			} else {
				// HTML element (e.g. div or span)
				str = obj.text().trim();
				obj.html(str); // reset element content
			}
			// 2. Force autosize resize for any textarea
			if (obj.is("textarea")) {obj.trigger("autosize.resize")}
		});
		// 3. Return last field value
		return str;
	},
	/* Check (field) validity
	 * This jQuery method checks wether a field is valid or not,
	 * set is jQuery data validity flag and error box message if any,
	 * and update field content according to his type.
	 */
	check_validity : function(cond, err_msg) { // Check validity (i.e. update field validity)
		var cond = (typeof(cond) !== "undefined" ? cond : function() {return true});
		var err_msg = err_msg || false;
		$(this).each(function() {
			var obj = $(this);
			// 1. Define and clean field value
			str = obj.clean_value();
			// 2. Proceed validation
			if (str.length > 0 && cond(str)) { // field required + custom condition (if any)
				// Set validity
				obj.set_validity(true);
			} else {
				// Define error message
				if (str.length == 0) {
					var msg = $msg.field_required; // set field required error message
				} else if (typeof(err_msg) === "string") {
					var msg = err_msg; // set custom error message if any
				}
				// Set validity
				obj.set_validity(false, msg);
			}
		});
	}
});

/* Add Confirmation Bar */
jQuery.fn.extend({
	add_confirmation_bar : function(opts) {
		// vars
		var defs = {
			"target"  : ".confirmation-bar", // [Sel]  Selector of the confirmation bar. Default : ".confirmation-bar"
			"timeout" : 1000                 // [Int]  Time before the confirmation bar shut down upon blur. Default : 1000
		};
		var cfg = $.extend({}, defs, opts);
		// functions
		function open(obj) {
			var m = obj.css("margin-bottom");
			obj.after(file_pool.confirmation_bar_tmpl); // insert confirmation_bar template
			job = obj.nextAll(cfg.target).first();
			job.svg_icons(); // reflow all icons of validation bar
			job.css("margin-bottom", m); // apply margin
			obj.css("margin-bottom", 0); // clear margin
			$conf.js_fx ? job.fadeIn("slow") : job.show();
		}
		function close(obj, job, cancel) {
			var cancel = typeof(cancel) !== "undefined" ? cancel : false;
			job.fadeOut(($conf.js_fx ? "fast" : 0), function() {
				obj.css("margin-bottom", job.css("margin-bottom")); // reset margin
				job.remove(); // remove element
				if (typeof(cancel) === "string") {obj.val(cancel)} // cancel value
				obj.trigger("autosize.resize") // force autosize resize
			});
		}
		function is_editable(obj) {
			if (obj.attr("disabled") == undefined
			 && obj.attr("readonly") == undefined) {
				return true
			}
		}
		// loop
		$(this).each(function() {
			// internals
			var self = $(this);
			var str = "";
			var t = 0;
			// events
			self.bind({
				focus : function() {
					if (is_editable(self)) {
						str = $(self).val();
						clearTimeout(t);
					}
				},
				blur : function(e) {
					if (is_editable(self)) {
						var obj = self.nextAll(cfg.target).first();
						if (obj.find("[data-cancel]").length > 0
						 && obj.find("[data-cancel]").is(":hover")) {
							close(self, obj, str);
						} else if (obj.find("[data-confirm]").length > 0
						 && obj.find("[data-confirm]").is(":hover")) {
							close(self, obj);
						} else {
							t = setTimeout(function() {
								close(self, obj);
							}, cfg.timeout);
						}
					}
				},
				keydown : function(e) {
					if (is_editable(self)) {
						var str = $(this).val();
						if (e.which == 13 && !e.shiftKey && !e.ctrlKey) { // Enter AND NOT Shift
							if (self.attr("maxlength") && str.length < self.attr("maxlength")) { // only if not max length
								var pos = $(this).get(0).selectionStart; // get cursor position (n.b. HTML 5 feature)
								$(this).val(str.trunc(pos) + "\n" + str.cut(pos)); // insert line end at cursor position
								$(this).get(0).setSelectionRange(pos + 1, pos + 1); // reset cursor position
							}
						}
					}
				},
				keyup : function(e) {
					if (is_editable(self)) {
						var obj = self.nextAll(cfg.target).first();
						if (e.which == 27) { // Escape
							close(self, obj, str);
						} else if (e.ctrlKey && e.which == 13) { // Ctrl + Enter
							close(self, obj);
							self.blur();
						} else if (e.which == 0 || e.which == 8 || e.which == 13 || e.which == 32 || e.which == 46 || e.which >= 48 && e.which <= 90 || e.which >= 96 && e.which <= 111 || e.which >= 160 && e.which <= 192) { // ² or Backspace or Enter or Space or Suppr or A-Z 0-9 or Numpad or Punctuation Mark
							if (obj.length == 0) {
								open(self);
							}
						}
					}
				}
			});
		});
	}
});

/* Create alert box
 * Insert closable notification dialog after first matched element.
 *
 * NOTE : Though this extension uses Foundation CSS styles, it is has
 * no dependency with Foundation alert plugin script.
 *
 * Arguments are optional.
 * - msg  = text displayed in the alert box     [string]
 * - id   = tag attribute of the alert box      [string]
 * - opts = options list (see below)            [object]
 *
 * If a create_alert_box() instance is launched again with same 'id',
 * then the alert box identified by that id will be updated instead
 * of being erased. To create another box, define another id.
 */
jQuery.fn.extend({
	create_alert_box : function(msg, id, opts) {
		var msg = msg || $msg.error, id = id || "alert_box";
		var defs = {
			"class"           : "error",    // String   CSS class of the alert box (null to none). Default : "error"
			"icon"            : "warning",  // String   Name of the message icon (null to none). Default : "warning"
			"icon_class"      : "white",    // String   CSS color class of the message icon (null to none). Default : "white"
			"insert"          : "prepend",  // String   DOM manipulation type (before, after, append or prepend). Default : "after"
			"timeout"         : 0,          // Integer  Time before alert box fade out (zero for never). Default : 0
			"scroll"          : true,       // Boolean  Scroll to alert box after insertion. Default : true
			"scroll_duration" : 500,        // Integer  Duration of the scrolling effect. Default : 500
			"fade_duration"   : 500         // Integer  Duration of the fading effeet. Default : 500
		};
		var cfg = $.extend({}, defs, opts);
		var sel = "#" + id; // internal
		function set_close_timeout(sel) {
			if (cfg.timeout > 0) {
				var timeout = setTimeout(function() {
					close_alert_box($(sel), true);
				}, cfg.timeout);
				$(sel).data("timeout", timeout);
			}
		}
		if ($(sel).length == 0) { // create
			var alert_box = file_pool.alert_box_tmpl({"id" : id, "class" : cfg["class"], "icon" : cfg.icon, "icon_class" : cfg.icon_class, "text" : msg});
			switch(cfg.insert) {
				case "before" : $(this).first().before(alert_box); break;
				case "after"  : $(this).first().after(alert_box);  break;
				case "append" : $(this).first().append(alert_box); break;
				default       : $(this).first().prepend(alert_box); // prepend
			}
			$(sel).svg_icons(); // set svg icons contained by alert box
			$(sel).fadeIn($conf.js_fx ? cfg.fade_duration / 2 : 0); // show alert box
			set_close_timeout(sel);
		} else { // update
			$(sel).removeClass("info secondary alert error success warning");
			$(sel).addClass(cfg["class"]);
			$(sel).find(".text").html(msg);
			$(sel).find(".icon").removeClass("").addClass("icon small" + (cfg.icon_class !== null ? " " + cfg.icon_class : ""));
			$(sel).find(".icon svg use").attr("xlink:href", "#icon-" + cfg.icon);
			if ($(sel).data("timeout")) {
				clearTimeout($(sel).data("timeout")); // reset timeout
				set_close_timeout(sel);
			}
		}
		if (cfg.scroll == true) { $(sel).scroll_to({"fx_d" : cfg.scroll_duration, "spacing" : $(sel).innerHeight()}) } // scroll to alert box
	},
	append_alert_box : function(msg, id, opts) {
		$(this).create_alert_box(msg, id, $.extend(opts, {"insert" : "append"}));
	},
	prepend_alert_box : function(msg, id, opts) {
		$(this).create_alert_box(msg, id, $.extend(opts, {"insert" : "prepend"}));
	},
	clear_alert_box : function(id) {
		var id = id || false;
		$(this).find((id ? "#" + id.toString() : ".alert-box")).each(function() {
			clearTimeout($(this).data("timeout")); // reset_timeout
			$(this).remove(); // remove alert
		});
	}
});

/* Create confirmation modal */
jQuery.fn.extend({
	create_confirmation_modal : function(opts) {
		var defs = {
			"fx_d"       : 500,                 // [Integer]   Effects duration (milliseconds). Default : 500
			"fx_slide"   : true,                // [Boolean]   Slide box on opening. Default : true
			"fx_resize"  : false,               // [Boolean]   Resize dialog box on opening. Default : false
			"text"       : $msg.confirm_action, // [String]    Text of the message box. Default : $msg.confirm_action
			"class"      : "",                  // [String]    CSS class name of the message box. Default : ""
			"extra"      : null,                // [String]    Extra template bindable to the modal. Default : null
			"focus"      : "confirm",           // [String]    Data attribute of the element focused on launch. Default : "confirm"
			"on_cancel"  : function() {},       // [Handler]   Function launched on modal cancel. Default : function() {}
			"on_confirm" : function() {},       // [Handler]   Function launched on modal confirm. Default : function() {}
		};
		var cfg = $.extend({}, defs, opts);
		var self = $(this);
		// Functions
		function get_center_y() {
			var obj_h = $(".dialog").outerHeight(), win_h = $(window).height();
			return obj_h <= win_h ? (win_h - obj_h) / 4 : 0;
		}
		function center_y() {
			$(".dialog").css("top", get_center_y() + "px");
		}
		function open(d) {
			var d = $conf.js_fx ? (d || cfg.fx_d) : 0;
			var t = get_center_y() + "px";
			var l = $(".dialog").css("left");
			var w = $(".dialog").css("width");
			var m = $(".dialog").css("margin-left");
			var f1 = cfg.fx_slide, f2 = cfg.fx_resize;
			$(".canvas").css("opacity", "0");
			$(".canvas").animate({"opacity" : "1"}, d);
			$(".dialog").css({"left" : (f2 ? "50%" : l), "width" : (f2 ? "25%" : w), "margin-left" : (f2 ? "0" : m), "top" : (f1 ? "0" : t)});
			$(".dialog").animate({"left" : l, "width" : w, "margin-left" : m, "top" : t}, d, function() {
				$(".dialog").css({"left" : "", "width" : "", "margin-left" : ""}); // reset css
			});
		}
		function close(d, f) {
			var d = $conf.js_fx ? (d || cfg.fx_d) / 2 : 0, f = f || function() {};
			$(".dialog").finish();
			$(".canvas").animate({"opacity" : "0"}, d, function() {
				$(".dialog").hide();
				f(); // callback
			});
		}
		function remove() {
			$(".modal").remove(); // remove modal element from document nodes
			$(document).off(".modal"); // remove modal namespace from document events
			self.focus();
		}
		// Live events
		$(window).on("resize.modal", function() {
			center_y(); // center modal on screen resize
		});
		$(document).on("click.modal", ".close, [data-confirm],[data-cancel]", function() {
			close(null, function() {
				remove(); // remove upon closing
			});
		});
		$(document).on("keydown.modal", function(e) {
			if (e.which == 27) { // Escape
				remove(); // close without animation
			} else if (e.which == 9 || e.which == 37 || e.which == 39) { // Tab, Left or Right
				e.preventDefault(); // override browser tab navigation
				var i = $(".modal [data-focus]").index($(":focus"));
				var max_i = $(".modal [data-focus]").size() - 1;
				var prev = i == 0 ? max_i : i - 1;
				var next = i == max_i ? 0 : i + 1;
				var q = e.shiftKey || e.which == 37 ? prev : next; // define next or previous focusable element
				$(".modal [data-focus]").eq(q).focus(); // switch to proper focusable element in modal
			}
		});
		// Execution
		$("body").prepend(file_pool.confirmation_modal_tmpl(cfg)); // insert confirmation modal template
		$(".modal [data-confirm], .modal [data-cancel], .modal .close").attr("data-focus", true); // set focusable elements
		$(".modal [data-confirm]").click(cfg.on_confirm); // attach confirm event handler
		$(".modal [data-cancel]").click(cfg.on_cancel); // attach cancel event handler
		$(".modal [data-" + cfg.focus + "]").focus(); // focus default action
		$(".modal").svg_icons(); // reflow icons for confirmation modal
		open(); // open dialog box
	}
});

/* ------------------------------------------------------------------ */
/* # Components */
/* ------------------------------------------------------------------ */

var user_menu = (function() {
	return {
		init : function(opts) {
			// vars
			var defs = {
				"target"   : "#user_menu",      // String    jQuery selector of user menu. Default : "#user_menu"
				"trigger"  : "#user_connect",   // String    jQuery selector of user menu trigger. Default : "#user_connected"
				"duration" : 500,               // Numeric   Animation base duration for open and close events (millisecond). Default : 500
				"timeout"  : 1000               // Numeric   Time before user menu disappears when focus is lost (millisecond). Default : 1000
			};
			var cfg = $.extend({}, defs, opts);
			var user_menu_timeout = 0; // internal
			// functions
			function show_menu(sel, d) {
				var d = d || cfg.duration;
				$(sel).css({"opacity" : "0"});
				$(sel).show();
				$(sel).find("a").first().focus();
				$(sel).animate({
					"opacity" : "1"
				}, $conf.js_fx ? d : 0, function() {
					$(sel).data("open", true);
				});
			}
			function hide_menu(sel, d) {
				var d = d || cfg.duration / 2;
				$(sel).animate({
					"opacity" : ""
				}, $conf.js_fx ? d : 0, function() {
					$(sel).hide()
					$(sel).data("open", false);
				});
			}
			function open_menu(sel) {
				$(sel).finish()
				show_menu(sel);
			}
			function close_menu(sel) {
				$(sel).finish()
				clearTimeout(user_menu_timeout);
				hide_menu(sel);
			}
			// events
			$("html").on("click", cfg.trigger, function() {
				if (UserSession.isConnected()) {
					 set_user_connected(true); // connect user
					 $(cfg.trigger).data("connected", true);
					 $(cfg.target).data("open") ? close_menu(cfg.target) : open_menu(cfg.target); // show menu
				} else {
					window.location.href = $nav.login.url; // redirect to the login page
				}
				////////////////////////////////////////////////////////////////
				// Local TEST block for DEBUG
				////////////////////////////////////////////////////////////////
				// set_user_connected(true); // connect user
				// $(cfg.trigger).data("connected", true);
				// $(cfg.target).data("open") ? close_menu(cfg.target) : open_menu(cfg.target); // show menu
				////////////////////////////////////////////////////////////////
				//checkAuthc(done, fail);
				$(this).toggleClass("active");
				$(this).blur();
				////////////////////////////////////////////////////////////////
			});
			$("html").on("keydown", cfg.target, function(e) {
				if (e.which == 27) { // Esc
					close_menu(cfg.target);
				}
			});
			$("html").on("focus", cfg.target + " a", function() {
				clearTimeout(user_menu_timeout);
			});
			$("html").on("blur", cfg.target + " a", function() {
				user_menu_timeout = setTimeout(function() {
					hide_menu(cfg.target);
				}, cfg.timeout);
			});
			$("html").on("click", cfg.target + " .disconnect", function() {
				set_user_connected(false);
				disconnect($msg.user_disconnected);
			});
			$("html").on("click", cfg.target + " .close", function(e) {
				close_menu(cfg.target);
			});
		}
	}
}());

var spring_box = (function() {
	// Configuration
	var cfg = {
		"fx_d"      : 375,              // Integer  Visual effets duration (milliseconds). Default : 375
		"box_x"     : 0.5,              // Numeric  Vertical position adjustment for box (root EM). Default : 0.5
		"box_y"     : 0.75,             // Numeric  Horizontal position adjustment for box (root EM). Default : 0.75
		"box_id"    : "spring_box",     // String   Spring box element identifier. Default : "spring_box"
		"box_class" : "",               // Selector Spring box element class. Default : ""
		"box_close" : ".close",         // Selector Cancel element identifier. Default : ".close"
		"box_valid" : ".success",       // Selector Confirmation element identifier. Default : ".success"
		"box_focus" : ".success",       // Selector Focus element on creation. Default : ".success"
		"box_html"  : null,             // String   Spring box content. Default : null
		"on_open"   : function() {},    // Function Callback for opening. Default : function() {}
		"on_close"  : function() {},    // Function Callback for closing. Default : function() {}
		"on_opened" : function() {},    // Function Callback when opened. Default : function() {}
		"on_closed" : function() {},    // Function Callback when closed. Default : function() {}
	};
	return {
		open : function(o, d, t) {
			cfg.on_open(); // open callback
			o.finish(); // prompt any pending animation
			o.scroll_to({"fx_d" : d / 2, "spacing" : o.outerHeight() / 4}); // scroll to box top
			var w = o.outerWidth(), h = o.outerHeight(); // set animation vars
			o.css({"width" : 0, "height" : 0, "margin-top" : h, "margin-left" : w, "opacity" : 0}); // set CSS values before animating
			o.children().hide(); // hide children before animating
			o.show().animate({"width" : w, "height" : h, "margin-top" : 0, "margin-left" : 0, "opacity" : 1 }, $conf.js_fx ? d : 0, function() {
				o.children().show(); // show children on animation completion
				o.css({"width" : "", "height" : "",}); // reset CSS values to default on animation completion
				o.find(t).focus(); // focus confirm button on animation completion
				cfg.on_opened(); // open callback
			});
		},
		close : function(o, d, t) {
			cfg.on_close(); // close callback
			o.fadeOut($conf.js_fx ? d / 2 : 0, function() { // hide box
				cfg.on_closed(); // close callback
				o.remove(); // destroy spring box
			});
		},
		create : function(launcher, opts) {
			cfg = $.extend({}, cfg, opts); // extend config
			var self = this; // set self
			var obj = $(file_pool.spring_box_tmpl({"id" : cfg.box_id, "class" : cfg.box_class, "html" : cfg.box_html})); // create template
			$("body").append(obj); // append template
			var x = launcher.offset().left + launcher.outerWidth() - obj.outerWidth() + cfg.box_x.toPx(); // define vertical position
			var y = launcher.offset().top - obj.outerHeight() - cfg.box_y.toPx(); // define horizontal position
			obj.css({"left" : x, "top" : y}); // set box position
			self.open(obj, cfg.fx_d, cfg.box_focus);
			$(obj).on("click", cfg.box_close, function() { // bind close event
				self.close(obj, cfg.fx_d, launcher);
			});
		}
	}
}());

var list_overview = (function() {
	return {
		init : function (attachee) {
			var triggerer = ".overview-tip";
			var triggered = ".overview";
			$(attachee).on("click", triggerer, function() {
				var obj = $(this);
				if (obj.data("is_sliding") !== "true") {
					obj.data("is_sliding", "true");
					obj.toggleClass("active");
					if ($conf.js_fx) {
						obj.next(triggered).slideToggle(250, function() {
							obj.removeData("is_sliding");
						});
					} else {
						obj.next(triggered).toggle();
						obj.removeData("is_sliding");
					}
				}
			});
		}
	}
}());

var faq_ui = (function() {
	var cfg = {
		"fx_d"       : 250,         // Integer  Visual effects duration (milliseconds). Default : 250
		"fx_toggle"  : true,        // Boolean  Switching behaviour for the component. Default : true
		"trigger"    : ".question", // Selector Element intiating the component. Default : ".question"
		"target"     : ".answer",   // Selector Element targeted by the component. Default : ".answer"
		"icon"       : ".vis-tip",  // Selector Element toggling on activation. Default : ".vis-tip"
		"icon_on"    : "show",      // IconName SVG icon shown while component is activated. Default : "show"
		"icon_off"   : "hide"       // IconName SVG icon shown while component is deactivated. Default : "hide"
	};
	return {
		open : function(o, d, f) {
			var o = o || cfg.target,
					d = $conf.js_fx ? (d || cfg.fx_d) : 0,
					f = f || function() {},
					p = o.prev(cfg.trigger),
					n = p.find("input");
			// Active Fix
			p.addClass("active");
			// Input Focus Fix
			if (n && n.attr("disabled")) {n.removeAttr("disabled")}
			// Autosize Fix
			if (o.find("textarea").length > 0) {
				var autosize = true; // set autosize flag
				o.find("textarea").trigger("autosize.destroy"); // destroy autosize
			}
			// Play Animation
			var h = o.height();
			o.show();
			o.css({"height" : "0", "opacity" : "0"});
			o.animate({"height" : h, "opacity" : "1"}, d, function() {
				o.css({"height" : ""});
				if (autosize) { o.find("textarea").autosize(autosize_cfg) } // Autosize Fix : initialize autosize
				o.scroll_to({"fx_d" : d / 2, "spacing" : (1).toPx()});
				f();
			});
		},
		close : function(o, d, f) {
			var o = o || cfg.target,
					d = $conf.js_fx ? (d || cfg.fx_d / 2) : 0,
					f = f || function() {},
					p = o.prev(cfg.trigger),
					n = p.find("input");
			// Active Fix
			p.removeClass("active");
			// Input Focus Fix
			if (n) {n.attr("disabled", true)}
			// Play Animation
			o.animate({"height" : "0", "opacity" : "0"}, d, function() {
				o.css({"height" : ""});
				o.hide();
				f();
			});
		},
		init : function(opts) {
			// Variables
			cfg = $.extend({}, cfg, opts);
			var self = this;
			// Functions
			function toggle_icon(obj) {
				var icon = obj.find(cfg.icon + " > svg > use"), link = "xlink:href";
				var name = icon.attr(link) == "#icon-" + cfg.icon_on ? cfg.icon_off : cfg.icon_on; // define on/off
				icon.attr(link, "#icon-" + name); // set icon on/off
			}
			function turn_icon(obj, tog) {
				var toggle = tog || false;
				var icon = obj.find(cfg.icon + " > svg > use"), link = "xlink:href";
				var name = tog ? cfg.icon_on : cfg.icon_off; // define on/off
				icon.attr(link, "#icon-" + name); // set icon on/off
			}
			// Live Events
			$(document).on("click", cfg.trigger, function() {
				var bar = $(this);
				var foo = bar.next(cfg.target);
				foo.finish();
				if (foo.is(":hidden")) {
					if (cfg.fx_toggle) { // close all others
						var other = bar.siblings();
						other.removeClass("active");
						self.close(other.next(cfg.target), null, function() {
							turn_icon(other);
						});
					}
					self.open(foo, null, function() {
						turn_icon(bar, true);
					});
				} else {
					self.close(foo, null, function() {
						turn_icon(bar);
					});
				}
			});
		}
	}
}());

var agenda_ui = (function() {
	var cfg = {
		"fx_d"         : 375,           // [Int]  Duration of effects (ms). Default : 375
		"ev_t"         : 500,           // [Int]  Timeout before showing date events (ms). Default : 500
		"show_events"  : true,          // [Bool] Show sliding date events ? Default : true
		"template"     : function() {}, // [Func] Template function for compiling. Default : function() {}
		"on_open"      : function() {}, // [Func] Callback function before modal opening. Default : function() {}
		"on_close"     : function() {}, // [Func] Callback function before modal opening. Default : function() {}
		"on_opened"    : function() {}, // [Func] Callback function after modal opening. Default : function() {}
		"on_closed"    : function() {}, // [Func] Callback function after modal closing. Default : function() {}
	};
	return {
		build : function(db) {
			// variables
			var today = new Date();
			var m = today.getMonth();
			var y = today.getFullYear();
			// functions
			function build_calendar(year, month) {
				var q = new Date(year, month, 1); // first day in month
				var m = []; // month array
				var w = []; // week array
				var i = 1; // num counter
				var n = q.getDay();
				for (i; i < (n == 0 ? 7 : n); i++) {
					w.push({}); // fill first week gap with empty object
				} i = 1; // reset counter
				while (q.getMonth() === month) {
					var ymd = getDateTime(new Date(q));
					var d = {}; // day object in week array
					// set day object
					d.num = i;
					d.date = ymd;
					var e = [];
					for (k in db) { // check date in db
						var day = new Date(q);
						if (getDateTime(day) == getDateTime(new Date(db[k].day))) {
							if (typeof(db[k].events) !== "undefined") {
								d.events = [];
								for (e in db[k].events) {
									var h = {};
									h.id = db[k].events[e].id; // get name
									h.title = db[k].events[e].title; // get name
									h.desc = db[k].events[e].desc || undefined; // get desc
									d.events.push(h);
								}
							}
						}
					}
					// push week array
					w.push(d);
					// check week last day
					if (q.getDay() == 0) {
						m.push(w);
						w = []; // reset week array
					}
					// increment all
					q.setDate(q.getDate() + 1);
					i++;
				}
				// push last values
				var n = q.getDay();
				for (i = (n == 0 ? 7 : n); i <= 7; i++) {
					w.push({}); // fill last week gap with empty object
				}
				m.push(w); // push last week array
				// get last id in array
				return m; // return month array
			}
			function update_agenda(year, month) {
				var calendar = build_calendar(year, month);
				$(".date-switcher h3").html($time.months[month].capitalize() + " " + year);
				$(".date-table tbody").html(file_pool.date_table_tmpl({"month" : calendar})); // append table body
				$(".date-table tbody").svg_icons(); // reload svg icons
			}
			// process build
			update_agenda(y, m);
			// live events
			$(".date-switcher .prev").click(function() {
				if (m == 0) {m = 11; y -= 1;} else {m -= 1}
				update_agenda(y, m);
			});
			$(".date-switcher .next").click(function() {
				if (m == 11) {m = 0; y += 1;} else {m += 1}
				update_agenda(y, m);
			});
		},
		init : function(opts) {
			cfg = $.extend({}, cfg, opts);
			function show_events(obj) {
				if (isComputer() && cfg.show_events) {
					obj.data("hover", true);
					setTimeout(function() {
						if (obj.data("hover") == true) {
							obj.children(".event-list").slideDown($conf.js_fx ? cfg.fx_d / 2 : 0);
						}
					}, cfg.ev_t);
				}
			}
			function hide_events(obj) {
				if (isComputer() && cfg.show_events) {
					obj.data("hover", false);
					obj.children(".event-list").slideUp($conf.js_fx ? cfg.fx_d : 0);
				}
			}
			$(document).on("focus", ".has-event .over", function() {show_events($(this).parent(".has-event"))});
			$(document).on("blur", ".has-event .over", function() {hide_events($(this).parent(".has-event"))});
			$(document).on("mouseenter", ".has-event .over", function() {$(this).blur(); show_events($(this).parent(".has-event"))});
			$(document).on("mouseleave", ".has-event .over", function() {hide_events($(this).parent(".has-event"))});
			$(document).on("click", ".over", function() {
				if ($(".reveal-modal").is(":visible")) {
					if (!$("html").data("revealing-modal")) {
						$(".reveal-modal").foundation("reveal", "close");
					}
				} else {
					// Create modal
					var self = $(this);
					var p = self.parent();
					var e = [];
					p.find(".event-list").children("li").each(function() {
						var id = $(this).find(".title").attr("id") || null;
						var title = $(this).find(".title").html() || null;
						var desc = $(this).find(".desc").html() || null;
						if (title) {e.push({"id" : id, "title" : decode_html(title), "desc" : (desc ? decode_html(desc, true) : null)})}
					});
					var d = p.find("time").first().attr("datetime") || 0;  // Datetime
					var a = d.split("-"); // YMD array
					var t = new Date(a[0], a[1] - 1, a[2]); // Timestamp
					var c = {
						"day"    : $time.days[t.getDay() == 0 ? 6 : t.getDay() - 1].capitalize() + " " + dateToHTML(t),
						"date"   : d,
						"events" : e
					};
					var modal = $(cfg.template(c));
					// Append modal
					$("body").append(modal);
					// Reload SVG icons
					modal.svg_icons();
					// Remember caller
					modal.data("caller", self);
					// Bind events
					modal.on("open", function() {
						$("html").data("revealing-modal", true);
						cfg.on_open(); // callback
					});
					modal.on("close", function() {
						cfg.on_close(); // callback
					});
					modal.on("opened", function() {
						$("html").removeData("revealing-modal");
						cfg.on_opened(); // callback
					});
					modal.on("closed", function() {
						cfg.on_closed(); // callback
						$(this).remove();
					});
					// Initialize modal
					modal.foundation("reveal", "open");
				}
			});
		}
	}
}());

var folder_list = (function() {
	var cfg = {
		"inspect" : true,  // [bool] Search for folder hash in url (open it on success on and let others closed). Default : true
		"manify"  : false, // [bool] Start all folders manified (i.e. opened). Default : false
		"toggle"  : true,  // [bool] Siblings are closed on self opening. Default : true
		"fx_d"    : 375    // [int]  Duration of effects. Default : 375
	};
	return {
		open : function(o, b) {
			var n = o.find(".name"), b = b || false, s = this;
			if (!o.hasClass("open")) {
				if (b) {o.siblings().each(function() {s.close($(this))});}
				o.addClass("open"); // show this
				o.find("textarea").trigger("autosize.resize"); // reload autosize
				var h = o.outerHeight();
				o.css("height", n.outerHeight()) // set css
				o.animate({"height" : h}, $conf.js_fx ? cfg.fx_d : 0, function() {
					if (o.parent(".folder-list").hasClass("edit")) {
						n.eq(0).hide(); n.eq(1).show(); // hide h4, show input
					} else {
						n.removeAttr("tabindex"); // disable tabnav for this
						o.find(".vis-toggle").focus(); // focus visibility toggle
					} o.css({"height" : ""}); // reset css
				});
			}
		},
		close : function(o, f) {
			var n = o.find(".name"), f = f || function() {};
			if (o.hasClass("open")) {
				o.css({"padding" : "0 .375rem"}); // set css
				o.animate({"height" : n.outerHeight()}, $conf.js_fx ? cfg.fx_d : 0, function() {
					o.removeClass("open"); // hide this
					o.css({"height" : "", "padding" : ""}); // reset css
					f(); n = o.find(".name"); // callback
					if (o.parent(".folder-list").hasClass("edit")) {
						n.eq(0).find(".text").text(n.eq(1).find("input").val().trim()); // feed h4 with input value
						n.eq(0).show(); n.eq(1).hide(); // show h4, hide input
					} else {
						n.attr("tabindex", "0"); // enable tabnav for this
					}
				});
			}
		},
		num : function(s) {
			var a = eval("(" + (s) + ")"), r = [];
			for (n in a) {r.push({"num" : n, "id" : a[n]})}
			return r;
		},
		build : function(ref, tmpl, art, rub) {
			// 1. Process folder list template
			ref.append(tmpl);
			// 2. Process folder list item from articles db
			ref.find(".folder .list li").each(function() {
				var id = $(this).attr("data-id"), a = art;
				if (is_def(typeof id)) {
					for (k in a) {
						if (a[k].id == id) {
							$(this).prepend(file_pool.folder_article_list_link_tmpl({"title" : a[k].title, "rubric" : " rubric-id-" + a[k].rubrique_id, "path" : a[k].path}));
						}
					}
				}
			});
			// 3. Process rubric id from rubrics db
			ref.find("[class*='rubric-id']").each(function() {
				var o = $(this), d = rub, r = o.attr("class").match(/rubric-id-(\d*)/), c;
				for (n in d) {
					if (d[n].id == r[1]) {
						c = d[n].classe;
					}
				}
				o.removeClass(r[0]);
				o.addClass("icon-" + c);
			});
			ref.svg_icons(); // reload svg icons
		},
		init : function(opts) {
			// Variables
			cfg = $.extend({}, cfg, opts);
			var self = this;
			// Live events
			$(".folder-list").on("click", ".folder .name", function() {
				self.open($(this).parent(".folder"), cfg.toggle);
			});
			$(".folder-list").on("click", ".folder .vis-toggle", function(e) {
				self.close($(this).parent(".name").parent(".folder"));
				e.stopPropagation();
			});
			// Execution
			var u = window.location.hash, r = true;
			$(".folder-list .folder").each(function() {
				if ($(this).attr("id") == u.cut(1)) { // check address bar for hash
					self.open($(u)); r = false;
				}
			});
			if (r && cfg.manify) {
				$(".folder-list .folder").each(function() {
					self.open($(this));
				});
			}
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Build methods */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Below are functions called during or after build process.
 * They are core helpers strictly required by the main flow execution.
 * Though, they are not parts of any specific block (but needed by all).
 * And, thus, they aren't supposed to be reloaded after main processing.
 */

/* Is Computer (i.e. Desktop or Laptop) */
function isComputer() {
	return (Modernizr.mq("(min-width: 800px)") && !Modernizr.touch); // Not Small Display and not Touch Device (i.e. exclude smartphones and tablets)
}

/* Global String Replacement (low-level) */
function gsub(str, obj, v_k, del) {
	var v_k = v_k || false, del = del || false;
	for (key in obj) {
		var reg = new RegExp((v_k ? obj[key] : key), "g");
		str = str.replace(reg, (del ? "" : (v_k ? key : obj[key])));
	} return str;
}
function gsup(str, obj) {return gsub(str, obj, true)}
function gdel(str, obj) {return gsub(str, obj, null, true)}

/* Convert Illegal Characters */
function encode_illegals(str) {return gsub(str, $chars.illegal)}
function decode_illegals(str) {return gsup(str, $chars.illegal)}
function remove_illegals(str) {return gdel(str, $chars.illegal)}

/* Convert Format Marks */
function encode_formats(str) {return gsub(str, $chars.format_enc)}
function decode_formats(str) {return gsub(str, $chars.format_dec)}
function remove_formats(str) {return gdel(str, $chars.format_enc)}

/* Convert Punctuation Characters */
function encode_punctuations(str) {return gsub(str, $chars.punctuation)}
function decode_punctuations(str) {return gsup(str, $chars.punctuation)}
function remove_punctuations(str) {return gdel(str, $chars.punctuation)}

/* Convert Diacritical Characters */
function encode_diacriticals(str) {return gsub(str, $chars.diacritical)}
function decode_diacriticals(str) {return gsup(str, $chars.diacritical)}
function remove_diacriticals(str) {return gdel(str, $chars.diacritical)}

/* Convert Line Ends */
function encode_line_ends(str) {
	return (str + "\n\n")
		.replace(/(.+)\n/g, "$1<br>")
		.replace(/(.+)<br>\n/g, "<p>$1</p>")
		.trim()
		.replace(/\n/g, "<br>");
}
function decode_line_ends(str) {
	return str
		.replace(/<p>/g, "")
		.replace(/<br>/g, "\n")
		.replace(/<\/p>/g, "\n\n")
		.trim();
}

/* Convert HTML */
function encode_html(str, lb) {
	// var lb = (typeof (lb) !== "undefined" ? lb : true);
	var lb = lb || false;
	str = encode_illegals(str);
	str = encode_formats(str);
	str = encode_punctuations(str);
	str = encode_diacriticals(str);
	str = (lb ? encode_line_ends(str) : str.trim());
	return str;
}
function decode_html(str, lb) {
	// var lb = (typeof (lb) !== "undefined" ? lb : true);
	var lb = lb || false;
	str = str.replace(/(")/g, "'"); // Double Quotations Fix
	str = str.replace(/[\t|\r\n]*/g, ""); // Tabulation and Line Feed Fix
	str = (lb ? decode_line_ends(str) : str.trim());
	str = decode_diacriticals(str);
	// str = decode_punctuations(str); // NOTE : Punctuation marks aren't decoded (useless if UTF-8 is used as HTML base encoding)
	str = decode_illegals(str);
	str = decode_formats(str);
	str = str.replace(/&nbsp;/g, " "); // No-Break Space Fix
	return str;
}

/* Convert string to location */
function encode_html_id(str, div) {
	var div = div || "-";
	str = str.toLowerCase()
		.replace(/[à|â|ä]/gi, "a") // a
		.replace(/ç/gi, "c") // c
		.replace(/[é|è|ê|ë]/gi, "e") // e
		.replace(/[î|ï]/gi, "i") // i
		.replace(/[ô|ö]/gi, "o") // o
		.replace(/ù/gi, "u") // u
		.replace(/\s/g, div) // blank spaces (strict -- no tabulation, no line feed)
		.replace(/[^a-z|0-9|\-_]/gi, ""); // strip anything else (except alphanumeric, hypens and underscores)
	return str;
}

/* Convert long date format to short numeric */
function getDateTime(date) { // passe une date en param pour obtenir une string au bon format pour la balise time
	var year = date.getFullYear().toString();
	var month;
	var day;
	var numMonth = date.getMonth() + 1;
	if (numMonth < 10) {
		month = "0" + numMonth.toString();
	} else {
		month = numMonth.toString();
	}
	if (date.getDate() < 10) {
		day = "0" + date.getDate().toString();
	} else {
		day = date.getDate().toString();
	}
	return year + "-" + month + "-" + day;
}

/* Convert date to string literal */
function dateToString(date) {
	var year = date.getFullYear().toString();
	var month;
	var day = date.getDate().toString();
	if (date.getDate() === 1) {
		day += "er";
	}
	month = $time.months[date.getMonth()];
	return day + " " + month + " " + year;
}

/* Convert date to HTML */
function dateToHTML(date) {
	return (dateToString(date).replace("1er", "1<sup>er</sup>").replace("é", "&eacute;").replace("û", "&ucirc;"));
}

/* Convert date to long format string */
function format_date(date) {
	var d = date.getDay();
	var day = d == 0 ? $time.days[6] : $time.days[d-1];
	var d = date.getDate();
	var m = date.getMonth();
	var month = $time.months[m + 1];
	var y = date.getFullYear();
	var h = date.getHours().toString().format(2);
	var mm = date.getMinutes().toString().format(2);
	var s = date.getSeconds().toString().format(2);
	return day.capitalize() + " " + (d == 1 ? d + "er" : d) + " " + month + " " + y + " à " + h + "h" + mm;
}

/* Get URL search params */
function get_url_search_params() {
	var params = {};
	var url = decodeURI(window.location.search).toLowerCase();
	var arr = url.match(/^\?([^\?\|=:;,]+)$|([^\?\|=&:;,]+)=([^\?\|:;,]+)/i);
	/* 0 = full matched result
	 * 1 = global search query (e.g. 'zizi' in 'url?zizi')
	 * 2 = specifier (e.g. 'rubrique' in 'url?rubrique=zizi')
	 * 3 = specified search query (e.g. 'zizi' in 'url?rubrique=zizi')
	 */
	if (arr !== null) {
		if (arr[1] !== undefined) { // search is global
			return arr[1];
		} else if (arr[2] !== undefined && arr[3] !== undefined) { // search is specific
			params[arr[2]] = arr[3];
			return params;
		}
	}
	return null; // search is null
}

/* Create alert bar */
function create_alert_bar(msg, opts) {
	var msg = msg || $msg.error;
	var defs = {
		"target"   : ".alert-bar", // [sel] Selector of the targeted plugin element. Default : ".alert-bar"
		"position" : "top",        // [str] Can be either "top" or "bottom" (stuck on caller place if undefined). Default : "top"
		"fx_d"     : 250,          // [int] Duration of effects (ms). Default : 250
	};
	var cfg = $.extend({}, defs, opts);
	function fix(m, t) {
		var m = m ? $(cfg.target).outerHeight() : "", t = t || 0;
		$(cfg.target).nextAll("div").first().animate({"margin-top" : m}, t);
	}
	if ($(cfg.target).length == 0) {
		$("body").prepend(file_pool.alert_bar_tmpl({"class" : cfg.position}));
		if (cfg.position == "top") {fix(true)}
		$(document).on("click", cfg.target + " .close", function() {
			var o = $(this).parent(cfg.target);
			var t = $conf.js_fx ? cfg.fx_d : 0;
			if (cfg.position == "top") {fix(null, t)}
			o.slideUp(t, function() {o.remove()});
		});
	}
	$(cfg.target).children("ul").append($("<li>").html(msg));
	if (cfg.position == "top") {fix(true)}
}

/* Close alert box */
function close_alert_box(o) {
	$(o).css("color", "transparent"); // mask box content
	$(o).children().css("visibility", "hidden"); // mask box content
	$(o).animate({
		"height": "0",
		"margin" : o.height() / 2 + "px 0 0",
		"padding" : "0",
		"opacity":"0"
	}, $conf.js_fx ? $time.duration.fx : 0, function() { // hide alert box
		o.remove();
	});
}

/* Insert alert box after header */
function createAlertBox(msg, id, opts) {
	$(".main-body").create_alert_box(msg, id, opts);
}

/* Set page title */
function set_page_title(str) {
	if ($conf.page_title) {
		$("title").html($("title").text() + " - " + str);
	}
}

/* Update user menu user name */
function update_user_pseudo(pseudo) {
	UserSession.updatePseudo(pseudo);
	$(".user-name").html(pseudo);
}

/* Update user menu user picture */
function update_user_avatar(pathAvatar) {
	UserSession.updateAvatar(pathAvatar);
	$("#user_avatar").attr("data-image", pathAvatar); // define avatar
	$("#user_menu").user_pictures(); // reload user image
}

/* Check authentication before sending AJAX requests */
function header_authentication(xhr) {
	if (hasStorage && UserSession.getUserToken() !== null) {
		xhr.setRequestHeader("Authorization", UserSession.getUserToken()); // check authc token
	}
}

/* Redirect on HTTP response status unauthorized after AJAX request */
function ajax_error(xhr, status, error) {
	if (xhr.status == 401) {
		window.location.href = $nav.login.url;
	}
}

/* Check REST through customized AJAX request */
function checkAJAX(done, fail, always, url) {
	var done = done || (function() {}),
			fail = fail || (function() {}),
			always = always || (function() {});
	$.ajax({
		url : url,
		processData : false,
		beforeSend : function(jqXHR) {header_authentication(jqXHR)},
		success : function() {done()},
		error : function() {fail()},
		complete : function() {always()},
		dataType : "json"
	});
}

/* Check if user is authenticated toward server */
function checkAuthc(done, fail, always) {
	checkAJAX(done, fail, always, $rest.authc)
}

/* Check if user is an admin toward server */
function checkAdmin(done, fail, always) {
	checkAJAX(done, fail, always, $rest.admin)
}

/* Check if user is a writer authenticated toward server */
function checkRedac(done, fail, always) {
	checkAJAX(done, fail, always, $rest.redac)
}

/* Disconnect user */
function disconnect(str) {
	var str = str || null;
	$.ajax({
		type : "POST",
		url : "/rest/authc/logout",
		contentType : "application/json; charset=utf-8",
		data : UserSession.getUserTokenId(),
		success : function(data, status, jqXHR) {
			clearStorage();
			UserSession.delete();
			if (location.protocol == "https:") {
				location.href = $nav.home.url;
			}
			if (str !== null) {
				createAlertBox(str, "alert_auth", {"timeout" : $time.duration.alert});
			}
		},
		error : function(jqXHR, status, errorThrown) {
		},
		dataType : "json"
	});
}

/* Check user connected through AJAX (deferred to document ready state) */
function check_user_connected() {
	if (checkCompatibility()) {
		set_user_connected(UserSession.isConnected()); // connect user
		$(".user-connect").fadeIn($conf.js_fx ? 500 : 0);
	}
}

/* Set user connected
 * NOTE : connected auth check has been deferred to ready state.
 */
function set_user_connected(is_connected) {
	if (checkCompatibility()) {
		var is_connected = is_connected || false, sel = "#user_connect";
		if (is_connected) {
			$(sel + " svg use").attr("xlink:href", "#icon-menu");
			$(sel + " .connect").html("Menu");
			$(sel).attr("title", "Ouvrir le menu utilisatrice");
			$(sel).data("connected", true); // register connected state in local data var
			$(".user-connect").append(file_pool.user_nav_tmpl); // process user menu template
			$("#user_menu").user_pictures(); // reload user pictures of user menu
		} else {
			$("#user_connect").removeClass("active");
			$("#user_menu").detach(); // remove user menu from DOM (n.b. keep data and events)
			$(sel + " svg use").attr("xlink:href", "#icon-connect");
			$(sel + " .connect").html("Connexion");
			$(sel).attr("title", "Se connecter");
			$(sel).data("connected", false); // register connected state in local data var
		}
	}
}

/* Check current page */
function check_current_page() {
	$("[data-current]").each(function () {
		var h = $(this).attr("href");
		var p = window.location.pathname.toString().split("/");
		var m = window.location.pathname.toString() + window.location.search.toString();
		if (h.indexOf(p[1]) >= 0 && m.indexOf(h) >= 0) {
			$(this).addClass("current");
		}
	});
}

/* Set prefs on toolbar (deferred to document ready state) */
function set_toolbar_prefs() {
	if (get_pref($prefs.app_conf, "css_fx") == true) { $("#_css_fx_toggle").addClass("active") }
	if (get_pref($prefs.app_conf, "svg_fx") == true) { $("#_svg_fx_toggle").addClass("active") }
	if (get_pref($prefs.app_conf, "js_fx") == true) { $("#_js_fx_toggle").addClass("active") }
}

/* Check prefs object */
function has_prefs(prefs) {
	if (localStorage !== undefined && localStorage.getItem(prefs) !== null) {
		return true;
	} else {
		return false;
	}
}

/* Check pref value */
function has_pref(prefs, key) {
	if (localStorage !== undefined && localStorage.getItem(prefs) !== null) {
		var p = JSON.parse(localStorage.getItem(prefs));
		if (p[key] !== null) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/* Retrieve prefs object */
function get_prefs(prefs) {
	if (localStorage !== undefined && localStorage.getItem(prefs) !== null) {
		return JSON.parse(localStorage.getItem(prefs));
	}
}

/* Retrieve pref value */
function get_pref(prefs, key) {
	if (localStorage !== undefined && localStorage.getItem(prefs) !== null) {
		var p = JSON.parse(localStorage.getItem(prefs));
		return p[key];
	}
}

/* Register prefs object */
function set_prefs(prefs, hash) {
	if (localStorage !== undefined) {
		var p = JSON.parse(localStorage.getItem(prefs)) || {};
		for (n in hash) {
			p[n] = hash[n];
		}
		localStorage.setItem(prefs, JSON.stringify(p))
	}
}

/* Register pref value */
function set_pref(prefs, key, value) {
	if (localStorage !== undefined) {
		var p = JSON.parse(localStorage.getItem(prefs));
		p[key] = value;
		localStorage.setItem(prefs, JSON.stringify(p))
	}
}

/* Delete prefs object */
function remove_prefs(prefs) {
	if (localStorage !== undefined) {
		localStorage.removeItem(prefs);
	}
}

/* Delete pref value */
function remove_pref(prefs, key) {
	if (localStorage !== undefined) {
		var p = JSON.parse(localStorage.getItem(prefs)), h = {};
		for (n in p) {
			if (n !== key) {
				h[n] = p[n];
			}
		}
	}
}

/* ------------------------------------------------------------------ */
/* # User prefs */
/* ------------------------------------------------------------------ */

/* Check app conf user prefs */
(function() {
	if (localStorage !== undefined && localStorage.getItem($prefs.app_conf) == null) {
			var defaults = {
			"css_fx" : $conf.css_fx,
			"svg_fx" : $conf.svg_fx,
			"js_fx" : $conf.js_fx,
		};
		set_prefs($prefs.app_conf, defaults); // register defaults to user prefs
	} else {
		if (has_prefs($prefs.app_conf)) { // retrieve user prefs
			$conf.css_fx = get_pref($prefs.app_conf, "css_fx") ? true : false; // overwrite defaults
			$conf.svg_fx = get_pref($prefs.app_conf, "svg_fx") ? true : false; // overwrite defaults
			$conf.js_fx = get_pref($prefs.app_conf, "js_fx") ? true : false; // overwrite defaults
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Compatibility */
/* ------------------------------------------------------------------ */

window.checkCompatibility = function() {
	return window.localStorage && new XMLHttpRequest().upload && window.FileReader && window.URL && window.JSON;
}

function compatibilityWarning() {
	if (!checkCompatibility()) {
		create_alert_bar($msg.compatibility_warning);
	}
}

/* ------------------------------------------------------------------ */
/* # Alert Boxes */
/* ------------------------------------------------------------------ */

/* Close Alert Boxes */
$("html").on("click", ".alert-box .close", function() {
	close_alert_box($(this).parent(".alert-box"));
});

/* ------------------------------------------------------------------ */
/* # Navigation */
/* ------------------------------------------------------------------ */

/* Navigation Links Current Switcher */
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
/* # Sub Navigation */
/* ------------------------------------------------------------------ */

/* Toggle Sub Navigation Links */
$("html").on("click", ".sub-nav dd a, .sub-nav dt a, .sub-nav li a", function() {
	if ($(this).attr("id") == "search_button"
	 || $(this).attr("id") == "filter_button"
	 || $(this).parent("li").parent("ul").attr("id") == "search_filters"
	 || $(this).parent("li").parent("ul").attr("id") == "filters_list") { // exception list ; rather ugly
		// do nothing !
	} else {
		if (!$(this).hasClass("unavailable") && !$(this).hasClass("disabled")) {
			if ($(this).parents(".sub-nav").hasClass("toggle")) { // toggle children only
				$(this).parent("dt, dd, li").siblings().children("a").removeClass("active");
			} else if ($(this).parents(".sub-nav").hasClass("toggle-all")) { // toggle even parents
				$(this).parents("dl, ul").find("dd a, dt a, li a").not($(this)).removeClass("active");
			}
			$(this).toggleClass("active");
			$(this).blur();
		}
	}
});

/* ------------------------------------------------------------------ */
/* # Tab Navigation */
/* ------------------------------------------------------------------ */

/*
 * NOTE
 * The purpose of live event below is to simulate an anchor behaviour
 * on any tab indexed element (i.e. <div> or <span>) by allowing user
 * to click on those elements (e.g. span.close or dt.accordion).
 * It may have unpredictable effect in some configuration, so be wary.
 */
$(document).on("keydown", "[tabindex]", function(e) {
	if (e.which == 13) { // Enter
		$(this).click();
	}
});

/* ------------------------------------------------------------------ */
/* # Required Fields */
/* ------------------------------------------------------------------ */

/*
 * NOTE
 * This live event is used for field validity convenience.
 */
$(document).on("focus", "[required]", function() {
	$(this).set_validity() // set field validity to undefined on focus (could also be on change or on blur)
});

/* ------------------------------------------------------------------ */
/* # Post Mailing */
/* ------------------------------------------------------------------ */

/*
 * NOTE
 * This live event simply redirects an unbound email address contained 
 * in postmail data-attribute toward a valid email address using mailto.
 */
$(document).on("click", "[data-postmail]", function() {
	document.location.href = "mailto:" + $(this).attr("data-postmail").rebind_postmail();
});

/* ------------------------------------------------------------------ */
/* # User Session */
/* ------------------------------------------------------------------ */

var UserSession = (function() {

	var is_user_remembered = docCookies.getItem($auth.remember_me) === "true";
	var is_client_connected = docCookies.hasItem($auth.is_authenticated);
	var user_account_id = is_user_remembered ? localStorage.getItem($auth.account_id) : sessionStorage.getItem($auth.account_id);
	var user_account_role = docCookies.getItem($auth.user_role);
	var user_token = is_user_remembered  ? localStorage.getItem($auth.token) : sessionStorage.getItem($auth.token);
	var user_token_id = docCookies.getItem($auth.token_id);
	var user_profile_id = is_user_remembered ? localStorage.getItem($auth.profile_id) : sessionStorage.getItem($auth.profile_id);
	var user_profile_pseudo = docCookies.getItem($auth.user_name);
	var user_profile_avatar = docCookies.getItem($auth.avatar_path);

	var persist_user_session = function(authcUser, rememberMe) {
		delete_user_session();
		// persiste sur une journée
		var expirationDate = rememberMe ? new Date() : 0;
		if (rememberMe) {
			expirationDate.setDate(expirationDate.getDate() + 1);
			// données sensibles restent dans le local storage
			localStorage.setItem($auth.account_id, authcUser.accountId);
			localStorage.setItem($auth.profile_id, authcUser.profileId);
			localStorage.setItem($auth.token, authcUser.token);
		} else {
			sessionStorage.setItem($auth.account_id, authcUser.accountId);
			sessionStorage.setItem($auth.profile_id, authcUser.profileId);
			sessionStorage.setItem($auth.token, authcUser.token);
		}
		docCookies.setItem($auth.is_authenticated,true,expirationDate, "/");
		docCookies.setItem($auth.user_role, authcUser.role,expirationDate, "/");
		docCookies.setItem($auth.user_name, authcUser.pseudo,expirationDate, "/");
		docCookies.setItem($auth.token_id, authcUser.tokenId,expirationDate, "/");
		docCookies.setItem($auth.avatar_path, authcUser.avatar,expirationDate, "/");
		docCookies.setItem($auth.remember_me,rememberMe,expirationDate,"/");
	}

	var delete_user_session = function() {
		docCookies.removeItem($auth.is_authenticated, "/");
		docCookies.removeItem($auth.user_role, "/");
		docCookies.removeItem($auth.user_name, "/");
		docCookies.removeItem($auth.token_id, "/");
		docCookies.removeItem($auth.avatar_path, "/");
		if (is_user_remembered) {
			localStorage.removeItem($auth.account_id);
			localStorage.removeItem($auth.profile_id);
			localStorage.removeItem($auth.token);
		} else {
			sessionStorage.removeItem($auth.account_id);
			sessionStorage.removeItem($auth.profile_id);
			sessionStorage.removeItem($auth.token);
		}
		is_user_remembered = false;
		is_client_connected = false;
		user_account_id = null;
		user_account_role = null;
		user_token = null;
		user_token_id = null;
		user_profile_id = null;
		user_profile_pseudo = null;
		user_profile_avatar = null;
	}

	var update_user_pseudo = function(pseudo) {
		var tomorrow = is_user_remembered ? new Date() : 0;
		if (is_user_remembered) {
			tomorrow.setDate(tomorrow.getDate() + 1);
		}
		docCookies.setItem($auth.user_name, pseudo, tomorrow, "/");
		user_profile_pseudo = docCookies.getItem($auth.user_name);
	}

	var update_user_avatar = function(avatar) {
		var tomorrow = is_user_remembered ? new Date() : 0;
		if (is_user_remembered) {
			tomorrow.setDate(tomorrow.getDate() + 1);
		}
		docCookies.setItem($auth.avatar_path, avatar, tomorrow, "/");
		user_profile_avatar = docCookies.getItem($auth.avatar_path);
	}

	return {
		isConnected : function() {
			return is_client_connected;
		},
		save : function(authcUser, rememberMe) {
			persist_user_session(authcUser, rememberMe);
		},
		delete : function() {
			delete_user_session();
		},
		updatePseudo : function(pseudo) {
			update_user_pseudo(pseudo);
		},
		updateAvatar : function(avatar) {
			update_user_avatar(avatar);
		},
		getAccountId : function() {
			return user_account_id;
		},
		getUserToken : function() {
			return user_token;
		},
		getUserTokenId : function() {
			return user_token_id;
		},
		getUserProfileId : function() {
			return user_profile_id;
		},
		getUserPseudo : function() {
			return user_profile_pseudo;
		},
		getUserAvatar : function() {
			return user_profile_avatar;
		},
		getUserRole : function() {
			return user_account_role;
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Ourses Security */
/* ------------------------------------------------------------------ */

var OursesSecurity = (function() {
	var is_user_admin = UserSession.getUserRole() !== null && UserSession.getUserRole() == $conf.role_admin;
	var is_user_writer = UserSession.getUserRole() !== null && UserSession.getUserRole() == $conf.role_redac;
	return {
		isUserAdmin : function() {
			return is_user_admin;
		},
		isUserWriter : function() {
			return is_user_writer;
		}
	}
})();

/* ------------------------------------------------------------------ */
/* # Initialize */
/* ------------------------------------------------------------------ */

/* Define third-party on-the-fly custom settings */
var autosize_cfg = {                           // Autosize jQuery plugin (i.e. remove line feed)
	"append"                : "",                // New line appended at the end of the textarea. Default : "\n"
	"resizeDelay"           : -1                  // Debounce timeout before resizing. Default : 10
};
var f_magellan_cfg = {                         // Foundation Magellan Sticky Nav component
	"threshold"             : 0,                 // Pixels from the top of the expedition for it to become fixes. Default : 0
	"destination_threshold" : 0,                 // Pixels from the top of destination for it to be considered active. Default : 20
	"throttle_delay"        : 0,                 // Calculation throttling to increase framerate. Default : 30
	"fixed_top"             : 0                  // Top distance in pixels assigend to the fixed element on scroll. Default : 0
};

/* Initialize modules on document ready */
$(document).ready(function() {
	var f = Foundation.libs, f_m = f["magellan-expedition"].settings; // define foundation custom settings
	$.extend(f_m, f_magellan_cfg, f_m); // appply foundation custom settings
	$(document).foundation(); // initialize foundation module
	loap.init(); // initialize primary module
	if (typeof loax !== "undefined" && loax.hasOwnProperty("init")) {
		loax.init() // initialize auxiliary module
	}
	$("textarea").autosize(autosize_cfg); // initialize autosize plugin
});

/* Reload modules on window resize event */
$(window).on("resize", function() {
	$("textarea").trigger("autosize.resize") // force autosize resize
});
