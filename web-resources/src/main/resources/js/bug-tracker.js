﻿/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("header + hr").after(loadfile($app_root + "tmpl/bug-tracker.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function GithubBug(title,body) {
	this.title = title;
	this.body = body;
	this.json = function() {
		return JSON.stringify(this);
	};
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

/* TEMP : to be removed */
$(".alert-box .close").on('click', function(event) {
	$(this).fadeOut(500);
});

$( "#new-bug" ).submit(function( event ) {
	if (document.getElementById("new-bug").checkValidity()){
		var clientBrowserLog = "\n--------------------------------\n" +
		"appName : " + navigator.appName + "\n" +
		"appCodeName : " + navigator.appCodeName + "\n" +
		"userAgent : " + navigator.userAgent + "\n" +
		"platform : " + navigator.platform + "\n" +
		"outerWidth : " + window.outerWidth + "\n" +
		"innerWidth : " + window.innerWidth,
		bug = new GithubBug($("#bug-title").val(),$("#bug-body").val() + clientBrowserLog);
		$.ajax({
			type: "POST",
			url: "/rest/github",
			data: bug.json(),
			contentType : "application/json; charset=utf-8",
			beforeSend: function(request){
				header_authentication(request);
			},
			success: function (data) {
				$("#bug-alert").remove("error");
				$("#bug-alert").addClass("success");
				$("#bug-alert-message").text("Le bug a été correctement créé");
				$("#bug-alert").fadeIn(500);
				$("#bug-title").val("");
				$("#bug-body").val("");
			},
			error: function(jqXHR, text, error){
				$("#bug-alert").remove("success");
				$("#bug-alert").addClass("error");
				$("#bug-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
				$("#bug-alert").fadeIn(500);
			},
			dataType : "json"
		});
	}
});
