/* ------------------------------------------------------------------ */
/* # Temporary */
/* ------------------------------------------------------------------ */

var db_rubrique = [
	{"id" : 1, "classe" : "struggles"},
	{"id" : 2, "classe" : "ourbody"},
	{"id" : 3, "classe" : "intersec"},
	{"id" : 4, "classe" : "internat"},
	{"id" : 5, "classe" : "educult"},
	{"id" : 6, "classe" : "ideas"}
];

var db_article = [
	{"id" : 6, "title" : "Avortement : un droit mal acquis", "rubrique_id" : 4, "path" : "javascript:void(0)"},
	{"id" : 13, "title" : "La guerre des poupons", "rubrique_id" : 3, "path" : "javascript:void(0)"},
	{"id" : 22, "title" : "Le troisième sexe", "rubrique_id" : 1, "path" : "javascript:void(0)"},
	{"id" : 43, "title" : "Parité : une théorie éculée ?", "rubrique_id" : 2, "path" : "javascript:void(0)"},
	{"id" : 927, "title" : "Gestation pour autrui, une autre étape ?", "rubrique_id" : 1, "path" : "javascript:void(0)"}
];

var db_folder = [
	{"id" : 7, "hash" : "natalite", "name" : "Natalité", "desc" : "<p>Le dossier qui regroupe les sujets sur la natalité.</p>", "list" : "{'1' : 13, '2' : 6, '0' : 927}"},
	{"id" : 1, "hash" : "egalite-des-sexes", "name" : "Égalité des sexes", "desc" : "<p>Le dossier qui regroupe les sujets sur l'égalité des sexes.</p>", "list" : "{'0' : 22, '1' : 43}"},
	{"id" : 11, "hash" : "evenements", "name" : "Évènements", "desc" : "<p>Le dossier qui regroupe les sujets sur des évènements.</p>"}
];

/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var folder_edit = {
	"holder"       : "#folder_list_edit", // [sel] jQuery selector for folder list. Default : "#folder_list_edit"
	"hide_buttons" : false                // [bool] Hide article unavailable move button (disable otherwise). Default : false
};

