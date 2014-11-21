/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"error_tmpl" : $loc.tmpl + "error.tmpl",
	"article_edit_tmpl" : $loc.tmpl + "article-edit.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			// si le path est /articles/{id}, c'est l'article avec l'id passé en param à aller chercher
			if (/^\/articles\/[0-9]+/.test(window.location.pathname)) {
				$.ajax({
					type: "GET",
					url: "/rest" + window.location.pathname,
					contentType: "application/json; charset=utf-8",
					beforeSend: function(request) {
						header_authentication(request);
					},
					success: function(data, status, jqxhr) {
						processArticle(data);
					},
					error: function(jqXHR, status, errorThrown) {
						ajax_error(jqXHR, status, errorThrown);
						if (jqXHR.status == 404) {
							$("main > header").after(file_pool.error_tmpl).after(lb(1));
						} else {
							createAlertBox();
						}
					},
					dataType: "json"
				});
			}
			// sinon c'est une création d'article
			else {
				processArticle(new Article("", "", "", null, null, []));
			}
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Components */
/* ------------------------------------------------------------------ */

var tags = (function() {
	return {
		update : function(id) {
			var sel = "#" + id;
			if ($(sel + " .select").children().size() == 0) { // no placeholder
				$(sel + "_tag").html($(sel + " .select").text()); // update text
				$(sel + "_tag").removeClass("undefined wrong"); // reset class
				if (id == "rubric") {
					$("form, #" + id + "_tag").removeClass("struggles ourbody intersec internat educult ideas"); // WARNING : using 'form' as topmost parent element
					if ($(sel + " .selected").attr("data-color")) {
						$("form, #" + id + "_tag").addClass($(sel + " .selected").attr("data-color")); // WARNING : using 'form' as topmost parent element
					}
				} else {
					$(sel + "_tag").addClass("inverse") // update color
				}
			}
		},
		init : function(opts) {
			var defs = {
				"fx_d"       : 250,             // Integer  Effects duration for tags component in milliseconds. Default : 500
				"tag_max"    : 8,               // Integer  Maximum of tags allowed (n.b. without rubric and category). Default : 10
				"tag_reflow" : 3                // Integer  Number of characters at which autocomplete starts on tag input. Default : 3
			};
			var cfg = $.extend({}, defs, opts);
			var self = this; // internal
			// functions
			function open_field(field) { // field = jQuery selector
				var field = field || null, obj = $("#tagging");
				obj.finish();
				if (obj.data("opening") !== true) {
					if (field !== null) {
						$(field).fadeIn($conf.js_fx ? cfg.fx_d : 0).siblings().hide();
					} else {
						obj.children("div").fadeIn($conf.js_fx ? cfg.fx_d : 0);
					}
					obj.data("opening", true);
					obj.slideDown($conf.js_fx ? cfg.fx_d : 0, function() {
						obj.scroll_to({"fx_d" : $conf.js_fx ? cfg.fx_d : 0, "spacing" : $("#tags").outerHeight() + 16});
						obj.removeData("opening");
					});
				}
			}
			function close_field(field) {
				var field = field || null, obj = $("#tagging");
				if (field !== null) {
					$(field).fadeOut($conf.js_fx ? cfg.fx_d : 0);
					if (obj.children(":visible").length == 1) {
						obj.slideUp($conf.js_fx ? cfg.fx_d : 0);
					}
				} else {
					obj.children("div").fadeOut($conf.js_fx ? cfg.fx_d : 0);
					obj.slideUp($conf.js_fx ? cfg.fx_d : 0);
				}
			}
			function update_tag(id) {
				self.update(id);
			}
			function add_tag(source, target) {
				var str = $(source).val().trim();
				if (str !== "") {
					// check if tag already exists
					$(target).children("dd").each(function() {
						if ($(this).children().text() == str) {
							$(source).set_validation(false, $msg.tag_dup);
						}
					});
					// continue if no error is found
					if ($(source).attr("data-invalid") !== "true") {
						if ($(target).children("dd").length - 2 >= cfg.tag_max) {
							// show floating string if maximum of tag allowed is reached
							var f_str = $("<div>")
							.css({
								"position" : "absolute",
								"display" : "inline-block",
								"top" : $(source).offset().top - $(source).outerHeight(false),
								"left" : $(source).offset().left,
								"padding" : ".5rem",
								"font-size" : "1.5em",
								"font-weight" : "bold",
								"color" : "#c33",
								"z-index" : "100"
							})
							.html($msg.tag_max);
							$("body").append(f_str);
							f_str.animate({
								"top" : $(source).offset().top / 1.5,
								"opacity" : "0"
							}, cfg.fx_d * 6);
							if ($("#tag_new").is(":visible")) {
								$("#tag_new").hide()
							}
						}
						// add tag to tags list 
						$(target).find("#tag_new").parent("dd").before("<dd data-tag><span class='label radius'>" + str + "<a href='javascript:void(0)' class='close'></a></span></dd>\n");
						$(target).foundation("alert");
						$(source).val("");
						// reset autocomplete
						$(source).nextAll(".autocomplete").first().find("ul > li").addClass("hide");
						$(source).set_validation(null); // reset validation
						// close tagging
						$("#tag_new").removeClass("active");
						$("#tag_new").focus(); // focus tag_new
						close_field();
					}
				} else {
					$(source).set_validation(null); // reset validation if input empty
				}
			}
			// events
			$("#rubric_tag, #category_tag, #tag_new").bind({
				mouseenter : function() {$(this).data("hover", true)},
				mouseleave : function() {$(this).removeData("hover")},
				click : function() {
					if (!$(this).hasClass("disabled")) {
						var sel = "#" + $(this).attr("id").cut(-4);
						$(this).toggleClass("active");
						$(this).parent("dd").siblings().find("a").removeClass("active");
						$(this).hasClass("active") ? open_field(sel + "_field") : close_field(sel + "_field");
						$(sel).focus();
					}
				}
			});
			$(".tags").on("click", "dd .label .close", function() { // live
				var obj = $(this).parent(".label").parent("dd");
				obj.fadeOut($conf.js_fx ? cfg.fx_d : 0, function() {
					obj.remove(); // remove tag
					if ($("#tag_new").is(":hidden")) {
						$("#tag_new").show();
					}
				});
			});
			$("#rubric, #category").bind({
				blur : function() {
					var id = $(this).attr("id"), sel = "#" + id;
					update_tag(id);
					if ($(sel + " li").hasClass("selected")) {
						if ($(sel + "_tag").data("hover") !== true) {
							$(sel + "_tag").removeClass("active");
							close_field(sel + "_field");
						}
					}
				},
				click : function() {update_tag($(this).attr("id"))},
				keyup : function(e) {
					if (e.which == 13 || e.which >= 33 && e.which <= 36 || e.which == 38 || e.which == 40) { // Enter, PageUp, PageDown, End, Home or Up or Down
						update_tag($(this).attr("id"));
					}
				}
			});
			$("label[for='rubric'], label[for='category']").on("click", function() {
				$("#" + $(this).attr("for")).force_focus();
			});
			$("#tag").bind({
				blur : function() {
					if ($(this).val().length == 0 && $("#tag_new").data("hover") !== true) {
						$("#tag_new").removeClass("active");
						close_field();
					}
				},
				focus : function() {
					$(this).set_validation(null); // reset validation
				},
				keyup : function(e) {
					if (e.which == 13) { // Enter
						$("#tag_add").click(); // force click on add tag button
					} else if ((e.which >= 48 && e.which <= 57) || (e.which >= 64 && e.which <= 90) || (e.which >= 96 && e.which <= 105) || e.which == 32 || e.which == 8 || e.which == 46) { // From 0 to 9 or from A to Z or from Numpad 0 to Numpad 9 or Space or Backspace or Del
						var self = $(this), str = $(this).val();
						if (str.length >= cfg.tag_reflow) {
							str = str.trunc(cfg.tag_reflow);
							if ($(this).data("q") !== str) {
								$(this).data("q", str);
								$(".autocomplete ul li").remove();
								$.getJSON("/rest/tags?criteria=" + str, function(json) {
									var q = "";
									$.each(json, function(i, obj) {
										q += tb(11) + "<li data-value='"+ obj.id +"' class='hide'>" + obj.tag + "</li>" + lb(1);
									});
									$(".autocomplete ul").append(q); // reflow tags autocomplete
									$(function() {
										e = $.Event("keyup");
										e.which = 48; // 0
										$("#tag").trigger(e); // force keyup 0 (i.e. show autocomplete after AJAX request)
									});
								});
							}
						}
					}
				}
			});
			$("#tag_add").on("click", function() {
				add_tag("#tag", ".tags"); // add tag
			});
			$("#tag").nextAll(".autocomplete").first().on("mousedown", "ul > li", function() {
				add_tag("#tag", ".tags"); // add tag
			});
			
		}
	}
}());

