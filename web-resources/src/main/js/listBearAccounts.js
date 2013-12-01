$.getJSON("http://localhost:8080/rest/account", function(accounts) {
	$.each(accounts, function(index, value) {
		$("#accountsTable tbody").append('<tr><td>'
				+ value.profile.pseudo
				+ '</td><td>'
				+ value.mail
				+ '</td><td>'
				+ value.role.role
				+ '</td></tr>');
	});
});