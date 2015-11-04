$(document).ready(function () {
    $.material.init();
    $('#loginbutton,#feedbutton').removeAttr('disabled');
    $("#repeticiones").on('click', '.toggle', function(){
        //Gets all <tr>'s  of greater depth
        //below element in the table
        var findChildren = function (tr) {
            var depth = tr.data('depth');
            return tr.nextUntil($('tr').filter(function () {
                return $(this).data('depth') <= depth;
            }));
        };
        var el = $(this);
        var tr = el.closest('tr'); //Get <tr> parent of toggle button
        var children = findChildren(tr);

        //Remove already collapsed nodes from children so that we don't
        //make them visible. 
        //(Confused? Remove this code and close Item 2, close Item 1 
        //then open Item 1 again, then you will understand)
        var subnodes = children.filter('.expand');
        subnodes.each(function () {
            var subnode = $(this);
            var subnodeChildren = findChildren(subnode);
            children = children.not(subnodeChildren);
        });

        //Change icon and hide/show children
        if (tr.hasClass('collapse')) {
            tr.removeClass('collapse').addClass('expand');
            tr.find(".mdi-content-remove").removeClass("mdi-content-remove").addClass("mdi-content-add");
            children.hide();
        } else {
            tr.removeClass('expand').addClass('collapse');
            tr.find(".mdi-content-add").removeClass("mdi-content-add").addClass("mdi-content-remove");
            children.show();
        }
        return children;
        });
    });
    //FB.getLoginStatus(updateStatusCallback);
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
var permiteGrupos;
// Here we run a very simple test of the Graph API after login is successful. 
// This testAPI() function is only called in those cases. 

function revisarPermisos() {
    FB.api('/me/permissions', function (response) {
        var continuar = false, i;
        for (i = 0; i < response.data.length; i++) {
            permisosUsuario = response.data[i];
            switch (permisosUsuario.permission) {
                case "user_photos":
                    continuar = permisosUsuario.status === "granted";
                    break;
                case "publish_actions":
                    continuar = permisosUsuario.status === "granted";
                    break;
                case "user_groups":
                    permiteGrupos = permisosUsuario.status === "granted";
                    break;
            }
        }
        if(continuar) { 
            ObtenerDetallesUsuario();
        }
        else Login();
    });
}

function ObtenerDetallesUsuario(){
    new Promise(function (resolve, reject) {
        Grupo.ObtenerGrupos(resolve);
    }).then(function () {
        EnlistarGrupos();
    }).then(function () {
        Post.ObtenerPost();
    }).then(function () {
       EnlistarPost();
    }).then(function () {
        Repeticiones.ObtenerRepeticiones();
    }).then(function () {
        EnlistarRepeticiones
    }).catch(function (err) {
        console.error(err); 
    });
}

function EnlistarGrupos(){
    var divGrupos = $(".grupos"), i;
    divGrupos.empty();
    if(permiteGrupos) {
        FB.api('/me/groups', function(response){
            gruposUsuario = response.data;
            for(i = 0; i < gruposUsuario.length; i++)
            {
                var gruposNoEncontrados = [];
                var grupo = UsuarioActual.GruposUsuario.filter(function (g) {
                    return g.GrupoID === gruposUsuario[i].id
                });
                if(grupo === undefined) {
                    grupo.GrupoID = gruposUsuario[i].id;
                    grupo.Usuario = UsuarioActual;
                    grupo.Nombre = gruposUsuario[i].name
                    console.log("Grupo a buscar" + grupo.GrupoID);
                    grupo.Buscar().then(function (resultado) {
                        if (resultado.length === 0) {
                            gruposNoEncontrados.push(grupo);
                        }
                    });
                    if(gruposNoEncontrados.length > 0) {
                        Parse.Object.saveAll(gruposNoEncontrados, function)
                    }
                }
                var opcion = $("<div class='checkbox'><label><input type='checkbox' value='" + 
                               gruposUsuario[i].id + "'>" + gruposUsuario[i].name + "</label></div>"); 
                divGrupos.append(opcion);
            }
            $.material.init();
        });
    } else {
        new Promise(function (resolve, reject) {
            for(i = 0; i < UsuarioActual.GruposUsuario.length; i++)
            {
                FB.api('/' + UsuarioActual.GruposUsuario[i].GrupoID, function(response) {
                    UsuarioActual.GruposUsuario[i].Nombre = response.data[0].name
                    var opcion = $("<div class='checkbox'><label><input type='checkbox' value='" + 
                                   UsuarioActual.GruposUsuario[i].GrupoID + "'>" + UsuarioActual.GruposUsuario[i].Nombre + "</label></div>"); 
                    divGrupos.append(opcion);
                });                
            }            
            resolve();
        }).then(function () {
            $.material.init();
            $("#txtEnlistarGrupos").Show();            
        });
    }
}

