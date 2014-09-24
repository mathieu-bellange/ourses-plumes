/**
 * Les Ourses à plumes
 * Javascript Main File
 * Require jQuery Library
 * ver. 0.0.7
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

/* Scroll to (object) */
function scrollTo(object, duration, spacing) {
	var duration = $js_fx ? (typeof duration !== "undefined" ? duration : 0) : 0;
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
	if ($js_fx) {
		$(selector)
			.animate({"opacity" : ".25"}, 125)
			.animate({"opacity" : "1"}, 250);
	}
}

/* Cursor Position */
jQuery.fn.extend({
	cursor_position : function(start, end) {
		end = end || false;
		obj = this.first().get(0);
		obj.focus();
		obj.setSelectionRange(start, end || start);
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
			"attr" : "data-placeholder",            // String    Attribute name of the placeholder element. Default : "data-placeholder"
			"class" : "placeholder",                // String    Class name of the placeholder element. Default : "placeholder"
		};
		var settings = $.extend({}, defaults, options);
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
				removePlaceholder($(this)); // erase placeholder
			});
			$(this).on("keypress", "[" + settings.attr + "]", function() {
				removePlaceholder($(this)); // erase placeholder
			});
			$(this).on("blur", "[" + settings.attr + "]", function() {
				if ($(this).text().trim().length === 0) {
					$(this).html("<p class='" + settings.class + "'>" + $(this).data("placeholder_value") + "</p>"); // append placeholder
					$(this).removeData("placeholder_value");
				}
			});
			// init
			$(document).ready(function() {
				$("[" + settings.attr + "]").each(function() {
					if ($(this).attr(settings.attr) !== "") {
						$(this).html("<p class='" + settings.class + "'>" + $(this).attr(settings.attr) + "</p>");
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
					$js_fx ? $(this).find(settings.options).slideUp(settings.slide_duration) : $(this).find(settings.options).hide();
				},
				keydown: function(event) {
					// var str = $(this).find(settings.options + " > li.selected").text();
					if (event.which == 27) { // Escape
						$(this).blur();
					}
					if (event.which == 13 || event.which == 32) { // Enter or Space
						if ($js_fx) {
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
				if ($js_fx) {
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
					$js_fx ? $(this).parent(settings.options).slideToggle(settings.slide_duration) : $(this).parent(settings.options).toggle();
				}
			});
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
				$(selector).set_validation(false, $app_msg.char_illegal);
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
					if (e.which == 33 || e.which == 34 || e.which == 38 || e.which == 40) { // PageUp, PageDown, End, Home or Up or Down
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
			$(".validation-bar").fadeOut("fast");
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
								$(this).after(doT.compile(loadfile($app_root + "tmpl/confirmation_bar.tmpl"))); // insert confirmation_bar template
								$(".validation-bar").svg_icons(); // reflow all icons of validation bar
								$(".validation-bar").fadeIn("slow");
							}
						}
					}
				});
			}
		});
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
			$(document).placeholder(); // set placeholder for whole document
			this.update();
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

/* Create Alert Box */
var alert_box_template = doT.compile(loadfile($app_root + "tmpl/alert_box.tmpl"));
function createAlertBox(msg, cls, id, scroll) {
	var msg = msg || $app_msg.error, cls = cls || "error", id = id || "alert_box", scroll = scroll || true;
	if ($("#" + id).length === 0) {
		$("main > header").after(alert_box_template({"id" : id, "class" : cls, "text" : msg}));
		$("#" + id).svg_icons(); // set svg icons contained by alert box
		$("#" + id).fadeIn(300); // show alert box
		$("#" + id).parent().foundation("alert"); // reload Foundation alert plugin for alert box closest parent (i.e. alert-box cannot be closed bug fix)
		if (scroll == true) {
			scrollTo($("#" + id), 500, $("#" + id).innerHeight()); // scroll to alert box
		}
	}
}

/* Reload Tooltip */
function reload_tooltip(obj) {
	var tooltip_id = obj.attr("data-selector");
	var tooltip_value = obj.attr("title");
	$("[data-selector='" + tooltip_id + "']").last().html(tooltip_value + "<span class='nub'></span>");
}

