/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("header + hr").after(doT.compile(loadfile($app_root + "tmpl/login.tmpl")));

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
		success : function(token, textStatus, jqXHR) {
			window.localStorage.setItem($oursesAuthcToken, token.token);
			if (window.location.search !== undefined){
				var redirection = window.location.search.replace($redir_param,"");
				if (redirection == $accounts_redirection){
					window.location.href = $accounts_page;
				}
			}
		},
		error : function(jqXHR, status, errorThrown) {
			var msg;
			if (jqXHR.status == 401){
				msg = "Login ou mot de passe incorrect";
			}else{
				msg = $err_msg.err_default;
			}
			if ($("#login-alert").length == 0) {
				$("#loginForm").prepend(alert_box_template({id: "login-alert", class: "error", text: msg}));
				$("#loginForm").foundation("alert");
				$("#login-alert").fadeIn(300);
			} else {
				$("#login-alert > span").html(msg);
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