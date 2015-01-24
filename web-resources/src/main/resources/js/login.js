/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"login_tmpl" : $loc.tmpl + "login.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.login.title);
			/* Insert template */
			$("main > header").after(file_pool.login_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

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
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			//document.cookie=$auth.is_authenticated + "=true;";
			docCookies.setItem($auth.is_authenticated,true,tomorrow, "/");
			docCookies.setItem($auth.user_role, authcUser.role,tomorrow, "/");
			docCookies.setItem($auth.user_name, authcUser.pseudo,tomorrow, "/");
			docCookies.setItem($auth.token_id, authcUser.tokenId,tomorrow, "/");
			docCookies.setItem($auth.avatar_path, authcUser.avatar,tomorrow, "/");
			var redirection = window.location.search.replace($conf.redir_param, "");
			if (redirection != "") {
				window.location.href = redirection;
			} else {
				window.location.href = $nav.home.url;
			}
		},
		error : function(jqXHR, status, errorThrown) {
			var msg = (jqXHR.status == 401 ? "Login ou mot de passe incorrect" : $msg.error);
			if ($("#login-alert").length == 0) {
				createAlertBox(msg, "login_alert", {"timeout" : $time.duration.alert});
			} else {
				$("#login-alert > .text").text(msg);
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("click", "#user_connection", function() {
	connection();
});
