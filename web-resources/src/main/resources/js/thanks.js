/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"thanks_tmpl" : $loc.tmpl + "thanks.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.thanks.title);
			/* Insert template */
			$("main > header").after(file_pool.thanks_tmpl).after(lb(1));
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// AJAX stuff goes here

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$(document).on("click", ".thanks-list .picture[tabindex]", function() {
	// Configuration
	var s = 256; // [Integer] Size of the picture clone (px). Default = 256
	var d = 375; // [Integer] Duration of clone animation (ms). Default = 375
	// Internals
	d = $conf.js_fx ? d : 0;
	// Functions
	function remove_clones() {
		$(".picture[data-clone]").finish();
		$(".picture[data-clone]").fadeOut((d / 2), function() {
			$(".thanks-list .picture[tabindex]").removeClass("active");
			$(this).remove();
		})
	}
	// Execution
	if (!$(this).hasClass("active")) {
		$(this).addClass("active");
		var clone = $(this).clone();
		var x = $(this).offset().left, y = $(this).offset().top;
		var w = $(this).width(), h = $(this).height();
		$("body").append(clone);
		clone
			.html($(this).parent().text())
			.attr("data-clone", true)
			.css({
				"position" : "absolute",
				"cursor" : "pointer",
				"left" : x,
				"top" : y,
				"width" : w,
				"height" : h,
				"line-height" : w,
				"color" : "white",
				"text-indent" : "0",
				"font-size" : "1.5rem",
				"font-weight" : "bold",
				"text-align" : "center",
				"text-shadow" : "1px 1px 1px black",
				"border-radius" : "100%",
				"outline" : "none"
			});
		clone.click(function() {remove_clones()});
		$(this).on("blur", function() {remove_clones()});
		$(document).on("keydown", function(e) {
			if (e.which == 27) { // Escape
				remove_clones();
			}
		});
		clone.animate({
			"width" : s,
			"height" : s,
			"left" : Modernizr.mq("(min-width: 800px)") ? x - ((s) / 2) + (h / 2) : x,
			"top" : y - ((s) / 2) + (w / 2),
			"line-height" : (s + s / 2).toString() + "px",
		}, d);
	} else {
		remove_clones();
	}
});
