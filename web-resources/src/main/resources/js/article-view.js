/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"error_tmpl" : $loc.tmpl + "error.tmpl",
	"article_view_tmpl" : $loc.tmpl + "article-view.tmpl",
	"related_list_tmpl" : $loc.tmpl + "related-list.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/*
			setup_api("facebook"); // insert external API
			// ---------------------------------------------------------------
			// # Facebook Application Initialization
			// ---------------------------------------------------------------
			// https://developers.facebook.com/apps/1076087169072990/ // Les Ourses à plumes
			// https://developers.facebook.com/apps/1576895285917760/ // Les Ourses à plumes [dev]
			// https://developers.facebook.com/apps/1576896615917627/ // Les Ourses à plumes [test] (from dev)
			// ---------------------------------------------------------------
			window.fbAsyncInit = function() {
				FB.init({
					appId      : 1076087169072990, // Les Ourses à plumes (i.e. for rtw)
					// appId      : 1576895285917760, // Les Ourses à plumes [dev] (i.e. for www)
					// appId      : 1576896615917627, // Les Ourses à plumes [test] (i.e. for localhost)
					status     : true,
					xfbml      : true,
					version    : "v2.3"
				});
			};
			*/
			displayArticle(); // process article
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var share = (function() {
	return {
		init : function(options) {
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
			function close_box(obj, d) {obj.fadeOut($conf.js_fx ? d : 0)}
			$(document).ready(function() {
				var article_url = encodeURI(window.location).replace("?", "%3F");
				var article_title = encodeURI($(".article h2.title").text()).replace("?", "%3F");
				var article_summary = encodeURI($(".article p.summary").text()).replace("?", "%3F");
				var article_source = encodeURI($org.name).replace("?", "%3F");
				$("#share_mail").on("click", function() {
					if ($(this).next(".spring-box").is(":hidden")) {
						$(this).next(".spring-box").find("input").first().set_validation(null); // reset validation
						$(this).next(".spring-box").find("input").first().val(""); // reset value
						open_box($(this).next(".spring-box"), settings.fx_d);
					} else {
						close_box($(this).next(".spring-box"), settings.fx_d);
					}
				});
				$(".spring-box").parent().css("position", "relative");
				$(".spring-box .close").on("click", function() {
					close_box($(this).parent(".spring-box"), settings.fx_d)
				});
				$(".spring-box input").on("keydown", function(e) {
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
								close_box($("#share_mail").next(".spring-box"), settings.fx_d);
							} else { // email has already been sent
								$(this).set_validation(false, $msg.email_dup);
							}
						} else { // email syntax is invalid
							$(this).set_validation(false, $msg.email_invalid);
						}
					} else if (e.which == 27) { // Esc
						close_box($(this).parent(".spring-box"), settings.fx_d);
					} else {
						$(this).set_validation(null); // reset validation
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
				/*
				$(document).on("click", "#share_facebook", function() {
					// -----------------------------------------------------------
					// # Facebook Dialog Feed
					// -----------------------------------------------------------
					FB.ui({
						method      : "feed",
						name        : $(".article h2.title").text(),                              // title of the link
						link        : window.location.toString(),                                 // url of the link (canonical)
						picture     : $org.domain + $img.pub + "loap_share_picture.jpg",          // url of the image
						caption     : $org.name,                                                  // source caption of the link (i.e. website)
						description : $(".article p.summary").text()                              // description of the link
					});
					// -----------------------------------------------------------
					// # Facebook Dialog Share (i.e. standard action)
					// -----------------------------------------------------------
					// FB.ui({
						// method : "share",
						// href   : $org.domain,                                                  // url of the link
					// });
					// -----------------------------------------------------------
					// # Facebook Dialog Share Open Graph (i.e. custom action)
					// -----------------------------------------------------------
					// FB.ui({
						// method            : "share_open_graph",
						// action_type       : "lesoursesaplumes:share",
						// action_properties : JSON.stringify({
							// website         : $org.domain,                                       // url of the link
							// image           : $org.domain + $img.pub + "loap_share_picture.jpg", // url of the image
						// })
					// });
					return false;
				});
				*/
				if (settings.target == "popup") {
					$("#share_twitter, #share_facebook, #share_googleplus, #share_linkedin").on("click", function() {
						window.open(this.href, "", "menubar=" + (settings.popup.menubar ? "yes" : "no") + ",toolbar=" + (settings.popup.toolbar ? "yes" : "no") + ",resizable=" + (settings.popup.resizable ? "yes" : "no") + ",scrollbars=" + (settings.popup.scrollbars ? "yes" : "no") + ",width=" + settings.popup.width + ",height=" + settings.popup.height);
						return false;
					});
				} else if (settings.target == "new") {
					$("#share_twitter, #share_facebook, #share_googleplus, #share_linkedin").attr("target", "_blank");
				}
				$("[data-count]").each(function() {
					var o = $(this), n = o.data("count"), u = article_url;
					switch(n) {
						case "twitter" :
							var q = "http://cdn.api.twitter.com/1/urls/count.json?url=" + u + "&callback=?";
							$.getJSON(q, function(data) {o.html(data.count.toString())});
							break;
						case "facebook" :
							var q = "http://graph.facebook.com/?id=" + u;
							$.getJSON(q, function(data) {o.html(data.shares.toString())}).fail(o.html("0"));
							break;
						case "googleplus" :
							var q = "https://clients6.google.com/rpc";
							var r = {
								"method" : "pos.plusones.get",
								"id" : u,
								"params" : {
									"nolog" : true,
									"id" : u,
									"source" : "widget",
									"userId" : "@viewer",
									"groupId" : "@self"
								},
								"jsonrpc" : "2.0",
								"key" : "p",
								"apiVersion" : "v1"
							};
							$.ajax({
								type : "POST",
								url : q,
								processData : true,
								contentType : "application/json",
								data : JSON.stringify(r),
								success : function(data) {o.html(typeof data.result !== "undefined" ? data.result.metadata.globalCounts.count.toString() : "0")}
							});
							break;
						case "linkedin" :
							var q = "http://www.linkedin.com/countserv/count/share?url=" + u + "&callback=?";
							$.getJSON(q, function(data) {o.html(data.count.toString())});
							break;
					}
				});
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # CKEditor Post-Load Batch */
/* ------------------------------------------------------------------ */

var editor = (function() {
	return {
		fluidify : function(obj) {
			// CKEditor Images Size Fix (for Image and Image2 Plugins)
			obj.find("img").each(function() {
				var o = $(this);
				var w = o.css("width");
				var f = o.css("float");
				o.attr("width", w); // compatibility fix (for 1.1.0 using Image Plugin)
				o.css({
					"border" : "none", // compatibility fix (for 1.1.0 using Image Plugin)
					"margin" : "0", // compatibility fix (for 1.1.0 using Image Plugin)
					"width" : "100%",
					"height" : "auto",
					"max-width" : w
				});
				if (f == "right" || f == "left") { // compatibility fix (for 1.1.0 using Image Plugin)
					switch (f) {
						case "left" : o.css("margin-right", "1rem"); break; // compatibility fix (for 1.1.0 using Image Plugin)
						case "right" : o.css("margin-left", "1rem"); break; // compatibility fix (for 1.1.0 using Image Plugin)
					}
					o.parent().addClass("clearfix"); // compatibility fix (for 1.1.0 using Image Plugin)
				}
			});
			// CKEditor iFrame Size Fix (for YouTube Plugin)
			function resize_iframe(obj) {
				var w = parseInt(obj.attr("width"));
				var h = parseInt(obj.attr("height"));
				var r = w / h; // ratio
				var r_w = obj.width(); // real width (computed at 100%)
				var r_h = r_w / r; // real height
				obj.css("height", r_h);
			}
			obj.find("iframe").each(function() {
				var o = $(this);
				var w = o.attr("width");
				o.css({
					"width" : "100%",
					"max-width" : w + "px"
				});
				o.parent().addClass("text-center"); // alignment fix
				resize_iframe(o);
			});
			$(window).on("resize", function() {
				obj.find("iframe").each(function() {
					resize_iframe($(this));
				});
			});
		},
		clean : function(obj) {
			// CKEditor Link Plugin Cleanup
			obj.find("a").each(function() {
				$(this).removeAttr("data-cke-saved-href"); // cke saved
			});
			// CKEditor Image Plugin Cleanup
			obj.find("img").each(function() {
				$(this).removeAttr("data-cke-saved-src"); // cke saved
			});
			// CKEditor Image2 Plugin Cleanup
			$(".body").find("[data-cke-temp]").remove(); // remove
			$(".body").find("[data-cke-hidden-sel]").remove(); // remove * USELESS : same as above
			$(".body").find(".cke_widget_drag_handler_container").remove(); // remove
			$(".body").find(".cke_widget_drag_handler").remove(); // remove * USELESS : contained in above
			$(".body").find(".cke_image_resizer").remove(); // remove
			$(".body").find(".cke_image_resizer_wrapper").children().unwrap(); // unwrap
			$(".body").find("[class*='cke_widget']").each(function() {
				$(this) // unbind all widgets
					.removeClass("cke_widget_wrapper cke_widget_element cke_widget_editable cke_widget_selected cke_widget_block cke_widget_inline cke_image_nocaption")
					.removeAttr("data-widget data-cke-widget-editable data-cke-widget-id data-cke-widget-data data-cke-widget-keep-attr data-cke-display-name data-cke-filter data-cke-enter-mode data-cke-widget-wrapper contenteditable tabindex");
			})
			// CKEditor BasicStyles Plugin Cleanup
			obj.find("p").each(function() {
				var o = $(this);
				o.find("br:last-child").remove(); // remove line breaks at paragraphs end
				// -----------------------------------------------------------------
				// # UNUSED : redacters may insert empty paragraphs for spacing (bad practices should be let up to users)
				// -----------------------------------------------------------------
				// if (o.length == 0 && o.text() == "") {o.remove()} // remove empty paragrahs
			});
		},
		patch : function(obj) {
			this.fluidify(obj);
			this.clean(obj);
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

var articleTimer = 1;
function displayArticle() {
	$.ajax({
		type : "GET",
		url : "/rest" + window.location.pathname,
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			processArticle(article);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$(".main-body").append(file_pool.error_tmpl).after(lb(1));
			} else if (jqXHR.status == 503) {
				setTimeout(function() {
					articleTimer = articleTimer * 10;
					displayArticle();
				}, articleTimer);
				
			}
		},
		dataType : "json"
	});
}

var relatedArticleTimer = 1;
function displayRelatedArticle(articleId) {
	$.ajax({
		type : "GET",
		url : "/rest/articles/" + articleId + "/related",
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			processRelatedArticles(articles);
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				$(".main-body").append(file_pool.error_tmpl).after(lb(1));
			} else if (jqXHR.status == 503) {
				setTimeout(function() {
					relatedArticleTimer = relatedArticleTimer * 10;
					displayRelatedArticle(articleId);
				}, relatedArticleTimer);
				
			}
		},
		dataType : "json"
	});
}

function shareByMail(articleId, mail) {
	$.ajax({
		type : "PUT",
		data : mail,
		url : "/rest/articles/" + articleId + "/share",
		contentType : "application/json; charset=utf-8",
		success : function(article, status, jqxhr) {
			createAlertBox($msg.email_sent, null, {"class" : "success", "timeout" : $time.duration.alert});
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

function goUserProfile(id, pseudo) {
	$.ajax({
		type : "GET",
		url : "/rest/profile/" + id,
		contentType : "application/json; charset=utf-8",
		success : function(profile, status, jqxhr) {
			window.location.href = profile.path;
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 404) {
				window.location.href = "/profils/" + pseudo;
			}
		},
		dataType : "json"
	});
}

function processArticle(article) {
	set_page_title(article.title);
	if (window.location.pathname !== article.path) {
		if (history.pushState) {
			window.history.pushState("", "", article.path); // live update address bar without reloading document (HTML5 method)
		} else {
			window.location.href = article.path;
		}
	}
	$(".main-body").append(file_pool.article_view_tmpl(article)).after(lb(1));
	$(".article").on("click", "a[rel='author']", function() {
		goUserProfile($(this).attr("data-profile-id"), $(this).html());
	}); // bind author profile redirection
	$(".header, .footer").update_separators(); // update separators
	$("section").svg_icons(); // reload svg icons for whole section
	editor.patch($(".body")); // ckeditor post-load batch
	share.init(); // init share
	displayRelatedArticle(article.id);
}

function processRelatedArticles(articles) {
	if (articles.length > 0) {
		articles.sort(function compare(a, b) {
			if (a.publishedDate > b.publishedDate)
				return -1;
			if (a.publishedDate < b.publishedDate)
				return 1;
			// a doit être égal à b
			return 0;
		});
		var related = $("<div>", {"class" : "related", "style" : "clear: both;"})
			.append($("<h4>", {"class" : "subheader"}).html("Articles connexes"))
			.append(file_pool.related_list_tmpl(articles)) // insert related template
			.append(lb(1));
		$(".article > .footer").append(related); // append related list
		list_overview.init(".related-list"); // initialize list overview component
		loap.update(); //refresh icon
	}
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
