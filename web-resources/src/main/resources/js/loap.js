/**
 * Les Ourses à plumes
 * Javascript Main File
 * Require jQuery Library
 * ver. 1.0.2
 */

/* ------------------------------------------------------------------ */
/* # Core */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Below are owner javascript prototypes extensions.
 * They must be called before anything else.
 * Well, at least if you can catch the rime of an ancient mariner ...
 */

/* Cut string
 * Remove characters from a string up to an end point
 * and return the result.
 * - e.g. "momolebite".cut(4) becomes "lebite"
 * - e.g. "momolebite".cut(-4) becomes "momole"
 */
String.prototype.cut = function(start) {
	// return this.substr(start, this.length);
	return (start < 0 ? this.substr(0, this.length + start) : this.substr(start, this.length));
};

/* Truncate string
 * Remove all characters from a string begining at a starting point
 * and return the result.
 * - e.g. "momolebite".trunc(4) becomes "momo"
 * - e.g. "momolebite".trunc(-4) becomes "bite"
 */
String.prototype.trunc = function(end) {
	return (end < 0 ? this.substr(end, this.length) : this.substr(0, end));
};

/* Convert pixel string to root EM numeric
 * From String to Float (e.g. "20px" becomes 1.25)
 */
String.prototype.toRem = function() {
	var n = parseFloat(this.replace("px", ""));
	var r = parseFloat(window.getComputedStyle(document.querySelector("body")).getPropertyValue("font-size").replace("px", ""));
	return (n / r);
};

