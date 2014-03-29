
/* Domain */

function BearAccount(mail,password,profile) {
	this.profile = profile;
	this.mail = mail;
	this.password = password;
	this.json = function() {
		return JSON.stringify(this);
	};
}

function Profile(pseudo) {
	this.pseudo = pseudo;
}

/* AJAX */

$("#bearAccount").submit(function(event){
	if (document.getElementById("bearAccount").checkValidity()){
		var profile = new Profile($("#pseudo").val());
		var bearAccount = new BearAccount($("#mail").val(),$("#password").val(),profile);
		$.ajax({
			type : "PUT",
			url : "/rest/account/create",
			contentType : "application/json; charset=utf-8",
			data : bearAccount.json(),
			success : function(jqXHR, status, errorThrown) {
				window.location.href = "/comptes";
			},
			error : function(jqXHR, status, errorThrown) {
				$("#compte-alert").addClass("error");
				$("#compte-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
				$("#compte-alert").fadeIn(500);
			},
			dataType : "json"
		});
	}
});

/*Events */
$("#compte-alert .close").on('click', function(event) {
	$("#compte-alert").fadeOut(500);
});