var share = (function() {
	return {
		init : function(options) {
			// vars
			var defaults = {
				"mail" : true,
				"twitter" : true,
				"facebook" : true,
				"googleplus" : false,
				"linkedin" : false
			};
			var settings = $.extend({}, defaults, options);
			// functions
			function update_tooltips(obj) {
				if (obj.hasClass("active")) {
					obj.reload_tooltip("D&eacute;sactiver le partage " + obj.data("tooltip-postfix"));
				} else {
					obj.reload_tooltip("Activer le partage " + obj.data("tooltip-postfix"));
				}
			}
			// events
			$("html").on("mouseenter", "#share_mail, #share_twitter, #share_facebook, #share_googleplus, #share_linkedin", function() {
				if ($(this).hasClass("disabled")) {
					$(this).css({"cursor" : "pointer", "border-color": "silver", "opacity" : "1"});
				}
			});
			$("html").on("mouseleave", "#share_mail, #share_twitter, #share_facebook, #share_googleplus, #share_linkedin", function() {
				if ($(this).hasClass("disabled")) {
					$(this).css({"cursor" : "", "border-color": "transparent", "opacity" : ""});
				}
			});
			$("html").on("click", "#share_mail, #share_twitter, #share_facebook, #share_googleplus, #share_linkedin", function() {
				var clone = $(this).clone();
				$(this).toggleClass("disabled");
				$(this).toggleClass("active");
				$(this).css("border-color", "transparent");
				update_tooltips($(this));
				if ($conf.js_fx && $(this).hasClass("disabled")) {
					var x = $(this).offset().left;
					var y = $(this).offset().top;
					var w = $(this).outerWidth();
					clone.css({"position" : "absolute", "left" : x, "top" : y, "z-index" : "10"})
					clone.appendTo("body");
					clone.find("svg").animate({"height" : "40px", "width" : "40px"}, 375).animate({"height" : "20px", "width" : "20px"}, 250);
					clone.find(".text").animate({"font-size" : "125%", "line-height" : "200%"}, 375).animate({"font-size" : "75%", "line-height" : "100%"}, 250);
					clone.animate({"top" : (y - 10.0).toString() + "px"}, 125).animate({"top" : y.toString() + "px", "opacity" : 0}, 250, function() {
						clone.remove();
					});
				}
			});
			// init
			$("#share_mail, #share_twitter, #share_facebook, #share_googleplus, #share_linkedin").css("border", ".0625rem dashed transparent");
			$("#share_mail, #share_twitter, #share_facebook, #share_googleplus, #share_linkedin").each(function() {
				var expr = undefined; // TODO : this is what is returned by AJAX query ; check wether a share link has ever been allowed (i.e. this is article's edition case)
				var u_id = $(this).attr("id").substr(6, $(this).attr("id").length);
				// check share link activation
				if (expr !== undefined) {
					if (expr) {
						$(this).addClass("active");
					} else {
						$(this).addClass("disabled");
					}
				} else if (settings.hasOwnProperty(u_id)) { // use defaults if no AJAX query defined (i.e. this is article's creation case)
					if (settings[u_id]) {
						$(this).addClass("active");
					} else {
						$(this).addClass("disabled");
					}
				}
				// set share link tooltip
				var str = $(this).attr("title");
				$(this).data("tooltip-postfix", str);
				update_tooltips($(this));
			});
		}
	}
}());

