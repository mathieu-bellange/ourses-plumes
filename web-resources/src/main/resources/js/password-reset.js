/* ------------------------------------------------------------------ */
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
			$("main > header").after(file_pool.password_reset_tmpl).after(lb(1));
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
	} else {
		$("main > header").create_alert_box($msg.form_invalid, null, {"timeout" : $time.duration.alert_long}); // display form invalid alert
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function submit_email(data) {
	////////////////////////////////////////////////////////////////
	// TODO
	////////////////////////////////////////////////////////////////
	// AJAX : send password by mail
	// - on fail, display error
	// - on success, send email and display submit confirmation
	////////////////////////////////////////////////////////////////
	$("main > header").create_alert_box($msg.form_valid, null, {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert}); // display form submit alert
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$(document)
	// Data Handling
	.on("click", "#submit", function() {check_email()})
	.on("keydown", "#email", function(e) {if (e.which == 13) {$("#submit").click().focus()}});
