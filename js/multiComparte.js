    $(document).ready(function() {
        $.material.init();
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        //FB.getLoginStatus(updateStatusCallback);
    })
//  // Load the SDK asynchronously
//  (function(d){
//   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//   if (d.getElementById(id)) {return;}
//   js = d.createElement('script'); js.id = id; js.async = true;
//   js.src = "//connect.facebook.net/en_US/all.js";
//   ref.parentNode.insertBefore(js, ref);
//  }(document));
    var gruposUsuario;
    var permisosUsuario;
  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
    
    function revisarPermisos(){
        FB.api('/me/permissions', function(response) {
            var continuar = false;
            for(var i = 0; i < response.data.length; i++) {
                permisosUsuario = response.data[i];
                switch(permisosUsuario.permission) {
                    case "user_photos": 
                        continuar = permisosUsuario.status === "granted";
                        break;
                    case "publish_actions": 
                        continuar = permisosUsuario.status === "granted";
                        break;
                    case "user_groups": 
                        continuar = permisosUsuario.status === "granted";
                        break;
                }
            }
            if(continuar) enlistarGrupos(); else Login();
        });
    }
    
    function enlistarGrupos(){
        FB.api('/me/groups', function(response){
            gruposUsuario = response.data;
            var divGrupos = $(".grupos");
            divGrupos.empty();
            for(var i = 0; i < gruposUsuario.length; i++)
            {
                var opcion = $("<div class='checkbox'><label><input type='checkbox' value='" + gruposUsuario[i].id + "'>" + gruposUsuario[i].name + "</label></div>"); 
                divGrupos.append(opcion);
            }
            $.material.init();
        });
    }
    
    function publicarMensaje() {
        if($(".grupos input:checked").length > 0) {
            if($("#imagenesUpload")[0].files.length === 0) {            
                var gruposChecados = $(".grupos input:checked");
                for(var i = 0; i < gruposChecados.length; i++) {
                    var llamada = '/' + $(gruposChecados[i]).val() + '/feed';
                    FB.api(llamada, 'POST', {
                        message: $("#txtMensajeGrupo").val().trim()
                    }, function(response) {
                        console.log(response);
                    });
                }
            } else {
                crearAlbum();
            }
        }
    }
    function publicLinkAlbum(){
        var gruposChecados = $(".grupos").find("input:checked");
        for(var i = 0; i < gruposChecados.length; i++) {
            var llamada = '/' + $(gruposChecados[i]).val() + '/feed';
            FB.api(llamada, 'POST', {
                message: $("#txtMensajeGrupo").val().trim(),
                link: linkAlbum
            }, function(response){
                console.log(response);
            });
        }        
    }
    var respuesta;
    var idAlbum = 0;
    var linkAlbum;
    function crearAlbum(){
        idAlbum = 0;
        FB.api("/me/albums",
            function (response) {
              if (response && !response.error) {
                var id = 0;
                for(var i = 0; i < response.data.length; i++)
                {
                    if(response.data[i].name === new Date().toDateString())
                    {
                        idAlbum = response.data[i].id;
                        linkAlbum = response.data[i].link;
                        break;
                    }
                }
                if(idAlbum === 0)
                {
                    FB.api("/me/albums",
                        "POST",
                        {
                            "name": new Date().toDateString(),
                            "privacy": {'value': 'EVERYONE'}
                        },
                        function (response) {
                          if (response && !response.error) {
                              crearAlbum();
                          }
                        }
                    );
                }
                else
                    subirImagen();
              }
            }
        );
    }
    
    function subirImagen()
    {
        var archivos = $("#imagenesUpload")[0].files;
        for(var i = 0; i < archivos.length; i++)
        {
            var formData = new FormData();
            formData.append("source", archivos[i]);
            formData.append("no_story", true);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://graph.facebook.com/" + idAlbum + "/photos?access_token="+FB.getAccessToken(), true);
            xhr.addEventListener("load", function (evt) {
                if(evt.target.status === 200){
                    respuesta = evt.target.responseText;
                }            
            }, false);
            xhr.addEventListener("error", function(evt) {
                console.log(evt);
            }, false);
            xhr.send(formData);
        }
        publicLinkAlbum();
    }
    
    function previsualizarImagenes(){
        var archivos = $("#imagenesUpload")[0].files;
        $(".imagenes").empty();
        for(var i = 0; i < archivos.length; i++)
        {
            var lector = new FileReader();
            
            lector.onload =  function(e){
                var imagen = $("<img src='"+e.target.result+"'>");
                imagen.width(100).height(150);
                $(".imagenes").append(imagen);
            };
            
            lector.readAsDataURL(archivos[i]);
        }
    }
