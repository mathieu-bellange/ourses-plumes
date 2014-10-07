﻿/**
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
 * Below are methods and jQuery extensions required by the module.
 * They have to be called before anything else.
 * Be carefull with them or beware Bilbo Baggin's mighty wrath !
 */

/* Cut string
 * Remove characters from a string up to an end point
 * and return the result (e.g. "molebite".cut(4) becomes "bite")
 */
String.prototype.cut = function(end) {
	return this.substr(end, this.length);
};

/* Truncate string
 * Remove all characters from a string begining at a starting point
 * and return the result (e.g. "molebite".trunc(4) becomes "mole")
 */
String.prototype.trunc = function(start) {
	return this.substr(0, start);
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
	placeholder : function(options) {
		// vars
		var defaults = {
			"tag" : "span",                         // String    The tag of the placeholder element. Default : "span"
			"attr" : "data-placeholder",            // String    Attribute name of the placeholder element. Default : "data-placeholder"
			"class" : "placeholder",                // String    Class name of the placeholder element. Default : "placeholder"
			"delay" : 750                           // Integer   Timeout before checking empty field value on blur. Default : 500
		};
		var settings = $.extend({}, defaults, options);
		var t = 0;
		// methods
		function removePlaceholder(obj) {
			if (obj.data("placeholder_value") === undefined) {
				obj.data("placeholder_value", obj.find("." + settings.class).text()); // store placeholder
				obj.find("." + settings.class).remove();
			}
		}
		// loop
		$(this).each(function () {
			// events
			$(this).on("click", "[" + settings.attr + "]", function() {
				clearTimeout(t);
				removePlaceholder($(this)); // erase placeholder
			});
			$(this).on("keypress", "[" + settings.attr + "]", function(event) {
				if (event.which !== 9) { // Tab
					removePlaceholder($(this)); // erase placeholder
				}
			});
			$(this).on("blur", "[" + settings.attr + "]", function() {
				var self = $(this);
				t = setTimeout(function() {
					if (!$("#cke_inline_editor").is(":visible")) {
						if (self.find("iframe").length == 0 && self.text().trim().length == 0) {
							self.html("<" + settings.tag + " class='" + settings.class + "'>" + self.data("placeholder_value") + "</" + settings.tag + ">"); // append placeholder
							self.removeData("placeholder_value");
						}
					}
				}, settings.delay);
			});
			// init
			$(document).ready(function() {
				$("[" + settings.attr + "]").each(function() {
					if ($(this).attr(settings.attr) !== "") {
						$(this).html("<span class='" + settings.class + "'>" + $(this).attr(settings.attr) + "</span>");
					}
				});
			});
		});
	}
});

/* User Pictures */
jQuery.fn.extend({
	user_pictures : function(options) {
		// Variables
		var defaults = {
			attr : "data-image",  // String  Define the data attribute containing image URL. Default : "data-image"
		};
		var settings = $.extend({}, defaults, options);
		// Loop
		$(this).each(function() {
			var obj = $(this).find("[" + settings.attr + "]");
			obj.each(function() {
				var file = $(this).attr(settings.attr);
				$(this).css("background-image", "url('" + file + "')")
			});
		});
	}
});

