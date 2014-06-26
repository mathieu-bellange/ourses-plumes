/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function BearAccount(oldPassword,newPassword,confirmPassword) {
	this.oldPassword = oldPassword;
	this.newPassword = newPassword;
	this.confirmPassword = confirmPassword;
	this.json = function() {
		return JSON.stringify(this);
	};
}

var newPassword ="";

function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#compte-alert").length == 0) {
		$("header + hr").after(alert_box_template({"id" : "compte-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			$(document).foundation("alert"); // reload Foundation alert plugin for whole document (i.e. alert-box cannot be closed bug fix)
		}
		$("#compte-alert").fadeIn(300);
	}
}

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

function checkOldPassword(){
	if ($("#oldPassword").val().length == 0){
		setValidationIcon($("#oldPassword"),$("#oldPasswordError"),false);
	}else{
		setValidationIcon($("#oldPassword"),$("#oldPasswordError"),true);
	}
}

function checkConfirmPassword(){
	if ($("#confirmPassword").val().length == 0 || $("#confirmPassword").val() !== $("#newPassword").val()){
		setValidationIcon($("#confirmPassword"),$("#confirmPasswordError"),false);
	}else{
		setValidationIcon($("#confirmPassword"),$("#confirmPasswordError"),true);
	}
}

function isFormValid(){
	var isOldPasswordValid = !$("#oldPassword").attr("data-invalid");
	var isnewPasswordValid = !$("#newPassword").attr("data-invalid");
	var isConfirmPasswordValid = !$("#confirmPassword").attr("data-invalid");
	return isOldPasswordValid && isnewPasswordValid && isConfirmPasswordValid;
}

function clearForm(){
	$("#oldPassword").removeClass("valid");
	$("#oldPassword").val("");
	$("#newPassword").removeClass("valid");
	$("#newPassword").val("");
	$("#newPassword").attr("placeholder","Minimum 7 caractères, une minuscule et un chiffre");
	$("#confirmPassword").removeClass("valid");
	$("#confirmPassword").val("");
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getAccount(){
	var accountId = window.localStorage.getItem($oursesAccountId);
	if(accountId != null){
		$.ajax({
			type : "GET",
			url : "/rest/account/" + accountId,
			contentType : "application/json; charset=utf-8",
			beforeSend: function(request){
				header_authentication(request);
			},
			success : function(account, status, jqxhr) {
				var account_template = doT.compile(loadfile($app_root + "tmpl/updateAccount.tmpl")); // create template
				$("header + hr").after(account_template(account)); // process template
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

function checkPasswordAJAX(){
	if (typeof newPasswordTimeoutValid !== "undefined") {
		clearTimeout(newPasswordTimeoutValid);
	}
	var selector = $("#newPassword");
	setValidationIcon(selector,$("#passwordError"), null);
	var pseudo = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/password",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			newPasswordTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#newPasswordError"), true)}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				newPasswordTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#newPasswordError"), false)}, 500);
			}
		},
		dataType : "json"
	});
}

function submitAccountAJAX(){
	var bearAccount = new BearAccount($("#oldPassword").val(),$("#newPassword").val(),$("#confirmPassword").val());
	$.ajax({
		type : "PUT",
		url : "/rest/account/" + window.localStorage.getItem($oursesAccountId),
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		beforeSend: function(request){
			header_authentication(request);
		},
		success : function(jqXHR, status, errorThrown) {
			createAlertBox("success","Compte mis à jour avec succès");
			clearForm();
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403 || jqXHR.status == 409){
				checkOldPassword();
				checkConfirmPassword();
				checkPasswordAJAX();
			}else if(jqXHR.status == 401){
				setValidationIcon($("#oldPassword"),$("#oldPasswordError"),false);
				$("#oldPasswordError").html("Mot de passe incorrect");
				checkConfirmPassword();
				checkPasswordAJAX();
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	getAccount();
});
$("html").on("submit","#updateBearAccount",function(event){
	if (isFormValid()){
		submitAccountAJAX();
	}
});
$("html").on("keyup","#oldPassword",function(event){
	checkOldPassword();
});
$("html").on("keypress","#oldPassword", function(){
	setValidationIcon(this,$("#oldPasswordError"), null);
});

$("html").on("keyup","#newPassword",function(event){
	if ($(this).val() != newPassword){
		checkPasswordAJAX();
		newPassword = $(this).val();
	}
});
$("html").on("keypress","#newPassword", function(){
	setValidationIcon(this,$("#newPasswordError"), null);
});
$("html").on("focus","#newPassword", function(event){
	$(this).attr("placeholder", "");
	newPassword = $(this).val();
});
$("html").on("blur","#newPassword", function(event){
	if ($(this).val().length==0){
		$(this).attr("placeholder","Minimum 7 caractères, une minuscule et un chiffre");
	}
});
$("html").on("change","#newPassword", function(event){
	checkConfirmPassword();
});

$("html").on("keyup","#confirmPassword",function(event){
	checkConfirmPassword();
});
$("html").on("keypress","#confirmPassword", function(){
	setValidationIcon(this,$("#confirmPasswordError"), null);
});