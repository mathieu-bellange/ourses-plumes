
function  sendArticle(){
	var title = $('#title').val();
	var data = $('#editor').val();
	var publication = $('#publication').val();
	return true;
};

$(document).ready(function(){
	$('#editor').ckeditor();
});





