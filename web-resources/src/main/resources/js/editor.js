/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */
var template = doT.compile(loadfile($app_root + "tmpl/editor.tmpl"));
// si le path est /articles/{id}, c'est l'article avec l'id passé en param à aller chercher
if(/^\/articles\/[0-9]+/.test(window.location.pathname)){
	$.ajax({
		type: "GET",
		url: "/rest" + window.location.pathname,
		contentType: "application/json; charset=utf-8",
		beforeSend: function(request){
			header_authentication(request);
		},
		success: function(data, status, jqxhr) {
			processArticle(data);
		},
		error: function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404){
				// TODO créer un template not found dans les cas où on récupère une erreur 404
				alert("non trouvé - tmpl 404 à faire ?")
			}else{
				createAlertBox();
			}
		},
		dataType: "json"
	});
}
// sinon c'est une création d'article
else{
	processArticle(new Article("","","",null,null,[]));
}

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function Article(title, body, description, category, rubrique, tags){
		this.title = title;
		this.body = body;
		this.description = description;
		this.category = category;
		this.rubrique = rubrique;
		this.tags = tags;
		this.toJson = function(){
			return JSON.stringify(this);
		};
};

function Category(id,value){
	this.id = id;
	this.category = value;
	this.toJson = function(){
		return JSON.stringify(this);
	}
}

function Rubrique(id,value){
	this.id = id;
	this.rubrique = value;
	this.toJson = function(){
		return JSON.stringify(this);
	}
}

function Tag(id,value){
	this.id = id;
	this.tag = value;
	this.toJson = function(){
		return JSON.stringify(this);
	}
}

function isFormValid(){
	var isTitleValid = !$("#title").attr("data-invalid");
	return isTitleValid;
}

/* ------------------------------------------------------------------ */
/* # DOM manipulation */
/* ------------------------------------------------------------------ */

/* processing de la page */

// le path de la création/maj d'un article
var pathPUT;
// le path du check d'un article
var pathTitle;

function processArticle(article){
	// affiche le template en passant en param l'article
	// la catégorie et la rubrique ne sont pas setté dans le template
	// il faut attendre la récupération asynchrone des données 
	$("header + hr").after(template(article));
	// le js est rattaché aux nouveaux articles avec comme path /articles/nouveau 
	// et aux draft en update avec comme path /articles/{id}
	
	//si il y a un id dans le path on est en update
	if(/^\/articles\/[0-9]+/.test(window.location.pathname)){
		pathPUT = "/rest" + window.location.pathname;
		pathTitle = "/rest/articles/check/title?id=" + article.id; 
	}
	//sinon en création
	else{
		pathPUT = "/rest/articles/create";
		pathTitle = "/rest/articles/check/title";
	}
	
	$.getJSON("/rest/categories", function(json){
		processCategory(json);
		//TODO injection de la valeur de l'article
	 });

	$.getJSON("/rest/rubriques", function(json){
		processRubric(json);
		//TODO injection de la valeur de l'article
	});
	$('#editor').ckeditor();
	
	// bind events après le chargement du template par dot.js
	$("#rubric").bind({
		blur: function() {update_rubric();},
		click: function() {update_rubric();},
		keyup: function() {update_rubric();}
	});
	$("#category").bind({
		blur: function() {update_category();},
		click: function() {update_category();},
		keyup: function() {update_category();}
	});
	$("#tag").bind({
		blur: function() {
			hide_error("#tag");
		},
		focus: function() {
			hide_error("#tag", true);
		},
		keydown: function(event) {
			hide_error("#tag");
			if (event.which == 13) { // Enter
				add_tag("#tag", "#tags");
			}
		}
	});
	$("#tags").on("click", ".close", function() {
		setTimeout(function() {
			if ($("#tags").children("dd").length == 2) {
				if ($("#tag_rubric").parent("dd").hasClass("hide") && $("#tag_category").parent("dd").hasClass("hide")) {
					$("#tags").fadeOut();
				}
			}
		}, 500);
	});
	// recharge foundatin pour les tags ajoutés directement par le template
	$("#tags").foundation("alert");
}

function processCategory(json){
	$.each(json, function(i, obj) {
		$('#category ul').append($("<li/>", {
			"data-value": obj.id,
			text: obj.category
		}));
	});
}

function processRubric(json){
	$.each(json, function(i, obj) {
		var li = $("<li/>", {
			"data-value": obj.id,
			"data-color" : obj.classe
		});
		var span = $("<span/>",{
			className : "icon-" + obj.classe + " small",
			style : "margin-right: .25rem;"
		});
		li.append(span);
		li.text(obj.rubrique);
		$('#rubric ul').append(li);
	});
}

