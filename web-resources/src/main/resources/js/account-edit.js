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
var accountTimer = 1;

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
				$(".main-body").append(file_pool.account_edit_tmpl(account)).after(lb(1));
				$("section").svg_icons(); // reload svg icons for whole section
			},
			error : function(jqXHR, status, errorThrown) {
				if (jqXHR.status == 503){
					setTimeout(function(){
						accountTimer = accountTimer * 10;
						getAccount();
						}, accountTimer);
					
				}
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

function deleteEvent(id, val) {
	var val = val || false;
	$.ajax({
		type : "DELETE",
		url : "/rest/account/" + id + "?deleteArticles=" + val.toString(),
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(data, status, jqxhr) {
			createAlertBox($msg.account_deleted, "delete_" + id, {"class" : "warning", "timeout" : $time.duration.alert});
			clearStorage();
			UserSession.delete();
			location.href = $nav.home.url;
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		}
	});
};

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("click", "a#delete_account", function() {
	var id = UserSession.getAccountId();
	if ($conf.confirm_delete.account) {
		// Confirm Delete Account
		var f = $msg.confirm_delete.account_articles, p = ["vos", ""];
		var l = {
			"input" : f.input_p.sprintf(p),
			"label" : f.label_p.sprintf(p),
			"helpz" : f.helpz_p.sprintf(p)
		};
		var m = {
			"text" : $msg.confirm_delete.my_account,
			"class" : "panel radius",
			"extra" : file_pool.delete_account_articles_tmpl(l),
			"on_confirm" : function() {
				deleteEvent(id, ($("#delete_account_articles").is(":checked") ? true : false)); // delete account
			}
		};
		$("#articles").create_confirmation_modal(m);
	} else {
		deleteEvent(id) // delete account
	}
});

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
