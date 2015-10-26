Parse.initialize("C3MLwUJafGLlC34cZclHBE148CiOim6kPMxMdE1H", "vTl7dlCy5Stp8ZVE3g5O6jPuAnQKgJ20BVNfnIih");

var Usuario = Parse.Object.extend("Usuario", {
    UsuarioID: '',
    HoraUltimoPost: new Date(),
    FechaPago: new Date(),
    PlanPago: 0,
    Pago: false,    
    Save: function(callBack){
        this.save({
            UsuarioID: this.UsuarioID,
            HoraUltimoPost: this.HoraUltimoPost.toLocaleTimeString(),
            FechaPago: this.FechaPago.toDateString(),
            PlanPago: this.PlanPago,
            Pago: this.Pago,
        },{
            error: function(_function, _error){
                console.error("Can't save Usuario: " + error);
            },
        }).then(function(usuario){
            if(callBack !== undefined)
                callBack();
        });
    },    
},{
    Create: function(_usuario){
        var usuario = new Usuario();
        usuario.id = _usuario.id;
        usuario.UsuarioID = _usuario.get("UsuarioID");
        usuario.FechaPago = _usuario.get("FechaPago");
        usuario.HoraUltimoPost = _usuario.get("HoraUltimoPost");
        usuario.Pago = _usuario.get("Pago");
        usuario.FechaPago = _usuario.get("FechaPago");
        return usuario;
    },
})

var Grupo = Parse.Object.extend("Grupos", {
    GrupoID: '',
    Usuario: {},
    Save: function(callBack){
        this.save({
            GrupoID: this.GrupoID,
            Usuario: this.Usuario,
        },{
            error: function(_function, _error){
                console.error("Can't save Grupo: " + error);
            },
        }).then(function(usuario){
            if(callBack !== undefined)
                callBack();
        });
    },    
},{
    Create: function(_grupo){
        var grupo = new Grupo();
        grupo.id = _grupo.id;
        grupo.GrupoID = _grupo.get("GrupoID");
        grupo.Usuario = Usuario.Create(_grupo.get("Usuario"));
        return grupo;
    },
    ObtenerGrupos: function(usuario, callback) {
        var query = new Parse.Query(Grupo);
        query.equalTo("Usuario", usuario);
        return query.find().then(function(results) {
            for(var i = 0; i < results.length; i++) {
                gruposUsuario.push(Grupo.Create(results[i]));
            }
            if(gruposUsuario.length > 0 && callback !== undefined)
                callback();
        },function(error) {
            console.error("Failed to retrieve user groups: " + error);
        });    
    }
})

var Post = Parse.Object.extend("Post", {
    PostID: '',
    Usuario: {},
    Grupo: {},
    Save: function(callBack){
        this.save({
            PostID: this.PostID,
            Usuario: this.Usuario,
            Grupo: this.Grupo,
        },{
            error: function(_function, _error){
                console.error("Can't save Post: " + error);
            },
        }).then(function(usuario){
            if(callBack !== undefined)
                callBack();
        });
    },    
},{
    Create: function(_base){
        var obj = new Post();
        obj.id = _base.id;
        obj.PostID = _base.get("PostID");
        obj.Usuario = Usuario.Create(_base.get("Usuario"));
        obj.Grupo = Usuario.Create(_base.get("Grupo"));
        return obj;
    },
    ObtenerPost: function(usuario, callback) {
        var query = new Parse.Query(Post);
        query.equalTo("Usuario", usuario);
        return query.find().then(function(results) {
            for(var i = 0; i < results.length; i++) {
                postUsuario.push(Post.Create(results[i]));
            }
            if(postUsuario.length > 0 && callback !== undefined)
                callback();
        },function(error) {
            console.error("Failed to retrieve user post: " + error);
        });    
    }
})

var Repeticiones = Parse.Object.extend("Repeticiones", {
    Usuario: {},
    Post: {},
    Frecuencia: 0,
    Tipo: 0,
    Save: function(callBack){
        this.save({
            Post: this.Post,
            Usuario: this.Usuario,
            Frecuencia: this.Frecuencia,
            Tipo: this.Tipo,
        },{
            error: function(_function, _error){
                console.error("Can't save Repeticion: " + error);
            },
        }).then(function(usuario){
            if(callBack !== undefined)
                callBack();
        });
    },    
},{
    Create: function(_base){
        var obj = new Repeticiones();
        obj.id = _base.id;
        obj.Post = _base.get("Post");
        obj.Usuario = Usuario.Create(_base.get("Usuario"));
        obj.Frecuencia = Usuario.Create(_base.get("Frecuencia"));
        obj.Tipo = Usuario.Create(_base.get("Tipo"));
        return obj;
    },
    ObtenerRepeticiones: function(usuario, callback) {
        var query = new Parse.Query(Repeticiones);
        query.equalTo("Usuario", usuario);
        return query.find().then(function(results) {
            for(var i = 0; i < results.length; i++) {
                repeticionesUsuario.push(Post.Create(results[i]));
            }
            if(repeticionesUsuario.length > 0 && callback !== undefined)
                callback();
        },function(error) {
            console.error("Failed to retrieve user repeticiones: " + error);
        });    
    }
})