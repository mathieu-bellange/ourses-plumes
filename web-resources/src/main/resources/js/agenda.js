/* ------------------------------------------------------------------ */
/* # Files Loading */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"agenda_tmpl" : $loc.tmpl + "agenda.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	/* Set page title */
	set_page_title($nav.agenda.title);
	/* Insert template */
	$("main > header").after(file_pool.agenda_tmpl).after(lb(1));
});

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

$("html").on("mouseenter", ".date-table .href-block.has-event", function() {
	$(this).addClass("mouseenter");
	var handler = $(this);
	handler.data("hover", true);
	setTimeout(function() {
		if (handler.data("hover") == true) {
			handler.css("width", handler.outerWidth());
			handler.css("position", "absolute");
			handler.css("z-index", "10");
			$conf.js_fx ? handler.children(".event-list").slideDown("fast") : handler.children(".event-list").show();
		}
	}, 400);
});
$("html").on("mouseleave", ".date-table .href-block.has-event", function() {
	$(this).data("hover", false);
	$(this).removeClass("mouseenter");
	if ($conf.js_fx) {
		$(this).children(".event-list").slideUp("slow", function() {
			$(this).css("position", "relative");
			$(this).css("z-index", "auto");
		});
	} else {
		$(this).children(".event-list").hide();
		$(this).css("position", "relative");
		$(this).css("z-index", "auto");
	}
});
