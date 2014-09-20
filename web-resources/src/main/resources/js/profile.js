/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var template = doT.compile(loadfile($app_root + "tmpl/profile.tmpl"));
var templateProfileArticles = doT.compile(loadfile($app_root + "tmpl/profile_article.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function processProfile(profile) {
	$("main > header").after(template(profile));
}

function processRole(role) {
	$(".user-role").text(role).fadeIn();
}

function processArticles(articles){
	articles.sort(function compare(a, b) {
		if (a.publishedDate > b.publishedDate)
			return -1;
		if (a.publishedDate < b.publishedDate)
			return 1;
		// a doit être égal à b
		return 0;
	});
	$("#articles").append(templateProfileArticles(articles));
	attach_slider(); // bind events on sliding elements
	loap.update();
}

function sortSocialLinks(links) {
	links.sort(function(a, b) {
		if (a.name > b.name) {
			return 1;
		}
		if (a.name < b.name) {
			return -1;
		}
		// a doit être égale à b
		return 0;
	});
}

function attach_slider(attachee) {
	var attachee = attachee || ".related-list";
	var triggerer = ".info-tip";
	var triggered = ".summary";
	$(attachee).on("click", triggerer, function() {
		var obj = $(this);
		if (obj.data("is_sliding") !== "true") {
			obj.data("is_sliding", "true");
			obj.toggleClass("active");
			obj.next(triggered).slideToggle(250, function() {
				obj.removeData("is_sliding");
			});
		}
	});
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayProfile() {
	var path = window.location.pathname.replace("/profils","");
	$.ajax({
		type : "GET",
		url : "/rest/profile" +  path,
		contentType : "application/json; charset=utf-8",
		success : function(profile, status, jqxhr) {
			processProfile(profile);
			displayRole(profile.pseudoBeautify);
			displayArticles(profile.id);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404){
				$("main > header").after(doT.compile(loadfile($app_root + "tmpl/error.tmpl")));
			} else {
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function displayRole(pseudo) {
	$.ajax({
		type : "GET",
		url : "/rest/profile/" + pseudo + "/authz",
		contentType : "application/json; charset=utf-8",
		success : function(role, status, jqxhr) {
			processRole(role);
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "text"
	});
}

function displayArticles(profileId){
	$.ajax({
		type : "GET",
		url : "/rest/profile/" + profileId + "/articles",
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			processArticles(JSON.parse(articles));
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "text"
	});
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayProfile();
});
