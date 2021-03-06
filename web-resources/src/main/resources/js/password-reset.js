﻿/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"password_reset_tmpl" : $loc.tmpl + "password-reset.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.password_reset.title);
			/* Insert template */
			$(".main-body").append(file_pool.password_reset_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function check_email() {
	var q = $("#email");
	var c = function(s) { // custom condition
		return (s.match($regx.email));
	}
	q.check_validity(c, $msg.email_invalid);
	if (q.is_valid()) {
		submit_email(q.val());
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function submit_email(data) {
	$.ajax({
		type : "PUT",
		url : "/rest/account/" + encodeURI(data) + "/passwordReset",
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$("main > header").create_alert_box($msg.form_valid, null, {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert, "insert" : "after"}); // display form submit alert
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$("main > header").create_alert_box($msg.form_invalid, null, {"timeout" : $time.duration.alert_long, "insert" : "after"}); // display form invalid alert
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

$(document)
	// Data Handling
	.on("click", "#submit", function() {check_email()})
	.on("keydown", "#email", function(e) {if (e.which == 13) {$("#submit").click().focus()}});
