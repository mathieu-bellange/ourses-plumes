roles = null;
$.getJSON("http://localhost:8080/rest/role", function(rolesBdd) {
	roles = rolesBdd;
	getAccount();
});

function getAccount(){
	$.getJSON("http://localhost:8080/rest/account", function(accounts) {
		$.each(accounts, function(index, value) {		
			$("#accountsTable tbody").append('<tr class="tr'+value.id+'"><td>'
					+ value.profile.pseudo
					+ '</td><td>'
					+ value.mail
					+ '</td><td class="role'+value.id+'">'
					+ '</td><td class="toinsert'+value.id+'">'
					+ '</td></tr>'
			);
			//creer la combo des roles
			var comboRole = $("<select id='role"+value.id+"'></select>")
			.appendTo($('td.role'+value.id));
			// recup la liste des roles et creer les options
			var options = $("#role"+value.id).prop('options');
			$.each(roles, function(val, text) {
				options[options.length] = new Option(text.role, text.id);
			});
			// selectionner la bonne option
			$("#role"+value.id).val(value.role.id);
			comboRole.on("change", value, updateEvent);
			// creer le bouton
			var button = $("<button onclick='deleteEvent("+value.id+")' type='button'>Delete</button>")
	        .appendTo($('td.toinsert'+value.id));
		});
	});
};

function OurseAuthzInfo(id){
	this.role = $("#role" + id +" option:selected").text();
	this.id = $("#role" + id).val();
};

function updateEvent(event) {
	var value = event.data;
	value.role = new OurseAuthzInfo(event.data.role.id);
	$.ajax({
		type : "PUT",
		url : "http://localhost:8080/rest/account",
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(value),
		success : function(jqXHR, status, errorThrown) {
			alert(status);
		},
		error : function(jqXHR, status, errorThrown) {
			alert(jqXHR.responseText);
		},
		dataType : "json"
	});
};

function deleteEvent(id){
	$.ajax({
		type : "DELETE",
		url : "http://localhost:8080/rest/account/"+id,
		contentType : "application/json; charset=utf-8",
		success : function(jqXHR, status, errorThrown) {
			$('tr.tr'+id).remove();
		},
		error : function(jqXHR, status, errorThrown) {
			alert(status);
		}
	});
};