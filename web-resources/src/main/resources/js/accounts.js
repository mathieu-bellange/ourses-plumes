/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

function createAlertBox(err, msg) {
	var err = err || "error", msg = msg || "";
	if ($("#comptes-alert").length == 0) {
		$("#accountsTable").before(alert_box_template({"id" : "comptes-alert", "class" : err, "text" : msg}));
		if (document.readyState === "complete") {
			$("#accounts").foundation("alert");
		}
		$("#comptes-alert").fadeIn(300);
	}
}

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

roles = null;

function OurseAuthzInfo(id,role){
	this.role = role;
	this.id = id;
	this.json = function() {
		return JSON.stringify(this);
	};
};

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getAccount(){
	$.ajax({
		type : "GET",
		url : "/rest/account",
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request){
			header_authentication(request);
		},
		success : function(accounts, status, jqxhr) {
			var accounts_template = doT.compile(loadfile($app_root + "tmpl/accounts.tmpl")); // create template
			$("header + hr").after(accounts_template(accounts)); // process template
			$("#accounts").on("click", "#accountsTable [data-account-id] button", function() {
				var id = $(this).parents("tr").attr("data-account-id");
				deleteEvent(id);
			});

			$("#accounts").on("change", "#accountsTable [data-account-id] select", function() {
				var id = $(this).parents("tr").attr("data-account-id");
				updateEvent(id);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		},
		dataType : "json"
	});
};

/* ------------------------------------------------------------------ */
/* # Event */
/* ------------------------------------------------------------------ */

function updateEvent(id) {
	// compte dans l'event
	var roleUrl = "/rest/account/"+id+"/role";
	var role = new OurseAuthzInfo($("#accountsTable tr[data-account-id="+id+"] select").val(),$("#accountsTable tr[data-account-id="+id+"] select option:selected").text());
	$.ajax({
		type : "PUT",
		url : roleUrl,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request){
			header_authentication(request);
		},
		data : role.json(),
		success : function(data, status, jqxhr) {
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		},
		dataType : "json"
	});
};

function deleteEvent(id){ 
	$.ajax({
		type : "DELETE",
		url : "/rest/account/"+id,
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request){
			header_authentication(request);
		},
		success : function(data, status, jqxhr) {
			$("#accountsTable tr[data-account-id="+id+"]").remove();
		},
		error : function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			createAlertBox();
		}
	});
};

/* ------------------------------------------------------------------ */
/* # Build */
/* ------------------------------------------------------------------ */

// TEMP : should be better to delay this block after page loading
$(document).ready(function() {
	$.ajax({
		type : "GET",
		url : "/rest/authz/roles",
		contentType : "application/json; charset=utf-8",
		beforeSend: function(request){
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
