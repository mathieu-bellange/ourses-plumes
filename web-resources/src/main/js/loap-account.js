
/* Domain */

function BearAccount(mail,password,profile,role) {
	this.profile = profile;
	this.mail = mail;
	this.password = password;
	this.role = role;
	this.json = function() {
		return JSON.stringify(this);
	};
}

function Profile(pseudo,description) {
	this.pseudo = pseudo;
	this.description = description;
}

function OurseAuthzInfo(id,role){
	this.role = role;
	this.id = id;
}

/* AJAX */

$("#bearAccount").submit(function(event){
	var profile = new Profile($("#pseudo").val(),$("#description").val());
	var authInfo = new OurseAuthzInfo($("#role").val(),$("#role option:selected").text());
	var bearAccount = new BearAccount($("#mail").val(),$("#password").val(),profile,authInfo);
	$.ajax({
		type : "POST",
		url : "/rest/account",
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		success : function(jqXHR, status, errorThrown) {
			window.location.href = "/comptes";
		},
		error : function(jqXHR, status, errorThrown) {
			alert(status);
		},
		dataType : "json"
	});
	return false;
});

$.getJSON("/rest/role", function(roles) {
	var options = $("#role").prop('options');
	$.each(roles, function(val, text) {
		options[options.length] = new Option(text.role, text.id);
	});
});

/* Event */
$(document).ready(function(){
	$("#pseudo").val("OURSE A PLUME");
});