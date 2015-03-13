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
			$(".main-body").append(file_pool.account_list_tmpl(accounts)).after(lb(1)); // process template
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
			createAlertBox($msg.account_updated, "update_" + id, {"class" : "success", "timeout" : $time.duration.alert});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		},
		dataType : "json"
	});
};

function deleteEvent(id) {
	//--------------------------------------------------------------------------------//
	//                                                                                //
	// TODO tenir compte du choix de l'utilisateur pour supprimer ou non ses articles //
	//                       par défault deleteArticles=false                         //
	//                                                                                //
	//--------------------------------------------------------------------------------//
	$.ajax({
		type : "DELETE",
		url : "/rest/account/" + id + "?deleteArticles=false",
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request) {
			header_authentication(request);
		},
		success : function(data, status, jqxhr) {
			$("#accountsTable tr[data-account-id=" + id + "]").remove();
			createAlertBox($msg.account_deleted, "delete_" + id, {"class" : "warning", "timeout" : $time.duration.alert});
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
	if ($conf.confirm_delete.account) {
		// Confirm Delete Account
		var modal_options = {
			"text" : $msg.confirm_delete.account,
			"class" : "panel radius",
			"on_confirm" : function() {
				deleteEvent(id) // delete account
			}
		};
		$("#articles").create_confirmation_modal(modal_options);
	} else {
		deleteEvent(id) // delete account
	}
});

$("html").on("change", "#accountsTable [data-account-id] select", function() {
	var id = $(this).parents("tr").attr("data-account-id");
	updateEvent(id);
});