var loax_pool = {
	"folder_view_mptl" : $loc.tmpl + "folder-view.mptl",
	"folder_edit_mptl" : $loc.tmpl + "folder-edit.mptl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.folder_edit.title);
			/* Insert template */
			$.ajax({
				type : "GET",
				url : "/rest/folder",
				contentType : "application/json; charset=utf-8",
				beforeSend: function(request) {
					header_authentication(request);
				},
				success : function(folders, status, jqxhr) {
					folder_list.build($(".main-body"), file_pool.folder_edit_list_tmpl(folders), db_article, db_rubrique); // process build edit
					setup_folder("#folder_list_edit"); // setup folder list edit
					/* Initialize component */
					folder_list.init(); // init component
				},
				error : function(jqXHR, status, errorThrown) {
					createAlertBox();
				},
				dataType : "json"
			});
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Data Handling
function get_unset_value(arr, val) {
	var a = arr, b = [], r = []; for (n in a) {b.push(a[n][val])}
	b.sort(function(a, b) {return a - b});
	var m = b.length > 0 ? parseInt(b[b.length - 1]) + 1 : 1;
	for (var i = 1; i <= m; i++) {
		var g = true; for (k in b) {if (b[k] == i) {g = false}}
		if (g) {r.push(i)}
	} return (r);
}

// User Interface
function show_button_bar(o) {
	var u = o.children(".button-bar");
	if (u.is(":hidden")) {u.slideDown($conf.js_fx ? "fast" : 0)}
}

function hide_button_bar(o) {
	var u = o.children(".button-bar");
	if (u.is(":visible")) {u.slideUp($conf.js_fx ? "fast" : 0)}
}

// Article
function order_article_list(o, d) {
	var p = o.parent("ul"), u = p.children("li"), d = (is_def(typeof d) ? d : null);
	if (folder_edit.hide_buttons) {
		u.find("[data-up], [data-down]").show(); // show all buttons
	} else {
		u.find("[data-up], [data-down]")
			.removeClass("disabled")
			.attr("tabindex", "0"); // enable all buttons
	}
	function f(o, d) {
		var i = o.index(), g = u.eq(i + d);
		c = o.clone().attr("data-num", parseInt(o.attr("data-num")) + d);
		o.remove(); d > 0 ? g.after(c) : g.before(c);
		g.attr("data-num", parseInt(g.attr("data-num")) - d);
		return p.children("li");
	}
	if (d !== null) {
		switch (d) {
			case 0: u = u.not(o); break;// all but this
			default: u = f(o, d); // up or down
		}
	}
	if (folder_edit.hide_buttons) {
		u.first().find("[data-up]").hide(); // hide first button up
		u.last().find("[data-down]").hide(); // hide last button down
	} else {
		u.first().find("[data-up]").addClass("disabled").attr("tabindex", "-1"); // disable first button up
		u.last().find("[data-down]").addClass("disabled").attr("tabindex", "-1"); // disable last button down
	}
}

function move_up_article(o) {
	abide_folder(o.closest(".folder")); // abide folder
	order_article_list(o, -1);
	//console.log("move up article"); // DEBUG
}

function move_down_article(o) {
	abide_folder(o.closest(".folder")); // abide folder
	order_article_list(o, 1);
	//console.log("move down article"); // DEBUG
}

function confirm_remove_article(o) {
	if ($conf.confirm_remove.folder_article) {
		var opts = {
			"text" : $msg.confirm_remove_p.sprintf(["cet article du dossier"]),
			"class" : "panel radius",
			"on_confirm" : function() {remove_article(o)}
		};
		$("body").create_confirmation_modal(opts);
	} else {
		remove_article(o);
	}
}

function remove_article(o) {
	abide_folder(o.closest(".folder")); // abide folder
	order_article_list(o, 0); // check order
	o.remove();
	//console.log("remove article"); // DEBUG
}

// Folder
function confirm_delete_folder(o) {
	var id = o.attr("data-id");
	if ($conf.confirm_delete.folder) {
		var opts = {
			"text" : $msg.confirm_delete_p.sprintf(["ce dossier"]),
			"class" : "panel radius callout",
			"on_confirm" : function() {delete_folder(id)}
		};
		$("body").create_confirmation_modal(opts);
	} else {
		delete_folder(id);
	}
}

function delete_folder(id, alert) {
	var alert = (is_def(typeof alert) ? alert : true);
	//////////////////////////////////////////////////////////////
	// TODO : AJAX
	//////////////////////////////////////////////////////////////
	// - on success : delete folder at id, alert success
	// - on fail : alert fail
	//////////////////////////////////////////////////////////////
	for (n in db_folder) {
		if (db_folder[n]["id"] == id) {
			db_folder.splice(n, 1); // NOTE : could be delete db_folder[n] for null value
		}
	}
	//////////////////////////////////////////////////////////////
	var o = $(".folder-list.edit [data-id='" + id + "']");
	var folder_name = o.find(".name input").val().trim();
	if (alert) {$(o).create_alert_box($msg.deleted_p.sprintf(["Dossier", folder_name]), "folder_deleted_" + id, {"insert" : "before", "class" : "warning", "timeout" : $time.duration.alert});}
	o.remove();
	//console.log("detete : " + id); // DEBUG
}

function backup_folder(o) {
	if (!is_def(typeof o.data("backup"))) {
		o.data("backup", o.clone().contents());  // create deep copy of html content and bind it to jQuery data that will be destroyed when element itself will be deleted
	}
}

function abide_folder(o) {
	if (!o.hasClass("abide")) {o.addClass("abide")} // add abiding class
	backup_folder(o); // backup folder
	if (o.children(".button-bar").is(":hidden")) {show_button_bar(o)} // show button bar
}

function unleash_folder(o) {
	if (!o.hasClass("new")) {o.removeClass("abide")}; // remove abiding class
	o.removeData("backup"); // remove backup data
	hide_button_bar(o); // hide button bar
}

function reset_folder(o) {
	folder_list.close(o, function() {
		o.html(o.data("backup")); // recall html content backup stored into jQuery data
		unleash_folder(o); // release folder from abiding
		o.find("textarea").css("height", ""); // reset textarea height
		o.find("textarea").autosize(autosize_cfg); // init autosize
		o.find("textarea").add_confirmation_bar(); // add confirmation bar
	});
	//console.log("reset folder"); // DEBUG
}

function check_folder(o) {
	var id = o.attr("data-id"), a = o.find("input"), b = o.find("textarea"), l = 0;
	// 1. Check fields validity
	a.check_validity();
	b.check_validity();
	// 2. Check form validity
	var pathName = "/rest/folder/check/name";
	if (id !== null){
		pathName = pathName + "?id=" + id;
	}
	$.ajax({
		type : "POST",
		url : pathName,
		contentType : "application/json; charset=utf-8",
		data : a.val(),
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(folders, status, jqxhr) {
			if (a.add(b).is_valid()) { // if all fields are valid
				o.removeClass("new"); // remove class new
				unleash_folder(o); // release folder from abiding
				folder_list.close(o); // close folder
				var data = { // define data
						"name" : a.val(),
						"desc" : encode_html(b.val(), true),
				};
				send_folder(data,id,o); // send data to db
			} else { // any field is invalid
				var alert_box_id = "validate-folder-" + id;
				$(document).clear_alert_box(alert_box_id);
				o.create_alert_box($msg.form_invalid, alert_box_id, {"timeout" : $time.duration.alert_long, "insert" : "before"}); // display form invalid alert
			}
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				var alert_box_id = "validate-folder-" + id;
				$(document).clear_alert_box(alert_box_id);
				o.create_alert_box($msg.form_invalid, alert_box_id, {"timeout" : $time.duration.alert_long, "insert" : "before"});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
	//console.log("check : " + id); // DEBUG
}

function send_folder(data,id,o) {
	var pathPUT = "/rest/folder";
	if (id !== null){
		pathPUT = pathPUT + "/" + id;
	}
	$.ajax({
		type : "PUT",
		url : pathPUT,
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(data),
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(folder, status, jqxhr) {
			o.attr("data-id",folder.id);
			o.attr("id",folder.hash + "-edit");
			//TODO articles
//			o.find(".list li").each(function() { // build folder article list from DOM
//				folder.list[$(this).attr("data-num")] = parseInt($(this).attr("data-id"));
//				l++;
//			});
//			if (is_def(typeof folder.list) && l > 0) {
//				folder.list = JSON.stringify(folder.list) // fix folder article list to string
//			} else {
//				if (o.find("div.list.info").length === 0) {
//					o.find(".desc").after(file_pool.folder_edit_article_list_empty_tmpl()) // append empty list template
//					o.find("div.list.info").svg_icons(); // reload svg icons
//				}
//			}
			var alert_box_id = "validate-folder-" + id;
			$(".folder-list.edit").clear_alert_box(alert_box_id);
			$(".folder-list.edit").create_alert_box($msg.form_valid, alert_box_id, {"class" : "success", "icon" : "info", "timeout" : $time.duration.alert, "insert" : "before"}); // display form valid alert
		},
		error : function(jqXHR, status, errorThrown) {
			if (jqXHR.status == 403){
				var alert_box_id = "validate-folder-" + id;
				$(document).clear_alert_box(alert_box_id);
				o.create_alert_box($msg.form_invalid, alert_box_id, {"timeout" : $time.duration.alert_long, "insert" : "before"});
			}else{
				createAlertBox();
			}
		},
		dataType : "json"
	});
}

function add_folder(data) {
	var data = data || {"id" : new Date().getTime(), "hash" : new Date().getTime(), "name" : "", "desc" : ""};
	var tmpl = $(file_pool.folder_edit_list_item_tmpl(data));
	$(".folder-list.edit").append(tmpl); // process template
	$(tmpl).addClass("abide new"); // add class abide and new
	$(tmpl).svg_icons(); // reload icons
	$(tmpl).find("textarea").autosize(autosize_cfg); // init autosize
	$(tmpl).find("textarea").add_confirmation_bar(); // add confirmation bar
	$(tmpl).attr("data-id","");
	folder_list.open(tmpl, true); // open folder and close others
}

function setup_folder(sel) {
	$(sel + " textarea").add_confirmation_bar(); // add confirmation bar
	$(sel + " .folder .list").each(function() {
		order_article_list($(this).children("li:first")); // order article list
	});
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// AJAX things here

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$(document)
	// User interface behaviour
	.on("keydown", folder_edit.holder + " input, " + folder_edit.holder + " textarea", function() {backup_folder($(this).closest(".folder"))})
	.on("input", folder_edit.holder + " input, " + folder_edit.holder + " textarea", function() {abide_folder($(this).closest(".folder"))})
	// Handle article data
	.on("click", folder_edit.holder + " [data-up]:not(.disabled)", function() {move_up_article($(this).closest("li"))})
	.on("click", folder_edit.holder + " [data-down]:not(.disabled)", function() {move_down_article($(this).closest("li"))})
	.on("click", folder_edit.holder + " [data-remove]", function() {confirm_remove_article($(this).closest("li"))})
	// Handle folder data
	.on("click", folder_edit.holder + " [data-delete]", function() {confirm_delete_folder($(this).closest(".folder"))})
	.on("click", folder_edit.holder + " [data-reset]", function() {reset_folder($(this).closest(".folder"))})
	.on("click", folder_edit.holder + " [data-submit]", function() {check_folder($(this).closest(".folder"))})
	.on("click", folder_edit.holder + " [data-add]", function() {add_folder()});
