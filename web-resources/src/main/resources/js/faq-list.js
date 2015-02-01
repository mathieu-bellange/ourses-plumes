/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"faq_list_tmpl" : $loc.tmpl + "faq-list.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.faq.title);
			/* Process */
			displayFAQ();
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function displayFAQ() {
	$.ajax({
		type : "GET",
		url : "/rest/faq",
		contentType : "application/json; charset=utf-8",
		success : function(faq, status, jqxhr) {
			$("main > header").after(file_pool.faq_list_tmpl(faq)).after(lb(1)); // process faq
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

// jQuery events go here
