/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("main > header").after(loadfile($app_root + "tmpl/agenda.tmpl"));

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

$("html").on("mouseenter", ".date-table .href-block.has-event", function() {
	$(this).addClass("mouseenter");
	var handler = $(this);
	handler.data("hover", true);
	setTimeout(function() {
		if (handler.data("hover") == true) {
			handler.css("width", handler.outerWidth());
			handler.css("position", "absolute");
			handler.css("z-index", "10");
			$js_fx ? handler.children(".event-list").slideDown("fast") : handler.children(".event-list").show();
		}
	}, 400);
});
$("html").on("mouseleave", ".date-table .href-block.has-event", function() {
	$(this).data("hover", false);
	$(this).removeClass("mouseenter");
	if ($js_fx) {
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