/* SVG Icons */
jQuery.fn.extend({
	svg_icons : function(options) {
		// Variables
		var defaults = {
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
		var settings = $.extend({}, defaults, options);
		// Loop
		$(this).each(function() {
			// Define object
			var obj = $(this).find(settings.i_selector);
			obj.each(function() {
				// Retrieve icon hypertext reference from object class
				var c = $(this).attr("class").match(settings.i_classmatch).toString();
				var i = c.substr(5, c.length);
				var k = settings.i_classname;
				// Define icon color class from icon hypertext reference
				if (settings.i_classes.hasOwnProperty(i)) {
					k += " " + settings.i_classes[i];
				}
				// Set svg element width and height attributes
				var s = settings.s_default;
				if (settings.s_null == true) {s = 0}
				else if ($(this).hasClass("tiny")) {s = settings.s_tiny}
				else if ($(this).hasClass("small")) {s = settings.s_small}
				else if ($(this).hasClass("medium")) {s = settings.s_medium}
				else if ($(this).hasClass("large")) {s = settings.s_large}
				else if ($(this).hasClass("huge")) {s = settings.s_huge}
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
	options_select : function(options) {
		// vars
		var defaults = {
			select : ".select",       // String   Selector of the value holder element. Default : "span"
			options : ".options",     // String   Selector of the list of choices itself. Default : "ul"
			slide_duration : "fast",  // Integer  Length of the sliding effect in milliseconds. Default : "fast"
			scroll_duration : 500,    // Integer  Length of the scrolling effect in milliseconds. Default : 500
			scroll_spacing : 0        // Integer  Size of the scrolling spacing in pixels. Default : 0
		};
		var settings = $.extend({}, defaults, options);
		// loop
		$(this).each(function () {
			// vars
			var self = this;
			// set initially selected value if any
			if ($(this).find(settings.options + " > li").hasClass("selected")) {
				var str = $(this).find(settings.options + " > li.selected").text();
				$(this).find(settings.select).text(str);
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
					$conf.js_fx ? $(this).find(settings.options).slideUp(settings.slide_duration) : $(this).find(settings.options).hide();
				},
				keydown: function(event) {
					// var str = $(this).find(settings.options + " > li.selected").text();
					if (event.which == 27) { // Escape
						$(this).blur();
					}
					if (event.which == 13 || event.which == 32) { // Enter or Space
						if ($conf.js_fx) {
							$(this).find(settings.options).slideToggle(settings.slide_duration, function() {
								scrollTo($(self), false, $(self).find(settings.select).outerHeight());
							});
						} else {
							$(this).find(settings.options).toggle();
							scrollTo($(self), false, $(self).find(settings.select).outerHeight());
						}
					}
					if (event.which >= 33 && event.which <= 36 || event.which == 38 || event.which == 40) { // PageUp, PageDown, End, Home or Up or Down
						event.preventDefault();
						var index = $(this).find(settings.options + " > li.selected").index();
						if (index == -1) {
							$(this).find(settings.options + " > li").not(".disabled").first().addClass("selected");
							index = 0;
						}
						if (event.which == 33 || event.which == 36) { // PageUp or Home
							$(this).find(settings.options + " > li").removeClass("selected");
							$(this).find(settings.options + " > li").first().addClass("selected");
						}
						if (event.which == 34 || event.which == 35) { // PageDown or End
							$(this).find(settings.options + " > li").removeClass("selected");
							$(this).find(settings.options + " > li").last().addClass("selected");
						}
						if (event.which == 38 && index - 1 >= 0) { // Up
							$(this).find(settings.options + " > li:eq(" + index + ")").prevAll("li:not(.disabled)").first().addClass("selected");
							if ($(this).find(settings.options + " > li:eq(" + index + ")").prevAll("li:not(.disabled)").first().hasClass("selected")) {
								$(this).find(settings.options + " > li:eq(" + index + ")").removeClass("selected");
							}
						}
						if (event.which == 40 && index + 1 < $(this).find(settings.options + " > li").length) { // Down
							$(this).find(settings.options + " > li:eq(" + index + ")").nextAll("li:not(.disabled)").first().addClass("selected");
							if ($(this).find(settings.options + " > li:eq(" + index + ")").nextAll("li:not(.disabled)").first().hasClass("selected")) {
								$(this).find(settings.options + " > li:eq(" + index + ")").removeClass("selected");
							}
						}
						// scrolling
						if ($(this).find(settings.options + " > li").hasClass("selected")) {
							var str = $(this).find(settings.options + " > li.selected").text();
							$(this).find(settings.select).text(str);
							if ($(this).find(settings.options + " > li.selected").is(":first-child")) {
								scrollTo($(this).find(settings.select), 250, $(this).find(settings.select).outerHeight());
							} else if ($(this).find(settings.options + " > li.selected").is(":last-child")) {
								scrollTo($(this).find(settings.options + " > li.selected"), 250, $(this).find(settings.select).outerHeight());
							} else {
								scrollTo($(this).find(settings.options + " > li.selected"), 0);
							}
						}
					}
				}
			});
			$(this).on("click", settings.select, function() {
				if ($conf.js_fx) {
					$(this).next(settings.options).slideToggle(settings.slide_duration, function() {
						scrollTo($(self), false, $(self).find(settings.select).outerHeight());
					});
				} else {
					$(this).next(settings.options).toggle();
					scrollTo($(self), false, $(self).find(settings.select).outerHeight());
				}
			});
			$(this).on("click", settings.options + " > li", function() {
				if (!$(this).hasClass("disabled")) {
					var str = $(this).text();
					$(this).addClass("selected");
					$(this).siblings().removeClass("selected");
					$(this).parent(settings.options).prev(settings.select).text(str);
					$conf.js_fx ? $(this).parent(settings.options).slideToggle(settings.slide_duration) : $(this).parent(settings.options).toggle();
				}
			});
		});
	}
});

/* Custom Slider */
jQuery.fn.extend({
	zlider: function(options) {
		var defaults = {
			"prev_selector"  : ".prev",        // Selector  Forward controller. Default : ".prev"
			"next_selector"  : ".next",        // Selector  Backward controller. Default : ".next"
			"inner_selector" : "ul",           // Selector  Inside box (i.e. the sliding content). Default : ".fast-nav ul"
			"item_selector"  : "li",           // Selector  Items contained by the inner box. Default : "li"
			"link_selector"  : "a",            // Selector  Links contained by each item. Default : "a"
			"slide_duration" : 125,            // Duration  Length of the sliding effect. Default : 125
			"resize_timeout" : 500,            // Duration  Time before slider is reset after window resize. Default : 500
			"extra_spacing"  : 1,              // Integer   Additional safety spacing added to inside box (px). Default : 1
		};
		settings = $.extend({}, defaults, options);
		$("[data-zlider]").each(function() {
			// vars
			var resize_count = 0;
			var slide_count = 0;
			var slide_step = 0;
			var inner_left = 0;
			var inner_width = 0;
			var self = $(this);
			// methods
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
						$(this).find(settings.link_selector).removeAttr("tabindex");
					} else {
						$(this).find(settings.link_selector).attr("tabindex", "-1");
					}
				});
			}
			function setup(obj) {
				var outer_width = get_items_width(obj, settings.item_selector); // internal ; compute total width
				if (obj.width() < outer_width) { // setup module if needed
					$(".prev, .next").show(); // show slider controls
					// define vars
					var prev = {
						"width" : obj.find(settings.prev_selector).width(),
						"padding" : parseFloat(obj.find(settings.prev_selector).css("padding-right"))
					};
					var next = {
						"width" : obj.find(settings.next_selector).width(),
						"padding" : parseFloat(obj.find(settings.next_selector).css("padding-left"))
					};
					inner_left = prev.width;
					inner_width = obj.width() - (prev.width + next.width + prev.padding + next.padding);
					// proceed positioning and sizing
					obj.find(settings.inner_selector).css("left", inner_left);
					obj.find(settings.inner_selector).css("width", outer_width + settings.extra_spacing);
					obj.find(settings.next_selector).find(settings.link_selector).addClass("disabled");
					obj.find(settings.prev_selector).find(settings.link_selector).removeClass("disabled");
					obj.find(settings.prev_selector).css({"padding-right" : "0", "background" : "none"});
					slide_step = Math.floor(outer_width / inner_width); // compute sliding steps
					set_items_focusability(obj, settings.item_selector, inner_width); // set items focusability
				} else {
					obj.find(settings.prev_selector + ", " + settings.next_selector).hide();
					obj.find(settings.inner_selector).css("width", "auto");
					obj.find(settings.inner_selector).css("left", "0");
					slide_count = 0; // reset count
				}
			}
			function slide(obj, dir, e) { // obj, forward|backward, mouse|keyboard
				var dir_selector = (dir == "forward" ? settings.next_selector : settings.prev_selector);
				var reverse_selector = (dir == "forward" ? settings.prev_selector : settings.next_selector);
				var e_event = (e == "mouse" ? "mousedown" : "keydown");
				obj.find(reverse_selector + " " + settings.link_selector).removeClass("disabled");
				dir == "forward" ? obj.find(dir_selector).css({"padding-left" : "", "background" : ""}) : obj.find(dir_selector).css({"padding-right" : "", "background" : ""});
				if (!obj.find(dir_selector).hasClass("disabled")) {
					obj.find(dir_selector).find(settings.link_selector).data(e_event, true);
					if (dir == "forward" ? slide_count < 0 : slide_count > -slide_step) {
						dir == "forward" ? slide_count++ : slide_count--;
						inner_left = (dir == "forward" ? inner_left + inner_width : inner_left - inner_width);
						obj.find(settings.inner_selector).animate({"left" : inner_left}, $conf.js_fx ? settings.slide_duration : 0, function() {
							set_items_focusability(obj, "li", inner_width);
							if (dir == "forward" ? slide_count < 0 : slide_count > -slide_step) {
								if ($conf.js_fx) {
									if (obj.find(dir_selector).find(settings.link_selector).data(e_event) == true) {
										if (e_event == "mousedown") {
											obj.find(dir_selector).find(settings.link_selector).mousedown();
										} else if (e_event == "keydown") {
											obj.find(dir_selector).find(settings.link_selector).keydown();
										}
									}
								}
							} else {
								obj.find(dir_selector).find(settings.link_selector).addClass("disabled");
								dir == "forward" ? obj.find(reverse_selector).css({"padding-right" : "0", "background" : "none"}) : obj.find(reverse_selector).css({"padding-left" : "0", "background" : "none"});
							}
						});
					} else {
						obj.find(dir_selector).find(settings.link_selector).addClass("disabled");
						dir == "forward" ? obj.find(reverse_selector).css({"padding-right" : "0", "background" : "none"}) : obj.find(reverse_selector).css({"padding-left" : "0", "background" : "none"});
					}
				}
			}
			// events
			$(this).find(settings.prev_selector + " " + settings.link_selector).mousedown(function() {
				slide(self, "backward", "mouse");
			});
			$(this).find(settings.next_selector + " " + settings.link_selector).mousedown(function() {
				slide(self, "forward", "mouse");
			});
			$(this).find(settings.prev_selector + " " + settings.link_selector + ", " + settings.next_selector + " " + settings.link_selector).mouseup(function() {
				$(this).removeData("mousedown");
			});
			$(this).find(settings.prev_selector + " " + settings.link_selector).keydown(function(e) {
				if (e.which == 13) { // Enter
					slide(self, "backward", "keyboard");
				}
			});
			$(this).find(settings.next_selector + " " + settings.link_selector).keydown(function(e) {
				if (e.which == 13) { // Enter
					slide(self, "forward", "keyboard");
				}
			});
			$(this).find(settings.prev_selector + " " + settings.link_selector + ", " + settings.next_selector + " " + settings.link_selector).keyup(function(e) {
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
					}, settings.resize_timeout);
				}
			});
			setup($(this)); // init
		});
	}
});

