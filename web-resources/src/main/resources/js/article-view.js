﻿/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Process */
			displayArticle();
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Files Loading */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"article_view_tmpl" : $loc.tmpl + "article-view.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var share = (function() {
	return {
		init : function(options) {
			// vars
			var addr = []; // internal
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
			// methods
			function open_box(obj, d) {
				var w = obj.outerWidth();
				var h = obj.outerHeight();
				obj.css({"width" : 0, "height" : 0, "opacity" : 0}); // reset CSS values to default on completion
				obj.children().not(".error").hide(); // hide children except error
				obj.show().animate({"width" : w, "height" : h, "opacity" : 1 }, $conf.js_fx ? d : 0, function() {
					obj.children().not(".error").show(); // show children except error
					obj.css({"width" : "", "height" : "",}); // reset CSS values to default on completion
					obj.find("input").first().focus(); // focus first field
				});
			}
			function close_box(obj, d) {
				obj.fadeOut($conf.js_fx ? d : 0);
			}
			// events
			$(document).ready(function() {
				var article_url = encodeURI(window.location).replace("?", "%3F");
				var article_title = encodeURI($(".article h2.title").text()).replace("?", "%3F");
				var article_summary = encodeURI($(".article p.summary").text()).replace("?", "%3F");
				var article_source = encodeURI($org.name).replace("?", "%3F");
				$("#share_mail").on("click", function() {
					if ($(this).next(".send-box").is(":hidden")) {
						$(this).next(".send-box").find("input").first().set_validation(true); // reset validation
						$(this).next(".send-box").find("input").first().removeClass("valid"); // reset validation
						$(this).next(".send-box").find("input").first().val(""); // reset value
						open_box($(this).next(".send-box"), settings.fx_d);
					} else {
						close_box($(this).next(".send-box"), settings.fx_d);
					}
				});
				$(".send-box").parent().css("position", "relative");
				$(".send-box .close").on("click", function() {
					close_box($(this).parent(".send-box"), settings.fx_d)
				});
				$(".send-box input").on("keydown", function(e) {
					var email = $(this).val().trim().toLowerCase();
					if (e.which == 13) { // Enter
						$(this).val(email); // format value
						if (email == 0) {
							$(this).set_validation(false, $msg.email_empty);
						} else if ($regx.email.test(email)) {
							if (addr.indexOf(email) == -1) {
								addr.push(email); // register email to prevent multiple sending
								$(this).set_validation(true);
								shareByMail($("#share_mail").attr("data-article"), email); // send email
								close_box($("#share_mail").next(".send-box"), settings.fx_d);
							} else { // email has already been sent
								$(this).set_validation(false, $msg.email_dup);
							}
						} else { // email syntax is invalid
							$(this).set_validation(false, $msg.email_invalid);
						}
					} else if (e.which == 27) { // Esc
						close_box($(this).parent(".send-box"), settings.fx_d);
					} else { // reset validation
						$(this).set_validation(true, null, {"cls_valid" : null});
						$(this).removeClass("valid");
					}
				});
				var twitter_href = "https://twitter.com/share";
				$("#share_twitter").attr("href", twitter_href);
				var facebook_href = "https://www.facebook.com/share.php?u=" + article_url;
				$("#share_facebook").attr("href", facebook_href);
				var googleplus_href = "https://plus.google.com/share?url=" + article_url;
				$("#share_googleplus").attr("href", googleplus_href);
				var linkedin_href = "http://www.linkedin.com/shareArticle?mini=true&url=" + article_url + "&title=" + article_title + "&summary=" + article_summary + "&source=" + article_source;
				$("#share_linkedin").attr("href", linkedin_href);
				if (settings.target == "popup") {
					$("#share_twitter, #share_facebook, #share_googleplus, #share_linkedin").on("click", function() {
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

function shareByMail(articleId, mail){
	$.ajax({
		type : "PUT",
		data : mail,
		url : "/rest/articles/" + articleId + "/share",
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			createAlertBox($msg.email_sent, null, {"class" : "success"});
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

function processArticle(article) {
	set_page_title(article.title);
	$("main > header").after(file_pool.article_view_tmpl(article)).after(lb(1));
	$("section").svg_icons(); // reload svg icons for whole section
	share.init(); // initialize share module
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
