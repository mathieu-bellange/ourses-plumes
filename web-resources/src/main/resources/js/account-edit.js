/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"account_edit_tmpl" : $loc.tmpl + "account-edit.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.account_edit.title);
		},
		init : function() {
			getAccount();
		}
	}
}());

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
	} else {
		$("#oldPassword").set_validation(true);
	}
}

function checkConfirmPassword() {
	if ($("#confirmPassword").val().length == 0 || $("#confirmPassword").val() !== $("#newPassword").val()) {
		$("#confirmPassword").set_validation(false);
	} else {
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
	$("#oldPassword").set_validation(null);
	$("#oldPassword").val("");
	$("#newPassword").set_validation(null);
	$("#newPassword").val("");
	$("#confirmPassword").set_validation(null);
	$("#confirmPassword").val("");
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getAccount() {
	var accountId = UserSession.getAccountId();
	if(accountId != null) {
		$.ajax({
			type : "GET",
			url : "/rest/account/" + accountId,
			contentType : "application/json; charset=utf-8",
			beforeSend : function(request) {
				header_authentication(request);
			},
			success : function(account, status, jqxhr) {
				$("main > header").after(file_pool.account_edit_tmpl(account)).after(lb(1));
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

function checkPasswordAJAX() {
	if (typeof newPasswordTimeoutValid !== "undefined") {
		clearTimeout(newPasswordTimeoutValid);
	}
	var selector = $("#newPassword");
	selector.set_validation();
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
		url : "/rest/account/" + UserSession.getAccountId(),
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		beforeSend : function(request) {
			header_authentication(request);
		},
		success : function(jqXHR, status, errorThrown) {
			createAlertBox($msg.account_updated, null, {"class" : "success", "timeout" : $time.duration.alert});
			clearForm();
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403 || jqXHR.status == 409) {
				checkOldPassword();
				checkConfirmPassword();
				checkPasswordAJAX();
			} else if (jqXHR.status == 401) {
				$("#oldPassword").set_validation(false, "Mot de passe incorrect");
				checkConfirmPassword();
				checkPasswordAJAX();
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("submit", "#updateBearAccount", function() {
	if (isFormValid()) {
		submitAccountAJAX();
	}
});
$("html").on("keyup", "#oldPassword", function() {
	checkOldPassword();
});
$("html").on("keyup", "#confirmPassword", function() {
	checkConfirmPassword();
});
$("html").on("keyup", "#newPassword", function() {
	if ($(this).val() != newPassword) {
		checkPasswordAJAX();
		newPassword = $(this).val();
	}
});
$("html").on("change", "#newPassword", function() {
	checkConfirmPassword();
});
$("html").on("focus", "#newPassword", function() {
	newPassword = $(this).val();
});

$("html").on("focus", "#oldPassword, #newPassword, #confirmPassword", function() {
	$(this).set_validation(null);
});
$("html").on("keypress", "#oldPassword, #newPassword, #confirmPassword", function() {
	$(this).set_validation();
});
