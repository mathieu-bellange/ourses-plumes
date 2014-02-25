//define router class
var LoapRouter = Backbone.Router.extend ({
    routes: {
        '' : 'home',
        'login' : 'login',
        'administration/:name' : 'admin',
        '*notFound': 'notFound'
    },
    home: function () {
        
    },
    login: function(){
    	$("#_auth_toggle").addClass("active");
    	$("#_auth_form").removeClass("hide");
    	$("#username").select();
    },
    admin : function(name){
    	if (name == "welcome"){
    		$("#_auth_toggle").addClass("hide");
    		$("#_auth_toggle").removeClass("active");
    		$("#_auth_form").addClass("hide");
    		$(".usernav").removeClass("hide");
    	}
    },
    notFound:function(){
    	alert('not found');
    }
});

//define our new instance of router
var appRouter = new LoapRouter();
 
// use html5 History API
Backbone.history.start();