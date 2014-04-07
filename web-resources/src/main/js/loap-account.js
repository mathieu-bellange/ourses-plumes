/* Domain */
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

/* UNUSED */
/*
var pseudoIsValid = false;
var mailIsValid = false;

function checkPseudo(){
	return pseudoIsValid;
}
*/

/* DOM manipulation */
function setValidationIcon(selector, isValid) {
	if (isValid == true) {
		$(selector).addClass("valid");
		$(selector).removeClass("wrong");
		$(selector).removeClass("loading");
	} else if (isValid == false) {
		$(selector).removeClass("valid");
		$(selector).addClass("wrong");
		$(selector).removeClass("loading");
	} else {
		$(selector).removeClass("valid");
		$(selector).removeClass("wrong");
		$(selector).addClass("loading");
	}
}
/* UNUSED */
/*
function showPseudoIconValidation(valid){
	pseudoIsValid = valid;
	if (valid){
		$("#pseudoPostFix").html("ok");
	}else{
		$("#pseudoPostFix").html("notOk");
	}
}
function showPseudoIconLoading(){
	$("#pseudoPostFix").html("load");
}
function showMailIconValidation(valid){
	mailIsValid = valid;
	if (valid){
		$("#mailPostFix").html("ok");
	}else{
		$("#mailPostFix").html("notOk");
	}
}
function showMailIconLoading(){
	$("#mailPostFix").html("load");
}
*/

/* AJAX */
$("#pseudo").keyup(function(event){
// showPseudoIconLoading();
	if (typeof pseudoTimeoutValid !== "undefined") {clearTimeout(pseudoTimeoutValid);}
	var selector = this;
	setValidationIcon(selector, null);
	var pseudo = $("#pseudo").val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/pseudo",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			// showPseudoIconValidation(true);
			pseudoTimeoutValid = setTimeout(function(){setValidationIcon(selector, true)}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				// showPseudoIconValidation(false);
				pseudoTimeoutValid = setTimeout(function(){setValidationIcon(selector, false)}, 500);
			}
		},
		dataType : "json"
	});
});

$("#mail").keyup(function(event){
	// showMailIconLoading();
	if (typeof mailTimeoutValid !== "undefined") {clearTimeout(mailTimeoutValid);}
	var selector = this;
	setValidationIcon(selector, null);
	var mail = $("#mail").val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/mail",
		contentType : "application/json; charset=utf-8",
		data : mail,
		success : function(data, textStatus, jqXHR) {
			// showMailIconValidation(true);
			mailTimeoutValid = setTimeout(function(){setValidationIcon(selector, true)}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				// showMailIconValidation(false);
				mailTimeoutValid = setTimeout(function(){setValidationIcon(selector, false)}, 500);
			}
		},
		dataType : "json"
	});
});

$("#bearAccount").submit(function(event){
	if (document.getElementById("bearAccount").checkValidity()){
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
				$("#compte-alert").addClass("error");
				$("#compte-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
				$("#compte-alert").fadeIn(500);
			},
			dataType : "json"
		});
	}
});

/* Events */
$("#password").on("focus", function(event){ // clear input
	$(this).attr("placeholder", "");
});
$("#compte-alert .close").on('click', function(event) { // fadeout alert box
	$("#compte-alert").fadeOut(500);
});