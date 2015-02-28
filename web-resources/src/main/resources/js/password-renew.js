/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"password_renew_tmpl" : $loc.tmpl + "password-renew.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.password_renew.title);
			/* Insert template */
			$(".main-body").append(file_pool.password_renew_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function BearAccount(newPassword, confirmPassword, mail) {
	this.mail = mail;
	this.newPassword = newPassword;
	this.confirmPassword = confirmPassword;
	this.json = function() {
		return JSON.stringify(this);
	};
}

var newPassword = "";

function checkConfirmPassword() {
	if ($("#confirmPassword").val().length == 0 || $("#confirmPassword").val() !== $("#newPassword").val()) {
		$("#confirmPassword").set_validation(false);
	} else {
		$("#confirmPassword").set_validation(true);
	}
}

function isFormValid() {
	var isnewPasswordValid = !$("#newPassword").attr("data-invalid");
	var isConfirmPasswordValid = !$("#confirmPassword").attr("data-invalid");
	return isnewPasswordValid && isConfirmPasswordValid;
}

function clearForm() {
	$("#newPassword").set_validation(null);
	$("#newPassword").val("");
	$("#confirmPassword").set_validation(null);
	$("#confirmPassword").val("");
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

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
	var bearAccount = new BearAccount($("#newPassword").val(),$("#confirmPassword").val(), $("#mail").val());
	var id = location.search;
	$.ajax({
		type : "PUT",
		url : "/rest/account/" + bearAccount.mail + "/renew" + id,
		contentType : "application/json; charset=utf-8",
		data : encodeURI(bearAccount.newPassword),
		success : function(jqXHR, status, errorThrown) {
			createAlertBox($msg.account_updated, null, {"class" : "success", "timeout" : $time.duration.alert});
			clearForm();
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403) {
				createAlertBox("L'identification a échoué, le mot de passe n'a pas pu être changé", null, {"class" : "error", "timeout" : $time.duration.alert});
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

$("html").on("focus", "#newPassword, #confirmPassword", function() {
	$(this).set_validation(null);
});
$("html").on("keypress", "#newPassword, #confirmPassword", function() {
	$(this).set_validation();
});
