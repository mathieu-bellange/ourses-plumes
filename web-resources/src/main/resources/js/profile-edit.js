/* ------------------------------------------------------------------ */
/* # Pre Processing */
/* ------------------------------------------------------------------ */

set_page_title($nav.profile_edit.title);

/* ------------------------------------------------------------------ */
/* # Public vars */
/* ------------------------------------------------------------------ */

var username_max_chars = 24;
var role_display_screen_width = 1023; // WARNING : Should be the same as CSS file for this to work properly

/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var profile_template = doT.compile(loadfile($loc.tmpl + "profile-edit.tmpl")); // create template

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Define Icons Input Variables
var user_links_icons_input = {
	"input_container" : "#user-link",
	"icons_container" : "#user_links_icons",
	"icons_title_prefix" : "Votre "
};

// Define Pair Property-Value registering method
function Couple(property, value) {
	this.property = property;
	this.value = value;
	this.json = function() {
		return JSON.stringify(this);
	};
}

// Instance Variables
var memoryCouple = new Couple("", "");
var pseudoProperty = "pseudo";
var avatarProperty = "avatar";
var descriptionProperty = "description";
var user_links = ["mail", "link", "twitter", "facebook", "googleplus", "linkedin"];

// Instance Methods
function modifiyCouple(couple) { // Pair storing
	if (couple.property == memoryCouple.property && couple.value !== memoryCouple.value) {
		if (pseudoProperty == couple.property) {
			// vérifie qu'il a pas resaisi son pseudo après une éventuelle erreur
			if (couple.value != window.localStorage.getItem($auth.user_name)) {
				checkPseudoAJAX(couple);
			}
			// si c'est son pseudo, on se contente de virer l'erreur
			else {
				$("#pseudo").set_validation(true);
				$("#pseudo").css("margin-bottom", "");
			}
		} else {
			save(couple);
		}
	}
}

// Display user role
function processRole(role) {
	$conf.js_fx ? $("#role").html(role).fadeIn(500) : $("#role").html(role).show();
}

// Data to HTML association method for user links
function processSocialLinks(socialLinks) {
	for (var i = 0; i < socialLinks.length; i++) {
		$(".icon-" + socialLinks[i].network.toLowerCase()).attr("data-url", socialLinks[i].socialUser);
	}
}

/* ------------------------------------------------------------------ */
/* # DOM manipulation */
/* ------------------------------------------------------------------ */

function majView(couple, updateInError) {
	// en cas d'erreur, rollback les données à l'écran
	if (updateInError) {
		if (memoryCouple.property == pseudoProperty) {
			$("#pseudo").val(memoryCouple.value);
		} else if (memoryCouple.property == descriptionProperty) {
			$("#description").val(memoryCouple.value);
		}
	// sinon mise à jour des attributs pour les socials links
	} else {
		switch (couple.property) {
		case user_links[0]:
			$(".icon-mail").attr("data-url", couple.value);
			break;
		case user_links[1]:
			$(".icon-link").attr("data-url", couple.value);
			break;
		case user_links[2]:
			$(".icon-twitter").attr("data-url", couple.value);
			break;
		case user_links[3]:
			$(".icon-facebook").attr("data-url", couple.value);
			break;
		case user_links[4]:
			$(".icon-googleplus").attr("data-url", couple.value);
			break;
		case user_links[5]:
			$(".icon-linkedin").attr("data-url", couple.value);
			break;
		case pseudoProperty :
			update_user_pseudo(couple.value); // method launched from loap.js
			break;
		case avatarProperty :
			$("#avatar").attr("data-image","/rest/avatars/" + couple.value);
			loap.update();
			update_user_avatar("/rest/avatars/" + couple.value); // method launched from loap.js
			break;
		default:
			break;
		}
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function checkPseudoAJAX(couple) {
	if (typeof pseudoTimeoutValid !== "undefined") {
		clearTimeout(pseudoTimeoutValid);
	}
	var selector = $("#pseudo");
	selector.set_validation(null);
	var pseudo = selector.val();
	var profileId = window.localStorage.getItem($auth.profile_id);
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/pseudo?id=" + profileId,
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			pseudoTimeoutValid = setTimeout(function() {
				selector.set_validation(true);
				$(selector).css("margin-bottom", "");
			}, 500);
			save(couple);
		},
		error : function(jqXHR, status, errorThrown) {
			// erreur 403, normal le pseudo est soit vide soit déjà pris
			if (jqXHR.status == 403) {
				pseudoTimeoutValid = setTimeout(function() {
					selector.set_validation(false, "Le nom d&rsquo;utilisatrice doit obligatoirement &ecirc;tre renseign&eacute;");
					$(selector).css("margin-bottom", "0");
					role_display.update();
					}, 500);
			}
			// autre erreur rollback du pseudo et affichage d'un alerte générique
			else{
				createAlertBox();
				majView(couple, true);
			}
		},
		dataType : "json"
	});
}