/* Autocomplete */
jQuery.fn.extend({
	autocomplete : function(options) {
		// Variables
		var defaults = {
			selector : ".autocomplete",             // String    Selector of the element containing the <ul> feeded by the autocomplete. Default : ".autocomplete"
			start_chars_num : 3,                    // Integer   The number of characters from which the autocomplete begins. Default : 3
			max_displayed_items : 6,                // Integer   The number of displayed items in the autocomplete suggestions box. Default : 6
			white_spaces_replacement : " ",         // String    Whites spaces are replaced by that string. Default : " "
			accepted_chars_list : /[^\w\d\s\+\-\:\%\&\€\?\!\'\’\éêèëàâäùûüîïôœ]+/i // Regexp. The valid characters pattern. Default : /[^\w\d\s\+\-\:\%\&\€\?\!\'\’\éêèëàâäùûüîïôœ]+/
		};
		var settings = $.extend({}, defaults, options);
		var i = settings.start_chars_num; // internal
		// methods
		function check_error(selector, error_margin) {
			var error_margin = error_margin || "";
			if (settings.accepted_chars_list.test($(selector).val())) {
				$(selector).css("margin-bottom", "0");
				$(selector).nextAll("small.error").first().css("margin-bottom", error_margin);
				$(selector).set_validation(false, $msg.char_illegal);
			} else if ($(selector).attr("data-invalid") == "true") {
				// DO nothing ! An error from elsewhere is triggered
			} else if ($(selector).val().length === 0) {
				$(selector).set_validation(true);
				$(selector).removeClass("valid");
			} else {
				$(selector).set_validation(true);
			}
		}
		// Loop
		$(this).each(function() {
			var self = $(this);
			var autocomplete_selector = $(this).nextAll(settings.selector).first(); // this is suggestion list container
			// events
			$(this).bind({
				focus : function() {
					$(this).css("margin-bottom", "0");
					autocomplete_selector.removeClass("hide");
					check_error(this, "0"); // check error
				},
				blur : function() {
					$(this).val($(this).val().trim()); // remove white spaces
					$(this).val($(this).val().replace(/\s+/g, settings.white_spaces_replacement)); // replace white spaces
					autocomplete_selector.addClass("hide");
					$(this).css("margin-bottom", "");
					check_error(this); // check error
				},
				keydown : function(e) {
					if (e.which == 13 || e.which == 27) { // Enter or Escape
						$(this).blur();
					}
					if (e.which == 33 || e.which == 34 || e.which == 38 || e.which == 40) { // PageUp or PageDown or or Up or Down
						e.preventDefault();
						index = 0;
						var index = autocomplete_selector.find("ul > li.selected").index();
						if (index == -1) {
							autocomplete_selector.find("ul > li").not(".hide").first().addClass("selected");
						}
						if (e.which == 33) { // PageUp
							autocomplete_selector.find("ul > li").removeClass("selected");
							autocomplete_selector.find("ul > li").not(".hide").first().addClass("selected");
						}
						if (e.which == 34) { // PageDown
							autocomplete_selector.find("ul > li").removeClass("selected");
							autocomplete_selector.find("ul > li").not(".hide").last().addClass("selected");
						}
						if (e.which == 38 && index - 1 >= 0) { // Up
							autocomplete_selector.find("ul > li:eq(" + index + ")").prevAll("li:not('.hide')").first().addClass("selected");
							if (autocomplete_selector.find("ul > li:eq(" + index + ")").prevAll("li:not('.hide')").first().hasClass("selected")) {
								autocomplete_selector.find("ul > li:eq(" + index + ")").removeClass("selected");
							}
						}
						if (e.which == 40) { // Down
							autocomplete_selector.find("ul > li:eq(" + index + ")").nextAll("li:not('.hide')").first().addClass("selected");
							if (autocomplete_selector.find("ul > li:eq(" + index + ")").nextAll("li:not('.hide')").first().hasClass("selected")) {
								autocomplete_selector.find("ul > li:eq(" + index + ")").removeClass("selected");
							}
						}
						var s = autocomplete_selector.find("ul > li.selected").text();
						$(this).val(s);
						// scroll to selected item
						if (autocomplete_selector.find("ul > li").hasClass("selected")) {
							if (autocomplete_selector.find("ul > li").not(".hide").first().hasClass("selected")) {
								scrollTo($(this), 250, $(this).outerHeight());
							} else if (autocomplete_selector.find("ul > li").not(".hide").last().hasClass("selected")) {
								scrollTo(autocomplete_selector.find("ul > li.selected"), 250, $(this).outerHeight());
							} else {
								scrollTo(autocomplete_selector.find("ul > li.selected"), 0);
							}
						}
					}
				},
				keyup : function(e) {
					check_error(this, "0"); // check error
					if ((e.which >= 48 && e.which <= 57) || (e.which >= 64 && e.which <= 90) || (e.which >= 96 && e.which <= 105) || e.which == 32 || e.which == 8 || e.which == 46) { // From 0 to 9 or from A to Z or from Numpad 0 to Numpad 9 or Space or Backspace or Del
						autocomplete_selector.find("ul > li").removeClass("selected"); // unselect all
						if (e.which == 8 || e.which == 46) { // Backspace or Del
							if (i > 0) {
								i -= 1;
							}
						}
						if ($(this).val().length >= settings.start_chars_num) {
							var k = 0;
							var m = $(this).val();
							i = $(this).val().length;
							autocomplete_selector.find("ul > li").each(function() {
								var r = $(this).text().slice(0, i);
								if (r.toLowerCase() == m.toLowerCase() && k < settings.max_displayed_items) {
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
							if (autocomplete_selector.offset().top + autocomplete_selector.height() > $(window).height() + $(document).scrollTop()) {
								scrollTo(autocomplete_selector.find("ul > li:visible").last(), 500, $(this).outerHeight());
							} else {
								scrollTo(autocomplete_selector.parent(), 500, $(this).outerHeight());
							}
						} else {
							autocomplete_selector.find("ul > li").each(function() {
								$(this).addClass("hide"); // hide all autocompletion items
							});
						}
					}
				},
			});
			autocomplete_selector.on("mouseenter", "ul > li", function() {
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
				self.val($(this).text());
				check_error(self, "0"); // check error
			});
			autocomplete_selector.on("mouseleave", "ul > li", function() {
				$(this).removeClass("selected");
			});
			$(document).ready(function() {
				autocomplete_selector.find("ul > li").each(function() {
					$(this).addClass("hide"); // hide all autocompletion items (if any)
				});
			});
		});
	}
});

/* Set Validation */
jQuery.fn.extend({
	set_validation : function(is_valid, err_msg, options) {
		// vars
		var err_msg = err_msg || undefined;
		var defaults = {
			cls_label : "error",            // String  The class of an invalid field label. Default : "error"
			cls_valid : "valid",            // String  The class of a valid field. Default : "valid"
			cls_invalid : "wrong",          // String  The class of an invalid field. Default : "wrong"
			cls_abiding : "loading",        // String  The class of an abiding validation field. Default : "loading"
			err_selector : "small.error"    // String  The selector of the element holding the error message. Default : "small.error"
		};
		var settings = $.extend({}, defaults, options);
		// loop
		$(this).each(function () {
			if (is_valid == true) {
				$(this).addClass(settings.cls_valid);
				$(this).removeAttr("data-invalid"); // Remove Foundation abide validation data attribute
				$(this).removeClass(settings.cls_invalid);
				$(this).removeClass(settings.cls_abiding);
				$("[for='" + $(this).attr("id") + "']").removeClass(settings.cls_label);
				$(this).nextAll(settings.err_selector).first().addClass("hide");
			} else if (is_valid == false) {
				$(this).removeClass(settings.cls_valid);
				$(this).attr("data-invalid", true); // Define Foundation abide validation data attribute
				$(this).addClass(settings.cls_invalid);
				$(this).removeClass(settings.cls_abiding);
				$("[for='" + $(this).attr("id") + "']").addClass(settings.cls_label);
				if (err_msg !== undefined) {
					$(this).nextAll(settings.err_selector).first().html(err_msg);
				}
				$(this).nextAll(settings.err_selector).first().removeClass("hide");
			} else {
				$(this).removeClass(settings.cls_valid);
				$(this).removeClass(settings.cls_invalid);
				$(this).addClass(settings.cls_abiding);
				setTimeout(function() {
					$(this).removeClass(settings.cls_abiding);
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
		// methods
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
			if (typeof obj.attr("disabled") === "undefined" && typeof obj.attr("readonly") === "undefined") {
				// events
				obj.bind({
					focus: function() {
						str = $(obj).val();
					},
					blur: function(event) {
						if ($(".validation-bar [data-valid]").length > 0 && $(".validation-bar [data-cancel]").is(":hover")) {
							valid(obj, true);
						} else {
							valid(obj);
						}
						obj.trigger('autosize.resize') // force autosize (i.e. wrong size on cancel bug fix)
					},
					keydown: function(event) {
						if (event.which == 27) { // Escape
							valid(obj, true);
							obj.blur();
						} else if (event.ctrlKey && event.which == 13) { // Ctrl + Enter
							valid(obj);
							obj.blur();
						} else if (event.which == 0 || event.which == 8 || event.which == 13 || event.which == 32 || event.which == 46 || event.which >= 48 && event.which <= 90 || event.which >= 96 && event.which <= 111 || event.which >= 160 && event.which <= 192) { // ² or Backspace or Enter or Space or Suppr or A-Z 0-9 or Numpad or Punctuation Mark
							if ($(".validation-bar").length === 0) {
								$(this).after(doT.compile(loadfile($loc.tmpl + "snippet_confirmation_bar.tmpl"))); // insert confirmation_bar template
								$(".validation-bar").svg_icons(); // reflow all icons of validation bar
								$conf.js_fx ? $(".validation-bar").fadeIn("slow") : $(".validation-bar").show();
							}
						}
					}
				});
			}
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
var alert_box_template = doT.compile(loadfile($loc.tmpl + "snippet_alert_box.tmpl"));
jQuery.fn.extend({
	create_alert_box : function(msg, id, opts) {
		var msg = msg || $msg.error, id = id || "alert_box";
		var defs = {
			"class"           : "error",              // String   CSS Class name of the alert box (null to none). Default : "error"
			"icon"            : "warning",            // String   CSS Class name of the message icon (null to none). Default : "warning"
			"timeout"         : 0,                    // Integer  Time before alert box fade out (zero to never). Default : 0
			"scroll"          : true,                 // Boolean  Scroll to alert box after insertion. Default : true
			"scroll_duration" : 500,                  // Integer  Duration of the scrolling effect. Default : 500
			"fade_duration"   : 500                   // Integer  Duration of the fading effeet. Default : 500
		};
		var cfg = $.extend({}, defs, opts);
		var sel = "#" + id; // internal
		if ($(sel).length == 0) {
			$(this).first().after(alert_box_template({"id" : id, "class" : cfg["class"], "icon" : cfg.icon, "text" : msg}));
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
		}
		if (cfg.scroll == true) { scrollTo($(sel), cfg.scroll_duration, $(sel).innerHeight()) } // scroll to alert box
	}
});

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
		update: function() {
			$(document).svg_icons(); // WARNING : set svg icons for whole document
			$(document).user_pictures(); // WARNING : set user pictures for whole document
		},
		init: function() {
			this.update();
			$(document).placeholder(); // set placeholder for whole document
			$(document).zlider();
		}
	};
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
	month = $const.months[date.getMonth()];
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
	if (hasStorage && window.localStorage.getItem($auth.token) !== undefined) {
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
		dataType : "text"
	});
}

/* Check if user is authenticated toward server */
function checkAuthc(done, fail, always) {
	checkAJAX(done, fail, always, "/rest/authc/connected")
}

/* Check if user is an admin toward server */
function checkAdmin(done, fail, always) {
	checkAJAX(done, fail, always, "/rest/authz/isadmin")
}

/* Check if user is a writer authenticated toward server */
function checkRedac(done, fail, always) {
	checkAJAX(done, fail, always, "/rest/authz/isredac")
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
				createAlertBox(str, "alert_auth");
			}
		},
		error : function(jqXHR, status, errorThrown) {
		},
		dataType : "json"
	});
}

/* Set user connected
 * A dirty mess lies below ...
 * Now that user connected auth check has been deferred to ready state,
 * it's useless to handle cases of plugins initialization.
 * TODO : remove is_plugin_initialized? conditions
 */

function set_user_connected(is_connected) {
	var is_connected = is_connected || false, sel = "#user_connect";
	if (is_connected) {
		/*
		if ($(sel).hasClass("icon-connect")) { // svg_icons not loaded
			$(sel).removeClass("icon-connect");
			$(sel).addClass("icon-menu");
		} else { // svg_icons loaded
			$(sel + " svg use").attr("xlink:href", "#icon-menu");
		}
		*/
		$(sel + " svg use").attr("xlink:href", "#icon-menu");
		$(sel).reload_tooltip("Menu"); // reset Foundation tooltip
		/*
		if ($(sel).attr("title") == "") { // Foundation tooltip plugin is initialized
			$(sel).reload_tooltip("Menu"); // reset Foundation tooltip
		} else { // Foundation tooltip plugin isn't initialized
			$(sel).attr("title", "Menu"); // change title attribute before Foundation tooltip plugin initialize
		}
		*/
		$(sel).data("connected", true); // register connected state in local data var
		$(".user-connect").append(doT.compile(loadfile($loc.tmpl + "user-nav.tmpl"))); // process user menu template
		$("#user_menu").user_pictures(); // reload user pictures of user menu
	} else {
		$("#user_menu").detach(); // remove user menu from DOM (n.b. keep data and events)
		/*
		if ($(sel).hasClass("icon-menu")) { // svg_icons not loaded
			$(sel).removeClass("icon-menu");
			$(sel).addClass("icon-connect");
		} else { // svg_icons loaded
			$(sel + " svg use").attr("xlink:href", "#icon-connect");
		}
		*/
		$(sel + " svg use").attr("xlink:href", "#icon-connect");
		$(sel).reload_tooltip("S&rsquo;identifier"); // reset Foundation tooltip
		/*
		if ($(sel).attr("title") == "") { // Foundation tooltip plugin is initialized
			$(sel).reload_tooltip("S&rsquo;identifier"); // reset Foundation tooltip
		} else { // Foundation tooltip plugin isn't initialized
			$(sel).attr("title", "S&rsquo;identifier"); // change title attribute before Foundation tooltip plugin initialize
		}
		*/
		$(sel).data("connected", false); // register connected state in local data var
	}
}

// function set_user_connected(is_connected) {
	// var is_connected = is_connected || false, sel = "#user_connect";
	// if (is_connected) {
		// if ($(sel).hasClass("icon-connect")) { // svg_icons not loaded
			// $(sel).removeClass("icon-connect");
			// $(sel).addClass("icon-menu");
		// } else { // svg_icons loaded
			// $(sel + " svg use").attr("xlink:href", "#icon-menu");
		// }
		// if ($(sel).attr("title") == "") { // Foundation tooltip plugin is initialized
			// $(sel).reload_tooltip("Menu"); // reset Foundation tooltip
		// } else { // Foundation tooltip plugin isn't initialized
			// $(sel).attr("title", "Menu"); // change title attribute before Foundation tooltip plugin initialize
		// }
		// $(sel).data("connected", true); // register connected state in local data var
		// $(".user-connect").append(doT.compile(loadfile($loc.tmpl + "user-nav.tmpl"))); // process user menu template
		// $("#user_menu").user_pictures(); // reload user pictures of user menu
	// } else {
		// $("#user_menu").detach(); // remove user menu from DOM (n.b. keep data and events)
		// if ($(sel).hasClass("icon-menu")) { // svg_icons not loaded
			// $(sel).removeClass("icon-menu");
			// $(sel).addClass("icon-connect");
		// } else { // svg_icons loaded
			// $(sel + " svg use").attr("xlink:href", "#icon-connect");
		// }
		// if ($(sel).attr("title") == "") { // Foundation tooltip plugin is initialized
			// $(sel).reload_tooltip("S&rsquo;identifier"); // reset Foundation tooltip
		// } else { // Foundation tooltip plugin isn't initialized
			// $(sel).attr("title", "S&rsquo;identifier"); // change title attribute before Foundation tooltip plugin initialize
		// }
		// $(sel).data("connected", false); // register connected state in local data var
	// }
// }

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
/* # Build processing */
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

// Process build
if ($conf.css_debug) {
	$("body").addClass("css-debug");
}
if ($conf.css_fx) {
	$("body").addClass("css-fx");
}
if ($build.container) {
	// Apply standard layout (i.e. two columns view) class to body
	$("body").addClass("standard-layout");
	// Create HTML skeleton
	$("body").prepend("<div id='main' class='frame'>");
	$("#main").append("<main class='main-pane'>");
	// Process toolbar template
	if (typeof $build.toolbar !== undefined && $build.toolbar == true) {
		$("body").prepend(doT.compile(loadfile($loc.tmpl + "_dev_toolbar.tmpl")));
	}
	// Process sidebar template
	$("#main").prepend(doT.compile(loadfile($loc.tmpl + "sidebar.tmpl")));
	// Process header template
	$(".main-pane").prepend(doT.compile(loadfile($loc.tmpl + "header.tmpl")));

	// Process footer template
	$(".main-pane").append(doT.compile(loadfile($loc.tmpl + "footer.tmpl")));

	/* UNUSED*/
	/*
	// Process slider template -- this is the tricky part
	if ($build.slider) {
		var news_list_tmpl = doT.compile(loadfile($loc.tmpl + "news_list.tmpl"));
		$(document).ready(function() {
			$(".main-pane > header").append(news_list_tmpl());
			$(".news-list").foundation("orbit"); // reload Foundation Orbit Slider plugin ; Foundation need to be loaded one time before that for the list to appear inline
			$(window).resize(); // just a dummy instruction for getting the proper height
		});
	}
	*/
}

if ($build.icons) {
	// Process SVG Icons
		if ($conf.svg_fx) {
			$("body").prepend("<style type='text/css'>" + loadfile($file.icons_fx) + "</style>"); // append SVG effects
		}
		$("body").prepend(loadfile($file.icons)); // append SVG icons
}

/* ------------------------------------------------------------------ */
/* # Active Section Toggler */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$(document).ready(function() {
	var url = window.location.pathname;
	var q = /[a-zA-Z-_]*\.(?:html|htm)/;
	var page = url.match(q);
	var selector = location.hash // assumed it's section id
	if ($(selector).hasClass("hide")) { // Show active section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
	}
});
*/

/* UNUSED */
/*
// Handle inner anchor click event ; need to check history.back() for inner anchors
$("html").on("click", "[href*='#']", function() {
	var arr = $(this).attr("href").split("#");
	var selector = "#" + arr[1];
	if ($(selector).hasClass("hide")) { // Show active section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
}
});
*/

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
				$("#main").css("margin-top", "45px");
			} else {
				$("#main").css("margin-top", "0");
			}
		}
		$("#toolbar").toggleClass("hide");
		toolbar_show.index = 0;
	} else {
		toolbar_show.index = 0;
	}
});

