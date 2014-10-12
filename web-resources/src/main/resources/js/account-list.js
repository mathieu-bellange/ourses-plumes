/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"account_list_tmpl" : $loc.tmpl + "account-list.tmpl"
}

var account_list = {              // This is global var for this module
	"alert_timeout" : 1500,         // Integer   Time before update alert box disapear. Default = 1500
	"alert_fadeout" : 500           // Integer   Duration of the alert box fade effet. Default = 500
};

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
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
		}
	}
}());

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
			$("main > header").after(file_pool.account_list_tmpl(accounts)).after(lb(1)); // process template
			loap.update(); // update main module
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		},
		dataType : "json"
	});
};

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

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

$("html").on("click", "#accountsTable [data-account-id] button", function() {
	var id = $(this).parents("tr").attr("data-account-id");
	deleteEvent(id);
});

$("html").on("change", "#accountsTable [data-account-id] select", function() {
	var id = $(this).parents("tr").attr("data-account-id");
	updateEvent(id);
});
