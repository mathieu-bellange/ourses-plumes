﻿/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"about_tmpl" : $loc.tmpl + "about.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.about.title);
			/* Insert template */
			$("main > header").after(file_pool.about_tmpl).after(lb(1));
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

// jQuery events go here
