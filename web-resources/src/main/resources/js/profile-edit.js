/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"profile_edit_tpml" : $loc.tmpl + "profile-edit.tmpl"
}

var username_max_chars = 24;
var role_display_screen_width = 1023; // WARNING : Should be the same as CSS file for this to work properly

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.profile_edit.title);
			/* Process */
			getProfile(); // process page template feeded with DB values through AJAX
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

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
			if (couple.value != UserSession.getUserPseudo()) {
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
	selector.set_validation();
	var pseudo = selector.val();;
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/pseudo?id=" + UserSession.getUserProfileId(),
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
					var empty = "Le nom d&rsquo;utilisatrice doit obligatoirement &ecirc;tre renseign&eacute;";
					var dup   = "Ce nom d&rsquo;utilisatrice est d&eacute;j&agrave; pris&nbsp;!";
					selector.set_validation(false, selector.val().trim() == "" ? empty : dup);
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
	var profileId = UserSession.getUserProfileId();
	if (profileId != null) {
		$.ajax({
			type : "GET",
			url : "/rest/profile/" + profileId,
			contentType : "application/json; charset=utf-8",
			success : function(profile, status, jqxhr) {
				$(".main-body").append(file_pool.profile_edit_tpml(profile)).after(lb(1)); // process template
				getRole(profile.pseudoBeautify); // process role
				processSocialLinks(profile.socialLinks); // process social links
				$("section textarea").autosize({append: ""}); // reinitialize autosize plugin for all textareas for whole section
				$("section textarea").add_confirmation_bar(); // initialize add_confirmation_bar plugin for all textareas for whole section
				user_icons(); // process icons input for user links
				role_display.init(); // apply role display changing
				loap.update(); // re-update loap for user picture
				processAvatar();
				if (typeof profile.avatar !== "undefined" && profile.avatar.id > 0) {
					$("#delete_avatar").show(); // show delete avatar link if avatar is defined
				}
			},
			error : function(jqXHR, status, errorThrown) {
				createAlertBox();
			},
			dataType : "json"
		});
	} else {
		createAlertBox();
	}
};

function deleteAvatar(){
	var profileId = UserSession.getUserProfileId();
	if(profileId != null) {
		$.ajax({
			type : "DELETE",
			url : "/rest/profile/" + profileId + "/avatar",
			contentType : "application/json; charset=utf-8",
			beforeSend: function(request) {
				header_authentication(request);
			},
			success : function(profile, status, jqxhr) {
				$("#delete_avatar").hide(); // hide delete avatar link
				$("#avatar").attr("data-image", profile.avatar.path);
				loap.update();
				update_user_avatar(profile.avatar.path);
			},
			error : function(jqXHR, status, errorThrown) {
				createAlertBox();
			},
			dataType : "json"
		});
	}
}

function save(couple) {
	var profileId = UserSession.getUserProfileId();
	if (profileId != null) {
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
	} else {
		createAlertBox();
	}
}

/* ------------------------------------------------------------------ */
/* # Create Icons Input */
/* ------------------------------------------------------------------ */

