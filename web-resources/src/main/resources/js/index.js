/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"index_tmpl" : $loc.tmpl + "index.tmpl",
	"article_list_tmpl" : $loc.tmpl + "online-article-list.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.home.title);
			displayArticles();
			/* Insert template */
			$("main > header").after(file_pool.index_tmpl).after(lb(1));
		},
		init : function() {
			/* Little Slider */
			var list = "#changes_list", less = "#show_less", more = "#show_more";
			var max = $(list).find("li").length, lim = 8, num = max / lim;
			if (num > 1) { $(more).removeClass("disabled") } // activate more
			var index = 0; // internal
			$(less).click(function() {
				if (index > 0) {
					$(list).animate({
						"top" : parseFloat($(list).css("top")) + (lim * (2.0).toPx())
					}, 250); // slide
					index--; // decrement
					$(more).removeClass("disabled"); // activate more
					if (index == 0) {
						$(this).addClass("disabled"); //deactivate self
					}
				}
			});
			$(more).click(function() {
				if (num > index + 1) {
					$(list).animate({
						"top" : parseFloat($(list).css("top")) - (lim * (2.0).toPx())
					}, 250); // slide
					index++; // increment
					// activate less
					$(less).removeClass("disabled");
					if (index + 1 > num) {
						$(this).addClass("disabled"); // deactivate self
					}
				}
			});
			$(less + ", " + more).click(function() { $(this).blur()} );
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayArticles() {
	$.ajax({
		type : "GET",
		url : "/rest/articles/last",
		contentType : "application/json; charset=utf-8",
		success : function(articles, status, jqxhr) {
			$("main > header").after(file_pool.article_list_tmpl(articles)).after(lb(1));
			$("#articles").svg_icons(); // always reload icons only for articles
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

/* Close */
$("html").on("click", ".row .close", function() {
	var columns = $(this).parents(".row").find(".column"),
			column = $(this).parents(".column").first();
	setTimeout(function() {
		columns.addClass("small-centered medium-centered large-centered");
		column.remove();
	}, 500);
});

