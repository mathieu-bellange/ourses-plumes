var grunt = (function(global){
	return {
		init : function(){
			var label = "init grunt in prod mode";
			var log_label = "init grunt in dev mode";
			if (DEBUG){
				label = "init grunt in dev mode";
			}
			if (global){
				log_label = "init global grunt test";
			}
			console.log(log_label);
			return label;
		}
	}
})(global_grunt);

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById("lbl").innerHTML = grunt.init();
});
