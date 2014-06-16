/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("header + hr").after(doT.compile(loadfile($app_root + "tmpl/editor.tmpl")));

/* ------------------------------------------------------------------ */
/* # Editor */
/* ------------------------------------------------------------------ */

function Article(){
		this.title = $('#title').val();
		this.body = $('#editor').val();
		this.publication = $('#publication').val();
		this.label = $('#label').val();
		this.category = $('#category').val();
		this.toJson = function(){
			return JSON.stringify(this);
		};
};

function Category(){
	this.id;
	this.category;
	this.toJson = function(){
		return JSON.stringify(this);
	}
	this.toDto = function(json){
		var cat = JSON.parse(json);
		this.id = cat.id;
		this.category = cat.category;
	}
}

function processCategory(json){
	$.each(json, function(i, obj) {
		$('#category').append($("<option/>", {
			value: obj.id,
			text: obj.category
		}));
	});
}

function sendArticle(){
	var article = new Article();
	// $.ajax({
		// type: "POST",
		// url: "http://localhost:8080/rest/article",
		// contentType: "application/json; charset=utf-8",
		// data : JSON.stringify(data),
		// success: function(jqXHR, status, errorThrown) {
			// alert(status);
		// },
		// error: function(jqXHR, status, errorThrown) {
			// alert(status);
		// },
		// dataType: "json"
		// });
	return true;
};

$.getJSON("http://localhost:8080/rest/category", function(json){
	processCategory(json);
 });

$(document).ready(function(){
	$('#editor').ckeditor();
});

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

/**
 * addTag()
 */
function addTag(source, target) {
	var str = $(source).val();
	if (str !== "") {
		$(target).append("<dd><span class='label radius' data-alert>" + str + "<a href='javascript:void(0)' class='close'></a></span></dd>\n");
		$(target).foundation("alert");
	}
}
$("html").on("click", "#tag_add", function() {
	addTag("#tag", "#tag_holder");
});
$("html").on("keydown", "#tag", function(e) {
	if (e.which == 13) { // Enter
		addTag("#tag", "#tag_holder");
	}
});


/**
 * Selects
 * To be put in loap.js
 */
// $("html").on("click", "body", function() {
	// $(".select").each(function() {
		// if ($(this).find(".options").css("display") != "none" && !$(this).is(":hover")) {
			// $(this).find(".options").slideToggle("fast");
		// }
	// });
// });
$("html").on("blur", ".select", function(event) {
	$(this).find(".options").slideUp("fast");
});
$("html").on("click", ".select > .value", function() {
	// alert($(this).next(".options").height());
	// alert($(window).scrollTop());
	// alert($(document).scrollTop());
	// alert($(document).height());
	// alert($(window).height());
	$(this).next(".options").slideToggle("fast");
});
$("html").on("click", ".select > .options > li", function() {
	if (!$(this).hasClass("disabled")) {
		var str = $(this).text();
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");
		$(this).parent(".options").prev(".value").text(str);
		$(this).parent(".options").slideToggle("fast");
	}
});
$("html").on("keydown", ".select", function(event) {
	if (event.which == 27) { // Escape
		$(this).find(".options").slideUp("fast");
	}
	if (event.which == 13 || event.which == 32) { // Enter OR Space
		var str = $(this).find(".options > li.selected").text();
		$(this).find(".value").text(str);
		$(this).find(".options").slideToggle("fast");
	}
	if (event.which == 38 || event.which == 40) { // Up or Down
		event.preventDefault();
		var idx = $(this).find(".options > li.selected").index();
		if (idx == -1) {
			$(this).find(".options > li").not(".disabled").first().addClass("selected");
			idx = 0;
		}
		if (event.which == 38 && idx - 1 >= 0) { // Up
			$(this).find(".options > li:eq(" + idx + ")").prevAll("li:not(.disabled)").first().addClass("selected");
			if ($(this).find(".options > li:eq(" + idx + ")").prevAll("li:not(.disabled)").first().hasClass("selected")) {
				$(this).find(".options > li:eq(" + idx + ")").removeClass("selected");
			}
		}
		if (event.which == 40 && idx + 1 < $(this).find(".options > li").length) { // Down
			$(this).find(".options > li:eq(" + idx + ")").nextAll("li:not(.disabled)").first().addClass("selected");
			if ($(this).find(".options > li:eq(" + idx + ")").nextAll("li:not(.disabled)").first().hasClass("selected")) {
				$(this).find(".options > li:eq(" + idx + ")").removeClass("selected");
			}
		}
	}
});
$(document).ready(function() {
	$(".select").each(function() {
		if ($(this).find(".options > li").hasClass("selected")) {
			var str = $(this).find(".options > li.selected").text();
			$(this).find(".value").text(str);
		}
	});
});
// WARNING : add scroll bottom if window bottom position < box bottom position !!!
// WARNING : add switch options while pressing down/up arrows if select focus and options not visible  !!!
