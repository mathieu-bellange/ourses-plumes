/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

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
			$("main > header").after(accounts_template(accounts)); // process template
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
