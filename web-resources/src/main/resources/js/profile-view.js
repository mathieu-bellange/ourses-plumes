/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

// var template = doT.compile(loadfile($loc.tmpl + "profile-view.tmpl"));
// var templateProfileArticles = doT.compile(loadfile($loc.tmpl + "profile-article-list.tmpl"));

/* ------------------------------------------------------------------ */
/* # Files Loading */
/* ------------------------------------------------------------------ */

$.holdReady(true);
loadfile($loc.tmpl + "profile-view.tmpl", function(response) {
	profile_view_tpml = doT.compile(response);
	$.holdReady(false);
});

$.holdReady(true);
loadfile($loc.tmpl + "profile-article-list.tmpl", function(response) {
	profile_view_related_tpml = doT.compile(response);
	$.holdReady(false);
});

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	displayProfile();
});

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function processProfile(profile) {
	set_page_title(profile.pseudo);
	$("main > header").after(profile_view_tpml(profile));
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
	$("#articles").append(profile_view_related_tpml(articles));
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
			if ($conf.js_fx) {
				obj.next(triggered).slideToggle(250, function() {
					obj.removeData("is_sliding");
				});
			} else {
				obj.next(triggered).toggle();
				obj.removeData("is_sliding");
			}
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
		url : "/rest/profile" + path,
		contentType : "application/json; charset=utf-8",
		success : function(profile, status, jqxhr) {
			processProfile(profile);
			displayRole(profile.pseudoBeautify);
			displayArticles(profile.id);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$("main > header").after(doT.compile(loadfile($loc.tmpl + "error.tmpl")));
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

function displayArticles(profileId) {
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
/* # Live Events */
/* ------------------------------------------------------------------ */

// $(document).ready(function() {
	// displayProfile();
// });
