function BearAccount() {
	this.profile = new Profile();
	this.mail = $("#mail").val();
	this.password = $("#password").val();
	this.role = new OurseAuthzInfo();
	this.json = function() {
		return JSON.stringify(this);
	};
}

function Profile() {
	this.pseudo = $("#pseudo").val();
	this.description = $("#description").val();
}

function OurseAuthzInfo(){
	this.role = $("#role option:selected").text();
	this.id = $("#role").val();
}
function createBearAccount() {
	var bearAccount = new BearAccount();
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
$(document).ready(function(){
	$("#pseudo").val("OURSE A PLUME");
});