function getRole(pseudo) {
	$.ajax({
		type : "GET",
		url : "/rest/profile/" + pseudo + "/authz",
		contentType : "application/json; charset=utf-8",
		success : function(role, status, jqxhr) {
			processRole(role);
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "text"
	});
}

function getProfile() {
	var profileId = window.localStorage.getItem($auth.profile_id);
	if(profileId != null) {
		$.ajax({
			type : "GET",
			url : "/rest/profile/" + profileId,
			contentType : "application/json; charset=utf-8",
			success : function(profile, status, jqxhr) {
				$("main > header").after(profile_template(profile)); // process template
				getRole(profile.pseudoBeautify); // process role
				processSocialLinks(profile.socialLinks); // process social links
				$("section textarea").autosize({append: ""}); // reinitialize autosize plugin for all textareas for whole section
				$("section textarea").add_confirmation_bar(); // initialize add_confirmation_bar plugin for all textareas for whole section
				create_icons_input(user_links_icons_input); // process icons input for user links
				role_display.init(); // apply role display changing
				loap.update(); // re-update loap for user picture
				processAvatar();
			},
			error : function(jqXHR, status, errorThrown) {
				createAlertBox();
			},
			dataType : "json"
		});
	}else{
		createAlertBox();
	}
};

function save(couple) {
	var profileId = window.localStorage.getItem($auth.profile_id);
	if(profileId != null) {
		$.ajax({
			type : "PUT",
			url : "/rest/profile/" + profileId,
			contentType : "application/json; charset=utf-8",
			beforeSend: function(request) {
				header_authentication(request);
			},
			data : couple.json(),
			success : function(profile, status, jqxhr) {
				majView(couple, false);
			},
			error : function(jqXHR, status, errorThrown) {
				majView(couple, true);
				createAlertBox();
			},
			dataType : "json"
		});
	}else{
		createAlertBox();
	}
}

/* ------------------------------------------------------------------ */
/* # Persistent Events */
/* ------------------------------------------------------------------ */

/* User Name */
$("html").on("focus", "#pseudo", function(event) {
	memoryCouple = new Couple(pseudoProperty,$(this).val());
});
$("html").on("keypress","#pseudo", function(event) {
	if (event.which == 13) { // Enter
		$(this).blur();
	}
});
$("html").on("keydown", "#pseudo", function(event) {
	if (event.which == 27) { // Escape
		$(this).val(memoryCouple.value); // recall last value on cancel
		$(this).blur();
	}
});
$("html").on("blur", "#pseudo", function(event) {
	if ($(this).val().length > username_max_chars) {
		$(this).set_validation(false, "Le nom d&rsquo;utilisatrice est trop long&nbsp;!");
		$(this).css("margin-bottom", "0");
	} else {
		var couple = new Couple(pseudoProperty,$("#pseudo").val());
		modifiyCouple(couple);
	}
});

/* User Description */
$("html").on("focus", "#description", function(event) {
	memoryCouple = new Couple(descriptionProperty, $("#description").val());
});
$("html").on("blur", "#description", function(event) {
	var couple = new Couple(descriptionProperty, $(this).val());
	modifiyCouple(couple);
});

/* User Links */
$("html").on("focus", "#user-link input", function() {
	memoryCouple = new Couple(user_links[$("#user_links_icons .active").attr("data-id")], $(this).val());
});
$("html").on("blur", "#user-link input", function() {
	var couple = new Couple(user_links[$("#user_links_icons .active").attr("data-id")], $(this).val());
	modifiyCouple(couple);
});
$("html").on("keypress", "#user-link input", function(event) {
	if (event.which == 13) { // Enter
		$(this).blur();
	}
});

/* ------------------------------------------------------------------ */
/* # Create Icons Input */
/* ------------------------------------------------------------------ */

function create_icons_input(options) {
	var defaults = {
		"input_container" : "",
		"icons_container" : "",
		"icons_selector" : "[class*='icon']", // BUG : SVG icons are generated after function initialization ; so the only selector available at this time is class containing keyword 'icon' (i.e. switch from "[class*='icon-']" to ".icon")
		"icons_title_prefix" : "",
		"icons_tooltip" : true,
		"animation_delay" : ($conf.js_fx ? 250 : 0)
	};
	// vars
	var options = $.extend({}, defaults, options);
	var input_container_margin_bottom = parseInt($(options.input_container).find("input").css("margin-bottom"));
	var icons_container_margin_bottom = parseInt($(options.icons_container).css("margin-bottom"));
	var is_icon_hover = false;
	// methods
	function show_input_container() {
		var obj = $(options.input_container + " input");
		var url = typeof $(options.icons_container + " " + options.icons_selector + ".active").attr("data-url") === "undefined" ? "" : $(options.icons_container + " " + options.icons_selector + ".active").attr("data-url");
		var url_prefix = typeof $(options.icons_container + " " + options.icons_selector + ".active").attr("data-url-prefix") === "undefined" ? false : $(options.icons_container + " " + options.icons_selector + ".active").attr("data-url-prefix");
		setTimeout(function() {
			$(options.input_container).fadeIn(options.animation_delay, function() {
				$(options.input_container + " input").css("margin-bottom", "0");
				$(options.input_container).css("margin-bottom", input_container_margin_bottom + "px");
				$(options.input_container + " .prefix").css("border-color", "darkgray");
				$(options.input_container).find("input").css("box-shadow", "none");
				$(options.input_container).css("box-shadow", "0 0 .25rem rgba(0, 0, 0, .5)");
			});
			obj.val(url);
			obj.selectText(0, obj.val().length);
			$(options.input_container).css("width", "100%");
			// set input prefix visibility
			if (!url_prefix) {
				$(options.input_container + " .prefix").hide();
				$(options.input_container + " input").css("width", "100%");
			} else {
				$(options.input_container + " .prefix").show();
				$(options.input_container + " .prefix").text(url_prefix);
				$(options.input_container + " .prefix").css({
					"width" : "auto",
					"display" : "inline-block"
				});
				// adjust input width
				var w = $(options.input_container).innerWidth() - $(options.input_container + " .prefix").outerWidth(true);
				var w_adj = parseInt($("html").css("font-size")) * 1.25; // REM to px conversion
				$(options.input_container + " input").width(w - w_adj);
				$(options.input_container).css("width", "auto");
			}
			// adjust container horizontal position
			var h = $(options.input_container).outerHeight(true);
			$(options.icons_container).css({"top" : h + "px", "margin-bottom" : h + icons_container_margin_bottom + "px"});
		}, options.animation_delay);
	}
	function hide_input_container() {
		$(options.input_container).fadeOut(options.animation_delay);
		check_icons_enabling($(options.icons_container + " " + options.icons_selector + ".active"));
		$(options.icons_container + " " + options.icons_selector).removeClass("active");
		setTimeout(function() {
			$(options.icons_container).css({"top" : "0", "margin-bottom" : icons_container_margin_bottom});
		}, options.animation_delay);
	}
	function check_icons_enabling(obj) {
		if (typeof obj.attr("data-url") === "undefined" || obj.attr("data-url") == "") {
			obj.addClass("disabled");
		} else {
			obj.removeClass("disabled");
		}
	}
	// events
	$(options.icons_container + " " + options.icons_selector).on("mouseenter", function() {
		is_icon_hover = true;
		if (!$(this).hasClass("active") && $(this).hasClass("disabled")) {
			$(this).css({
				"cursor" : "pointer",
				"outline" : "1px dotted gray",
				"background-color" : "rgba(255, 255, 255, .5)",
				"border-radius" : "0",
				"opacity" : "1"
			});
		}
	});
	$(options.icons_container + " " + options.icons_selector).on("mouseleave", function() {
		is_icon_hover = false;
		$(this).css({"cursor" : "", "outline" : "", "background-color" : "", "border-radius" : "", "opacity" : ""});
		if (!$(this).hasClass("active")) {
			if (typeof $(this).attr("data-url") === "undefined" || $(this).attr("data-url") == "") {
				$(this).addClass("disabled");
			}
		}
	});
	$(options.icons_container + " " + options.icons_selector).on("click", function() {
		$(options.icons_container + " " + options.icons_selector).removeClass("active");
		$(this).removeClass("disabled");
		$(this).addClass("active");
		show_input_container()
	});
	$(options.input_container + " input").on("blur", function() {
		$(options.icons_container + " " + options.icons_selector + ".active").attr("data-url", $(this).val());
		if (is_icon_hover == false) {
			hide_input_container()
		} else {
			check_icons_enabling($(options.icons_container + " " + options.icons_selector + ".active"));
		}
	});
	$(options.input_container + " input").on("keyup", function(event) {
		if (event.which == 13) { // Enter
			$(options.icons_container + " " + options.icons_selector + ".active").attr("data-url", $(this).val());
			hide_input_container()
		}
		if (event.which == 27) { // Escape
			hide_input_container()
		}
	});
	// init
	$(document).ready(function() {
		$(options.input_container).wrap("<div style='position: relative;'></div>");
		$(options.input_container).css({"position" : "absolute", "width" : "100%", "display" : "none"});
		$(options.icons_container).css({"position" : "relative", "top" : "0", "margin-bottom" : icons_container_margin_bottom, "transition" : "top " + options.animation_delay + "ms, margin-bottom " + options.animation_delay + "ms"});
		$(options.icons_container + " " + options.icons_selector).each(function() {
			var str = $(this).attr("title");
			if (typeof str !== "undefined" && str != "") {
				if (options.icons_tooltip) {
					$(this).reload_tooltip(options.icons_title_prefix + str);
				}
			}
			check_icons_enabling($(this));
		});
	});
}

/* ------------------------------------------------------------------ */
/* # Update Role Display */
/* ------------------------------------------------------------------ */

var role_display = (function() {
	return {
		update : function(clear) { // Set role display according to device width
			var clear = clear || false;
			var screen_width = role_display_screen_width;
			if (window.matchMedia("(min-width: " + screen_width + "px)").matches) {
				$("h3.user-name").css("padding-right", $("#role").outerWidth());
				$("input.user-name").css("padding-right", parseFloat($("#role").width()) + parseFloat($("body").css("font-size").replace("px", "")));
				$("#role").css({
					"color" : (clear ? "" : "gray"),
					"text-shadow" : (clear ? "" : "none")
				});
			} else {
				$("h3.user-name").css("padding-right", "");
				$("input.user-name").css("padding-right", "");
			}
		},
		clear : function() { // Alias of update method with clear argument
			this.update(true);
		},
		init : function() { // Bind role display events to pseudo
			var self = this;
			self.clear();
			$(window).resize(function() {
				self.clear();
			});
			$("#pseudo").bind({
				mouseenter: function() {
					self.update();
				},
				mouseleave: function() {
					if (!$(this).is(":focus") && !$(this).hasClass("wrong")) {
						self.clear();
					}
				},
				focus: function() {
					self.update();
				},
				blur: function() {
					if (!$(this).hasClass("wrong")) {
						self.clear();
					}
				}
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Drag 'n' Drop File Upload */
/* ------------------------------------------------------------------ */

function processAvatar(options) {
	// vars
	var defaults = {
		"selector" : "#avatar",           // String   A James Cameron tribute ;) Default : "#avatar"
		"classname" : "dragon",           // String   Hu ? Smaug should have been a good name for this too ... Default : "dragon"
		"max_file_size" : 204800,         // Integer  Maximum file size allowed on upload (kilobytes). Default : 204800
		"progress_hide_delay" : 2000,     // Integer  Delay during which progress bar is visible after file upload (milliseconds). Default : 2000
		"progress_fade_duration" : 1000,  // Integer  Duration of the progress bar fading effect (milliseconds). Default : 1000
	};
	var settings = $.extend({}, defaults, options);
	var o_progress = $(settings.selector).nextAll(".progress").first(); // internal
	var t_progress = 0; // internal
	// methods
	function show_progress_bar() {
		clearTimeout(t_progress);
		o_progress.removeClass("secondary warning alert success");
		o_progress.show();
	}
	function updateProgress(event) {
		if (event.lengthComputable) {
			var p = (event.loaded / event.total * 100 | 0); // completed percentage
			o_progress.find(".meter").text(p);
			o_progress.find(".meter").css("width", p + "%");
		}
	}
	function transferComplete(event) {
		o_progress.removeClass("secondary warning alert");
		o_progress.addClass("success");
		t_progress = setTimeout(function() {
			$conf.js_fx ? o_progress.fadeOut(settings.progress_fade_duration) : o_progress.hide();
		}, settings.progress_hide_delay);
	}
	function transferFailed(event) {
		o_progress.removeClass("secondary warning success");
		o_progress.addClass("alert");
		t_progress = setTimeout(function() {
			$conf.js_fx ? o_progress.fadeOut(settings.progress_fade_duration) : o_progress.hide();
		}, settings.progress_hide_delay);
	}
	function get_avatar_server_response() {
		if (this.readyState == this.DONE) {
			if (this.status == 200) { // OK
				var avatar = JSON.parse(this.response);
				save(new Couple(avatarProperty, avatar.id));
			} else {
				// console.log("HTTP error = " + this.status)
				createAlertBox();
			}
		}
	}
	function readfiles(files) {
		// var formData = new FormData(); // USELESS UNUSED BUG : FormData() isn't recognized by IE9, as well as Blob(), FileList(), FileReader(), etc.
		// console.log("FileList() = " + files[0].name); // DEBUG : data may not be outputed by some browsers (like FF), so check the first array key value instead
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			// check file type
			if (!file.type.match("image.*")) {
				createAlertBox("Votre image doit &ecirc;tre au format JPG, PNG ou GIF", null, {"class" : "warning"});
				continue;
			}
			// max 200 KB
			if (file.size <= settings.max_file_size) {
				// display file upload progess bar
				show_progress_bar();
				// set up AJAX request
				var reader = new FileReader(); // WARNING : unsupported by IE 9 and below
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = get_avatar_server_response; // define XHR response event
				xhr.upload.addEventListener("progress", updateProgress, false);
				xhr.upload.addEventListener("load", transferComplete, false);
				xhr.upload.addEventListener("error", transferFailed, false);
				xhr.open("POST", "/rest/avatars/create");
				header_authentication(xhr); // check authc token
				reader.onload = function(event) {
					xhr.sendAsRawData(event.target.result); // send image as binary
					/* UNUSED : send as blob
					 * Server should be told to parse sent blob object and insert it to database
					 * Without proper service this won't works ...
					 */
					/*
					var raw_data = event.target.result;
					// console.log("raw_data = " + raw_data); // DEBUG
					var blob_data = new Blob([raw_data], {"type" : "image/jpeg"});
					// console.log("blob_data = " + JSON.stringify(blob_data)); // DEBUG
					xhr.send(blob_data);
					*/
				};
				reader.readAsBinaryString(file);
			} else {
				createAlertBox("Votre image ne doit pas d&eacute;passer " + (settings.max_file_size / 1024) + " Ko", null, {"class" : "warning"});
			}
		}
	}
	// events
	$("html").on("dragenter", settings.selector, function(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	});
	$("html").on("dragover", settings.selector, function(event) {
		event.preventDefault();
		event.stopPropagation();
		if ($(settings.selector).data("drag_on") !== "true") {
			$(settings.selector).data("drag_on", "true");
			$(settings.selector).focus();
			$(settings.selector).addClass(settings.classname);
		}
		return false;
	});
	$("html").on("dragend", settings.selector, function() {
		event.preventDefault();
		event.stopPropagation();
		return false;
	});
	$("html").on("drop", settings.selector, function(event) {
		event.preventDefault();
		event.stopPropagation();
		// reset avatar display
		if ($(settings.selector).data("drag_on") === "true") {
			$(settings.selector).removeData(settings.classname);
			$(settings.selector).blur();
			$(settings.selector).removeClass(settings.classname);
		}
		// start file upload
		var data = event.originalEvent.dataTransfer.files;
		readfiles(data); // DEBUG : IE 9 receives 'undefined' ; method not supported (IE 10 should retrieve FileList properly)
	});
	$("html").on("click", settings.selector, function() {
		$(settings.selector).focus();
		$conf.js_fx ? $(settings.selector).next($("input[file]")).fadeIn(250) : $(settings.selector).next($("input[file]")).show();
		if ($(settings.selector).next($("input[file]")).attr("id") === undefined) {
			$(settings.selector).next($("input[file]")).attr("id", $(settings.selector).attr("id") + "_file");
			$(settings.selector + "_file").bind({
				change : function() {
					// start file upload
					var data = this.files;
					readfiles(data); // DEBUG : IE 9 receives 'undefined' ; '.files' not supported anyway (IE 10 should retrieve FileList properly)
				}
			});
		}
	});
	$("html").on("blur", settings.selector, function() {
		$conf.js_fx ? $(settings.selector).next($("input[file]")).fadeOut(250) : $(settings.selector).next($("input[file]")).hide();
	});
}

/* ------------------------------------------------------------------ */
/* # Initialization */
/* ------------------------------------------------------------------ */

// Page Load
$(document).ready(function() {
	getProfile(); // process page template feeded with DB values through AJAX
});
