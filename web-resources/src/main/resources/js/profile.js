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

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayProfile(){
	var path = window.location.pathname.replace("/profils","");
	alert(path);
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
