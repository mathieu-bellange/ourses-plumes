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

function checkField(obj) {
	var str = obj.val().trim();
	obj.val(str);
	if (str.length == 0) {
		obj.set_validation(false);
		return false;
	} else {
		obj.set_validation(true);
		return true;
	}
}

function isFormValid() {
	var isTitleValid = checkField($("#bug_title"));
	var isBodyValid = checkField($("#bug_body"));
	return isTitleValid && isBodyValid;
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function submitBugAJAX(title, body) {
	var clientBrowserInfos = "\n***\n" +
	"- appName : *" + navigator.appName + "*\n" +
	"- appCodeName : *" + navigator.appCodeName + "*\n" +
	"- userAgent : *" + navigator.userAgent + "*\n" +
	"- platform : *" + navigator.platform + "*\n" +
	"- outerWidth : *" + window.outerWidth + "*\n" +
	"- innerWidth : *" + window.innerWidth + "*",
	bug = new GithubBug(title, body + clientBrowserInfos);
	$.ajax({
		type : "POST",
		url : "/rest/github",
		data : bug.json(),
		contentType : "application/json; charset=utf-8",
		beforeSend : function(request){
			header_authentication(request);
		},
		success : function (data) {
			createAlertBox("Le rapport de bug a &eacute;t&eacute; envoy&eacute; !", "report_alert", {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert});
			$("#bug_title").val("");
			$("#bug_body").val("");
		},
		error : function(jqXHR, text, error){
			createAlertBox();
		},
		complete : function() {
			setTimeout(function() {
				$("[type='submit']").prop("disabled", false);
			}, $time.duration.check);
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("submit", "#new_bug", function() {
	if (isFormValid()) {
		$("[type='submit']").prop("disabled", true);
		submitBugAJAX($("#bug_title").val(), $("#bug_body").val());
	} else {
		createAlertBox($msg.form_invalid, "report_alert", {"timeout" : $time.duration.alert});
	}
});
$("html").on("focus", "#bug_title, #bug_body", function() {
	$(this).set_validation(null);
});
$("html").on("blur", "#bug_title, #bug_body", function() {
	checkField($(this));
});
