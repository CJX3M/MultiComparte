var UsuarioActual;

window.fbAsyncInit = function () {
    'use strict';
    $.ajaxSetup({cache: true});
    $.getScript('https://connect.facebook.net/en_US/all.js', function(){
      FB.init({
        appId      : '1406195122990310',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true,  // parse XFBML
        version    : 'v2.1'  
      });
    });
/*
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '1406195122990310', // Facebook App ID
      status     : true,  // check Facebook Login status
      cookie     : true,  // enable cookies to allow Parse to access the session
      xfbml      : true,  // initialize Facebook social plugins on the page
      version    : 'v2.6' // point to the latest Facebook Graph API version
    });
*/
    // Run code after the Facebook SDK is loaded.
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    'use strict';
    //console.log('statusChangeCallback');
    //console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        obtenerUsuario();
        // Logged into your app and Facebook.
    } else if (response.status === 'not_authorized') {
        // return to main page
    } else {
        // return to main page
        Login();
    }
}

var gruposUsuario;
var permisosUsuario;

function Login () {
    'use strict';
    FB.login(function(response){
        $(".login").hide();
        UsuarioActual = response;
        revisarPermisos();
    }, {scope:'public_profile,email,user_managed_groups,user_posts,publish_actions,manage_pages,read_stream,publish_pages'});
}


function obtenerUsuario(){
    FB.api("/me", function(response){
        LoggedUser = response;
    });
}

function ActualizarPost() {
    FB.api("/615950401903143/sharedposts", function(response){
        response.data.forEach(function(message, index){
           FB.api("/" + message.id, "POST", {"message":"."}, function(response){
               console.log(response);
           }); 
        });
    });    
}
