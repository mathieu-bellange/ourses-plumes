/* Domain */

roles = null;

function OurseAuthzInfo(id,role){
	this.role = role;
	this.id = id;
};

/* AJAX */

$.getJSON("/rest/role", function(rolesBdd) {
	roles = rolesBdd;
	getAccount();
}).fail(function(){
	$("#comptes-alert").remove("success");
	$("#comptes-alert").addClass("warning");
	$(".comptes-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
	$("#comptes-alert").fadeIn(500);
});

function getAccount(){
	$.ajax({
		type : "GET",
		url : "/rest/account",
		contentType : "application/json; charset=utf-8",
		success : function(accounts, status, jqxhr) {
			$.each(accounts, function(index, value) {
				//création de la ligne tr
				var ligne = $("<tr>").attr("data-account-id",value.id);
				//création des colonnes
				var pseudoCol = $("<td>");
				var mailCol = $("<td>");
				var roleCol = $("<td>");
				var delCol = $("<td>");
				//création et config des composants dans les colonnes
				var pseudo = $("<label>").text(value.profile.pseudo);
				var mail = $("<label>").text(value.mail);
				var comboRole = $("<select>");
				comboRole.on("change", value, updateEvent);
				// recup la liste des roles et creer les options
				var options = comboRole.prop('options');
				$.each(roles, function(val, text) {
					options[options.length] = new Option(text.role, text.id);
				});
				// selectionne la bonne option
				comboRole.val(value.role.id);
				// creer le bouton delete
				var buttonDel = $( "<button>" ).text("Delete");
				buttonDel.on("click",value.id,deleteEvent);
				//ajoute les composants aux colonnes
				pseudoCol.append(pseudo);
				mailCol.append(mail);
				roleCol.append(comboRole);
				delCol.append(buttonDel);
				//ajoute les colonnes à la ligne
				ligne.append(pseudoCol);
				ligne.append(mailCol);
				ligne.append(roleCol);
				ligne.append(delCol);
				//ajoute la ligne au tableau
				$("#accountsTable tbody").append(ligne);
			});
		},
		error : function(jqXHR, status, errorThrown) {
			$("#comptes-alert").remove("success");
			$("#comptes-alert").addClass("warning");
			$(".comptes-alert-message").text("Une erreur technique s'est produite, prévenez l'administateur du site");
			$("#comptes-alert").fadeIn(500);
		},
		dataType : "json"
	});
};

/* Event */

function updateEvent(event) {
	// compte dans l'event
	var value = event.data;
	
	value.role = new OurseAuthzInfo($("#accountsTable tr[data-account-id="+value.id+"] select").val(),$("#accountsTable tr[data-account-id="+value.id+"] select option:selected").text());
	$.ajax({
		type : "PUT",
		url : "/rest/account",
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(value),
		success : function(data, status, jqxhr) {
			alert(status);
		},
		error : function(jqXHR, status, errorThrown) {
			alert(jqXHR.responseText);
		},
		dataType : "json"
	});
};

function deleteEvent(event){
	var id = event.data;
	$.ajax({
		type : "DELETE",
		url : "/rest/account/"+id,
		contentType : "application/json; charset=utf-8",
		success : function(data, status, jqxhr) {
			$("#accountsTable tr[data-account-id="+id+"]").remove();
		},
		error : function(jqXHR, status, errorThrown) {
			alert(status);
		}
	});
};

$(".close-comptes").on('click', function(event) {
	$("#comptes-alert").fadeOut(500);
});