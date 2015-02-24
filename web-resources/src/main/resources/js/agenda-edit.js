/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var agenda_edit = true; // global flag

var loax_pool = {
	"agenda_tmpl" : $loc.tmpl + "agenda.tmpl",
	"agenda_mptl" : $loc.tmpl + "agenda-view.mptl",
	"agenda_edit_mptl" : $loc.tmpl + "agenda-edit.mptl"
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
			$("main > header").after(file_pool.agenda_tmpl).after(lb(1));
			getCalendarDays()
			agenda_ui.init({ // initialize ui component
				"template" : function(arg) {return file_pool.date_modal_edit_tmpl(arg)},
				"on_open" : function() {$("#agenda").disable_tabnav()},
				"on_close" : function() {$("#agenda").renable_tabnav()},
				"on_opened" : function() {
					$("#date_modal").find(".close-reveal-modal").focus();
					init_date_event();
				}
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function remove_date_modal() {
	$("#date_modal").foundation("reveal", "close");
}

function remove_date_event(obj) {
	if ($("#date_modal").find("[data-delete]").size() == 1) {
		var c = $("#date_modal").data("caller").parent(".over-block");
		c.find(".event-list").remove(); // remove event list
		c.removeClass("has-event"); // remove has event class
		remove_date_modal() // remove modal
	}
	obj.nextAll(".title").first().next(".error").remove();
	obj.nextAll(".title").first().remove();
	obj.nextAll(".description").first().remove();
	obj.remove();
}

function delete_date_event(obj) {
	if ($conf.confirm_delete.date_event) {
		var modal_options = {
			"text" : $msg.confirm_delete.date_event,
			"class" : "panel radius",
			"on_confirm" : function() {
				remove_date_event(obj);
			}
		};
		$("body").create_confirmation_modal(modal_options);
	} else {
		remove_date_event(obj);
	}
}

function create_date_event() {
	$("#date_modal fieldset").append(file_pool.date_event_edit_tmpl({"title" : "", "text" : ""}));
	$("#date_modal").svg_icons();
	init_date_event();
}

function init_date_event() {
	$("#date_modal textarea").autosize(autosize_cfg); // initialize autosize plugin
	$("#date_modal textarea").add_confirmation_bar(); // add confirmation to textarea
}

function check_date_event() {
	var a = $("#date_modal .title");
	var b = $("#date_modal .description");
	// 1. Check fields validity
	a.check_validity();
	b.clean_value();
	// 2. Check form validity
	if (a.is_valid()) { // if all fields are valid
		var data = [];
		$("#date_modal .title").each(function() {
			data.push({
				"title" : encode_html($(this).val()),
				"description" : encode_html($(this).nextAll(".description").first().val(), true)
			});
		});
		send_date_event(data); // send data to db
	} else { // any field is invalid
		$("#date_modal").find("h2").first().create_alert_box($msg.form_invalid, "fail", {"timeout" : $time.duration.alert_long}); // display form invalid alert
	}
}

function send_date_event(data) {
//////////////////////////////////////////////////////////////////
// 1. save data
// 2. remove modal
// 3. display success alert
// 4. update date table with new values
//////////////////////////////////////////////////////////////////
// TODO : AJAX
//////////////////////////////////////////////////////////////////
// - on fail : display error alert
// - on success : register output to db
//////////////////////////////////////////////////////////////////
	alert("output : " + JSON.stringify(data));
//////////////////////////////////////////////////////////////////
	remove_date_modal();
//////////////////////////////////////////////////////////////////
	$("main > header").create_alert_box($msg.form_valid, null, {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert}); // display form valid alert
//////////////////////////////////////////////////////////////////
	var c = $("#date_modal").data("caller").parent(".over-block");
	var l = $(file_pool.date_event_list_tmpl({"events" : data}));
	if (!c.hasClass("has-event")) {c.addClass("has-event")}
	c.find(".event-list").remove(); // remove event list
	c.find(".over").before(l); // insert event list
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getCalendarDays() {
	$.ajax({
		type: "GET",
		url: "/rest/agenda",
		contentType: "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success: function(data, status, jqxhr) {
			agenda_ui.build(data);
		},
		error: function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				$("main > header").after(file_pool.error_tmpl).after(lb(1));
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

$(document)
	// Data Handling
	.on("click", "#date_modal [data-delete]", function() {delete_date_event($(this))}) // delete date event
	.on("click", "#date_modal .button-bar [data-add]", function() {create_date_event()}) // create date event
	.on("click", "#date_modal .button-bar [data-submit]", function() {check_date_event()}) // submit date modal
	.on("click", "#date_modal .button-bar [data-cancel]", function() {remove_date_modal()}); // cancel date modal
