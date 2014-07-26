/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */
function displayArticles(){
	$.ajax({
		type : "GET",
		url : "/rest/articles",
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			var brouillons = articles.filter(function(n){
				return n.status === "BROUILLON";
			});
			var aVerifier = articles.filter(function(n){
				return n.status === "AVERIFIER";
			});
			var enLigne = articles.filter(function(n){
				return n.status === "ENLIGNE";
			});
			enLigne.sort(function compare(a, b) {
				  if (a.publishedDate > b.publishedDate)
					     return -1;
					  if (a.publishedDate < b.publishedDate)
					     return 1;
					  // a doit être égal à b
					  return 0;
					});
			processArticles({"drafts":brouillons,"toCheck":aVerifier,"onLine":enLigne});
		},
		error : function(jqXHR, status, errorThrown) {
		},
		dataType : "json"
	});
}

function processArticles(articles){
	var articles_tmpl = doT.compile(loadfile($app_root + "tmpl/articles.tmpl"));
	$("header + hr").after(articles_tmpl(articles));
}
// AJAX stuff goes here

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
$(document).ready(function() {
	displayArticles();
});
