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
function Couple(property, value){
	this.property = property;
	this.value = value;
	this.json = function() {
		return JSON.stringify(this);
	};
}

// Instance Variables
var memoryCouple = new Couple("", "");
var pseudoProperty = "pseudo";
var descriptionProperty = "description";
var user_links = ["mail", "link", "twitter", "facebook", "googleplus", "linkedin"];

// Instance Methods
function modifiyCouple(couple){ // Pair storing
	if (couple.property == memoryCouple.property && couple.value !== memoryCouple.value) {
		if (pseudoProperty == couple.property){
			// vérifie qu'il a pas resaisi son pseudo après une éventuelle erreur
			if (couple.value != window.localStorage.getItem($oursesUserPseudo)){
				checkPseudoAJAX(couple);
			}
			// si c'est son pseudo, on se contente de virer l'erreur
			else {
				setValidationIcon($("#pseudo"), $("#pseudoError"), true);
			}
		} else {
			save(couple);
		}
	}
}

// Data to HTML association method for user links
function processSocialLinks(socialLinks){
	for (var i = 0; i < socialLinks.length; i++) {
		$(".icon-" + socialLinks[i].network.toLowerCase()).attr("data-url", socialLinks[i].socialUser);
	}
}

// TEMP : instance method for alert box initialization ; to be replaced in loap.js
function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#profile-alert").length == 0) {
		$("main > header").after(alert_box_template({"id" : "profile-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			$(document).foundation("alert"); // reload Foundation alert plugin for whole document (i.e. alert-box cannot be closed bug fix)
		}
		$("#profile-alert").fadeIn(300);
	}
}

/* ------------------------------------------------------------------ */
/* # DOM manipulation */
/* ------------------------------------------------------------------ */

function setValidationIcon(selector, labelSelector, isValid) {
	if (isValid == true) {
		$(selector).removeAttr("data-invalid");
		$(selector).removeClass("wrong");
		$(selector).css("margin-bottom", "");
		$(labelSelector).addClass("hide");
		// TEMP : show role on validation success
		if (selector.attr("id") == "pseudo" && $(window).width() > 640) {
			$("#role").show();
		}
	} else if (isValid == false) {
		$(selector).attr("data-invalid",true);
		$(selector).addClass("wrong");
		$(selector).css("margin-bottom", "0");
		$(labelSelector).removeClass("hide");
		// TEMP : hide role on validation fail
		if (selector.attr("id") == "pseudo" && $(window).width() > 640) {
			$("#role").hide();
		}
	} else {
		$(selector).removeClass("wrong");
	}
}

function majView(couple, updateInError) {
	//en cas d'erreur, rollback les données à l'écran
	if (updateInError) {
		if (memoryCouple.property == pseudoProperty) {
			$("#pseudo").val(memoryCouple.value);
		} else if (memoryCouple.property == descriptionProperty) {
			$("#description").val(memoryCouple.value);
		}
	//sinon mise à jour des attributs pour les socials links
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
		default:
			break;
		}
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function checkPseudoAJAX(couple){
	if (typeof pseudoTimeoutValid !== "undefined") {
		clearTimeout(pseudoTimeoutValid);
	}
	var selector = $("#pseudo");
	setValidationIcon(selector,$("#pseudoError"), null);
	var pseudo = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/pseudo",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			pseudoTimeoutValid = setTimeout(function(){
				setValidationIcon(selector,$("#pseudoError"), true)}, 500);
			save(couple);
		},
		error : function(jqXHR, status, errorThrown) {
			//erreur 403, normal le pseudo est soit vide soit déjà pris
			if (jqXHR.status == 403){
				pseudoTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#pseudoError"), false)}, 500);
			}
			//autre erreur rollback du pseudo et affichage d'un alerte générique
			else{
				createAlertBox();
				majView(couple, true);
			}
		},
		dataType : "json"
	});
}

