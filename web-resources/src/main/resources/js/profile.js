/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var template = doT.compile(loadfile($app_root + "tmpl/profile.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function processProfile(profile){
	$("main > header").after(template(profile));
	loap.update();
}

function sortSocialLinks(links){
	links.sort(function(a, b) {
	    if (a.name > b.name)
	      return 1;
	    if (a.name < b.name)
	      return -1;
	    // a doit être égale à b
	    return 0;
	});
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayProfile(){
	var path = window.location.pathname.replace("/profils","");
	$.ajax({
		type : "GET",
		url : "/rest/profile" +  path,
		contentType : "application/json; charset=utf-8",
		success : function(profile, status, jqxhr) {
			processProfile(profile);
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

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayProfile();
});
