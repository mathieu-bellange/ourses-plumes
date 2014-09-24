/* ------------------------------------------------------------------ */
/* # Public variables */
/* ------------------------------------------------------------------ */

var tag_max = 8;        // Integer  Maxium of tags allowed. Default = 8;

/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var template = doT.compile(loadfile($app_root + "tmpl/editor.tmpl"));
// si le path est /articles/{id}, c'est l'article avec l'id passé en param à aller chercher
if(/^\/articles\/[0-9]+/.test(window.location.pathname)) {
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
				$("main > header").after(doT.compile(loadfile($app_root + "tmpl/error.tmpl")));
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

function isFormValid() {
	var isTitleValid = !$("#title").attr("data-invalid");
	var isRubricValid = !$("#rubric").attr("data-invalid");
	var isCategoryValid = !$("#category").attr("data-invalid");
	var isSummaryValid = !$("#summary").attr("data-invalid");
	var isBodyValid = !$("#editor").attr("data-invalid");
	return isTitleValid && isRubricValid && isCategoryValid && isSummaryValid && isBodyValid;
}

/* ------------------------------------------------------------------ */
/* # DOM manipulation */
/* ------------------------------------------------------------------ */

/* processing de la page */

// le path de la création/maj d'un article
var pathPUT;
// le path du check d'un article
var pathTitle;

function processArticle(article) {
	// affiche le template en passant en param l'article
	// la catégorie et la rubrique ne sont pas setté dans le template
	// il faut attendre la récupération asynchrone des données 
	$("main > header").after(template(article));
	// le js est rattaché aux nouveaux articles avec comme path /articles/nouveau 
	// et aux draft en update avec comme path /articles/{id}

	//si il y a un id dans le path on est en update
	if(/^\/articles\/[0-9]+/.test(window.location.pathname)) {
		pathPUT = "/rest" + window.location.pathname;
		pathTitle = "/rest/articles/check/title?id=" + article.id; 
	} else { //sinon en création
		pathPUT = "/rest/articles/create";
		pathTitle = "/rest/articles/check/title";
	}

	$.getJSON("/rest/categories", function(json) {
		// processCategory(json);
		processCategory(json, article);
		//TODO injection de la valeur de l'article
		// alert(article.category.id);
		// alert(article.category.category);
	 });

	$.getJSON("/rest/rubriques", function(json) {
		processRubric(json, article);
		//TODO injection de la valeur de l'article
	});

	// Initialize inline CKEditor with custom config
	CKEDITOR.disableAutoInline = true;
	CKEDITOR.inline("editor", {
		customConfig : $js_root + "editor_settings.js",
		extraAllowedContent : {"p" : {classes : "placeholder", styles : "color"}},
		contentsCss : $css_root + "loap-main.css"
	});

	// bind events après le chargement du template par dot.js
	$("#rubric").bind({
		blur : function() {
			update_rubric();
			// update validation
			$("#rubric").set_validation($("#rubric li.selected").text().length !== 0);
		},
		click : function() {update_rubric();},
		keyup : function() {update_rubric();}
	});
	$("#category").bind({
		blur : function() {
			update_category();
			// update validation
			$("#category").set_validation($("#category li.selected").text().length !== 0);
		},
		click : function() {update_category();},
		keyup : function() {update_category();}
	});

	// recharge foundation pour les tags ajoutés directement par le template
	if (article.tags.length > 0) {
		$("#tags").foundation("alert");
	}

	// initialize plugins
	$("textarea").autosize({append: ""}); // TEMP DEBUG : apply autosize after AJAX request
	$("textarea").add_confirmation_bar(); // TEMP DEBUG : apply add_confirmation_bar plugin to all textarea of the page after AJAX request
	$(".options-select").options_select(); // TEMP DEBUG : apply options_select plugin to all .options-select of the page after AJAX request
	$("section").svg_icons(); // TEMP DEBUG : reload svg icons for whole section
	$("#tag").autocomplete(); // TEMP DEBUG : apply autocomplete plugin to #tag input
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
		$('#rubric ul').append(li);
	});
	$("#rubric").svg_icons(); // set svg icons for all icons contained by rubric
	update_rubric()
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
	update_category()
}

