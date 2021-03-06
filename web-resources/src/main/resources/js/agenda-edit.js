﻿/* ------------------------------------------------------------------ */
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
			$(".main-body").append(file_pool.agenda_tmpl).after(lb(1));
			getCalendarDays()
			agenda_ui.init({ // initialize ui component
				"decode_html"  : true,
				"template" : function(arg) {return file_pool.date_modal_edit_tmpl(arg)},
				"on_open" : function() {$("#agenda").disable_tabnav()},
				"on_close" : function() {$("#agenda").renable_tabnav(); $("#date_modal").data("caller").focus();},
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
	obj.nextAll(".desc").first().remove();
	obj.remove();
}

function delete_date_event(obj) {
	if ($conf.confirm_delete.date_event && $("#date_modal").find("[data-delete]").size() == 1) {
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
	$("#date_modal fieldset").append(file_pool.date_event_edit_tmpl({"id" : 0, "title" : "", "text" : ""}));
	$("#date_modal").svg_icons();
	init_date_event();
}

function init_date_event() {
	$("#date_modal textarea").autosize(autosize_cfg); // initialize autosize plugin
	$("#date_modal textarea").add_confirmation_bar(); // add confirmation to textarea
}

function check_date_event() {
	var a = $("#date_modal .title");
	var b = $("#date_modal .desc");
	// 1. Check fields validity
	a.check_validity();
	b.clean_value();
	// 2. Check form validity
	if (a.is_valid()) { // if all fields are valid
		var data = {
			"day" : new Date($("#date_modal time").attr("datetime")).valueOf(),
			"events" : []
		};
		$("#date_modal .title").each(function() {
			data["events"].push({
				"id"    : $(this).attr("id"),
				"title" : encode_html($(this).val()),
				"desc"  : encode_html($(this).nextAll(".desc").first().val(), true)
			});
		});
		send_date_event(data); // send data to db
	} else { // any field is invalid
		$("#date_modal").find("h2").first().create_alert_box($msg.form_invalid, "fail", {"timeout" : $time.duration.alert_long, "insert" : "after"}); // display form invalid alert
	}
}

function send_date_event(data) {
	$.ajax({
		type: "PUT",
		url: "/rest/agenda/" + data.day,
		contentType: "application/json; charset=utf-8",
		data : JSON.stringify(data.events),
		beforeSend: function(request) {
			header_authentication(request);
		},
		success: function(data, status, jqxhr) {
			remove_date_modal();
			$(".main-body").create_alert_box($msg.form_valid, null, {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert}); // display form valid alert
			var c = $("#date_modal").data("caller").parent(".over-block");
			var l = $(file_pool.date_event_list_tmpl({"events" : data.events}));
			if (!c.hasClass("has-event")) {c.addClass("has-event")}
			c.find(".event-list").remove(); // remove event list
			c.find(".over").after(l); // insert event list
			c.svg_icons(); // reload svg icons
		},
		error: function(jqXHR, status, errorThrown) {
			remove_date_modal();
			createAlertBox();
		},
		dataType: "json"
	});
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */
var calendarTimer = 1;
function getCalendarDays() {
	$.ajax({
		type: "GET",
		url: "/rest/agenda/noCache",
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
				$(".main-body").append(file_pool.error_tmpl).after(lb(1));
			}else if (jqXHR.status == 503){
				setTimeout(function(){
					calendarTimer = calendarTimer * 10;
					getCalendarDays();
					}, calendarTimer);
				
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
