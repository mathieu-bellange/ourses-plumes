//define router class
var LoapRouter = Backbone.Router.extend ({
    routes: {
        '' : 'home',
        'view': 'viewImage',
        'login' : 'login',
        '*notFound': 'notFound'
    },
    home: function () {
        alert('you are viewing home page');
    },
    viewImage: function () {
        alert('you are viewing an image');
    },
    login: function(){
    	$("#_auth_toggle").click();
    	$("#username").select();
    },
    notFound:function(){
    	alert('not found');
    }
});

//define our new instance of router
var appRouter = new LoapRouter();
 
// use html5 History API
Backbone.history.start({pushState: true});