/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

$("header + hr").after(loadfile($app_root + "tmpl/updateProfile.tmpl"));

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

function Couple(property,value){
	this.property = property;
	this.value=value;
	this.json = function() {
		return JSON.stringify(this);
	};
}

var memoryCouple = new Couple("","");
var pseudoProperty = "pseudo";
var descriptionProperty = "description";
var twitterProperty = "twitter";

function modifiyCouple(couple){
	if (couple.property == memoryCouple.property && couple.value != memoryCouple.value){
		save(couple);
	}
}


/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function save(couple){
	alert("save couple" + couple.json());
}

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

$("html").on("mouseover","#pseudo", function(event){
	$("#pseudo").addClass("editable");
});
$("html").on("mouseout","#pseudo", function(event){
	$("#pseudo").removeClass("editable");
});
$("html").on("focus","#pseudo", function(event){
	$("#pseudo").removeClass("disable");
	$("#pseudo").addClass("editing");
	memoryCouple = new Couple(pseudoProperty,$("#pseudo").val());
});
$("html").on("keypress","#pseudo", function(event){
	if(event.which == 13) {
        $("#pseudo").blur();
    }
});
$("html").on("blur","#pseudo", function(event){
	$("#pseudo").addClass("disable");
	$("#pseudo").removeClass("editing");
	var couple = new Couple(pseudoProperty,$("#pseudo").val());
	modifiyCouple(couple);
});

$("html").on("mouseover","#description", function(event){
	$("#description").addClass("editable");
});
$("html").on("mouseout","#description", function(event){
	$("#description").removeClass("editable");
});
$("html").on("focus","#description", function(event){
	$("#description").removeClass("disable");
	$("#description").addClass("editing");
	memoryCouple = new Couple(descriptionProperty,$("#description").val());
});
$("html").on("keypress","#description", function(event){
	if(event.which == 13) {
        $("#description").blur();
    }
});
$("html").on("blur","#description", function(event){
	$("#description").addClass("disable");
	$("#description").removeClass("editing");
	var couple = new Couple(descriptionProperty,$("#description").val());
	modifiyCouple(couple);
});

$("html").on("click",".icon-twitter", function(event){
	$("#social-link").removeClass("hide");
	$("#social-link span").html("Link Twitter");
	$("#social-link input").focus();
});

$("html").on("blur","#social-link", function(event){
	$("#social-link").addClass("hide");
});
$("html").on("keypress","#social-link", function(event){
	if(event.which == 13) {
        $("#social-link").blur();
    }
});