function EnlistarPost() {
    var i;
    for(i = 0; i < UsuarioActual.Posts.length; i++) {
        FB.api("/" + UsuarioActual.Posts[i].PostID, function(response){
            if(response || !response.error) {
                UsuarioActual.Posts[i].mensaje = response.message;
                UsuarioActual.Posts[i].link = response.link;
                UsuarioActual.Posts[i].caption = response.caption;
            }            
        });
    }
}

function EnlistarRepeticiones() {
    $.each(UsuarioActual.Repeticiones, function(index, value){
        var i;
        var post = UsuarioActual.Posts.filter(function (p) { return p.PostID === value.PostID });
        var grupo = UsuarioActual.Grupos.filter(function (g) { return g.GrupoID === post.Grupo.GrupoID });
        /*for (i = 0; i < UsuarioActual.Posts.length; i++) {
            if(value.PostID == UsuarioActual.Posts[i].PostID) {
                value.post = UsuarioActual.Posts[i];
                break;
            }
        }
        for (i = 0; i < UsuarioActual.Grupos.length; i++) {
            if(value.post.Grupo == UsuarioActual.Grupos[i].GrupoID) {
                value.post.Grupo = UsuarioActual.Grupos[i];
                break;
            }
        }*/
        //AgregarRepeticionTabla(value.post.mensaje, value.post.PostID, value.post.Grupo.nombre, value.Frecuencia);
        AgregarRepeticionTabla(post.mensaje, post.PostID, grupo.nombre, value.Frecuencia);
    })
    $.each(UsuarioActual.Posts, function(index, value){
        //var i;
        /*for (i = 0; i < UsuarioActual.Grupos.length; i++) {
            if(value.Grupo == UsuarioActual.Grupos[i].GrupoID) {
                value.Grupo = UsuarioActual.Grupos[i];
                break;
            }
        }*/
        //AgregarRepeticionTabla(value.mensaje, value.PostID, value.Grupo.nombre, 0);
        var grupo = UsuarioActual.Grupos.filter(function (g) { return g.GrupoID === value.Grupo.GrupoID });
        AgregarRepeticionTabla(value.mensaje, value.PostID, grupo.nombre, 0);
    })
}

function AgregarRepeticionTabla(mns, mnsId, nombreGrupo, frecuencia) {
    var tabla = $("#repeticiones");
    var td = tabla.find("td").filter(function() {
        return $(this).text() == mns;
    });
    if (td.length == 0) {
        td = $("<tr data-depth=\"0\" class=\"collapse level0\">" +
               "<td colspan=\"3\"><i class=\"mdi-content-add toggle\"></i>" + msn + "</td></tr>");
        tabla.append(td);
    }
    var tdHijo = $("<tr data-depth=\"1\" class=\"collapse level1\">" +
                    "<td colspan=\"2\">" + nombreGrupo + "</td>" +
                    "<td><div class=\"checkbox\"><input type=\"checkbox\" onclick=\"" +
                        "ActivarRepeticion(this, " + mnsId + ");\" " + 
                        (frecuencia == 1 ? "checked" : "") + "/></div></td>" +
                    "</tr>")
    td.after(tdHijo);
}

function ActivarRepeticion(check, msnId) {
    if($(check).is(":checked")) {
        Repeticiones.Activar(msnId, 1);
    } else {
        Repeticiones.Activar(msnId, 0);
    }
}

var gruposSeleccionados;
var opcionesMensaje;

