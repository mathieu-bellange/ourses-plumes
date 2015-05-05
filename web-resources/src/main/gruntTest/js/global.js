var global_grunt = (function(){
	return {
		init : function(){
			var label = "init global grunt in prod mode";
			if (DEBUG){
				label = "init global grunt in dev mode";
			}
			return label;
		}
	}
})();