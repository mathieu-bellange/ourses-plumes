﻿/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"error_tmpl" : $loc.tmpl + "error.tmpl",
	"profile_view_tpml" : $loc.tmpl + "profile-view.tmpl",
	"related_list_tmpl" : $loc.tmpl + "related-list.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			displayProfile();
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function processProfile(profile) {
	/* Set page title */
	set_page_title(profile.pseudo);
	/* Insert template */
	$(".main-body").append(file_pool.profile_view_tpml(profile)).after(lb(1));
}

function processRole(role) {
	$conf.js_fx ? $(".user-role").html(role).fadeIn(500) : $(".user-role").html(role).show();
}

function processArticles(articles) {
	articles.sort(function compare(a, b) {
		if (a.publishedDate > b.publishedDate)
			return -1;
		if (a.publishedDate < b.publishedDate)
			return 1;
		// a doit être égal à b
		return 0;
	});
	$("#articles").append(file_pool.related_list_tmpl(articles)).append(lb(1));
	list_overview.init(".related-list"); // initialize list overview component
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

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */
var profileTimer = 1;
function displayProfile() {
	var path = window.location.pathname.replace("/profils","");
	$.ajax({
		type : "GET",
		url : "/rest/profile" + path,
		contentType : "application/json; charset=utf-8",
		success : function(profile, status, jqxhr) {
			processProfile(profile);
			displayRole(profile.pseudoBeautify);
			displayArticles(profile.id);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$(".main-body").append(file_pool.error_tmpl).after(lb(1));
			}else if (jqXHR.status == 503){
				setTimeout(function(){
					profileTimer = profileTimer * 10;
					displayProfile();
				}, profileTimer);
			}
		},
		dataType : "json"
	});
}
var roleTimer = 1;
function displayRole(pseudo) {
	$.ajax({
		type : "GET",
		url : "/rest/profile/" + pseudo + "/authz",
		contentType : "application/json; charset=utf-8",
		success : function(role, status, jqxhr) {
			processRole(role);
		},
		error : function(jqXHR, status, errorThrown) {
			 if (jqXHR.status == 503){
					setTimeout(function(){
						roleTimer = roleTimer * 10;
						displayRole(pseudo);
					}, roleTimer);
			 }
		},
		dataType : "text"
	});
}
var articlesTimer = 1;
function displayArticles(profileId) {
	$.ajax({
		type : "GET",
		url : "/rest/profile/" + profileId + "/articles",
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			processArticles(JSON.parse(articles));
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 503){
				setTimeout(function(){
					articlesTimer = articlesTimer * 10;
					displayArticles(profileId);
				}, articlesTimer);
		 }
		},
		dataType : "text"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