var validate = (function () {
	return {
		init : function(opts) {
			var defs = {
				"save_fx_d"     : 250,          // Integer   Save effects duration in milliseconds. Default : 250
				"save_timeout"  : 1000,         // Integer   Time during which the application is frozen upon saving (milliseconds). Default : 1000
				"kbd_chain_nav" : true          // Boolean   Enable keyboard chained navigation (i.e. switch to next input on key press Enter). Default : true
			};
			var cfg = $.extend({}, defs, opts);
			// vars
			var t_summary = 0; // internal
			// functions
			function checkTitle() {
				checkTitleAJAX();
				var str = $("#title").val().trim();
				$("#title").val(str);
				if (str.length == 0) {
					$("#title").set_validation(false, "Le titre de l&rsquo;article doit obligatoirement &ecirc;tre renseign&eacute;.");
				} else {
					$("#title").data("last_value", str);
					$("#title").set_validation(true);
				}
			}
			function checkSummary() {
				var str = $("#summary").val().trim();
				$("#summary").val(str);
				if (str.length == 0) {
					$("#summary").set_validation(false, "Le r&eacute;sum&eacute; doit n&eacute;cessairement &ecirc;tre saisi.");
				} else {
					$("#summary").set_validation(true);
				}
			}
			function checkRubric() {
				if ($("#rubric_tag").hasClass("undefined")) {
					if ($("#tagging").is(":hidden")) { $("#tagging").show() }
					if ($("#rubric_field").is(":hidden")) { $("#rubric_field").show() }
					$("#rubric").addClass("active");
					$("#rubric_tag").set_validation(false);
					$("#rubric").set_validation(false, "Une rubrique doit imp&eacute;rativement &ecirc;tre choisie.");
				} else {
					$("#rubric").set_validation(true);
				}
			}
			function checkCategory() {
				if ($("#category_tag").hasClass("undefined")) {
					if ($("#tagging").is(":hidden")) { $("#tagging").show() }
					if ($("#category_field").is(":hidden")) { $("#category_field").show() }
					$("#category").addClass("active");
					$("#category_tag").set_validation(false);
					$("#category").set_validation(false, "Une cat&eacute;gorie doit imp&eacute;rativement &ecirc;tre choisie.");
				} else {
					$("#category").set_validation(true);
				}
			}
			function checkBody() {
				if ($("#editor").text().length == 0 || $("#editor").children().hasClass("placeholder")) {
					$("#editor").set_validation(false, "La saisie du corps de l&rsquo;article est indispensable.");
				} else {
					$("#editor").set_validation(true);
				}
			}
			// events
			$("#title").bind({
				focus: function() {
					$(this).set_validation(true);
				},
				blur : function() {
					//checkTitleAJAX();
					checkTitle();
				},
				keydown : function(e) {
					if (e.which == 27) { // Escape
						$(this).val($(this).data("last_value")); // recall last value
					}
				},
				keypress : function(e) {
					if (e.which == 13) { // Enter
						checkTitle();
						if (cfg.kbd_chain_nav) {
							$("#summary").focus(); // keyboard chained navigation
						}
					}
				}
			});
			$("#summary").bind({
				focus : function() {
					clearTimeout(t_summary);
					$(this).set_validation(true);
				},
				blur : function() {
					t_summary = setTimeout(function() {
						checkSummary();
					}, 250);
				},
				keydown : function(e) {
					if (e.ctrlKey && e.which == 13 && cfg.kbd_chain_nav) { // Ctrl + Enter
						$("#rubric_tag").click(); // keyboard chained navigation
					}
				}
			});
			$("#rubric").bind({
				focus : function() {
					$(this).set_validation(true);
				},
				blur : function() {
					checkRubric();
				},
				keydown : function(e) {
					if (e.which == 13 && cfg.kbd_chain_nav) { // Enter
						$("#category_tag").click(); // keyboard chained navigation
					}
				}
			});
			$("#category").bind({
				focus : function() {
					$(this).set_validation(true);
				},
				blur : function() {
					checkCategory();
				},
				keydown : function(e) {
					if (e.which == 13 && cfg.kbd_chain_nav) { // Enter
						$("#tag_new").click(); // keyboard chained navigation
					}
				}
			});
			$("#editor").bind({
				focus : function() {
					$(this).set_validation(true);
				},
				blur : function() {
					checkBody();
				}
			});
			$("#save").click(function() {
				if ($(this).data("saving") !== true) {
					$(this).data("saving", true);
					// append screen blocker during validation
					var f_scr = $("<div>")
					.css({
						"position" : "fixed",
						"display" : "block",
						"top" : "0",
						"left" : "0",
						"height" : "100%",
						"width" : "100%",
						"color" : "white",
						"font-size" : "2em",
						"font-weight" : "bold",
						"line-height" : ($(window).height() / 2) + "px",
						"text-align" : "center",
						"text-shadow" : "1px 1px 1px black",
						"background-color" : "black",
						"opacity" : "0",
						"z-index" : "1000"
					})
					.html($msg.checking);
					var f_bar = $("<div>")
					.css({
						"position" : "absolute",
						"display" : "inline-block",
						"top" : ($(window).height() / 2) - ($(window).height() / 16 ) + "px",
						"left" : "12.5%",
						"width" : "75%",
						"height" : "6.25%",
						"border" : "2px solid white",
						"transition" : "border-left-width .25s"
					});
					$("body").append(f_scr);
					f_scr.append(f_bar);
					f_scr.animate({"opacity" : ".5"}, cfg.save_fx_d);
					var step = (cfg.save_timeout - (cfg.save_fx_d)) / (cfg.save_fx_d);
					var f_bar_w = parseFloat(f_bar.css("width"));
					var f_bar_s = f_bar_w / step;
					var f_scr_timer = setInterval(function() {
						var border_w = parseFloat(f_bar.css("border-left-width"));
						f_bar.css("border-left-width", (border_w + f_bar_s) + "px")
					}, (cfg.save_fx_d));
					// check validation for all inputs
					setTimeout(function() {
						checkTitle();
						checkSummary();
						checkRubric();
						checkCategory();
						checkBody();
						// clear screen timer
						$("#save").removeData("saving");
						clearInterval(f_scr_timer);
						f_scr.animate({"opacity" : "0"}, cfg.save_fx_d, function() {
							f_scr.remove();
						});
						// create alert box
						if ($("#title, #summary, #rubric_tag, #category_tag, #editor").hasClass("wrong")) {
							createAlertBox($msg.form_invalid, "form_valid", {"timeout" : $time.duration.alert_long});
						} else {
							createAlertBox($msg.form_valid, "form_valid", {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert_short});
							sendArticle();
						}
					}, cfg.save_timeout);
				}
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function Article(title, body, description, category, rubrique, tags) {
		this.title = title;
		this.body = body;
		this.description = description;
		this.category = category;
		this.rubrique = rubrique;
		this.tags = tags;
		this.toJson = function() {
			return JSON.stringify(this);
		};
};

function Category(id,value) {
	this.id = id;
	this.category = value;
	this.toJson = function() {
		return JSON.stringify(this);
	}
}

function Rubrique(id,value) {
	this.id = id;
	this.rubrique = value;
	this.toJson = function() {
		return JSON.stringify(this);
	}
}

function Tag(id,value) {
	this.id = id;
	this.tag = value;
	this.toJson = function() {
		return JSON.stringify(this);
	}
}

/* ------------------------------------------------------------------ */
/* # DOM manipulation */
/* ------------------------------------------------------------------ */

var pathPUT; // le path de la création/maj d'un article
var pathTitle; // le path du check d'un article

function processArticle(article) {
	// affiche le template en passant en param l'article
	// la catégorie et la rubrique ne sont pas setté dans le template
	// il faut attendre la récupération asynchrone des données
	$("main > header").after(file_pool.article_edit_tmpl(article)).after(lb(1));
	// le js est rattaché aux nouveaux articles avec comme path /articles/nouveau
	// et aux draft en update avec comme path /articles/{id}
	//si il y a un id dans le path on est en update
	if(/^\/articles\/[0-9]+/.test(window.location.pathname)) {
		pathPUT = "/rest" + window.location.pathname;
		pathTitle = "/rest/articles/check/title?id=" + article.id; 
		set_page_title(article.title);
	}
	//sinon en création
	else {
		pathPUT = "/rest/articles/create";
		pathTitle = "/rest/articles/check/title";
		set_page_title($nav.article_add.title);
	}
	// get rubrics and categories through AJAX
	$.getJSON("/rest/rubriques", function(json) {
		processRubric(json, article);
	});
	$.getJSON("/rest/categories", function(json) {
		processCategory(json, article);
	});
	// list co authors
	$.ajax({
		type: "GET",
		url: "/rest/profile/writer",
		contentType: "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success: function(data, status, jqxhr) {
			processWriters(data, article);
		},
		error: function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				$("main > header").after(file_pool.error_tmpl).after(lb(1));
			} else {
				createAlertBox();
			}
		},
		dataType: "json"
	});
	// initialize inline CKEditor with custom config
	CKEDITOR.disableAutoInline = true;
	CKEDITOR.inline("editor", {
		customConfig : $loc.js + "conf-cke.js",
		contentsCss : $loc.css + "loap-main.css",
		extraAllowedContent : {"span" : {classes : "placeholder"}}
	});
	// initialize plugins and components
	$("section textarea").autosize({append: ""}); // apply autosize after AJAX request for whole section
	$("section textarea").add_confirmation_bar(); // apply add_confirmation_bar plugin to all textarea of the page after AJAX request for whole section
	$("section .options-select").options_select(); // apply options_select plugin to all .options-select of the page after AJAX request for whole section
	$("section").svg_icons(); // reload svg icons after AJAX request for whole section
	$("#tag").autocomplete(); // apply autocomplete plugin to #tag input
	tags.init(); // initialize tags component
	//share.init(); // UNUSED (for now) : initialize share component
	validate.init(); // initialize validate component
}

function processWriters(json, article){
	$.each(json, function(i, obj) {
		if (window.localStorage.getItem($auth.profile_id) != obj.id){
			var li = "<li class='' data-value='"+ obj.id +"' data-color=''>" + obj.pseudo + "</li>";
			$("#coauthor ul").append(li);
		}
	});
}

function processRubric(json, article) {
	$.each(json, function(i, obj) {
		if (article.rubrique != null && article.rubrique.id == obj.id) {
			$("#rubric .select").html(obj.rubrique); // reflow select value (i.e. asynchronous script conflict)
			var cls = "selected " + article.rubrique.classe;
		} else {
			var cls = "";
		}
		var li = "<li class='" + cls + "' data-value='"+ obj.id +"' data-color='" + obj.classe + "'><span class='icon-" + obj.classe + " small' style='margin-right: .25rem;'></span>" + obj.rubrique + "</li>";
		$("#rubric ul").append(li);
	});
	$("#rubric").svg_icons(); // set svg icons for all icons contained by rubric
	tags.update("rubric");
}

function processCategory(json, article) {
	$.each(json, function(i, obj) {
		if (article.category != null && article.category.id == obj.id) {
			$("#category .select").html(obj.category); // reflow select value (i.e. asynchronous script conflict)
			var cls = "selected";
		} else {
			var cls = "";
		}
		var li = "<li class='" + cls + "' data-value='"+ obj.id +"'>" + obj.category + "</li>";
		$("#category ul").append(li);
	});
	tags.update("category");
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// créer ou ajouter un article
function sendArticle() {
	// set article's topic
	var title = $("#title").val();
	var description = $("#summary").val();
	var body = $("#editor").html();
	// set category
	var idCategory = $("#category li.selected").attr("data-value");
	var valueCategory = $("#category li.selected").text();
	var category = new Category(idCategory, valueCategory);
	// set rubric
	var idRubrique = $("#rubric li.selected").attr("data-value");
	var valueRubrique = $("#rubric li.selected").text();
	var rubrique = new Rubrique(idRubrique, valueRubrique);
	// set tags
	var tags = [];
	$("[data-tag] span").each(function() {
		tags.push(new Tag($(this).attr("data-id"), $(this).text()));
	});
	// set article's data
	var data = new Article(title, body, description, category, rubrique, tags);
	// send AJAX request
	 $.ajax({
		type: "PUT",
		url: pathPUT,
		contentType: "application/json; charset=utf-8",
		data : JSON.stringify(data),
		beforeSend: function(request) {
			header_authentication(request);
		},
		success: function(jqXHR, status, errorThrown) {
			window.location.href = $nav.draft_article_list.url;
		},
		error: function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 403) {
				checkTitleAJAX();
			} else if (jqXHR.status == 404) {
				createAlertBox($msg.article_deleted, null, {"class" : null, "timeout" : $time.duration.alert});
			} else {
				createAlertBox();
			}
		},
		dataType: "json"
		});
	return true;
}

function checkTitleAJAX() {
	if (typeof titleTimeoutValid !== "undefined") {
		clearTimeout(titleTimeoutValid);
	}
	var selector = $("#title");
	selector.set_validation();
	var title = selector.val();
	$.ajax({
		type : "POST",
		url : pathTitle,
		contentType : "application/json; charset=utf-8",
		data : title,
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(data, textStatus, jqXHR) {
			pseudoTimeoutValid = setTimeout(function() {
				selector.set_validation(true);
			}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 403) {
				pseudoTimeoutValid = setTimeout(function() {
					selector.set_validation(false, "Ce titre est d&eacute;j&agrave; pris");
				}, 500);
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live events */
/* ------------------------------------------------------------------ */

// jQuery events go here