/* maj de la combo rubrique */
function update_rubric() {
	if ($("#rubric .select").children().size() == 0) {
		// update text
		$("#tag_rubric").html($("#rubric .select").text());
		// update color
		$("#tag_rubric").removeClass();
		$("form").removeClass(); // WARNING : using 'form' as topmost parent element
		if ($("#rubric .selected").attr("data-color")) {
			$("#tag_rubric").addClass("label radius " + $("#rubric .selected").attr("data-color"));
			$("form").addClass("article edit " + $("#rubric .selected").attr("data-color")); // WARNING : using 'form' as topmost parent element
		} else {
			$("#tag_rubric").addClass("label radius secondary");
			$("form").addClass("article edit"); // WARNING : using 'form' as topmost parent element
		}
		// update visibility
		if ($("#tag_rubric").parent("dd").hasClass("hide")) {
			$("#tag_rubric").parent("dd").removeClass("hide")
		}
		if ($("#tags").css("display") == "none") {
			$("#tags").fadeIn();
		}
	}
}

/* maj de la combo catégorie */
function update_category() {
	if ($("#category .select").children().size() == 0) {
		// update text
		$("#tag_category").html($("#category .select").text());
		// update visibility
		if ($("#tag_category").parent("dd").hasClass("hide")) {
			$("#tag_category").parent("dd").removeClass("hide")
		}
		if ($("#tags").css("display") == "none") {
			$("#tags").fadeIn();
		}
	}
}

/* Add New Tags */
function add_tag(source, target) {
	var str = $(source).val();
	if (str !== "") {
		// check if maxium of tags allowed is reached
		if ($(target).children("dd").length >= tag_max) {
			$(source).css("margin-bottom", "0");
			$(source).set_validation(false, $app_msg.tag_max);
		} else {
			// check if tag already exists in tags list
			$(target).children("dd").each(function() {
				if ($(this).children().text() == str) {
					$(source).css("margin-bottom", "0");
					$(source).set_validation(false, $app_msg.tag_dup);
				}
			});
		}
		// add tag to tags list if no error found
		if ($(source).attr("data-invalid") !== "true") {
			$(target).append("<dd data-alert data-tag><span class='label radius'>" + str + "<a href='javascript:void(0)' class='close'></a></span></dd>\n");
			$(target).foundation("alert");
			$(source).val("");
			$(source).css("margin-bottom", "");
			$(source).set_validation(true);
			$(source).removeClass("valid");
		}
	} else {
		$(source).css("margin-bottom", "");
		$(source).set_validation(true);
		$(source).removeClass("valid");
	}
}

/* Display indexation panel (i.e. tags editing) */
function toggle_tags() {
	$(".tags").blur();
	if ($(".tags").data("preventClick") !== "true" && $(".tags").data("preventToggle") !== "true") {
		$(".tags").toggleClass("active");
		if ($("#indexing").is(":visible")) {
			$js_fx ? $("#indexing").slideUp(250) : $("#indexing").hide();
		} else {
			$(".tags").data("preventToggle", "true");
			if ($js_fx) {
				$("#indexing").slideDown(250, function() {
					scrollTo($("#indexing"), 250, $("#tags").outerHeight() + 16);
					$(".tags").removeData("preventToggle");
				});
			} else {
				$("#indexing").show();
				scrollTo($("#indexing"), 0, $("#tags").outerHeight() + 16);
				$(".tags").removeData("preventToggle");
			}
		}
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// créer ou ajout un article
function sendArticle() {
	// Edition
	var title = $("#title").val();
	var description = $("#summary").val();
	var body = $("#editor").html();

	// Categories
	var idCategory = $("#category li.selected").attr("data-value");
	var valueCategory = $("#category li.selected").text();
	var category = new Category(idCategory, valueCategory);

	// Rubriques
	var idRubrique = $("#rubric li.selected").attr("data-value");
	var valueRubrique = $("#rubric li.selected").text();
	var rubrique = new Rubrique(idRubrique, valueRubrique);

	// Tags
	var tags = [];
	$("[data-tag] span").each(function() {
		tags.push(new Tag($(this).attr("data-id"), $(this).text()));
	});

	var data = new Article(title, body, description, category, rubrique, tags);

	 $.ajax({
		 type: "PUT",
		 url: pathPUT,
		 contentType: "application/json; charset=utf-8",
		 data : JSON.stringify(data),
		 beforeSend: function(request) {
				header_authentication(request);
		 },
		 success: function(jqXHR, status, errorThrown) {
			 window.location.href = $articles;
		 },
		 error: function(jqXHR, status, errorThrown) {
			 ajax_error(jqXHR, status, errorThrown);
				if (jqXHR.status == 403) {
					checkTitleAJAX();
				}else if (jqXHR.status == 404) {
					createAlertBox($app_msg.article_deleted, "default");
				} else {
					createAlertBox();
				}
		 },
		 dataType: "json"
		 });
	return true;
};

function checkTitleAJAX() {
	if (typeof titleTimeoutValid !== "undefined") {
		clearTimeout(titleTimeoutValid);
	}
	var selector = $("#title");
	selector.set_validation(null);
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
					if ($("#title").val().length === 0) {
						selector.set_validation(false, "La saisie du titre est obligatoire");
					} else {
						selector.set_validation(false, "Ce titre est d&eacute;j&agrave; pris");
					}
				}, 500);
			}
		},
		dataType : "json"
	});
}

