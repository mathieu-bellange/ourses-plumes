/*
 * VERSION
 * Les Ourses à plumes
 * Javascript and jQuery Scripts
 * ver. alpha 1
 *
 */

/* -------------------------------------------------------------------------- */
/* # jQuery  Variables */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* # jQuery  Functions */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* # jQuery  Events */
/* -------------------------------------------------------------------------- */

/* Auth Visibility Toggler -------------------------------------------------- */

$("#_auth_toggle").click(
  function() {
    if (!$(this).hasClass("active")) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
    if ($("#_auth_form").hasClass("hide")) {
      $("#_auth_form").removeClass("hide");
    } else {
      $("#_auth_form").addClass("hide");
    }
  }
);

/* Connect Switcher --------------------------------------------------------- */
function Login() {
	this.mail = $("#username").val();
	this.password = $("#password").val();
	this.json = function() {
		return JSON.stringify(this);
	};
}

$("#_connect_switch").click(
  function() {
	  var login = new Login();
	  $.ajax({
          type: "POST",
          url: "/rest/authc",
          data: login.json(),
          contentType : "application/json; charset=utf-8",
          success: function (data) {    
        	  $("#_auth_toggle").addClass("hide");
        	    if ($("#_auth_toggle").hasClass("active")) {
        	      $("#_auth_toggle").removeClass("active");
        	    }
        	    $("#_auth_form").addClass("hide");
        	    if ($(".usernav").hasClass("hide")) {
        	      $(".usernav").removeClass("hide");
        	    }
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

/* User Navigation Current Switcher ----------------------------------------- */

$(".usernav ul li a").click(
  function() {
    if (!$(this).parent().is("#_disconnect_switch")) {
      $(this).parent("li").siblings().children().removeClass("current");
      $(this).addClass("current");
    }
  }
);

/* Side Navigation Current Switcher ----------------------------------------- */

$(".sidenav ul li a").click(
  function() {
    $(".sidenav ul li a").parent("li").siblings().children().removeClass("current");
    $(".sidenav ul ul li a").parent("li").siblings().children().removeClass("current");
    $(this).addClass("current");
  }
);

$("#_cat_toggle").hover(
  function() {
    $("#_cat_list").removeClass("hide");
  }
);

$("#_cat_list").mouseleave(
  function() {
    $("#_cat_list").addClass("hide");
  }
);

/* Sup Navigation Current Switcher ------------------------------------------ */

$(".supnav ul li a").click(
  function() {
    $(this).parent("li").siblings().children().removeClass("current");
    $(this).addClass("current");
  }
);

/* Sub Navigation Current Switcher ------------------------------------------ */

$(".subnav ul li a").click(
  function() {
    $(this).parent("li").siblings().children().removeClass("current");
    $(this).addClass("current");
  }
);

/* Accordion Link Toggler --------------------------------------------------- */

$(".accordion dd > a").click(
  function() {
    $(this).parent("dd").siblings().children().removeClass("current");
    if (!$(this).hasClass("current")) {
      $(this).addClass("current");
    } else {
      $(this).removeClass("current");
    }
  }
);

