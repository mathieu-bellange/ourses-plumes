/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function Couple(property,value){
	this.property = property;
	this.value=value;
	this.json = function() {
		return JSON.stringify(this);
	};
}

var memoryCouple = new Couple("","");
var pseudoProperty = "pseudo";
var descriptionProperty = "description";
var social_links = ["twitter","facebook","googleplus","linkedin"];
var user_links = ["home","mail","link"];

function modifiyCouple(couple){
	if (couple.property == memoryCouple.property && couple.value !== memoryCouple.value){
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

function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#profile-alert").length == 0) {
		$("header + hr").after(alert_box_template({"id" : "profile-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			// BUG -- the error alert box cannot be closed
			// The Foundation alert box is reloaded only for the selector "header + hr".
			// But the alert box has been put under "header + hr" with the jQuery method ".after()" (precisely between header and section).
			// So the method foundation("alert") won't reload the newly created box because the scope is wrong.
			// For it to work, this method should be placed on the parent element that contain the alert box.
			// It can also be placed on the top most element of the node if any doubt remain.
			// Let's append it to the whole document for now considering its actual position ;)
			// $("header + hr").foundation("alert");
			$(document).foundation("alert");
		}
		$("#profile-alert").fadeIn(300);
	}
}

function selectorSocialLink(network){
	return ".icon-"+network;
}

function processSocialLinks(socialLinks){
	for (var i = 0; i < socialLinks.length; i ++){
		//social network like facebook, twitter googpleplus and linkedin
		var indexSocialNetwork = $.inArray(socialLinks[i].network,social_links);
		if (indexSocialNetwork != -1){
			$(selectorSocialLink(socialLinks[i].network)).addClass("social-active");
			$(selectorSocialLink(socialLinks[i].network)).attr("data-social-user",socialLinks[i].socialUser)
		}
		//user network like web site mail and other link
		var indexUserNetwork = $.inArray(socialLinks[i].network,user_links);
		if (indexUserNetwork != -1){
			$(selectorSocialLink(socialLinks[i].network)).addClass("social-active");
			$(selectorSocialLink(socialLinks[i].network)).attr("data-social-user",socialLinks[i].socialUser)
		}
	}
}

/* ------------------------------------------------------------------ */
/* # DOM manipulation */
/* ------------------------------------------------------------------ */

function setValidationIcon(selector, labelSelector, isValid) {
	if (isValid == true) {
		$(selector).removeAttr("data-invalid");
		$(selector).removeClass("wrong");
		$(labelSelector).addClass("hide");
	} else if (isValid == false) {
		$(selector).attr("data-invalid",true);
		$(selector).addClass("wrong");
		$(labelSelector).removeClass("hide");
	} else {
		$(selector).removeClass("wrong");
	}
}

function majView(couple,updateInError){
	//en cas d'erreur, rollback les données à l'écran
	if(updateInError){
		if (memoryCouple.property == pseudoProperty){
			$("#pseudo").val(memoryCouple.value);
		}else if(memoryCouple.property == descriptionProperty){
			$("#description").val(memoryCouple.value);
		}
	//sinon mise à jour des attributs pour les socials links
	}else{
		switch (couple.property) {
		case social_links[0]:
			$(".icon-twitter").attr("data-social-user",couple.value);
			break;
		case social_links[1]:
			$(".icon-facebook").attr("data-social-user",couple.value);
			break;
		case social_links[2]:
			$(".icon-googleplus").attr("data-social-user",couple.value);
			break;
		case social_links[3]:
			$(".icon-linkedin").attr("data-social-user",couple.value);
			break;
		case user_links[0]:
			$(".icon-home").attr("data-social-user",couple.value);
			break;
		case user_links[1]:
			$(".icon-mail").attr("data-social-user",couple.value);
			break;
		case user_links[2]:
			$(".icon-link").attr("data-social-user",couple.value);
			break;
		case pseudoProperty :
			//loap.js method
			update_user_pseudo(couple.value);
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
				majView(couple,true);
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
				$("header + hr").after(profile_template(profile)); // process template
				// Begin EDIT
				$('textarea').autosize({append: ""}); // reinitialize autosize plugin for all textareas
				loap.update(); // update loap for user picture
				// End EDIT
				processSocialLinks(profile.socialLinks);
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

function save(couple){
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
				majView(couple,false);
			},
			error : function(jqXHR, status, errorThrown) {
				majView(couple,true);
				createAlertBox();
			},
			dataType : "json"
		});
	}else{
		createAlertBox();
	}
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	getProfile();
});
// champ pseudo
$("html").on("mouseover","#pseudo", function(event){
	$(this).addClass("editable");
});
$("html").on("mouseout","#pseudo", function(event){
	$(this).removeClass("editable");
});
$("html").on("focus","#pseudo", function(event){
	$(this).removeClass("disable");
	$(this).addClass("editing");
	memoryCouple = new Couple(pseudoProperty,$(this).val());
});
$("html").on("keypress","#pseudo", function(event){
	if(event.which == 13) {
		$(this).blur();
	}
});
$("html").on("blur","#pseudo", function(event){
	$(this).addClass("disable");
	$(this).removeClass("editing");
	var couple = new Couple(pseudoProperty,$("#pseudo").val());
	modifiyCouple(couple);
});

