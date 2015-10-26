var LoggedUser;

window.fbAsyncInit = function () {
    'use strict';
    $.ajaxSetup({cache: true});
    $.getScript('//connect.facebook.net/en_US/all.js', function(){
      FB.init({
        appId      : '1406195122990310',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true,  // parse XFBML
        version    : 'v2.0'  
      }); 
    // Run code after the Facebook SDK is loaded.
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

(function (d, s, id) {
    'use strict';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
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
        // Logged into your app and Facebook.
        Login();
    } else if (response.status === 'not_authorized') {
        // return to main page
    } else {
        // return to main page
    }
}

var gruposUsuario;
var permisosUsuario;

function Login () {
    'use strict';
    /*FB.login(function(response) {
        //revisarPermisos();
        enlistarAlbums();
     }, {scope: 'user_groups, publish_actions, user_photos', auth_type: 'rerequest'});*/
    Parse.FacebookUtils.logIn('user_groups, publish_actions, user_photos', {
        success: function(user) {
            $(".login").hide();
            revisarPermisos();
            LoggedUser = user;
        },
        error: function (user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
        }
    });
}


function obtenerUsuario(){
    FB.api("/me", function(response){
        LoggedUser = user;
    });
}