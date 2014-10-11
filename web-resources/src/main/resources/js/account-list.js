/* ------------------------------------------------------------------ */
/* # Pre Processing */
/* ------------------------------------------------------------------ */

// set_page_title($nav.account_list.title);

/* ------------------------------------------------------------------ */
/* # Public vars */
/* ------------------------------------------------------------------ */

var account_list = {              // This is global var for this module
	"alert_timeout" : 1500,         // Integer   Time before update alert box disapear. Default = 1500
	"alert_fadeout" : 500           // Integer   Duration of the alert box fade effet. Default = 500
};

/* ------------------------------------------------------------------ */
/* # Files Loading */
/* ------------------------------------------------------------------ */

$.holdReady(true);
loadfile($loc.tmpl + "account-list.tmpl", function(response) {
	account_list_tmpl = doT.compile(response);
	$.holdReady(false);
});

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	/* Set page title */
	set_page_title($nav.account_list.title);
	/* Process */
	$.ajax({
		type : "GET",
		url : "/rest/authz/roles",
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(data, status, jqxhr) {
			roles = data;
			getAccount();
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		}
	});
});

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

roles = null;

function OurseAuthzInfo(id, role) {
	this.role = role;
	this.id = id;
	this.json = function() {
		return JSON.stringify(this);
	};
};

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getAccount() {
	$.ajax({
		type : "GET",
		url : "/rest/account",
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(accounts, status, jqxhr) {
			// var accounts_template = doT.compile(loadfile($loc.tmpl + "account-list.tmpl")); // create template
			$("main > header").after(account_list_tmpl(accounts)); // process template
			loap.update(); // update main module
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		},
		dataType : "json"
	});
};

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

function updateEvent(id) {
	// compte dans l'event
	var roleUrl = "/rest/account/" + id + "/role";
	var role = new OurseAuthzInfo($("#accountsTable tr[data-account-id=" + id + "] select").val(), $("#accountsTable tr[data-account-id=" + id + "] select option:selected").text());
	$.ajax({
		type : "PUT",
		url : roleUrl,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		data : role.json(),
		success : function(data, status, jqxhr) {
			createAlertBox($msg.account_updated, "update_" + id, {"class" : "success", "timeout" : 2500});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		},
		dataType : "json"
	});
};

function deleteEvent(id) {
	$.ajax({
		type : "DELETE",
		url : "/rest/account/" + id,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(data, status, jqxhr) {
			$("#accountsTable tr[data-account-id=" + id + "]").remove();
			createAlertBox($msg.account_deleted, "delete_" + id, {"class" : "warning", "timeout" : 2500});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		}
	});
};

$("html").on("click", "#accountsTable [data-account-id] button", function() {
	var id = $(this).parents("tr").attr("data-account-id");
	deleteEvent(id);
});

$("html").on("change", "#accountsTable [data-account-id] select", function() {
	var id = $(this).parents("tr").attr("data-account-id");
	updateEvent(id);
});

/* ------------------------------------------------------------------ */
/* # Build */
/* ------------------------------------------------------------------ */

// $(document).ready(function() {
	// $.ajax({
		// type : "GET",
		// url : "/rest/authz/roles",
		// contentType : "application/json; charset=utf-8",
		// beforeSend: function(request) {
			// header_authentication(request);
		// },
		// success : function(data, status, jqxhr) {
			// roles = data;
			// getAccount();
		// },
		// error : function(jqXHR, status, errorThrown) {
			// ajax_error(jqXHR, status, errorThrown);
			// createAlertBox();
		// }
	// });
// });
