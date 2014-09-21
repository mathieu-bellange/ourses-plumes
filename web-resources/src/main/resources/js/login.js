/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("main > header").after(doT.compile(loadfile($app_root + "tmpl/login.tmpl")));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var $accounts_redirection = "accounts";

function Authentication(login,password){
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
	var authc = new Authentication($("#user_login").val(),$("#user_password").val());
	$.ajax({
		type : "POST",
		url : "/rest/authc",
		contentType : "application/json; charset=utf-8",
		data : authc.json(),
		success : function(authcUser, textStatus, jqXHR) {
			window.localStorage.setItem($oursesAccountId, authcUser.accountId);
			window.localStorage.setItem($oursesProfileId, authcUser.profileId);
			window.localStorage.setItem($oursesAuthcToken, authcUser.token);
			window.localStorage.setItem($oursesUserPseudo, authcUser.pseudo);
			window.localStorage.setItem($oursesUserRole, authcUser.role);
			window.localStorage.setItem($oursesAvatarPath, authcUser.avatar);
			var redirection = window.location.search.replace($redir_param, "");
			if (redirection != ""){
				window.location.href = redirection;
			}else{
				window.location.href = $home_page;
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 401){
				var msg = "Login ou mot de passe incorrect";
			} else {
				var msg = $err_msg.err_default;
			}
			if ($("#login-alert").length === 0) {
				createAlertBox(msg, "alert", "login-alert", true);
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

$("#user_connection").on("click", function() {
	connection();
});