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
var faqTimer = 1;
function displayFAQ() {
	$.ajax({
		type : "GET",
		url : "/rest/faq",
		contentType : "application/json; charset=utf-8",
		success : function(faq, status, jqxhr) {
			$(".main-body").append(file_pool.faq_list_tmpl(faq)).after(lb(1)); // process faq
			$(".faq").svg_icons()// reload svg icons
			faq_ui.init(); // init ui component
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 503){
				setTimeout(function(){
					faqTimer = faqTimer * 10;
					displayFAQ();
				}, faqTimer);
			}
		},
		dataType : "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
