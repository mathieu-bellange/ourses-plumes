$.getJSON("http://localhost:8080/rest/account", function(accounts) {
	$.each(accounts, function(index, value) {		
		$("#accountsTable tbody").append('<tr class="tr'+value.id+'"><td>'
				+ value.profile.pseudo
				+ '</td><td>'
				+ value.mail
				+ '</td><td>'
				+ value.role.role
				+ '</td><td class="toinsert'+value.id+'">'
				+ '</td></tr>'
				);
		var button = $("<button onclick='deleteEvent("+value.id+")' type='button'>Delete</button>")
        .appendTo($('td.toinsert'+value.id));
	});
});

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
}