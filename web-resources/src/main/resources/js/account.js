/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

/* UNUSED for now */
/*
var alert_box_data = {"class" : "error", "text" : "Ceci est un message d&rsquo;erreur"};
var alert_box_template = doT.compile(loadfile("tmpl/alert_box.tmpl"));
$("section#account h2").after(alert_box_template(alert_box_data));
*/

/* ------------------------------------------------------------------ */
/* Domain */
/* ------------------------------------------------------------------ */

function BearAccount(mail,password,profile) {
	this.profile = profile;
	this.mail = mail;
	this.password = password;
	this.json = function() {
		return JSON.stringify(this);
	};
}

function Profile(pseudo) {
	this.pseudo = pseudo;
}

function isFormValid(){
	var isPseudoValid = !$("#pseudo").attr("data-invalid");
	var isMailValid = !$("#mail").attr("data-invalid");
	var isPasswordValid = !$("#password").attr("data-invalid");
	return isPseudoValid && isMailValid && isPasswordValid;
}

/* ------------------------------------------------------------------ */
/* DOM manipulation */
/* ------------------------------------------------------------------ */

function setValidationIcon(selector, labelSelector, isValid) {
	if (isValid == true) {
		$(selector).addClass("valid");
		$(selector).removeAttr("data-invalid");
		$(selector).removeClass("wrong");
		$(selector).removeClass("loading");
		$("[for='" + selector.attr("id") + "']").removeClass("error");
		$(labelSelector).addClass("hide");
	} else if (isValid == false) {
		$(selector).removeClass("valid");
		$(selector).attr("data-invalid",true);
		$(selector).addClass("wrong");
		$(selector).removeClass("loading");
		$("[for='" + selector.attr("id") + "']").addClass("error");
		$(labelSelector).removeClass("hide");
	} else {
		$(selector).removeClass("valid");
		$(selector).removeClass("wrong");
		$(selector).addClass("loading");
		setTimeout(function(){$(selector).removeClass("loading")}, 1000);
	}
}

/* ------------------------------------------------------------------ */
/* AJAX */
/* ------------------------------------------------------------------ */

function checkPseudoAJAX(){
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
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				pseudoTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#pseudoError"), false)}, 500);
			}
		},
		dataType : "json"
	});
}

function checkPasswordAJAX(){
	if (typeof passwordTimeoutValid !== "undefined") {
		clearTimeout(passwordTimeoutValid);
	}
	var selector = $("#password");
	setValidationIcon(selector,$("#passwordError"), null);
	var pseudo = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/password",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			passwordTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#passwordError"), true)}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				passwordTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#passwordError"), false)}, 500);
			}
		},
		dataType : "json"
	});
}

function checkMailAJAX(){
	if (typeof mailTimeoutValid !== "undefined") {
		clearTimeout(mailTimeoutValid);
	}
	var selector = $("#mail");
	setValidationIcon(selector,$("#mailError"), null);
	var mail = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/mail",
		contentType : "application/json; charset=utf-8",
		data : mail,
		success : function(data, textStatus, jqXHR) {
			mailTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#mailError"), true)}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				mailTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#mailError"), false)}, 500);
			}
		},
		dataType : "json"
	});
}

function submitAccountAJAX(){
	var profile = new Profile($("#pseudo").val());
	var bearAccount = new BearAccount($("#mail").val(),$("#password").val(),profile);
	$.ajax({
		type : "PUT",
		url : "/rest/account/create",
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		success : function(jqXHR, status, errorThrown) {
			window.location.href = "/comptes";
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				checkPseudoAJAX();
				checkPasswordAJAX();
				checkMailAJAX();
			}else{
				$("#compte-alert").addClass("error");
				$("#compte-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
				$("#compte-alert").fadeIn(500);
			}
		},
		dataType : "json"
	});
}

/* Events */
$("#bearAccount").submit(function(event){
	if (isFormValid()){
		submitAccountAJAX();
	}
});
$("#pseudo").keyup(function(event){
	checkPseudoAJAX();
});
$("#pseudo").on("keypress", function(){
  setValidationIcon(this,$("#pseudoError"), null);
});
$("#mail").keyup(function(event){
	checkMailAJAX();
});
$("#mail").on("keypress", function(){
	setValidationIcon(this,$("#mailError"), null);
});
$("#password").keyup(function(event){
	checkPasswordAJAX();
});
$("#password").on("keypress", function(){
	setValidationIcon(this,$("#passwordError"), null);
});
$("#password").on("focus", function(event){
	$(this).attr("placeholder", "");
});
$("#compte-alert .close").on('click', function(event) {
	$("#compte-alert").fadeOut(500);
});