//champ description
$("html").on("mouseover","#description", function(event){
	$(this).addClass("editable");
});
$("html").on("mouseout","#description", function(event){
	$(this).removeClass("editable");
});
$("html").on("focus","#description", function(event){
	$(this).removeClass("disable");
	$(this).addClass("editing");
	memoryCouple = new Couple(descriptionProperty,$("#description").val());
});
$("html").on("keypress","#description", function(event){
	if(event.which == 13) {
		$(this).blur();
	}
});
$("html").on("blur","#description", function(event){
	$(this).addClass("disable");
	$(this).removeClass("editing");
	var couple = new Couple(descriptionProperty,$(this).val());
	modifiyCouple(couple);
});

//twitter
$("html").on("click",".icon-twitter", function(event){
	$("#social-link").removeClass("hide");
	$("#social-link").attr("data-social-network",social_links[0]);
	$("#social-link span").html("https://twitter.com/");
	$("#social-link input").val($(this).attr("data-social-user"));
	$("#social-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(social_links[0],network);
});
//facebook
$("html").on("click",".icon-facebook", function(event){
	$("#social-link").removeClass("hide");
	$("#social-link").attr("data-social-network",social_links[1]);
	$("#social-link span").html("https://facebook.com/");
	$("#social-link input").val($(this).attr("data-social-user"));
	$("#social-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(social_links[1],network);
});
//google plus
$("html").on("click",".icon-googleplus", function(event){
	$("#social-link").removeClass("hide");
	$("#social-link").attr("data-social-network",social_links[2]);
	$("#social-link span").html("https://plus.google.com/");
	$("#social-link input").val($(this).attr("data-social-user"));
	$("#social-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(social_links[2],network);
});
//linkedin
$("html").on("click",".icon-linkedin", function(event){
	$("#social-link").removeClass("hide");
	$("#social-link").attr("data-social-network",social_links[3]);
	$("#social-link span").html("https://linkedin.com/");
	$("#social-link input").val($(this).attr("data-social-user"));
	$("#social-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(social_links[3],network);
});
//social link
$("html").on("blur","#social-link", function(event){
	$(this).addClass("hide");
	var couple = new Couple($(this).attr("data-social-network"),$("#social-link input").val());
	modifiyCouple(couple);
});
$("html").on("keypress","#social-link", function(event){
	if(event.which == 13) {
		$(this).blur();
	}
});
//home
$("html").on("click",".icon-home", function(event){
	$("#user-link").removeClass("hide");
	$("#user-link").attr("data-user-network",user_links[0]);
	$("#user-link input").val($(this).attr("data-social-user"));
	$("#user-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(user_links[0],network);
});
//mail
$("html").on("click",".icon-mail", function(event){
	$("#user-link").removeClass("hide");
	$("#user-link").attr("data-user-network",user_links[1]);
	$("#user-link input").val($(this).attr("data-social-user"));
	$("#user-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(user_links[1],network);
});
//link
$("html").on("click",".icon-link", function(event){
	$("#user-link").removeClass("hide");
	$("#user-link").attr("data-user-network",user_links[2]);
	$("#user-link input").val($(this).attr("data-social-user"));
	$("#user-link input").focus();
	var network = "";
	if ($(this).attr("data-social-user") != undefined){
		network = $(this).attr("data-social-user");
	}
	memoryCouple = new Couple(user_links[2],network);
});
//user link
$("html").on("blur","#user-link", function(event){
	$(this).addClass("hide");
	var couple = new Couple($(this).attr("data-user-network"),$("#user-link input").val());
	modifiyCouple(couple);
});
$("html").on("keypress","#user-link", function(event){
	if(event.which == 13) {
		$(this).blur();
	}
});