function user_icons(opts) {
	// Configuration
	var defs = {
		"icons_container"    : "#user_links_icons",
		"input_container"    : "#user-link",
		"icons_selector"     : "[class^=icon]",
		"input_selector"     : "input",
		"label_selector"     : "label",
		"icons_title_prefix" : "Votre ",
		"fx_d"               : 250
	};
	// Variables
	var cfg = $.extend({}, defs, opts);
	var field = $(cfg.input_container);
	var icons = $(cfg.icons_container + " " + cfg.icons_selector);
	var input = $(cfg.input_container + " " + cfg.input_selector);
	var label = $(cfg.input_container + " " + cfg.label_selector);
	// Functions
	function check_icon(obj) {
		if (is_def(typeof obj.attr("data-url")) && obj.attr("data-url") != "") {
			obj.removeClass("disabled");
		} else {
			obj.addClass("disabled");
		}
	}
	function show_input(obj) {
		var url = is_def(typeof obj.attr("data-url")) ? obj.attr("data-url") : "";
		var url_prefix = is_def(typeof obj.attr("data-url-prefix")) ? obj.attr("data-url-prefix") : "&nbsp;";
		input.val(url);
		label.html(url_prefix);
		if (field.is(":hidden")) {
			field.show();
			var h = field.outerHeight();
			field.css({"opacity" : 0, "height" : 0});
			field.animate({"opacity" : 1, "height" : h}, $conf.js_fx ? cfg.fx_d : 0, function() {
				field.css({"opacity" : "", "height" : ""});
				input.select_text(0, input.val().length);
			});
		} else {
			input.select_text(0, input.val().length);
		}
	}
	function hide_input(obj) {
		icons.removeClass("active");
		obj.blur();
		check_icon(obj);
		if (field.is(":visible")) {
			field.animate({"opacity" : 0, "height" : 0}, $conf.js_fx ? cfg.fx_d : 0, function() {
				field.css({"opacity" : "", "height" : ""});
				field.hide();
			});
		}
	}
	// Live Events
	icons.on("mouseenter", function() {
		is_icon_hover = true;
	});
	icons.on("mouseleave", function() {
		is_icon_hover = false;
		if (!$(this).hasClass("active")) {
			if (typeof $(this).attr("data-url") === "undefined" || $(this).attr("data-url") == "") {
				$(this).addClass("disabled");
			}
		}
	});
	icons.on("click", function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			hide_input($(this));
		} else {
			icons.removeClass("active");
			$(this).removeClass("disabled");
			$(this).addClass("active");
			show_input($(this))
		}
	});
	input.on("blur", function() {
		var obj = icons.filter(".active")
		obj.attr("data-url", $(this).val());
		if (!is_icon_hover) {
			hide_input(obj)
		} else {
			check_icon(obj);
		}
	});
	input.on("keydown", function(e) {
		var obj = icons.filter(".active");
		if (e.which == 13) { // Enter
			obj.attr("data-url", $(this).val());
			hide_input(obj)
		}
		if (e.which == 27) { // Escape
			hide_input(obj)
		}
	});
	// Execution
	icons.each(function() {
		var str = $(this).children().text();
		if (typeof str !== "undefined" && str != "") {
			$(this).attr("title", cfg.icons_title_prefix + str);
		}
		check_icon($(this));
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
	// var o_progress = $(settings.selector).nextAll(".progress").first(); // internal
	var o_progress = $(settings.selector).parent("div").nextAll(".progress").first(); // internal
	var t_progress = 0; // internal
	// functions
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
				$("#delete_avatar").show(); // show delete avatar link
			} else {
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
				createAlertBox("Votre image doit &ecirc;tre au format JPG, PNG ou GIF", null, {"class" : "warning", "timeout" : $time.duration.alert});
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
				createAlertBox("Votre image ne doit pas d&eacute;passer " + (settings.max_file_size / 1024) + " Ko", null, {"class" : "warning", "timeout" : $time.duration.alert});
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
		var input = $(settings.selector).parent("div").next($("input[file]"));
		$(settings.selector).focus();
		$conf.js_fx ? input.fadeIn(250) : input.show();
		if (input.attr("id") === undefined) {
			input.attr("id", $(settings.selector).attr("id") + "_file");
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
		var input = $(settings.selector).parent("div").next($("input[file]"));
		$conf.js_fx ? input.fadeOut(250) : input.hide();
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

/* User Name */
$("html").on("focus", "#pseudo", function(event) {
	memoryCouple = new Couple(pseudoProperty, $(this).val());
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
	var str = $(this).val().trim();
	$(this).val(str);
	if (str.length > username_max_chars) {
		$(this).set_validation(false, "Le nom d&rsquo;utilisatrice est trop long&nbsp;!");
		$(this).css("margin-bottom", "0");
	} else {
		var couple = new Couple(pseudoProperty, str);
		modifiyCouple(couple);
	}
});

/* User Description */
$("html").on("focus", "#description", function(event) {
	memoryCouple = new Couple(descriptionProperty, $("#description").val());
});
$("html").on("blur", "#description", function(event) {
	var str = $(this).val().trim();
	$(this).val(str);
	var couple = new Couple(descriptionProperty, str);
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

/* Delete Avatar */
$(document).on("click", "#delete_avatar", function() {
	if ($conf.confirm_delete.avatar) {
		var modal_options = {
			"text" : $msg.confirm_delete.avatar,
			"class" : "panel radius",
			"on_confirm" : function() {
				deleteAvatar(); // delete avatar
			}
		};
		$(this).create_confirmation_modal(modal_options);
	} else {
		deleteAvatar(); // delete avatar
	}
});
