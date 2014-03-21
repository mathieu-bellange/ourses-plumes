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
	this.role = id;
	this.id = role;
}

/* AJAX */
function createBearAccount() {
	var profile = new Profile($("#pseudo").val(),$("#description").val());
	var authInfo = new OurseAuthzInfo($("#role").val(),$("#role option:selected").text());
	var bearAccount = new BearAccount($("#mail").val(),$("#password").val(),profile,authInfo);
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/rest/account",
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		success : function(jqXHR, status, errorThrown) {
			alert(status);
			window.location = window.location.host + "/comptes";
		},
		error : function(jqXHR, status, errorThrown) {
			alert(status);
		},
		dataType : "json"
	});
};

$.getJSON("http://localhost:8080/rest/role", function(roles) {
	var options = $("#role").prop('options');
	$.each(roles, function(val, text) {
		options[options.length] = new Option(text.role, text.id);
	});
});

/* Event */
$(document).ready(function(){
	$("#pseudo").val("OURSE A PLUME");
});
