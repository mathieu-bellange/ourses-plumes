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
			brouillons.sort(function compare(a, b) {
				// si pas d'update, on test la date de création
				var aDate = a.updatedDate;
				var bDate = b.updatedDate;
				if (a.updatedDate === null){
					aDate = a.createdDate;
				}
				if (b.updatedDate === null){
					bDate = b.createdDate;
				}
				
				if (aDate > bDate)
					return -1;
				if (aDate < bDate)
					return 1;
				// a doit être égal à b
				return 0;
			});
			var aVerifier = articles.filter(function(n){
				return n.status === "AVERIFIER";
			});
			aVerifier.sort(function compare(a, b) {
				if (a.updatedDate > b.updatedDate)
					return -1;
				if (a.updatedDate < b.updatedDate)
					return 1;
				// a doit être égal à b
				return 0;
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
	$("main > header").after(articles_tmpl(articles));
	$(document).foundation(); // reload all Foundation plugins
	// Events
	$("html").on("mouseenter", ".href-block", function() {
		$(this).find(".validate").show();
	});
	$("html").on("mouseleave", ".href-block", function() {
		$(this).find(".validate").hide();
	});
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
$(document).ready(function() {
	displayArticles();
});
