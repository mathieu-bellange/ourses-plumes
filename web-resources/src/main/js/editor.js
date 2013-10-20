function Article(){
		this.title = $('#title').val();
		this.body = $('#editor').val();
		this.publication = $('#publication').val();
		this.label = $('#label').val();
		this.pseudo = $('#pseudo').val();
		this.category = $('#category').val();	
		this.toJson = function(){
			return JSON.stringify(this);
		};
};

function Category(){
	this.id;
	this.category;
	this.toJson = function(){
		return JSON.stringify(this);
	}
	this.toDto = function(json){
		var cat = JSON.parse(json);
		this.id = cat.id;
		this.category = cat.category;
	}
}

function processCategory(json){
	$.each(json, function(i, obj) {
		$('#category').append($("<option/>", {
	        value: obj.id,
	        text: obj.category
	    }));
	});
}


function  sendArticle(){
	var article = new Article();
//	$.ajax({
//		  type: "POST",
//		  url: "http://localhost:8080/rest/article",
//		  contentType: "application/json; charset=utf-8",
//		  data : JSON.stringify(data),
//		  success: function(jqXHR, status, errorThrown) {
//				 alert(status);
//			},
//		  error: function(jqXHR, status, errorThrown) {
//				 alert(status);
//			},
//		  dataType: "json"
//		});
//	return true;
};

$.getJSON("http://localhost:8080/rest/category", function(json){
	processCategory(json);
 });

$(document).ready(function(){
	$('#editor').ckeditor();
});





