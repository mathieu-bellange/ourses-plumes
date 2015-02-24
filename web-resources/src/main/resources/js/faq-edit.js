/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"faq_edit_mptl" : $loc.tmpl + "faq-edit.mptl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title("Modifier les " + $nav.faq.title);
			/* Process */
			displayFAQ();
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function confirm_delete(obj) {
	if ($conf.confirm_delete.faq) {
		var modal_options = {
			"text" : $msg.confirm_delete.faq,
			"class" : "panel callout radius",
			"on_confirm" : function() {
				delete_faq(obj)
			}
		};
		obj.create_confirmation_modal(modal_options);
	} else {
		delete_faq(obj)
	}
}

function check_faq() {
	var q = $(".faq.edit .question > input");
	var a = $(".faq.edit .answer > textarea");
	var c = function(s) { // custom condition
		return (s == "zizi" || s == "bite" ? false : true); // not 'zizi' and not 'bite'
	}
	// 1. Check fields validity
	q.check_validity(c, "Les zizis et les bites ne sont pas tol&eacute;r&eacute;s&nbsp;!"); // check all question fields with custom condition and custom message
	a.check_validity(); // check all answer fields with default condition (not empty)
	// 2. Check form validity
	if (q.add(a).is_valid()) { // if all fields are valid
		var data = [];
		$(".faq.edit .question").each(function() {
			data.push({
				"question" : encode_html($(this).find("input").val()),
				"answer" : encode_html($(this).next(".answer").find("textarea").val(), true)
			});
		});
		submit_faq(data); // send data to db
	} else { // any field is invalid
		$(".faq.edit .answer > textarea").each(function() {
			if ($(this).data("valid") == false) {
				faq_ui.open($(this).parent(), -1); // force open tab withtout scrolling
			}
		});
		$("main > header").create_alert_box($msg.form_invalid, null, {"timeout" : $time.duration.alert_long}); // display form invalid alert
	}
}

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
			$(".faq textarea").add_confirmation_bar(); // add confirmation to textarea
			$(".faq").svg_icons()// reload svg icons
			faq_ui.init(); // init ui component
		},
		error : function(jqXHR, status, errorThrown) {
			createAlertBox();
		},
		dataType : "json"
	});
}

function create_faq() {
	////////////////////////////////////////////////////////////////
	// TODO
	////////////////////////////////////////////////////////////////
	// AJAX : get faq new id
	// - on fail, display error
	// - on success, process faq template with param new id
	////////////////////////////////////////////////////////////////
	$(".faq.edit").append(file_pool.faq_item_tmpl({"question" : "", "answer" : ""})); // append faq item template
	$("textarea").add_confirmation_bar(); // add confirmation to textarea
	$(".faq.edit").svg_icons()// reload svg icons from parent
}

function delete_faq(obj) {
	var id = obj.data("delete");
	////////////////////////////////////////////////////////////////
	// TODO
	////////////////////////////////////////////////////////////////
	// AJAX : delete faq matching id
	// - on fail, display error
	// - on success, display delete confirmation
	////////////////////////////////////////////////////////////////
	obj.parent(".question").next(".answer").detach();
	obj.parent(".question").detach();
	$("main > header").create_alert_box($msg.faq_deleted, id, {"class" : "warning", "icon" : "info", "timeout" : $time.duration.alert_short}); // display form invalid alert
}

function submit_faq(data) {
	////////////////////////////////////////////////////////////////
	// TODO
	////////////////////////////////////////////////////////////////
	// AJAX : send faq to db
	// - on fail, display error
	// - on success, display submit confirmation
	////////////////////////////////////////////////////////////////
	alert(JSON.stringify(data)); // TO REMOVE
	////////////////////////////////////////////////////////////////
	$("main > header").create_alert_box($msg.form_valid, null, {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert}); // display form submit alert
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$(document)
	// Visual Effects
	.on("focus mouseenter", "[data-delete]", function() {$(this).parent().addClass("warning")})
	.on("blur mouseleave", "[data-delete]", function() {$(this).parent().removeClass("warning")})
	// Data Handling
	.on("click", "[data-create]", function() {create_faq()})
	.on("click", "[data-delete]", function() {confirm_delete($(this))})
	.on("click", "[data-valid]", function() {check_faq()})
	// User Interface
	.on("click keydown", ".faq.edit .question > input, [data-delete]", function(e) {e.stopImmediatePropagation()});
