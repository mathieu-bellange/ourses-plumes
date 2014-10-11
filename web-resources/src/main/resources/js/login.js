/* ------------------------------------------------------------------ */
/* # Pre Processing */
/* ------------------------------------------------------------------ */

// set_page_title($nav.login.title);

/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

// $("main > header").after(doT.compile(loadfile($loc.tmpl + "login.tmpl")));

/* ------------------------------------------------------------------ */
/* # Files Loading */
/* ------------------------------------------------------------------ */

$.holdReady(true);
loadfile($loc.tmpl + "login.tmpl", function(response) {
	login_tmpl = doT.compile(response);
	$.holdReady(false);
});

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	/* Set page title */
	set_page_title($nav.login.title);
	/* Insert template */
	$("main > header").after(login_tmpl);
});

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

//var $accounts_redirection = "accounts"; //??????????????????

function Authentication(login, password){
	this.login = login;
	this.password = password;
	this.json = function() {
		return JSON.stringify(this);
	};
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function connection(){
	var authc = new Authentication($("#user_login").val(), $("#user_password").val());
	$.ajax({
		type : "POST",
		url : "/rest/authc",
		contentType : "application/json; charset=utf-8",
		data : authc.json(),
		success : function(authcUser, textStatus, jqXHR) {
			window.localStorage.setItem($auth.account_id, authcUser.accountId);
			window.localStorage.setItem($auth.profile_id, authcUser.profileId);
			window.localStorage.setItem($auth.token, authcUser.token);
			window.localStorage.setItem($auth.user_name, authcUser.pseudo);
			window.localStorage.setItem($auth.user_role, authcUser.role);
			window.localStorage.setItem($auth.avatar_path, authcUser.avatar);
			var redirection = window.location.search.replace($conf.redir_param, "");
			if (redirection != "") {
				window.location.href = redirection;
			} else {
				window.location.href = $nav.home.url;
			}
		},
		error : function(jqXHR, status, errorThrown) {
			var msg = (jqXHR.status == 401 ? "Login ou mot de passe incorrect" : $msg.error);
			if ($("#login-alert").length === 0) {
				createAlertBox(msg, "login_alert");
			} else {
				$("#login-alert > .text").text(msg);
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$("html").on("click", "#user_connection", function() {
	connection();
});