function  sendArticle(){
	var data = {
			title : $('#title').val(),
			body : $('#editor').val(),
			publication : $('#publication').val(),
			label : $('#label').val(),
			pseudo : $('#pseudo').val(),
			categorie : $('#categorie').val()
	};
	
//	$.post( "editor.html",data, function(status) {
//		 alert(status);
//		});
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8080/rest/article",
		  contentType: "application/json; charset=utf-8",
		  data : JSON.stringify(data),
		  success: function(jqXHR, status, errorThrown) {
				 alert(status);
			},
		  error: function(jqXHR, status, errorThrown) {
				 alert(status);
			},
		  dataType: "json"
		});
	return true;
};


$(document).ready(function(){
	$('#editor').ckeditor();
});