function checkRubric() {
	if ($("#rubric li.selected").text().length === 0) {
		$("#rubric").set_validation(false);
		if (!$("#indexing").is(":visible")) {
			toggle_tags();
		}
	} else {
		$("#rubric").set_validation(true);
	}
}

function checkCategory() {
	if ($("#category li.selected").text().length === 0) {
		$("#category").set_validation(false);
		if (!$("#indexing").is(":visible")) {
			toggle_tags();
		}
	} else {
		$("#category").set_validation(true);
	}
}

function checkSummary() {
	if ($("#summary").val().length === 0) {
		$("#summary").set_validation(false);
	} else {
		$("#summary").set_validation(true);
	}
}

function checkBody() {
	if (($("#editor").text().length == 0) || ($("#editor").length == 1 && $("#editor").children().hasClass("placeholder"))) {
		$("#editor").set_validation(false);
	} else {
		$("#editor").set_validation(true);
	}
}

/* ------------------------------------------------------------------ */
/* # Persistent events */
/* ------------------------------------------------------------------ */

// Save button form check validation
$("html").on("click", "#saveButton", function() {
	checkTitleAJAX();
	checkRubric();
	checkCategory();
	checkBody();
	checkSummary();
	if (isFormValid()) {
		sendArticle();
	}
});
// Title validation
$("html").on("blur", "#title", function() {
	checkTitleAJAX();
});
$("html").on("keypress", "#title", function(event) {
	if (event.which == 13) { // Enter
		checkTitleAJAX();
		$("#summary").focus();
	}
});
// Summary check validation
var t_summary = 0;
$("html").on("focus", "#summary", function() {
	clearTimeout(t_summary);
	$("#summary").set_validation(true);
});
$("html").on("blur", "#summary", function() {
	t_summary = setTimeout(function() {
		checkSummary();
	}, 250);
});
$("html").on("keydown", "#summary", function(event) {
	if (event.ctrlKey && event.which == 13) { // Ctrl + Enter
	toggle_tags();
	$("#rubric").focus();
	}
});
// Body validation
$("html").on("blur", "#editor", function() {
	checkBody();
});
// Tag new
$("html").on("focus", "#tag", function() {
	$(this).val(""); // erase
	$(this).css("margin-bottom", "");
	$(this).set_validation(true);
});
$("html").on("keydown", "#tag", function(event) {
	if (event.which == 13) { // Enter
		add_tag("#tag", "#tags");
	}
});
$("html").on("click", "#tag_add", function() {
	add_tag("#tag", "#tags");
});
// Tags list prevent click from child element
$("html").on("mouseenter", ".tags dd", function() {
	$(".tags").data("preventClick", "true");
});
$("html").on("mouseleave", ".tags dd", function() {
	$(".tags").removeData("preventClick");
});
// Tags list toggle indexation display
$("html").on("click", ".tags", function() {
	toggle_tags();
});
$("html").on("keypress", ".tags", function(e) {
	if (e.which === 13) { // Enter
		toggle_tags();
	}
});
// Options Select Labels
$("html").on("click", "label[for='rubric']", function() {force_focus("#" + $(this).attr("for"));});
$("html").on("click", "label[for='category']", function() {force_focus("#" + $(this).attr("for"));});