/* maj de la rubrique */
function update_rubric() {
	if ($("#rubric .select").children().size() == 0) {
		// update text
		$("#tag_rubric").text($("#rubric .select").text());
		// update color
		$("#tag_rubric").removeClass();
		if ($("#rubric .selected").attr("data-color")) {
			$("#tag_rubric").addClass("label radius " + $("#rubric .selected").attr("data-color"));
		} else {
			$("#tag_rubric").addClass("label radius secondary");
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
		$("#tag_category").text($("#category .select").text());
		// update visibility
		if ($("#tag_category").parent("dd").hasClass("hide")) {
			$("#tag_category").parent("dd").removeClass("hide")
		}
		if ($("#tags").css("display") == "none") {
			$("#tags").fadeIn();
		}
	}
}
/* Tags */
var tag_num_lim = 8;
var tag_err_msg = ["Limite de tags autoris&eacute;e atteinte", "Cette &eacute;tiquette a d&eacute;j&agrave; &eacute;t&eacute; choisie"];
function add_tag(source, target) {
	var str = $(source).val();
	var is_valid = true;
	if (str !== "") {
		// Check if maxium of tags allowed is reached
		if ($(target).children("dd").length >= tag_num_lim) {
			$(source).next("small.error").html(tag_err_msg[0]);
			$(source).next("small.error").removeClass("hide");
			is_valid = false;
		} else {
			// Check if tag already exists
			$(target).children("dd").each(function() {
				if ($(this).children().text() == str) {
					$(source).next("small.error").html(tag_err_msg[1]);
					$(source).next("small.error").removeClass("hide");
					is_valid = false;
				}
			});
		}
		// Add tag to tags list
		if (is_valid == true) {
			$(target).append("<dd data-alert data-tag><span class='label radius'>" + str + "<a href='javascript:void(0)' class='close'></a></span></dd>\n");
			$(target).foundation("alert");
			$(source).val("");
			$(source).next("small.error").addClass("hide");
			if ($("#tags").css("display") == "none") {
				$("#tags").fadeIn();
			}
		}
	} else {
		$(source).next("small.error").addClass("hide");
	}
}
function hide_error(obj, clear) {
	var clear = clear || false;
	if (!$(obj).next("small.error").hasClass("hide")) {
		$(obj).next("small.error").addClass("hide")
		if (clear) {
			$(obj).val("");
		}
	}
}

/* Alert box */
function setValidationIcon(selector, labelSelector, isValid) {
	if (isValid == true) {
		$(selector).addClass("valid");
		$(selector).removeAttr("data-invalid");
		$(selector).removeClass("wrong");
		$(selector).removeClass("loading");
		$("[for='" + selector.attr("id") + "']").removeClass("error");
		$(labelSelector).addClass("hide");
	} else if (isValid == false) {
		$(selector).removeClass("valid");
		$(selector).attr("data-invalid",true);
		$(selector).addClass("wrong");
		$(selector).removeClass("loading");
		$("[for='" + selector.attr("id") + "']").addClass("error");
		$(labelSelector).removeClass("hide");
	} else {
		$(selector).removeClass("valid");
		$(selector).removeClass("wrong");
		$(selector).addClass("loading");
		setTimeout(function(){$(selector).removeClass("loading")}, 1000);
	}
}

function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#article-alert").length == 0) {
		$("header + hr").after(alert_box_template({"id" : "article-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			$(document).foundation("alert"); // reload Foundation alert plugin for whole document (i.e. alert-box cannot be closed bug fix)
		}
		$("#article-alert").fadeIn(300);
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// créer ou ajout un article
function sendArticle(){
	//Edition
	var title = $("#title").val();
	var description = $("#summary").val();
	var body = $("#editor").val();
	
	//Categories
	var idCategory = $("#category li.selected").attr("data-value");
	var valueCategory = $("#category li.selected").text();	
	var category = new Category(idCategory, valueCategory);
	
	//Rubriques
	var idRubrique = $("#rubric li.selected").attr("data-value");
	var valueRubrique = $("#rubric li.selected").text();
	var rubrique = new Rubrique(idRubrique, valueRubrique);
	
	//Tags
	var tags = [];
	$("[data-tag] span").each(function(){
		tags.push(new Tag(null, $(this).text()));
	});
	
	var data = new Article(title, body, description, category, rubrique, tags);
	
	 $.ajax({
		 type: "PUT",
		 url: pathPUT,
		 contentType: "application/json; charset=utf-8",
		 data : JSON.stringify(data),
		 beforeSend: function(request){
				header_authentication(request);
		 },
		 success: function(jqXHR, status, errorThrown) {
			 window.location.href = $articles;
		 },
		 error: function(jqXHR, status, errorThrown) {
			 ajax_error(jqXHR, status, errorThrown);
				if (jqXHR.status == 403){
					checkTitleAJAX();
				}else{
					createAlertBox();
				}
		 },
		 dataType: "json"
		 });
	return true;
};

function checkTitleAJAX(){
	if (typeof titleTimeoutValid !== "undefined") {
		clearTimeout(titleTimeoutValid);
	}
	var selector = $("#title");
	setValidationIcon(selector,$("#titleError"), null);
	var title = selector.val();
	$.ajax({
		type : "POST",
		url : pathTitle,
		contentType : "application/json; charset=utf-8",
		data : title,
		beforeSend: function(request){
			header_authentication(request);
		},
		success : function(data, textStatus, jqXHR) {
			pseudoTimeoutValid = setTimeout(function(){
				setValidationIcon(selector,$("#titleError"), true)}, 500);
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 403){
				pseudoTimeoutValid = setTimeout(function(){setValidationIcon(selector, $("#titleError"), false)}, 500);
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$("html").on("click","#saveButton",function(){
	if (isFormValid()){
		sendArticle();
	}
});

$("html").on("change","#title",function(event){
	checkTitleAJAX();
});

$("html").on("click", "#tag_add", function() {
	add_tag("#tag", "#tags");
});


