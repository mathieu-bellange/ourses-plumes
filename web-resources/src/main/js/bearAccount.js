function BearAccountClasse() {
	this.profile = function(){
		this.pseudo = $("#pseudo").val();
		this.description = $("#description").val();
	}	
	this.mail = $("#mail").val();
	this.password = $("#password").val();
	this.role = $("#role").val();
	this.json = function() {
		return JSON.stringify(this);
	};
	this.html = function() {
		$("#pseudo").value = this.pseudo;
		$("#description").value = this.description;
		$("#mail").value = this.mail;
		$("#password").value = this.password;
		$("#role").value = this.role;
	};
}

function createBearAccount() {
	var bearAccount = new BearAccountClasse();
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/rest/account",
		contentType : "application/json; charset=utf-8",
		data : bearAccount.json(),
		success : function(jqXHR, status, errorThrown) {
			alert(status);
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
	})
});
