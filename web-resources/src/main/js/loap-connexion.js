function Login(mail,password) {
	this.mail = mail;
	this.password = password;
	this.json = function() {
		return JSON.stringify(this);
	};
}

$("#_connect_modal").click(
		function() {
			/* masque login */
		    if ($(this).hasClass("active")) {
		    	appRouter.navigate("", {trigger: false});
		    	$(this).removeClass("active");
		    	$("#_auth_form").addClass("hide");
		    } 
		    /* show login */
		    else {
		    	appRouter.navigate("login", {trigger: true});
		    }
		}
);

/* Connect Switcher --------------------------------------------------------- */
$(".connect-switch").click(
  function() {
	  var login = new Login($("#username").val(),$("#password").val());
	  $.ajax({
          type: "POST",
          url: "/rest/authc",
          data: login.json(),
          contentType : "application/json; charset=utf-8",
          success: function (data) {    
        	  /* show administration */
        	  appRouter.navigate("administration/welcome", {trigger: true});
          },
          error: function(jqXHR, text, error){
        	  alert("error");
          },
          dataType : "json"
	  });
  }
);

/* Disconnect Switcher ------------------------------------------------------ */

$("#_disconnect_switch").click(
  function() {
	  $.ajax({
          type: "POST",
          url: "/logout",
          success: function (data) {    
        	  $(".usernav").addClass("hide");
        	  $("#_auth_toggle").removeClass("hide");
          },
          error: function(jqXHR, text, error){
        	  alert("error");
          }
	  });
  }
);