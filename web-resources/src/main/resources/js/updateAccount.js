/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#compte-alert").length == 0) {
		$("header + hr").after(alert_box_template({"id" : "compte-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			$("header + hr").foundation("alert");
		}
		$("#compte-alert").fadeIn(300);
	}
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

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	getAccount();
});