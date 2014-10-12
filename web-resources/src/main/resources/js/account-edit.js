/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.account_edit.title);
			/* Insert template */
			$("main > header").after(file_pool.account_edit_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Files Loading */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"account_edit_tmpl" : $loc.tmpl + "account-edit.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function BearAccount(oldPassword, newPassword, confirmPassword) {
	this.oldPassword = oldPassword;
	this.newPassword = newPassword;
	this.confirmPassword = confirmPassword;
	this.json = function() {
		return JSON.stringify(this);
	};
}

var newPassword = "";

function checkOldPassword() {
	if ($("#oldPassword").val().length == 0) {
		$("#oldPassword").set_validation(false);
	}else{
		$("#oldPassword").set_validation(true);
	}
}

function checkConfirmPassword() {
	if ($("#confirmPassword").val().length == 0 || $("#confirmPassword").val() !== $("#newPassword").val()) {
		$("#confirmPassword").set_validation(false);
	}else{
		$("#confirmPassword").set_validation(true);
	}
}

function isFormValid() {
	var isOldPasswordValid = !$("#oldPassword").attr("data-invalid");
	var isnewPasswordValid = !$("#newPassword").attr("data-invalid");
	var isConfirmPasswordValid = !$("#confirmPassword").attr("data-invalid");
	return isOldPasswordValid && isnewPasswordValid && isConfirmPasswordValid;
}

function clearForm() {
	$("#oldPassword").removeClass("valid");
	$("#oldPassword").val("");
	$("#newPassword").removeClass("valid");
	$("#newPassword").val("");
	$("#newPassword").attr("placeholder", "Minimum 7 caractères, une minuscule et un chiffre");
	$("#confirmPassword").removeClass("valid");
	$("#confirmPassword").val("");
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getAccount() {
	var accountId = window.localStorage.getItem($auth.account_id);
	if(accountId != null) {
		$.ajax({
			type : "GET",
			url : "/rest/account/" + accountId,
			contentType : "application/json; charset=utf-8",
			beforeSend: function(request) {
				header_authentication(request);
			},
			success : function(account, status, jqxhr) {
				$("main > header").after(account_template(account)); // process template
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

function checkPasswordAJAX() {
	if (typeof newPasswordTimeoutValid !== "undefined") {
		clearTimeout(newPasswordTimeoutValid);
	}
	var selector = $("#newPassword");
	selector.set_validation(null);
	var pseudo = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/password",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			newPasswordTimeoutValid = setTimeout(function() {
				selector.set_validation(true);
			}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403) {
				newPasswordTimeoutValid = setTimeout(function() {
					selector.set_validation(false);
				}, 500);
			}
		},
		dataType : "json"
	});
}

function submitAccountAJAX() {
	var bearAccount = new BearAccount($("#oldPassword").val(),$("#newPassword").val(),$("#confirmPassword").val());
	$.ajax({
		type : "PUT",
		url : "/rest/account/" + window.localStorage.getItem($auth.account_id),
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(jqXHR, status, errorThrown) {
			createAlertBox($msg.account_updated, null, {"class" : "success"});
			clearForm();
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403 || jqXHR.status == 409) {
				checkOldPassword();
				checkConfirmPassword();
				checkPasswordAJAX();
			}else if(jqXHR.status == 401) {
				$("#oldPassword").set_validation(false, "Mot de passe incorrect");
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
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("submit","#updateBearAccount",function(event) {
	if (isFormValid()) {
		submitAccountAJAX();
	}
});
$("html").on("keyup","#oldPassword",function(event) {
	checkOldPassword();
});
$("html").on("keypress","#oldPassword", function() {
	$(this).set_validation(null);
});

$("html").on("keyup","#newPassword",function(event) {
	if ($(this).val() != newPassword) {
		checkPasswordAJAX();
		newPassword = $(this).val();
	}
});
$("html").on("keypress","#newPassword", function() {
	$(this).set_validation(null);
});
$("html").on("focus","#newPassword", function(event) {
	$(this).attr("placeholder", "");
	newPassword = $(this).val();
});
$("html").on("blur","#newPassword", function(event) {
	if ($(this).val().length==0) {
		$(this).attr("placeholder","Minimum 7 caractères, une minuscule et un chiffre");
	}
});
$("html").on("change","#newPassword", function(event) {
	checkConfirmPassword();
});

$("html").on("keyup","#confirmPassword",function(event) {
	checkConfirmPassword();
});
$("html").on("keypress","#confirmPassword", function() {
	$(this).set_validation(null);
});
