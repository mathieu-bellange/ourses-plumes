/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"account_create_tmpl" : $loc.tmpl + "account-create.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.account_create.title);
			/* Insert template */
			$(".main-body").append(file_pool.account_create_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function checkConfirmPassword() {
	if ($("#confirmPassword").val().length == 0 || $("#confirmPassword").val() !== $("#password").val()) {
		$("#confirmPassword").set_validation(false);
	} else {
		$("#confirmPassword").set_validation(true);
	}
}

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

function isFormValid() {
	var isPseudoValid = !$("#pseudo").attr("data-invalid");
	var isMailValid = !$("#mail").attr("data-invalid");
	var isPasswordValid = !$("#password").attr("data-invalid");
	var isConfirmPasswordValid = !$("#confirmPassword").attr("data-invalid");
	return isPseudoValid && isMailValid && isPasswordValid && isConfirmPasswordValid;
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function checkPseudoAJAX() {
	if (typeof pseudoTimeoutValid !== "undefined") {
		clearTimeout(pseudoTimeoutValid);
	}
	var selector = $("#pseudo");
	selector.set_validation();
	var pseudo = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/pseudo",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			pseudoTimeoutValid = setTimeout(function() {
				selector.set_validation(true);
			}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403) {
				pseudoTimeoutValid = setTimeout(function() {
					selector.set_validation(false);
				}, 500);
			}
		},
		dataType : "json"
	});
}

function checkPasswordAJAX() {
	if (typeof passwordTimeoutValid !== "undefined") {
		clearTimeout(passwordTimeoutValid);
	}
	var selector = $("#password");
	selector.set_validation();
	var pseudo = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/password",
		contentType : "application/json; charset=utf-8",
		data : pseudo,
		success : function(data, textStatus, jqXHR) {
			passwordTimeoutValid = setTimeout(function() {
				selector.set_validation(true);
			}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403) {
				passwordTimeoutValid = setTimeout(function() {
					selector.set_validation(false);
				}, 500);
			}
		},
		dataType : "json"
	});
}

function checkMailAJAX() {
	if (typeof mailTimeoutValid !== "undefined") {
		clearTimeout(mailTimeoutValid);
	}
	var selector = $("#mail");
	selector.set_validation();
	var mail = selector.val();
	$.ajax({
		type : "POST",
		url : "/rest/signup_check/mail",
		contentType : "application/json; charset=utf-8",
		data : mail,
		success : function(data, textStatus, jqXHR) {
			mailTimeoutValid = setTimeout(function() {
				selector.set_validation(true);
			}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403) {
				mailTimeoutValid = setTimeout(function() {
					selector.set_validation(false);
				}, 500);
			}
		},
		dataType : "json"
	});
}

function submitAccountAJAX() {
	var profile = new Profile($("#pseudo").val());
	var bearAccount = new BearAccount($("#mail").val(), $("#password").val(), profile);
	$.ajax({
		type : "PUT",
		url : "/rest/account/create",
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(jqXHR, status, errorThrown) {
			window.location.href = "/comptes";
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 403) {
				checkPseudoAJAX();
				checkPasswordAJAX();
				checkMailAJAX();
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

$("html").on("submit", "#bearAccount", function() {
	if (isFormValid()) {
		submitAccountAJAX();
	}
});
$("html").on("blur", "#pseudo", function() {
	var str = $(this).val().trim();
	$(this).val(str);
	checkPseudoAJAX();
});
$("html").on("keyup", "#pseudo", function() {
	checkPseudoAJAX();
});
$("html").on("keyup", "#mail", function() {
	checkMailAJAX();
});
$("html").on("keyup", "#password", function() {
	checkPasswordAJAX();
});
$("html").on("focus", "#password", function() {
	$(this).attr("placeholder", "");
});
$("html").on("blur", "#password", function() {
	if ($(this).val().length == 0) {
		$(this).attr("placeholder", "Minimum 7 caract&egrave;res dont une minuscule et un chiffre");
	}
});
$("html").on("keyup", "#confirmPassword", function() {
	checkConfirmPassword();
});
$("html").on("change", "#password", function() {
	checkConfirmPassword();
});
$("html").on("focus", "#pseudo, #mail, #password", function() {
	$(this).set_validation(null);
});
$("html").on("keypress", "#pseudo, #mail, #password", function() {
	$(this).set_validation();
});
// Password Visibility
$(document).on("click", "#password_visibility", function() {
	var u = $(this), o = $("#password");
	if (o.attr("type") == "password") {
		o.attr("type", "text");
		u.attr("title", $msg.password_hide);
		u.find("use").attr("xlink:href", "#icon-hide");
	} else {
		o.attr("type", "password");
		u.attr("title", $msg.password_show);
		u.find("use").attr("xlink:href", "#icon-show");
	}
	u.blur();
});
