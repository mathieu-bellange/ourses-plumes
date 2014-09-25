/* ------------------------------------------------------------------ */
/* # Public vars */
/* ------------------------------------------------------------------ */

var username_max_chars = 24;
var role_display_screen_width = 1023; // WARNING : Should be the same as CSS file for this to work properly

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
			if (couple.value != window.localStorage.getItem($oursesUserPseudo)) {
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
	var profileId = window.localStorage.getItem($oursesProfileId);
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
					role_display.update(); // here's the trick ! fancy stuff ;)
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

function getProfile() {
	var profileId = window.localStorage.getItem($oursesProfileId);
	if(profileId != null) {
		$.ajax({
			type : "GET",
			url : "/rest/profile/" + profileId,
			contentType : "application/json; charset=utf-8",
			success : function(profile, status, jqxhr) {
				var profile_template = doT.compile(loadfile($app_root + "tmpl/updateProfile.tmpl")); // create template
				$("main > header").after(profile_template(profile)); // process template
				processSocialLinks(profile.socialLinks); // process social links
				$("textarea").autosize({append: ""}); // reinitialize autosize plugin for all textareas
				$("textarea").add_confirmation_bar(); // initialize add_confirmation_bar plugin for all textareas
				create_icons_input(user_links_icons_input); // process icons input for user links
				role_display.init(); // apply role display changing
				processAvatar();
				loap.update(); // re-update loap for user picture
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
	var profileId = window.localStorage.getItem($oursesProfileId);
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
		"animation_delay" : 250
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
			obj.cursor_position(0, obj.val().length);
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
				$(this).attr("title", options.icons_title_prefix + str);
				if (options.icons_tooltip) {
					$(this).addClass("tip-top");
					$(this).attr("data-tooltip", "");
					$(options.icons_container).foundation("tooltip");
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

// XHR Object
if (!XMLHttpRequest.prototype.sendAsBinary) {
	XMLHttpRequest.prototype.sendAsBinary = function(sData) {
		var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
		for (var nIdx = 0; nIdx < nBytes; nIdx++) {
			ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
		}
		/* send as ArrayBufferView...: */
		this.send(ui8Data);
		/* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
	};
}

// Get File
function handler() {
	if (this.readyState == this.DONE) {
		if (this.status == 200) { // success!
			var avatar = JSON.parse(this.response);
			save(new Couple(avatarProperty, avatar.id));
		} else { // fail...
			createAlertBox();
		}
	}
}

// Open and Send Files
function readfiles(files) {
	var formData = new FormData(); // Here's IE bug ! FormData() isn't recognized by that browser
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		// check file type
		if (!file.type.match("image.*")) {
			createAlertBox("Votre image doit &ecirc;tre au format JPG, PNG ou GIF", "warning");
			continue;
		}
		// max 200 KB
		if (file.size <= 204800) {
			// show progress bar
			show_progress_bar();
			var reader = new FileReader();
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = handler;
			xhr.upload.addEventListener("progress", updateProgress, false);
			xhr.upload.addEventListener("load", transferComplete, false);
			xhr.upload.addEventListener("error", transferFailed, false);
			xhr.open("POST", "/rest/avatars/create");
			if (window.localStorage.getItem($oursesAuthcToken) !== undefined){
				xhr.setRequestHeader("Authorization", window.localStorage.getItem($oursesAuthcToken)); // set authc token
			}
			reader.onload = function(e) {
				xhr.sendAsBinary(e.target.result);
			};
			reader.readAsBinaryString(file);
		} else {
			createAlertBox("Votre image ne doit pas d&eacute;passer 200 Ko", "warning"); // Matthieuuuuu !!!! Participe (dé)passé !
		}
	}
}

// Locals
var t_progress = 0;
var h_selector = "#avatar";

function show_progress_bar() {
	clearTimeout(t_progress);
	$(h_selector).nextAll(".progress").first().removeClass("secondary warning alert success");
	$(h_selector).nextAll(".progress").first().show();
}

function processAvatar() {
	// vars
	var id = "avatar"; // A tribute to James Cameron ?
	var cls = "dragon" // Parce que ça marche des flammes :D
	var holder = document.getElementById(id);
	var selector = "#" + id;
	// events
	holder.ondragover = function() {
		if ($(selector).data("drag_on") !== "true") {
			$(selector).data("drag_on", "true");
			$(selector).focus();
			$(selector).addClass(cls);
		}
		return false;
	};
	holder.ondragend = function() {
		return false;
	};
	holder.ondrop = function(e) {
		// reset avatar display
		if ($(selector).data("drag_on") === "true") {
			$(selector).removeData(cls);
			$(selector).blur();
			$(selector).removeClass(cls);
		}
		// start file upload
		e.preventDefault();
		readfiles(e.dataTransfer.files);
	};
	holder.onfocus = function() {
		$(selector).next($("input[file]")).fadeIn(250);
		if ($(selector).next($("input[file]")).attr("id") === undefined) {
			$(selector).next($("input[file]")).attr("id", $(selector).attr("id") + "_file");
			$(selector + "_file").bind({
				change : function() {
					// start file upload
					readfiles(this.files);
				}
			});
		}
	};
	holder.onblur = function() {
		$(selector).next($("input[file]")).fadeOut(250);
	}
}

// XHR upload events
function updateProgress(event) {
	var selector = h_selector;
	if (event.lengthComputable) {
		var p = (event.loaded / event.total * 100 | 0); // completed percentage
		$(selector).nextAll(".progress").first().find(".meter").text(p);
		$(selector).nextAll(".progress").first().find(".meter").css("width", p + "%");
	}
}
function transferComplete(event) {
	var selector = h_selector;
	$(selector).nextAll(".progress").first().removeClass("secondary warning alert");
	$(selector).nextAll(".progress").first().addClass("success");
	t_progress = setTimeout(function() {
		$(selector).nextAll(".progress").first().fadeOut(1000);
	}, 2000);
}
function transferFailed(event) {
	var selector = h_selector;
	$(selector).nextAll(".progress").first().removeClass("secondary warning success");
	$(selector).nextAll(".progress").first().addClass("alert");
	t_progress = setTimeout(function() {
		$(selector).nextAll(".progress").first().fadeOut(1000);
	}, 2000);
}

/* ------------------------------------------------------------------ */
/* # Initialization */
/* ------------------------------------------------------------------ */

// Page Load
$(document).ready(function() {
	getProfile(); // process page template feeded with DB values through AJAX
});