/* Convert long date format to short numeric */
function getDateTime(date) { // passe une date en param pour obtenir une string au bon format pour la balise time
	var year = date.getFullYear().toString();
	var month;
	var day;
	var numMonth = date.getMonth() + 1;
	if (numMonth < 10){
		month = "0" + numMonth.toString();
	}else{
		month = numMonth.toString();
	}
	if (date.getDate() <10){
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
	month = $months[date.getMonth()];
	return day + " " + month + " " + year;
}

/* Convert long date format to HTML */
function dateToHTML(date) {
	return (dateToString(date).replace("1er", "1<sup>er</sup>").replace("é", "&eacute;").replace("û", "&ucirc;"));
}

/* Update user menu user name */
function update_user_pseudo(pseudo){
	window.localStorage.setItem($oursesUserPseudo,pseudo);
	$(".user-name").html(pseudo);
}

/* Update user menu user picture */
function update_user_avatar(pathAvatar){
	window.localStorage.setItem($oursesAvatarPath,pathAvatar);
	$("#user-avatar").attr("data-image",pathAvatar);
	loap.update();
}

/* Check authentication before sending AJAX requests */
function header_authentication(xhr){
	if (window.localStorage.getItem($oursesAuthcToken) !== undefined){
		xhr.setRequestHeader("Authorization", window.localStorage.getItem($oursesAuthcToken)); // set authc token
	}
}

/* Redirect on HTTP response status unauthorized after AJAX request */
function ajax_error(jqXHR, textStatus, errorThrown){
	if (jqXHR.status == 401){
		window.location.href = $login_page;
	}
}

/* Check if user is authenticated */
var onAuthc = $.ajax({
	url : "/rest/authc/connected",
	processData : false,
	beforeSend : function(jqXHR) {
		header_authentication(jqXHR);
	},
	dataType : "text"
});

/* Check if user is an admin according to localStorage -- alias method */
function isAdmin() {
	if (window.localStorage.getItem($oursesUserRole) == $role_admin) {
		return true;
	}
}
/* Check if user is a writer according to localStorage -- alias method */
function isRedac() {
	if (window.localStorage.getItem($oursesUserRole) == $role_redac) {
		return true;
	}
}

/* Set user connect */
function set_user_connect(user_logged_in) {
	var user_logged_in = user_logged_in || false;
	if (user_logged_in == true) {
		$("#user_connect").attr("href", "javascript:void(0)"); // supprime le lien vers la page de connexion pour ajouter le menu utilisateur
		$("#user_connect").attr("data-dropdown", "user_menu");
		//$("#user_connect").attr("data-options", "is_hover:true"); // TEMP : disable user menu hover ; uncomment to re-enable
		$("#user_connect").parent("span").attr("title", "Menu"); // TEMP : set tooltip title on hover
		//$("#user_connect").parent("span").removeAttr("data-tooltip"); // TEMP : prevent tooltip disabling if hover
		if ($("#user_connect").hasClass("icon-connect")) {
			$("#user_connect").removeClass("icon-connect");
			$("#user_connect").addClass("icon-menu");
		} else {
			$("#user_connect svg use").attr("xlink:href", "#icon-menu");
		}
		$("#user_connect").data("enable", "true");
		$(".fast-nav").after(doT.compile(loadfile($app_root + "tmpl/user_nav.tmpl"))); // Process user menu template
	} else {
		//$("#user_menu").detach(); // remove user menu from DOM (n.b. keep data and events)
		$("#user_connect").attr("href", $login_page); // ajoute le lien vers la page de connexion
		$("#user_connect").parent("span").attr("title", "S&rsquo;identifier");
		//$("#user_connect").parent("span").attr("data-tooltip");
		$("#user_connect").removeAttr("data-dropdown");
		//$("#user_connect").removeAttr("data-options"); // TEMP : disable user menu hover ; uncomment to re-enable
		if ($("#user_connect").hasClass("icon-menu")) {
			$("#user_connect").removeClass("icon-menu");
			$("#user_connect").addClass("icon-connect");
		} else {
			$("#user_connect svg use").attr("xlink:href", "#icon-connect");
		}
		$("#user_connect").data("enable", "false");
	}
}

/* Check user connect */
function check_user_connect() {
	if ((window.location.href.indexOf($login_page) == -1) && (window.localStorage.getItem($oursesUserPseudo) !== undefined && window.localStorage.getItem($oursesUserPseudo) !== null)) { // if current page != connexion
		isAuthenticated(); // check if auth token hasn't expired
	}
	if ((window.location.href.indexOf($login_page) == -1) && ($("#user_connect").data("enable") == "false") && (window.localStorage.getItem($oursesUserPseudo) !== undefined && window.localStorage.getItem($oursesUserPseudo) !== null)) {
		set_user_connect(true); // enable user connection
		$("#user_menu").user_pictures(); // reload user pictures of user menu
		$(document).foundation("dropdown"); // reload Foundation Dropdown plugin for whole document (n.b. includes #user_connect and #user_menu)
		reload_tooltip($("#user_connect").parent("span")); // reflow Foundation tooltip
	}
	if (($("#user_connect").data("enable") == "true") && (window.localStorage.getItem($oursesUserPseudo) === undefined || window.localStorage.getItem($oursesUserPseudo) === null)) {
		$("#user_menu").detach(); // remove user menu from DOM (n.b. keep data and events)
		set_user_connect(false); // disable user connection
		reload_tooltip($("#user_connect").parent("span")); // reflow Foundation tooltip
	}
}

/* ------------------------------------------------------------------ */
/* # Build processing */
/* ------------------------------------------------------------------ */
/*
 * NOTE
 * Choice has been made to keep the two first <div> after <body> in
 * HTML files in order to handle none or multiple <section> cases and
 * prevent indent issues. The script seems to work properly that way.
 */

// Process build
if (typeof $css_fx !== "undefined" && $css_fx == true) {
	$("body").addClass("css-fx");
}

if (typeof $build_container !== "undefined" && $build_container == true) {
	// Apply standard layout (i.e. two columns view) class to body
	$("body").addClass("standard-layout");
	// Create HTML skeleton
	$("body").prepend("<div id='main' class='frame'>");
	$("#main").append("<main class='main-pane'>");
	// Process toolbar template
	if ($dev_toolbar == true) {
		$("body").prepend(doT.compile(loadfile($app_root + "tmpl/toolbar.tmpl")));
	}
	// Process sidebar template
	$("#main").prepend(doT.compile(loadfile($app_root + "tmpl/sidebar.tmpl")));
	// Process header template
	$(".main-pane").prepend(doT.compile(loadfile($app_root + "tmpl/header.tmpl")));

	// Set user connection depending on browser local storage domain log
	if (window.location.href.indexOf($login_page) > -1) {
		set_user_connect(false);
	} else {
		if (window.localStorage.getItem($oursesUserPseudo) !== undefined && window.localStorage.getItem($oursesUserPseudo) !== null) {
			set_user_connect(true);
		} else {
			set_user_connect(false);
		}
	}

	// Bind user connect event
	$("#user_connect").mouseenter(function() {
		check_user_connect()
	});

	// Process footer template
	$(".main-pane").append(doT.compile(loadfile($app_root + "tmpl/footer.tmpl")));
	// Process slider template -- this is the tricky part
	var news_list_tmpl = doT.compile(loadfile($app_root + "tmpl/news_list.tmpl"));
	$(document).ready(function() {
		$(".main-pane > header").append(news_list_tmpl());
		$(".news-list").foundation("orbit"); // reload Foundation Orbit Slider plugin ; Foundation need to be loaded one time before that for the list to appear inline
		$(window).resize(); // just a dummy instruction for getting the proper height
	});
}

if (typeof $build_icons !== "undefined" && $build_icons == true) {
	// Process SVG Icons
		$("body").prepend("<style type='text/css'>" + loadfile($svg_icons_fx_file) + "</style>"); // append SVG effects
		$("body").prepend(loadfile($svg_icons_file)); // append SVG icons
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

/* Toolbar CSS Toggle Checker */
$(document).ready(function() {
	if (typeof $css_fx !== "undefined" && $css_fx == false) {
		$("#_css_fx_toggle").addClass("active");
	}
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

/* Toolbar CSS Effects Toggler */
$("#_css_fx_toggle").click(function() {
	$(this).toggleClass("active");
	$("body").toggleClass("css-fx");
});

/* Toolbar CSS Debug Toggler */
$("#_css_debug_icons_toggle").click(function() {
	$(this).toggleClass("active");
	$("[class*='icon-']").toggleClass("css-debug");
});
$("#_css_debug_nav_pane_toggle").click(function() {
	$(this).toggleClass("active");
	$(".nav-pane").toggleClass("css-debug");
});
$("#_css_debug_fast_nav_toggle").click(function() {
	$(this).toggleClass("active");
	$(".fast-nav").toggleClass("css-debug");
});
$("#_css_debug_site_nav_toggle").click(function() {
	$(this).toggleClass("active");
	$(".site-nav").toggleClass("css-debug");
});
$("#_css_debug_orbit_slider_toggle").click(function() {
	$(this).toggleClass("active");
	$(".orbit-container").toggleClass("css-debug");
});
$("#_css_debug_breadcrumbs_toggle").click(function() {
	$(this).toggleClass("active");
	$(".breadcrumbs").toggleClass("css-debug");
});
$("#_css_debug_accessibility_toggle").click(function() {
	$(this).toggleClass("active");
	$(".accessibility").toggleClass("css-debug");
});
$("#_css_debug_user_account_toggle").click(function() {
	$(this).toggleClass("active");
	$("#user-profile").toggleClass("css-debug");
});
$("#_css_debug_article_toggle").click(function() {
	$(this).toggleClass("active");
	$("article").toggleClass("css-debug");
});
$("#_css_debug_articles_list_toggle").click(function() {
	$(this).toggleClass("active");
	$(".articles-list").toggleClass("css-debug");
});
$("#_css_debug_comment_list_toggle").click(function() {
	$(this).toggleClass("active");
	$(".comment-list").toggleClass("css-debug");
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

/* ------------------------------------------------------------------ */
/* # Connect */
/* ------------------------------------------------------------------ */

/* Connect click Event */
$("html").on("click", ".disconnect", function() {
	$.ajax({
		type : "POST",
		url : "/rest/authc/logout",
		contentType : "application/json; charset=utf-8",
		data : window.localStorage.getItem($oursesAuthcToken),
		success : function(data, status, jqxhr) {
			window.localStorage.removeItem($oursesAuthcToken);
			window.localStorage.removeItem($oursesUserPseudo);
			window.localStorage.removeItem($oursesUserRole);
			window.localStorage.removeItem($oursesAccountId);
			window.localStorage.removeItem($oursesProfileId);
			window.localStorage.removeItem($oursesAvatarPath);
			window.location.href = $home_page;
		},
		error : function(jqXHR, status, errorThrown) {
		},
		dataType : "json"
	});
});

/* ------------------------------------------------------------------ */
/* # Main Navigation */
/* ------------------------------------------------------------------ */

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

/* UNUSED : put to top in update
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
/* # User Pictures */
/* ------------------------------------------------------------------ */

/* UNUSED : put to top in update */
/*
$("[data-image]").each(function() {
	var file = $(this).attr("data-image");
	var dir = "img/";
	$(this).css("background-image", "url('" + dir + file + "')")
});
*/

/* ------------------------------------------------------------------ */
/* # Accordions */
/* ------------------------------------------------------------------ */

/* Accordion Active Switcher */
$(".accordion dd > a").click(function() {
	$(this).parent("dd").siblings().children().removeClass("active");
	$(this).toggleClass("active");
});

/* ------------------------------------------------------------------ */
/* # Sub Navigation */
/* ------------------------------------------------------------------ */

/* Sub Navigation Toggler / Switcher */
$("html").on("click", ".sub-nav dd a", function() {
	if (!$(this).parent("dd").hasClass("unavailable") && !$(this).hasClass("disabled")) {
		$(this).parent("dd").toggleClass("active"); // toggle
		if (!$(this).parent("dd").parent(".sub-nav").hasClass("toggle")) {
			$(this).parent("dd").siblings().removeClass("active"); // switch
		}
	}
});

/* ------------------------------------------------------------------ */
/* # Pagination */
/* ------------------------------------------------------------------ */

/* Pagination Switcher */
$(".pagination li a").click(function() {
	if (!$(this).parent("li").hasClass("unavailable")) {
		if (!$(this).hasClass("disabled")) {
			$(this).parent("li").siblings().removeClass("current");
			$(this).parent("li").toggleClass("current");
		}
	}
});

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
/* # Initialize */
/* ------------------------------------------------------------------ */

/* Autosize jQuery plugin custom settings */
var autosize_cfg = {append: ""};

/* Initialize Autosize jQuery plugin for all <textarea> HTML tags without new line appending */
$(document).ready(function() {
	$("textarea").autosize(autosize_cfg); // WARNING : compatibility need to be checked on IE10
	loap.init();
});

/* Reload Autosize jQuery plugin on window resize */
$(window).on("resize", function() {
	$("textarea").autosize(autosize_cfg);
});
