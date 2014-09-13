/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var template = doT.compile(loadfile($app_root + "tmpl/article.tmpl"));

function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#article-alert").length == 0) {
		$("main > header").after(alert_box_template({"id" : "article-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			$(document).foundation("alert"); // reload Foundation alert plugin for whole document (i.e. alert-box cannot be closed bug fix)
		}
		$("#article-alert").fadeIn(300);
	}
}

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayArticle(){
	$.ajax({
		type : "GET",
		url : "/rest" +  window.location.pathname,
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			processArticle(article);
			loap.update(); // reload all loap plugins for whole document
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404){
				$("main > header").after(doT.compile(loadfile($app_root + "tmpl/error.tmpl")));
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function processArticle(article){
	$("main > header").after(template(article));
}
/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayArticle();
});
