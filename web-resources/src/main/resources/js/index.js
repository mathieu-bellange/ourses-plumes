/* ------------------------------------------------------------------ */
/* # Pre Processing */
/* ------------------------------------------------------------------ */

set_page_title($nav.home.title);

/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("main > header").after(loadfile($loc.tmpl + "index.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// AJAX stuff goes here

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

/* Close */
$(".row .close").click(function() {
	var columns = $(this).parents(".row").find(".column"),
			column = $(this).parents(".column").first();
	setTimeout(function() {
		columns.addClass("small-centered medium-centered large-centered");
		column.remove();
	}, 500);
});

/* Tiny Lovely Slider for Changelog :D */
$(document).ready(function() {
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
});
