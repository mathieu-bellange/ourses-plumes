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
		},
		error : function(jqXHR, status, errorThrown) {		
			if (jqXHR.status == 404){
				// TODO créer un template not found dans les cas où on récupère une erreur 404
				alert("non trouvé - tmpl 404 à faire ?")
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function processArticle(article){
	$("header + hr").after(template(article));
}
/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayArticle();
});