/* Convert root EM numeric to pixel string
 * From Float to String (e.g. 1.25 becomes "20px")
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
	"confirmation_bar_tmpl"         : $loc.tmpl + "snippet_confirmation_bar.tmpl",
	"alert_box_tmpl"                : $loc.tmpl + "snippet_alert_box.tmpl",
	"dev_toolbar_tmpl"              : $loc.tmpl + "_dev_toolbar.tmpl",
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
			if ($conf.css_debug) { $("body").addClass("css-debug") }
			// Apply css fx
			if ($conf.css_fx) { $("body").addClass("css-fx"); }
			// Build container
			if ($build.container) {
				// Apply standard layout (i.e. two columns view)
				$("body").addClass("standard-layout");
				// Prepend frame
				$("body").prepend(file_pool.frame_tmpl).prepend(lb(1));
			}
			// Build toolbar template
			if ($build.toolbar) { $("body").prepend(file_pool.dev_toolbar_tmpl).prepend(lb(1)) }
			// Build icons
			if ($build.icons) {
				// Prepend SVG effects
				if ($conf.svg_fx) {
					$("body").prepend(tb(2) + "<style type='text/css'>" + lb(1) + file_pool.icons_fx_file + lb(1) + tb(2) + "</style>").prepend(lb(1))
				}
				// Prepend SVG icons
				$("body").prepend(file_pool.icons_file).prepend(lb(1));
			}
		},
		update : function() {
			$(document).svg_icons(); // WARNING : set svg icons for whole document
			$(document).user_pictures(); // WARNING : set user pictures for whole document
		},
		init : function() {
			/* Apply user settings */
			check_user_connected()
			set_toolbar_prefs()
			/* Load components */
			this.update();
			$(document).placeholder(); // set placeholder for whole document
			$(document).zlider(); // launch zlider for whole document
			user_menu.init(); // setup user menu
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
				loax.build() // process auxiliary build
			}
			$.holdReady(false); // release document ready event
		}
	}
	function setFileCallback(varname) {
		return function(XHRresponse) {
			if (file_pool[varname].trunc(-4) == "tmpl") {
				file_pool[varname] = doT.compile(XHRresponse);
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

/* Scroll to (object) */
function scrollTo(object, duration, spacing) {
	var duration = $conf.js_fx ? (typeof duration !== "undefined" ? duration : 0) : 0;
	var spacing = spacing || 0;
	if (object.offset().top + object.height() > $(window).height() + $(document).scrollTop()) { // scroll down
		$("html, body").animate({ // NOTE : 'html' for FF/IE and 'body' for Chrome
			scrollTop : object.offset().top + object.outerHeight() - $(window).height() + spacing
		}, duration);
	} else if (object.offset().top < $(document).scrollTop()) { // scroll up
		$("html, body").animate({ // NOTE : 'html' for FF/IE and 'body' for Chrome
			scrollTop : object.offset().top - spacing
		}, duration);
	}
}

/* Force focus */
function force_focus(selector) {
	$(selector).focus();
	if ($conf.js_fx) {
		$(selector)
			.animate({"opacity" : ".25"}, 125)
			.animate({"opacity" : "1"}, 250);
	}
}

/* Cursor Position */
jQuery.fn.extend({
	selectText : function(start, end) {
		end = end || false;
		obj = this.first().get(0);
		obj.focus();
		obj.setSelectionRange(start, end || start);
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
			"delay" : 750                           // Integer   Timeout before checking empty field value on blur. Default : 500
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
			$(this).on("click", "[" + cfg.attr + "]", function() {
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
				var h = "<svg viewBox='0 0 48 48' width='" + s + "' height='" + s + "'><use xlink:href='#" + c + "'></use></svg>";
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
					// var str = $(this).find(cfg.options + " > li.selected").text();
					if (e.which == 13) { // Enter
						$(this).blur();
					}
					else if (e.which == 27) { // Escape
						var q = $(this).data("last_value");
						console.log(q);
						$(this).find(cfg.options + " > li").removeClass("selected");
						$(this).find(cfg.options + " > li").eq(q).addClass("selected");
						var s = $(this).find(cfg.options + " > li.selected").text();
						$(this).find(cfg.select).text(s);
					}
					else if (e.which == 32) { // Space
						if ($conf.js_fx) {
							$(this).find(cfg.options).slideToggle(cfg.slide_duration, function() {
								scrollTo($(self), false, $(self).find(cfg.select).outerHeight());
							});
						} else {
							$(this).find(cfg.options).toggle();
							scrollTo($(self), false, $(self).find(cfg.select).outerHeight());
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
								scrollTo($(this).find(cfg.select), 250, $(this).find(cfg.select).outerHeight());
							} else if ($(this).find(cfg.options + " > li.selected").is(":last-child")) {
								scrollTo($(this).find(cfg.options + " > li.selected"), 250, $(this).find(cfg.select).outerHeight());
							} else {
								scrollTo($(this).find(cfg.options + " > li.selected"), 0);
							}
						}
					}
				}
			});
			$(this).on("click", cfg.select, function() {
				if ($conf.js_fx) {
					$(this).next(cfg.options).slideToggle(cfg.slide_duration, function() {
						scrollTo($(self), false, $(self).find(cfg.select).outerHeight());
					});
				} else {
					$(this).next(cfg.options).toggle();
					scrollTo($(self), false, $(self).find(cfg.select).outerHeight());
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
					obj.find(cfg.next_selector).find(cfg.link_selector).addClass("disabled");
					obj.find(cfg.prev_selector).find(cfg.link_selector).removeClass("disabled");
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
				obj.find(reverse_selector + " " + cfg.link_selector).removeClass("disabled");
				dir == "forward" ? obj.find(dir_selector).css({"padding-left" : "", "background" : ""}) : obj.find(dir_selector).css({"padding-right" : "", "background" : ""});
				if (!obj.find(dir_selector).hasClass("disabled")) {
					obj.find(dir_selector).find(cfg.link_selector).data(e_event, true);
					if (dir == "forward" ? slide_count < 0 : slide_count > -slide_step) {
						dir == "forward" ? slide_count++ : slide_count--;
						inner_left = (dir == "forward" ? inner_left + inner_width : inner_left - inner_width);
						obj.find(cfg.inner_selector).animate({"left" : inner_left}, $conf.js_fx ? cfg.slide_duration : 0, function() {
							set_items_focusability(obj, "li", inner_width);
							if (dir == "forward" ? slide_count < 0 : slide_count > -slide_step) {
								if ($conf.js_fx) {
									if (obj.find(dir_selector).find(cfg.link_selector).data(e_event) == true) {
										if (e_event == "mousedown") {
											obj.find(dir_selector).find(cfg.link_selector).mousedown();
										} else if (e_event == "keydown") {
											obj.find(dir_selector).find(cfg.link_selector).keydown();
										}
									}
								}
							} else {
								obj.find(dir_selector).find(cfg.link_selector).addClass("disabled");
								dir == "forward" ? obj.find(reverse_selector).css({"padding-right" : "0", "background" : "none"}) : obj.find(reverse_selector).css({"padding-left" : "0", "background" : "none"});
							}
						});
					} else {
						obj.find(dir_selector).find(cfg.link_selector).addClass("disabled");
						dir == "forward" ? obj.find(reverse_selector).css({"padding-right" : "0", "background" : "none"}) : obj.find(reverse_selector).css({"padding-left" : "0", "background" : "none"});
					}
				}
			}
			// events
			$(this).find(cfg.prev_selector + " " + cfg.link_selector).mousedown(function() {
				slide(self, "backward", "mouse");
			});
			$(this).find(cfg.next_selector + " " + cfg.link_selector).mousedown(function() {
				slide(self, "forward", "mouse");
			});
			$(this).find(cfg.prev_selector + " " + cfg.link_selector + ", " + cfg.next_selector + " " + cfg.link_selector).mouseup(function() {
				$(this).removeData("mousedown");
			});
			$(this).find(cfg.prev_selector + " " + cfg.link_selector).keydown(function(e) {
				if (e.which == 13) { // Enter
					slide(self, "backward", "keyboard");
				}
			});
			$(this).find(cfg.next_selector + " " + cfg.link_selector).keydown(function(e) {
				if (e.which == 13) { // Enter
					slide(self, "forward", "keyboard");
				}
			});
			$(this).find(cfg.prev_selector + " " + cfg.link_selector + ", " + cfg.next_selector + " " + cfg.link_selector).keyup(function(e) {
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
								scrollTo($(this), 250, $(this).outerHeight());
							} else if (sel.find("ul > li").not(".hide").last().hasClass("selected")) {
								scrollTo(sel.find("ul > li.selected"), 250, $(this).outerHeight());
							} else {
								scrollTo(sel.find("ul > li.selected"), 0);
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
								scrollTo(sel.find("ul > li:visible").last(), 500, $(this).outerHeight());
							} else {
								scrollTo(sel.parent(), 500, $(this).outerHeight());
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

/* Add Confirmation Bar */
jQuery.fn.extend({
	add_confirmation_bar : function() {
		// vars
		var str = "";
		var t = 0;
		// functions
		function valid(obj, cancel) {
			var cancel = cancel || false;
			$conf.js_fx ? $(".validation-bar").fadeOut("fast") : $(".validation-bar").hide();
			$(".validation-bar").remove();
			if (cancel) {
				obj.val(str);
			}
		}
		// loop
		$(this).each(function() {
			var obj = $(this);
			// events
			obj.bind({
				focus: function() {
					if (obj.attr("disabled") == undefined && obj.attr("readonly") == undefined) {
						str = $(obj).val();
					}
				},
				blur: function(event) {
					if (obj.attr("disabled") == undefined && obj.attr("readonly") == undefined) {
						if ($(".validation-bar [data-valid]").length > 0 && $(".validation-bar [data-cancel]").is(":hover")) {
							valid(obj, true);
						} else {
							valid(obj);
						}
						obj.trigger('autosize.resize') // force autosize (i.e. wrong size on cancel bug fix)
					}
				},
				keyup: function(event) {
					if (obj.attr("disabled") == undefined && obj.attr("readonly") == undefined) {
						if (event.which == 27) { // Escape
							valid(obj, true);
						} else if (event.ctrlKey && event.which == 13) { // Ctrl + Enter
							valid(obj);
							obj.blur();
						} else if (event.which == 0 || event.which == 8 || event.which == 13 || event.which == 32 || event.which == 46 || event.which >= 48 && event.which <= 90 || event.which >= 96 && event.which <= 111 || event.which >= 160 && event.which <= 192) { // ² or Backspace or Enter or Space or Suppr or A-Z 0-9 or Numpad or Punctuation Mark
							if ($(".validation-bar").length === 0) {
								$(this).after(file_pool.confirmation_bar_tmpl); // insert confirmation_bar template
								$(".validation-bar").svg_icons(); // reflow all icons of validation bar
								$conf.js_fx ? $(".validation-bar").fadeIn("slow") : $(".validation-bar").show();
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
 * no dependences with Foundation alert plugin script.
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
			"timeout"         : 0,          // Integer  Time before alert box fade out (zero to never). Default : 0
			"scroll"          : true,       // Boolean  Scroll to alert box after insertion. Default : true
			"scroll_duration" : 500,        // Integer  Duration of the scrolling effect. Default : 500
			"fade_duration"   : 500         // Integer  Duration of the fading effeet. Default : 500
		};
		var cfg = $.extend({}, defs, opts);
		var sel = "#" + id; // internal
		if ($(sel).length == 0) {
			$(this).first().after(file_pool.alert_box_tmpl({"id" : id, "class" : cfg["class"], "icon" : cfg.icon, "icon_class" : cfg.icon_class, "text" : msg}));
			$(sel).svg_icons(); // set svg icons contained by alert box
			$(sel).fadeIn($conf.js_fx ? cfg.fade_duration / 2 : 0); // show alert box
			if (cfg.timeout > 0) {
				setTimeout(function() {
					$(sel).children().css("visibility", "hidden"); // mask box content
					$(sel).animate({"height":"0", "margin" : "0", "padding" : "0", "opacity":"0"}, $conf.js_fx ? cfg.fade_duration : 0, function() { // hide alert box
						$(sel).remove(); // remove alert box
					});
				}, cfg.timeout);
			}
		} else { // update
			$(sel).removeClass("info secondary alert error success warning");
			$(sel).addClass(cfg["class"]);
			$(sel).find(".text").html(msg);
			$(sel).find(".icon").removeClass("").addClass("icon small" + (cfg.icon_class !== null ? " " + cfg.icon_class : ""));
			$(sel).find(".icon svg use").attr("xlink:href", "#icon-" + cfg.icon);
		}
		if (cfg.scroll == true) { scrollTo($(sel), cfg.scroll_duration, $(sel).innerHeight()) } // scroll to alert box
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
				var done = (function() {
					if ($(cfg.trigger).data("connected") == true) {
						$(cfg.target).data("open") ? close_menu(cfg.target) : open_menu(cfg.target); // show menu
					} else {
						set_user_connected(true); // connect user
						createAlertBox($msg.connected, "alert_auth", {"class" : "success", "timeout" : $time.duration.alert})
					}
				});
				var fail = (function() {
					if ($(cfg.trigger).data("connected") == true) {
						set_user_connected(false); // set not connected
						disconnect($msg.disconnected, {"timeout" : $time.duration.alert}); // disconnect
					} else {
						window.location.href = $nav.login.url; // redirect to the login page
					}
				});
				////////////////////////////////////////////////////////////////
				// Local TEST block for DEBUG
				////////////////////////////////////////////////////////////////
				// set_user_connected(true); // connect user
				// $(cfg.trigger).data("connected", true);
				// $(cfg.target).data("open") ? close_menu(cfg.target) : open_menu(cfg.target); // show menu
				////////////////////////////////////////////////////////////////
				checkAuthc(done, fail);
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

/* ------------------------------------------------------------------ */
/* # Build methods declaration */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Below are all methods called after or during build process.
 * These are not parts of the module and aren't supposed to be reloaded.
 */

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

/* Insert alert box after header */
function createAlertBox(msg, id, opts) {
	$("main > header").create_alert_box(msg, id, opts);
}

/* Convert long date format to short numeric */
function getDateTime(date) { // passe une date en param pour obtenir une string au bon format pour la balise time
	var year = date.getFullYear().toString();
	var month;
	var day;
	var numMonth = date.getMonth() + 1;
	if (numMonth < 10) {
		month = "0" + numMonth.toString();
	}else{
		month = numMonth.toString();
	}
	if (date.getDate() <10) {
		day = "0" + date.getDate().toString();
	}else{
		day = date.getDate().toString();
	}
	return year + "-" + month + "-" + day;
}

/* Convert long date format to string */
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

/* Convert long date format to HTML */
function dateToHTML(date) {
	return (dateToString(date).replace("1er", "1<sup>er</sup>").replace("é", "&eacute;").replace("û", "&ucirc;"));
}

/* Set page title */
function set_page_title(str) {
	if ($conf.page_title) {
		$("title").html($("title").text() + " - " + str);
	}
}

/* Update user menu user name */
function update_user_pseudo(pseudo) {
	window.localStorage.setItem($auth.user_name, pseudo);
	$(".user-name").html(pseudo);
}

/* Update user menu user picture */
function update_user_avatar(pathAvatar) {
	window.localStorage.setItem($auth.avatar_path, pathAvatar);
	$("#user_avatar").attr("data-image", pathAvatar); // define avatar
	$("#user_menu").user_pictures(); // reload user image
}

/* Check authentication before sending AJAX requests */
function header_authentication(xhr) {
	if (hasStorage && window.localStorage.getItem($auth.token) !== null) {
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($auth.token)); // check authc token
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
		dataType : "xml"
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
		data : window.localStorage.getItem($auth.token),
		success : function(data, status, jqXHR) {
			clearStorage();
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
	var done = (function() { set_user_connected(true) });
	var fail = (function() { set_user_connected(false) });
	var always = (function() { $(".user-connect").fadeIn($conf.js_fx ? 500 : 0) });
	checkAuthc(done, fail, always);
}

/* Set user connected
 * NOTE : connected auth check has been deferred to ready state.
 */
function set_user_connected(is_connected) {
	var is_connected = is_connected || false, sel = "#user_connect";
	if (is_connected) {
		$(sel + " svg use").attr("xlink:href", "#icon-menu");
		$(sel).reload_tooltip("Menu"); // reset Foundation tooltip
		$(sel).data("connected", true); // register connected state in local data var
		$(".user-connect").append(file_pool.user_nav_tmpl); // process user menu template
		$("#user_menu").user_pictures(); // reload user pictures of user menu
	} else {
		$("#user_menu").detach(); // remove user menu from DOM (n.b. keep data and events)
		$(sel + " svg use").attr("xlink:href", "#icon-connect");
		$(sel).reload_tooltip("S&rsquo;identifier"); // reset Foundation tooltip
		$(sel).data("connected", false); // register connected state in local data var
	}
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
/* # Process user prefs */
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
/* # Toolbar */
/* ------------------------------------------------------------------ */

/* Toolbar Activator */
var toolbar_show = {
	"index" : 0,
	"timer" : NaN,
	"delay" : 500
};
$(document).on("keydown", function(event) {
	if ((event.which == 68 && toolbar_show.index == 0) || (event.which == 69 && toolbar_show.index == 1)) { // D OR E
		toolbar_show.index++;
		toolbar_show.timer = setTimeout(function() {
			toolbar_show.index = 0;
		}, toolbar_show.delay);
	}
	else if (event.which == 86 && toolbar_show.index == 2) { // V
		clearTimeout(toolbar_show.timer);
		if ($("#_toolbar_stick_toggle").hasClass("active")) {
			if ($("#toolbar").hasClass("hide")) {
				$(".frame").css("margin-top", "45px");
			} else {
				$(".frame").css("margin-top", "0");
			}
		}
		$("#toolbar").toggleClass("hide");
		toolbar_show.index = 0;
	} else {
		toolbar_show.index = 0;
	}
});

/* Toolbar Effects Toggler */
$("html").on("click", "#_css_fx_toggle, #_svg_fx_toggle, #_js_fx_toggle", function() {
	$(this).toggleClass("active");
	var str = $(this).attr("id").replace("_toggle", "").cut(1);
	var val = $(this).hasClass("active") ? true : false;
	set_pref($prefs.app_conf, str, val); // set user pref
	$conf[str] = val; // overwrite global conf
});
$("html").on("click", "#_css_fx_toggle", function() {
	$("body").toggleClass("css-fx");
});
$("html").on("click", "#_svg_fx_toggle", function() {
	createAlertBox("Configuration de l&rsquo;affichage modifi&eacute;e. Rechargement de la page n&eacute;cessaire.", "alert_conf", {"class" : "warning", "timeout" : $time.duration.alert});
});

/* Toolbar Null Links Toggler */
$("html").on("click", "#_null_links_toggle", function() {
	if (!$(this).hasClass("active")) {
		// Navs
		$("nav ul li .disabled").addClass("not-disabled");
		$("nav ul li[class^='icon-'] .disabled").parent("li").addClass("enabled"); // Navs Icons
		$("nav ul li .disabled").removeClass("disabled");
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

/* Toolbar CSS Debug Toggler */
$("html").on("click", "[id^='_css_debug_']", function() {
	if (!$(this).hasClass("disabled")) {
		$(this).toggleClass("active");
		$("." + $(this).attr("id").cut(11)).toggleClass("css-debug");
	}
});

/* Toolbar Stick Toggler */
$("html").on("click", "#_toolbar_stick_toggle", function() {
	$(this).toggleClass("active");
	$("#toolbar").toggleClass("fixed");
	var n = $(".frame").css("margin-top") != "45px" ? "45px" : 0;
	$(".frame").css("margin-top", n);
});

/* Close Toolbar Toggler */
$("html").on("click", "#toolbar .close", function() {
	if ($(".frame").css("margin-top") != 0) {
		$(".frame").css("margin-top", 0)
	}
	$("#toolbar").addClass("hide");
});

/* ------------------------------------------------------------------ */
/* # Alert Boxes */
/* ------------------------------------------------------------------ */

/* Close Alert Boxes */
$("html").on("click", ".alert-box .close", function() {
	var self = $(this).parent(".alert-box");
	$(self).css("color", "transparent"); // mask box content
	$(self).children().css("visibility", "hidden"); // mask box content
	$(self).animate({
		"height": "0",
		"margin" : self.height() / 2 + "px 0 0",
		"padding" : "0",
		"opacity":"0"
	}, $conf.js_fx ? $time.duration.fx : 0, function() { // hide alert box
		self.remove();
	});
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
/* # Initialize */
/* ------------------------------------------------------------------ */

/* Define third-party on-the-fly custom settings */
var autosize_cfg = {append: ""};              // Autosize jQuery plugin (i.e. remove line feed)
var f_tooltip_cfg = {                         // Foundation Tooltip component
	"touch_close_text" : "Appuyez pour fermer", // Translate message. Default : "Tap To Close"
	"disable_for_touch" : true,                 // Global deactivation for touch devices. Default : false
	"hover_delay" : 500                         // Increase time before tooltips appear. Default : 200
};

/* Initialize third-party modules */
$(document).ready(function() {
	/* Apply Foundation custom config */
	var f = Foundation.libs;
	$.extend(f.tooltip.settings, f_tooltip_cfg, f.tooltip.settings); // Apply Foundation custom settings -- NOTE : override fucking Foundation fucking libs
	/* Initialize third-party plugins */
	$("textarea").autosize(autosize_cfg); // Autosize jQuery plugin -- WARNING : compatibility need to be checked on IE10
	$(document).foundation(); // Initialize Foundation module
	loap.init(); // Initialize primary module
	if (typeof loax !== "undefined" && loax.hasOwnProperty("init")) {
		loax.init() // Initialize auxiliary module
	}
});

/* Reload modules on window resize event */
$(window).on("resize", function() {
	$("textarea").autosize(autosize_cfg); // Autosize jQuery plugin
});