/* Toolbar Effects Toggler */
$("#_css_fx_toggle, #_svg_fx_toggle, #_js_fx_toggle").click(function() {
	$(this).toggleClass("active");
	var str = $(this).attr("id").replace("_toggle", "").cut(1);
	var val = $(this).hasClass("active") ? true : false;
	set_pref($prefs.app_conf, str, val); // set user pref
	$conf[str] = val; // overwrite global conf
});
$("#_css_fx_toggle").click(function() {
	$("body").toggleClass("css-fx");
});
$("#_svg_fx_toggle").click(function() {
	createAlertBox("Configuration de l&rsquo;affichage modifi&eacute;e. Rechargement de la page n&eacute;cessaire.", "alert_conf", {"class" : "warning"});
});

/* Toolbar Null Links Toggler */
$("#_null_links_toggle").click(function() {
	if (!$(this).hasClass("active")) {
		// Navs
		$("nav ul li .disabled").addClass("not-disabled");
		$("nav ul li[class^='icon-'] .disabled").parent("li").addClass("enabled"); // Navs Icons
		$("nav ul li .disabled").removeClass("disabled");
		/* UNUSED */
		/*
		// Accessibility Icons
		$(".accessibility ul li .disabled").addClass("enabled");
		$(".accessibility ul li .disabled").addClass("not-disabled");
		$(".accessibility ul li .disabled").removeClass("disabled");
		*/
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
		/* UNUSED */
		/*
		// Accessibility Icons
		$(".accessibility ul li .not-disabled").addClass("disabled");
		$(".accessibility ul li .not-disabled").removeClass("enabled");
		$(".accessibility ul li .not-disabled").removeClass("not-disabled");
		*/
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
$("[id^='_css_debug_']").click(function() {
	if (!$(this).hasClass("disabled")) {
		$(this).toggleClass("active");
		$("." + $(this).attr("id").cut(11)).toggleClass("css-debug");
	}
});

/* Toolbar Stick Toggler */
$("#_toolbar_stick_toggle").click(function() {
	$(this).toggleClass("active");
	$("#toolbar").toggleClass("fixed");
	if ($("#main").css("margin-top") != "45px") {
		$("#main").css("margin-top", "45px");
	} else {
		$("#main").css("margin-top", 0);
	}
});

/* Close Toolbar Toggler */
$("#toolbar .close").click(function() {
	if ($("#main").css("margin-top") != 0) {
		$("#main").css("margin-top", 0);
	}
	$("#toolbar").addClass("hide");
});

/* Toolbar Initialization */
$(document).ready(function() {
	if (get_pref($prefs.app_conf, "css_fx") == true) {
		$("#_css_fx_toggle").addClass("active");
	}
	if (get_pref($prefs.app_conf, "svg_fx") == true) {
		$("#_svg_fx_toggle").addClass("active");
	}
	if (get_pref($prefs.app_conf, "js_fx") == true) {
		$("#_js_fx_toggle").addClass("active");
	}
});

/* ------------------------------------------------------------------ */
/* # Main Navigation */
/* ------------------------------------------------------------------ */

/* UNUSED */
/* Main Navigation Sub List Visibility Toggler */
/*
$(".main-nav [data-roll='sub-list']").mouseenter(function() {
	var handler = $(this);
	handler.data("hover", true);
	main_nav_sub_list_open_timeout = setTimeout(function() {
		if (handler.data("hover") == true) {
			$(".main-nav .sub-list ul").slideDown("fast");
		}
	}, 400);
});
$(".main-nav .sub-list ul").mouseenter(function() {
	$(this).data("hover", true);
});
$(".main-nav").mouseenter(function() {
	clearTimeout(main_nav_sub_list_close_timeout);
});
$(".main-nav").mouseleave(function() {
	main_nav_sub_list_close_timeout = setTimeout(function() {
		if ($(".main-nav .sub-list ul").data("hover") != true) {
			$(".main-nav .sub-list ul").slideUp("fast");
		}
	}, 400);
});
$(".main-nav [data-roll='sub-list']").mouseleave(function() {
	$(".main-nav .sub-list ul").data("hover", false);
	clearTimeout(main_nav_sub_list_open_timeout);
});
$(".main-nav .sub-list ul").mouseleave(function() {
	$(this).data("hover", false);
});
*/

/* ------------------------------------------------------------------ */
/* # Breadcrumbs */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
function refresh_breadcrumbs(selector) {
	// Selector comes from breadcrumbs
	if (selector.parents("ul").hasClass("breadcrumbs")) {
		var index = ($(".breadcrumbs li").index(selector.parent("li")));
		$(".breadcrumbs li:gt(" + (index) + ")").remove();
		selector.parent("li").addClass("current");
	}
	// Selector comes from a nav
	else if (selector.parent("li").parent("ul").parent().is("nav")) {
		switch(selector.parent("li").parent("ul").parent("nav").attr("class")) {
			case "toolbar-nav":
				var str = "Dev Tools";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
			case "user-nav":
				var str = "Nadejda"; // TEMP : need to retrieve username somehow
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
			case "main-nav":
				$(".breadcrumbs").empty(); // Erase level 1 and above
				// If is sub-list
					// Erase level 2 and above
				break;
			case "fast-nav":
				// Erase level 2 and above
				break;
			case "site-nav":
				var str = "Les Ourses &agrave; plumes";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
		}
		var str = selector.text();
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
	// Selector comes from an articles-list
	else if (selector.parent("div").parent("li").parent("ul").hasClass("articles-list")) {
		switch(selector.parent("div").parent("li").parent("ul").parent("section").attr("id")) {
			case "latest":
				var str = "&Agrave; la une";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
			case "articles":
				var str = "Articles";
				$(".breadcrumbs").empty(); // Erase level 1 and above
				$(".breadcrumbs").append("<li class='unavailable'>" + str + "</li>"); // Append false level 1
				break;
		}
		var str = $("#" + selector.attr("data-show") + " h2 > span").text().slice(0, -1); // TEMP
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
	// Selector comes from user-list
	else if (selector.parents("section").attr("id") == "user-list") {
		$(".breadcrumbs li:last-child").removeClass("current");
		var str = $("#" + selector.attr("data-show") + " h2").text(); // TEMP
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
	// Selector comes from an article
	else if (selector.parents("article").hasClass("article")) {
		$(".breadcrumbs li:last-child").removeClass("current");
		var str = $("#" + selector.attr("data-show") + " h2").text(); // TEMP
		if (selector.attr("href") != "null") {
			var href = selector.attr("href");
		}
		if (selector.attr("data-show") != "null") {
			var attr = " data-show='" + selector.attr("data-show") + "'";
		}
		$(".breadcrumbs").append("<li class='current'><a href='" + href + "'" + attr + ">" + str + "</a></li>");
	}
}
*/

/* ------------------------------------------------------------------ */
/* # Accessibility */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$(".accessibility .icon-textinc").click(function() {
	if ($(".accessibility .icon-textdec").hasClass("active")) {
		$(".accessibility .icon-textdec").removeClass("active");
		$("section").removeClass("text-small");
	}
	$(this).toggleClass("active");
	$(this).blur();
	$("section").toggleClass("text-large");
});
$(".accessibility .icon-textdec").click(function() {
	if ($(".accessibility .icon-textinc").hasClass("active")) {
		$(".accessibility .icon-textinc").removeClass("active");
		$("section").removeClass("text-large");
	}
	$(this).toggleClass("active");
	$(this).blur();
	$("section").toggleClass("text-small");
});
*/

/* ------------------------------------------------------------------ */
/* # Accordions */
/* ------------------------------------------------------------------ */

/* UNUSED for now ... maybe later ? */
/* Accordion Active Switcher */
/*
$(".accordion dd > a").click(function() {
	$(this).parent("dd").siblings().children().removeClass("active");
	$(this).toggleClass("active");
});
*/

/* ------------------------------------------------------------------ */
/* # Sub Navigation */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	/* Sub Navigation Switcher */
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
})

/* ------------------------------------------------------------------ */
/* # Pagination */
/* ------------------------------------------------------------------ */

/* UNUSED for now ... maybe later ? */
/* Pagination Switcher */
/*
$(".pagination li a").click(function() {
	if (!$(this).parent("li").hasClass("unavailable")) {
		if (!$(this).hasClass("disabled")) {
			$(this).parent("li").siblings().removeClass("current");
			$(this).parent("li").toggleClass("current");
		}
	}
});
*/

/* ------------------------------------------------------------------ */
/* # Site Navigation */
/* ------------------------------------------------------------------ */

// Disabled Flag for Pseudo-element :before
/* UNUSED -- Get Fucky feat. Farrel Williams */
/*
$(document).ready(function() {
	$(".site-nav ul li .disabled").parent("li:before").css("opacity", .5);
});
*/

/* ------------------------------------------------------------------ */
/* # Links Focus Fix (for Chrome) */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$("html").on("click", "a", function() {
	if (!$(this).is(":focus")) {
		// $(this).focus(); // BUG : conflict with CKEditor combo boxes
	}
});
*/

/* ------------------------------------------------------------------ */
/* # Links Display Switchers */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$("[data-show]").click(function() {
	var selector = "#" + $(this).attr("data-show")
	if ($(selector).hasClass("hide")) {
		// Display section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
		// Refresh Breadcrumbs
		refresh_breadcrumbs($(this));
	}
});

// Attach event for now and the future to 'html'
$("html").on("click", "[data-show]", function() {
	var selector = "#" + $(this).attr("data-show")
	if ($(selector).hasClass("hide")) {
		// Display section
		$(".main-pane > section").addClass("hide");
		$(selector).removeClass("hide");
		// Refresh Breadcrumbs
		refresh_breadcrumbs($(this));
	}
});
*/

/* ------------------------------------------------------------------ */
/* # Links Current Switchers */
/* ------------------------------------------------------------------ */

/* UNUSED */
/*
$("[class*='-nav'] ul li a").click(function() { // WARNING : [class$='-nav'] is false if any class is put after (e.g. 'hide')
	var selector = $(this);
	if (!selector.hasClass("no-current")) {
		if (!selector.hasClass("disabled")) {
			$("[class*='-nav'] ul li a").removeClass("current") // WARNING : [class$='-nav'] is false if any class is put after (e.g. 'hide')
		}
		selector.not(".disabled").addClass("current");
	}
});
*/

/* Attach event for now and the future to 'html' */
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
/* # Alert Boxes */
/* ------------------------------------------------------------------ */

/* Close alert boxes */
$("html").on("click", ".alert-box .close", function() {
	var self = $(this).parent(".alert-box");
	$(self).children().css("visibility", "hidden"); // mask box content
	$(self).animate({"height":"0", "margin" : "0", "padding" : "0", "opacity":"0"}, $conf.js_fx ? 500 : 0, function() { // hide alert box
		self.remove();
	});
});

/* ------------------------------------------------------------------ */
/* # User Connect Events */
/* ------------------------------------------------------------------ */

/* Connection or User menu link */
$("html").on("click", "#user_connect", function() {
	var done = (function() {
		if ($("#user_connect").data("connected") == true) {
			$("#user_menu").toggle(); // show menu
		} else {
			set_user_connected(true); // connect user
			createAlertBox($msg.connected, "alert_auth", {"class" : "success"})
		}
	});
	var fail = (function() {
		if ($("#user_connect").data("connected") == true) {
			set_user_connected(false); // set not connected
			disconnect($msg.disconnected); // disconnect
		} else {
			window.location.href = $nav.login.url; // redirect to the login page
		}
	});
	checkAuthc(done, fail);
});

/* Disconnection link */
$("html").on("click", ".disconnect", function() {
	set_user_connected(false);
	disconnect($msg.user_disconnected);
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

/* Launch modules on document ready */
$(document).ready(function() {
	var f = Foundation.libs;
	$.extend(f.tooltip.settings, f_tooltip_cfg, f.tooltip.settings); // Apply Foundation custom settings -- NOTE : override fucking Foundation fucking libs
	$("textarea").autosize(autosize_cfg); // Initialize Autosize jQuery plugin -- WARNING : compatibility need to be checked on IE10
	loap.init(); // Initialize owner module
});

/* Set user connected through AJAX on document ready */
$(document).ready(function() {
	var done = (function() { set_user_connected(true) });
	var fail = (function() { set_user_connected(false) });
	var always = (function() { $(".user-connect").fadeIn($conf.js_fx ? 500 : 0) });
	checkAuthc(done, fail, always);
});

/* Reload Autosize jQuery plugin on window resize */
$(window).on("resize", function() {
	$("textarea").autosize(autosize_cfg);
});
