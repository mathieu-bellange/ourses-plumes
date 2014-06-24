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

/* Forecasted Date */
function convert_date_format(digit, literal) {
	var date = digit.val(); // Retrieve date value
	var err_prefix = "<strong>Erreur</strong>&#8239;: " // Set error message string prefix
	// var q = /^(\d{2})\/(\d{2})\/(\d{4})$/; // Set regular expression query DD/MM/YYYY
	var q = /^(\d{2})(\/|-)(\d{2})(\/|-)(\d{4})$/; // Set regular expression query DD/MM/YYYY
	var r = date.match(q); // Set regular expression result from match
	if (r !== null) {
		if (r[1] > 0 && r[1] <= 31 && r[3] > 0 && r[3] <= 12 && r[5] >= 2014) {
			switch(r[3]) {
				case "01" : r[3] = "janvier"; break;
				case "02" : r[3] = "f&eacute;vrier"; break;
				case "03" : r[3] = "mars"; break;
				case "04" : r[3] = "avril"; break;
				case "05" : r[3] = "mai"; break;
				case "06" : r[3] = "juin"; break;
				case "07" : r[3] = "juillet"; break;
				case "08" : r[3] = "ao&ucirc;t"; break;
				case "09" : r[3] = "septembre"; break;
				case "10" : r[3] = "octobre"; break;
				case "11" : r[3] = "novembre"; break;
				case "12" : r[3] = "d&eacute;cembre"; break;
			}
			if (r[1] == "01" ) {
				r[1] = "1<sup>er</sup>";
			} else if (r[1].slice(0,1) == 0) {
				r[1] = r[1].slice(1,2);
			}
			literal.html(r[1] + " " + r[3] + " " + r[5]);
		} else if (r[1] == 0 || r[1] > 31) { // Day invalid
			literal.html(err_prefix + "Jour invalide <small class='text-steel'>(<strong class='red'>01-31</strong>/MM/AAAA)</small>");
		} else if (r[3] == 0 || r[3] > 12) { // Month invalid
			literal.html(err_prefix + "Mois invalide <small class='text-steel'>(JJ/<strong class='red'>01-12</strong>/AAAA)</small>");
		} else if (r[5] == 0 || r[5] < 2014) { // Year wrong
			literal.html(err_prefix + "Ann&eacute;e incorrecte <small class='text-steel'>(JJ/MM/<strong class='red'>2014+</strong>)</small>");
		} else { // Any other date mistake
			literal.html(err_prefix + "Date erron&eacute;e &hellip;");
		}
	} else if (digit.val().length > 0) { // Wrong date format
		literal.html(err_prefix + "Format de date incorrect <small class='text-steel'>(<strong class='red'>JJ/MM/AAAA</strong>)</small>");
	} else {
		literal.html("&hellip;");
	}
}
$("html").on("blur", "#date", function() {
	convert_date_format($(this), $("#date_literal"));
});
$("html").on("keydown", "#date", function(e) {
	if (e.which == 13) { // Enter
		convert_date_format($(this), $("#date_literal"));
	}
});

/* Rubric and Category */
$("html").on("change", "#rubric", function() {
	$("#tag_rubric").text($(this).val());
	$("#tag_rubric").removeClass();
	if ($("#tag_rubric").parent("dd").hasClass("hide")) {
		$("#tag_rubric").parent("dd").removeClass("hide")
	}
	if ($(this).children("option").filter(":selected").attr("data-color")) {
		$("#tag_rubric").addClass("label radius " + $(this).children("option").filter(":selected").attr("data-color"));
	} else {
		$("#tag_rubric").addClass("label radius secondary");
	}
});
$("html").on("change", "#category", function() {
	$("#tag_category").text($(this).val());
	if ($("#tag_category").parent("dd").hasClass("hide")) {
		$("#tag_category").parent("dd").removeClass("hide")
	}
});

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
			$(source).next("small.error").addClass("hide");
			$(target).append("<dd data-alert><span class='label radius'>" + str + "<a href='javascript:void(0)' class='close'></a></span></dd>\n");
			$(target).foundation("alert");
			$(source).val("");
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
$("html").on("click", "#tag_add", function() {
	add_tag("#tag", "#tags");
});
$("html").on("keydown", "#tag", function(e) {
	hide_error("#tag");
	if (e.which == 13) { // Enter
		add_tag("#tag", "#tags");
	}
});
$("html").on("focus", "#tag", function() {
	hide_error("#tag", true);
});
$("html").on("blur", "#tag", function() {
	hide_error("#tag");
});
