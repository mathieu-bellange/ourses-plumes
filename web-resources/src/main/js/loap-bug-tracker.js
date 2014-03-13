/* Domain */

function GithubBug(title,body) {
	this.title = title;
	this.body = body;
	this.json = function() {
		return JSON.stringify(this);
	};
}

/* Events */
$( "#new-bug" ).submit(function( event ) {
	var bug = new GithubBug($("#bug-title").val(),$("#bug-body").val());
	$.ajax({
        type: "POST",
        url: "/rest/github",
        data: bug.json(),
        contentType : "application/json; charset=utf-8",
        success: function (data) {    
        	alert("ok");
        },
        error: function(jqXHR, text, error){
      	  alert("error");
        },
        dataType : "json"
	  });
});