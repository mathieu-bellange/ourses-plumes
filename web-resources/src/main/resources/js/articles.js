/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

//TODO externalisé
var short_article_tmpl = doT.compile(loadfile($app_root + "tmpl/shortArticle.tmpl"));
var articles_tmpl = doT.compile(loadfile($app_root + "tmpl/articles.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function deleteArticle(id) {
	$.ajax({
		type : "DELETE",
		url : "/rest/articles/" + id,
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(noData, status, jqxhr) {
			$(".validate button[data-delete='" + id + "']").parents("li").fadeOut("slow", function(){
				$(".validate button[data-delete='" + id + "']").parents("li").remove();
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404){
				$(".validate button[data-delete='" + id + "']").parents("li").fadeOut("slow", function(){
					$(".validate button[data-delete='" + id + "']").parents("li").remove();
				});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}
function validateArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/validate",
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-validate='" + id + "']").parents("li").fadeOut("slow", function(){
				$(".validate button[data-validate='" + id + "']").parents("li").remove();
				processAfterValidation(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404){
				createAlertBox($app_msg.article_deleted, "default");
				$(".validate button[data-validate='" + id + "']").parents("li").fadeOut("slow", function(){
					$(".validate button[data-validate='" + id + "']").parents("li").remove();
				});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}
function inValidateArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/invalidate",
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function(){
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterInValidation(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404){
				createAlertBox($app_msg.article_offcheck, "default");
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function(){
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}
function publishArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/publish",
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function(){
				$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				processAfterPublish(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404){
				createAlertBox($app_msg.article_offcheck, "default");
				$(".validate button[data-invalidate='" + id + "']").parents("li").fadeOut("slow", function(){
					$(".validate button[data-invalidate='" + id + "']").parents("li").remove();
				});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}
function recallArticle(id) {
	$.ajax({
		type : "PUT",
		url : "/rest/articles/" + id + "/recall",
		beforeSend: function(request){
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			$(".validate button[data-recall='" + id + "']").parents("li").fadeOut("slow", function(){
				$(".validate button[data-recall='" + id + "']").parents("li").remove();
				processAfterRecall(article);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404){
				createAlertBox($app_msg.article_offline, "default");
				$(".validate button[data-recall='" + id + "']").parents("li").fadeOut("slow", function(){
					$(".validate button[data-recall='" + id + "']").parents("li").remove();
				});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function displayArticles() {
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
			createAlertBox();
		},
		dataType : "json"
	});
}

function set_articles_filtering() {
	// Set filters list CSS
	$("#filters_list").css({"margin" : "0", "padding" : "0", "line-height" : "2.5rem", "height": "2.5rem"});
	$("#filters_list dd > a").css("cursor", "pointer");
	// Hide others drafts
	var user_name = window.localStorage.getItem($oursesUserPseudo);
	$("#articles_draft .author").each(function() {
		if ($(this).text() != user_name) {
			$(this).parents("li").addClass("other");
			$(this).parents("li").toggle();
		}
	});
	// Bind events
	$("html").on("click", "#filter_icon", function() {
		if (window.localStorage.getItem($oursesUserRole) !== $role_admin) {
			window.location.href = $login_page;
		}
		$("#filter_icon").toggleClass("active");
		$("#filter_icon").blur();
		$("#filters_list").toggle();
	});
	$("html").on("click", "#filters_list #others_drafts", function() {
		$(this).parent("dd").toggleClass("active");
		$(".draft .other").toggle();
	});
}

function processArticles(articles) {
	$("main > header").after(articles_tmpl(articles));
	$(document).foundation(); // reload all Foundation plugins
	loap.update(); // reload loap plugins
	set_articles_filtering(); // set articles filtering
	// Events
	$("html").on("mouseenter", ".href-block", function() {
		$(this).find(".validate").show();
	});
	$("html").on("mouseleave", ".href-block", function() {
		$(this).find(".validate").hide();
	});
	$(".validate button[data-delete]").click(function(){
		deleteArticle($(this).attr("data-delete"));
	});
	$(".validate button[data-validate]").click(function(){
		validateArticle($(this).attr("data-validate"));
	});
	$(".validate button[data-invalidate]").click(function(){
		inValidateArticle($(this).attr("data-invalidate"));
	});
	$(".validate button[data-publish]").click(function(){
		publishArticle($(this).attr("data-publish"));
	});
	$(".validate button[data-recall]").click(function(){
		recallArticle($(this).attr("data-recall"));
	});
}

function processAfterValidation(article) {
	$("#articles_standby").prepend(short_article_tmpl(article));
	$("#articles_standby li:first .validate button[data-invalidate]").click(function(){
		inValidateArticle($(this).attr("data-invalidate"));
	});
	$("#articles_standby li:first .validate button[data-publish]").click(function(){
		publishArticle($(this).attr("data-publish"));
	});
}

function processAfterInValidation(article) {
	$("#articles_draft").prepend(short_article_tmpl(article));
	$("#articles_draft li:first .validate button[data-validate]").click(function(){
		validateArticle($(this).attr("data-validate"));
	});
	$("#articles_draft li:first .validate button[data-delete]").click(function(){
		deleteArticle($(this).attr("data-delete"));
	});
}

function processAfterPublish(article) {
	$("#articles_publish").prepend(short_article_tmpl(article));
	$("#articles_publish li:first .validate button[data-recall]").click(function(){
		recallArticle($(this).attr("data-recall"));
	});
}

function processAfterRecall(article) {
	//mêmes étapes qu'une validation
	processAfterValidation(article);
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayArticles();
});
