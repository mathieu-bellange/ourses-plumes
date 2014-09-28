/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var template = doT.compile(loadfile($loc.tmpl + "article-view.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var share = (function() {
	return {
		init : function(options) {
			// vars
			var defaults = {
				"target" : "popup",             // String   Window type for the share plugin. Allowed values are "popup", "new" or "none". Default : "popup"
				"popup" : {                     // Object   Popup configuration.
					"menubar" : false,            // Boolean  Set menu bar visibility. Default : false
					"toolbar" : false,            // Boolean  Set tool bar visibility. Default : false
					"resizable" : true,           // Boolean  Allow popup resize. Default : true
					"scrollbars" : true,          // Boolean  Set scrollbars visibility. Default : true
					"width" : 500,                // Integer  Set popup width (px). Default : 500
					"height" : 320                // Integer  Set popup height (px). Default : 320
				}
			};
			var settings = $.extend({}, defaults, options);
			// events
			$(document).ready(function() {
				var article_url = window.location;
				var article_title = encodeURI($(".article h2.title").text());
				var article_summary = encodeURI($(".article p.summary").text());
				var article_source = encodeURI($org.name);
				var mail_href = "mailto:?subject=" + $org.name + encodeURI(" : ") + article_title + "&body=" + encodeURI("Quelqu'un vous a invité à lire ") + article_title + encodeURI(" sur ") + article_source + encodeURI(" : ") + article_url + encodeURI("\n\nBonne lecture !");
				$("#share_mail").attr("href", mail_href);
				var twitter_href = "https://twitter.com/share";
				$("#share_twitter").attr("href", twitter_href);
				var facebook_href = "https://www.facebook.com/share.php?u=" + article_url;
				$("#share_facebook").attr("href", facebook_href);
				var googleplus_href = "https://plus.google.com/share?url=" + article_url;
				$("#share_googleplus").attr("href", googleplus_href);
				var linkedin_href = "http://www.linkedin.com/shareArticle?mini=true&url=" + article_url + "&title=" + article_title + "&summary=" + article_summary + "&source=" + article_source;
				$("#share_linkedin").attr("href", linkedin_href);
				if (settings.target == "popup") {
					$("html").on("click", "#share_twitter, #share_facebook, #share_googleplus, #share_linkedin", function() {
						window.open(this.href, "", "menubar=" + (settings.popup.menubar ? "yes" : "no") + ",toolbar=" + (settings.popup.toolbar ? "yes" : "no") + ",resizable=" + (settings.popup.resizable ? "yes" : "no") + ",scrollbars=" + (settings.popup.scrollbars ? "yes" : "no") + ",width=" + settings.popup.width + ",height=" + settings.popup.height);
						return false;
					});
				} else if (settings.target == "new") {
					$("#share_twitter, #share_facebook, #share_googleplus, #share_linkedin").attr("target", "_blank");
				}
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayArticle() {
	$.ajax({
		type : "GET",
		url : "/rest" +  window.location.pathname,
		beforeSend: function(request) {
			header_authentication(request);
		},
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			processArticle(article);
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

function processArticle(article) {
	set_page_title(article.title);
	$("main > header").after(template(article));
	$("section").svg_icons(); // reload svg icons for whole section
	share.init();
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$(document).ready(function() {
	displayArticle();
});