function getProfile(){
	var profileId = window.localStorage.getItem($oursesProfileId);
	if(profileId != null){
		$.ajax({
			type : "GET",
			url : "/rest/profile/" + profileId,
			contentType : "application/json; charset=utf-8",
			success : function(profile, status, jqxhr) {
				var profile_template = doT.compile(loadfile($app_root + "tmpl/updateProfile.tmpl")); // create template
				$("main > header").after(profile_template(profile)); // process template
				processSocialLinks(profile.socialLinks); // process social links
				// Begin EDIT --------------------------------------------------
				$("textarea").autosize({append: ""}); // reinitialize autosize plugin for all textareas
				$("textarea").validation_bar(); // initialize validation_bar plugin for all textareas
				//set_icons_input(social_links); // process icons input for social links
				create_icons_input(user_links_icons_input); // process icons input for user links
				loap.update(); // re-update loap for user picture
				update_role_display(640); // update user role display
				$(window).on("resize", function() {
					update_role_display(640); // update user role display on screen resize
				});
				// End EDIT ----------------------------------------------------
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
	if(profileId != null){
		$.ajax({
			type : "PUT",
			url : "/rest/profile/" + profileId,
			contentType : "application/json; charset=utf-8",
			beforeSend: function(request){
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
$("html").on("focus","#pseudo", function(event) {
	memoryCouple = new Couple(pseudoProperty,$(this).val());
});
$("html").on("keypress","#pseudo", function(event) {
	if (event.which == 13) { // Enter
		$(this).blur();
	}
});
$("html").on("keydown","#pseudo", function(event) {
	if (event.which == 27) { // Escape
		$(this).val(memoryCouple.value); // recall last value on cancel
		$(this).blur();
	}
});
$("html").on("blur","#pseudo", function(event) {
	var couple = new Couple(pseudoProperty,$("#pseudo").val());
	modifiyCouple(couple);
});

/* User Description */
$("html").on("focus","#description", function(event) {
	memoryCouple = new Couple(descriptionProperty, $("#description").val());
});
$("html").on("blur","#description", function(event) {
	var couple = new Couple(descriptionProperty, $(this).val());
	modifiyCouple(couple);
});

/* User Links */
$("html").on("focus", "#user-link input", function() {
	memoryCouple = new Couple($("#user_links_icons .active").text().toLowerCase(), $(this).val());
});
$("html").on("blur", "#user-link input", function() {
	var couple = new Couple($("#user_links_icons .active").text().toLowerCase(), $(this).val());
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
		"icons_selector" : "[class*='icon-']",
		"icons_title_prefix" : "",
		"icons_tooltip" : true,
		"animation_delay" : 250
	};
	// Vars
	var options = $.extend({}, defaults, options);
	var input_container_margin_bottom = parseInt($(options.input_container).find("input").css("margin-bottom"));
	var icons_container_margin_bottom = parseInt($(options.icons_container).css("margin-bottom"));
	var is_icon_hover = false;
	// Methods
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
			// Set input prefix visibility
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
				// Adjust input width
				var w = $(options.input_container).innerWidth() - $(options.input_container + " .prefix").outerWidth(true);
				var w_adj = parseInt($("html").css("font-size")) * 1.25; // REM to px conversion
				$(options.input_container + " input").width(w - w_adj);
				$(options.input_container).css("width", "auto");
			}
			// Adjust container horizontal position
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
	// Eventing
	$(options.icons_container + " " + options.icons_selector).on("mouseenter", function() {
		is_icon_hover = true;
		if (!$(this).hasClass("active") && $(this).hasClass("disabled")) {
			$(this).css({
				"cursor" : "pointer",
				"outline" : "1px dotted gray",
				"background-color" : "rgba(255, 255, 255, .5)",
				"opacity" : "1"
			});
		}
	});
	$(options.icons_container + " " + options.icons_selector).on("mouseleave", function() {
		is_icon_hover = false;
		$(this).css({"cursor" : "", "outline" : "", "background-color" : "", "opacity" : ""});
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
	// Initialization
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

function update_role_display(screen_width) {
	var screen_width = screen_width || 640;
	if ($(window).width() > screen_width) {
		// Init : set user role custom styles
		$("#role").addClass("text-large");
		$("#role").css({
			"position" : "absolute",
			"top" : $("#pseudo").position().top,
			"right" : "0",
			"margin" : "0",
			"padding" : "0 1rem",
			"height" : $("#pseudo").outerHeight(),
			"line-height" : $("#pseudo").css("line-height"),
			"opacity" : ".5",
			"color" : "white",
			"text-shadow" : "-1px -1px rgba(0, 0, 0, .5)",
		});
		// Events : change user role custom styles
		$("#pseudo").bind({
			mouseover: function() {
				$("#role").css("color", "gray");
				$("#role").css("text-shadow", "none");
			},
			mouseout: function() {
				$("#role").css("color", "white");
				$("#role").css("text-shadow", "-1px -1px rgba(0, 0, 0, .5)");
			},
			focus: function() {
				$("#role").fadeOut();
			},
			blur: function() {
				// TEMP : do not show role if pseudo is invalid
				if (typeof $("#pseudo").attr("data-invalid") === "undefined") {
					$("#role").fadeIn();
				}
			}
		});
	} else {
		// Init : reset user role custom styles
		$("#role").removeClass("text-large");
		$("#role").css({
			"position" : "",
			"top" : "",
			"right" : "",
			"margin" : "",
			"padding" : "",
			"height" : "",
			"line-height" : "",
			"opacity" : "",
			"color" : "",
			"text-shadow" : "",
		});
		// Events : unbind user role custom styles
		$("#pseudo").unbind("mouseover");
		$("#pseudo").unbind("mouseout");
		$("#pseudo").unbind("focus");
		$("#pseudo").unbind("blur");
	}
}

/* ------------------------------------------------------------------ */
/* # Initialization */
/* ------------------------------------------------------------------ */

// Page Load
$(document).ready(function() {
	getProfile(); // process page template feeded with DB values through AJAX
});
