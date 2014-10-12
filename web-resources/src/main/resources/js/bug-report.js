/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"bug_report_tmpl" : $loc.tmpl + "bug-report.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.bug_report.title);
			/* Insert template */
			$("main > header").after(file_pool.bug_report_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function GithubBug(title, body) {
	this.title = title;
	this.body = body;
	this.json = function() {
		return JSON.stringify(this);
	};
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("submit", "#new-bug", function() {
	if ($("#bug-title").val() != "" && $("#bug-body").val() != "") {
		var clientBrowserInfos = "\n***\n" +
		"- appName : *" + navigator.appName + "*\n" +
		"- appCodeName : *" + navigator.appCodeName + "*\n" +
		"- userAgent : *" + navigator.userAgent + "*\n" +
		"- platform : *" + navigator.platform + "*\n" +
		"- outerWidth : *" + window.outerWidth + "*\n" +
		"- innerWidth : *" + window.innerWidth + "*",
		bug = new GithubBug($("#bug-title").val(), $("#bug-body").val() + clientBrowserInfos);
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
				$conf.js_fx ? $("#bug-alert").fadeIn(500) : $("#bug-alert").show();
				$("#bug-title").val("");
				$("#bug-body").val("");
			},
			error: function(jqXHR, text, error){
				$("#bug-alert").remove("success");
				$("#bug-alert").addClass("error");
				$("#bug-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
				$conf.js_fx ? $("#bug-alert").fadeIn(500) : $("#bug-alert").show();
			},
			dataType : "json"
		});
	}
});
