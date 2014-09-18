/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var template = doT.compile(loadfile($app_root + "tmpl/article.tmpl"));

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
