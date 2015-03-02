/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"agenda_tmpl" : $loc.tmpl + "agenda.tmpl",
	"agenda_mptl" : $loc.tmpl + "agenda-view.mptl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.agenda.title);
			/* Insert template */
			$(".main-body").append(file_pool.agenda_tmpl).after(lb(1));
			getCalendarDays();
			agenda_ui.init({"template" : function(arg) {return file_pool.date_modal_tmpl(arg)}}); // initialize ui component
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getCalendarDays() {
	$.ajax({
		type: "GET",
		url: "/rest/agenda",
		contentType: "application/json; charset=utf-8",
		success: function(data, status, jqxhr) {
			agenda_ui.build(data);
		},
		error: function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				$(".main-body").append(file_pool.error_tmpl).after(lb(1));
			} else {
				createAlertBox();
			}
		},
		dataType: "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// Live events go here