function publicarMensaje() {
    gruposSeleccionados = [];
    if (!verificarHoraUltimoPost()) {
        return;
    }
    if (!revisarCantidadGrupos()) {
        return;
    }
    if($("#imagenesUpload")[0].files.length === 0 && opcionesMensaje === undefined) {
        crearAlbum();
    } else {
        $(".grupos input:checked").map(function(){
            gruposSeleccionados.push(this.value);
        });
        opcionesMensaje.message = $("#txtMensajeGrupo").val().trim();
        if($("#txtLink").val() !== "")
            opcionesMensaje.link = $("#txtLinkPublic").val();
        if(gruposSeleccionados.length > 0) {
            for (i = 0; i < gruposSeleccionados.length; i++) {
                Publicar(gruposSeleccionados[i], opcionesMensaje, function(response) {
                    var grupo = UsuarioActual.Grupos.filter(function (g) { return g.GrupoID === gruposSeleccionados[i]});
                    GuardarRespuesta(response, grupo);
                    opcionesMensaje = undefined;
                    UsuarioActual.HoraUltimoPost = new Date();
                    UsuarioActual.Save();
                });
            }
        }
        if (!permiteGrupos && $("#txtEnlistarGrupos").val() !== "") {
            var gruposEnlistados = $("#txtEnlistarGrupos").val().split(","), i;
            for (i = 0; i < gruposEnlistados[i]; i++) {
                if (gruposSeleccionados.indexOf(gruposEnlistados[i]) < 0) {
                    Publicar(gruposEnlistados[i], opcionesMensaje, function(response) {
                        opcionesMensaje = undefined;
                        var grupo = new Grupo();
                        grupo.GrupoID = gruposEnlistados[i];
                        grupo.Usuario = UsuarioActual;
                        grupo.Save();
                        grupo.Fetch({
                            success: function (_grupo) {
                                var grupo = Grupo.Create(_grupo);
                                GuardarRespuesta(response, grupo);
                                UsuarioActual.Grupos.push(grupo);
                            }
                        });
                        UsuarioActual.HoraUltimoPost = new Date();
                        UsuarioActual.Save();
                    });
                }
            }
        }
        ResetearForma();
    }
}

function Publicar(groupId, opciones, callback) {
    var llamada = '/' + groupId + '/feed';
    FB.api(llamada, 'POST', opciones, callback);
}

function verificarHoraUltimoPost() {
    var horaActual = new Date();
    var diff = horaActual.getTime() - UsuarioActual.HoraUltimoPost.getTime();
    var hours = Math.floor(diff / (1000 * 60 * 60));
    return (hours > 1);
}

function revisarCantidadGrupos() {
    var gruposChecados = $(".grupos input:checked").length;
    var gruposIngresados = $("#txtEnlistarGrupos").val() !== ""
        ? $("#txtEnlistarGrupos").val().split(",").length
        : 0;
    return gruposChecados + gruposIngresados > 5;
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
            for(var i = 0; i < response.data.length; i++) {
                if(response.data[i].name === new Date().toDateString()) {
                    idAlbum = response.data[i].id;
                    linkAlbum = response.data[i].link;
                    break;
                }
            }
            if(idAlbum === 0) {
                FB.api("/me/albums", "POST", {
                    "name": new Date().toDateString(),
                    "privacy": {'value': 'EVERYONE'}
                }, function (response) {
                    if (response && !response.error) {
                        crearAlbum();
                    }
                });
            } else {
                subirImagen();
            }
        }
    });
}

function subirImagen() {
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
    opcionesMensaje.link = linkAlbum;
    publicarMensaje();
}

function previsualizarImagenes() {
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

function GuardarRespuesta(respuesta, grupo) {
    var mensaje = new Post();
    mensaje.PostID = respuesta;
    mensaje.Grupo = grupo;
    mensaje.Usuario = UsuarioActual;
    mensaje.Save();
}

function ResetearForma() {
    $("textarea").val("");
    $("#txtLink").val("");
    $("#imagenesUpload").val("");
    $(".imagenes").empty();
    $(".grupos input:checked").prop("checked", false);
}
