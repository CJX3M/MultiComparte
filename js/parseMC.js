//Parse.initialize("C3MLwUJafGLlC34cZclHBE148CiOim6kPMxMdE1H", "vTl7dlCy5Stp8ZVE3g5O6jPuAnQKgJ20BVNfnIih");
//
//var Usuario = Parse.Object.extend("Usuario", {
//    UsuarioID: {},
//    FechaUltimoPost: new Date("2000/01/01"),
//    FechaPago: new Date("2000/01/01"),
//    PlanPago: 0,
//    Pago: false,
//    Posts: [],
//    Repeticiones: [],
//    Grupos: [],
//    Save: function (callBack) {
//        'use strict';
//        return this.save({
//            UsuarioID: this.UsuarioID,
//            FechaUltimoPost: this.FechaUltimoPost,
//            FechaPago: this.FechaPago,
//            PlanPago: this.PlanPago,
//            Pago: this.Pago
//        }, {
//            error: function (_function, _error) {
//                console.error("Can't save Usuario: " + _error);
//            }
//        }).then(function (usuario) {
//            Usuario.Create(usuario, this);
//            if (callBack !== undefined) {
//                callBack();
//            }
//        });
//    },
//    Buscar: function (foundCallBack, notFoundCallback) {
//        'use strict';
//        var query = new Parse.Query(UsuarioActual);
//        query.equalTo("UsuarioID", this.UsuarioID);
//        query.find({
//            success: function (results) {
//                if (results.length > 0) {
//                    Usuario.Create(results[0], UsuarioActual);
//                    if(foundCallBack !== undefined)
//                        foundCallBack();
//                } else if (notFoundCallback !== undefined) {
//                    notFoundCallback();
//                }
//            },
//            error: function (results, error) {
//                console.error("Failed to retrieve user: " + error);
//            }
//        });
//    }
//}, {
//    Create: function (_usuario, usuario) {
//        'use strict';
//        usuario.id = _usuario.id;        
//        usuario.FechaPago = _usuario.get("FechaPago");
//        usuario.HoraUltimoPost = _usuario.get("HoraUltimoPost");
//        usuario.Pago = _usuario.get("Pago");
//        usuario.FechaPago = _usuario.get("FechaPago");
//        return usuario;
//    }
//});
//
//var Grupo = Parse.Object.extend("Grupos", {
//    GrupoID: '',
//    Usuario: {},
//    Save: function (callBack) {
//        "use strict";
//        console.log("Guardando Grupo " + this.GrupoID);
//        return this.save({
//            GrupoID: this.GrupoID,
//            Usuario: this.Usuario
//        }, {
//            error: function (_function, _error) {
//                console.error("Can't save Grupo: " + error);
//            }
//        }).then(function (grupo) {
//            this.id = grupo.id;
//            console.log("guardo " + grupo.id);
//            if (callBack !== undefined) {
//                callBack();
//            }
//        });
//    },
//    Buscar: function (foundCallBack, notFoundCallBack) {
//        "use strict";
//        console.log("Buscando Grupo " + this.GrupoID);
//        var query = new Parse.Query(Grupo);
//        query.equalTo("GrupoID", this.GrupoID);
//        query.equalTo("Usuario", UsuarioActual);
//        return query.find().then(function (results) {
//            if(results.length > 0) {
//                console.log("Encontro al Grupo " + this.GrupoID);
//                var i;
//                for (i = 0; i < results.length; i++) {
//                    Grupo.Create(results[i], this);
//                    if (foundCallBack !== undefined) {
//                        foundCallBack(this);
//                    }
//                }
//            } else if (notFoundCallBack !== undefined) {
//                console.log("No encontro al grupo " + this.GrupoID);
//                notFoundCallBack(this);
//            }
//        }, function (results, error) {
//            console.error("Failed to retrieve user: " + error);
//        });
//    }
//}, {
//    Create: function(_grupo, grupo) {
//        'use strict';
//        grupo.id = _grupo.id;
//        grupo.GrupoID = _grupo.get("GrupoID");
//        if (_grupo.get("Usuario") !== undefined) {
//            grupo.Usuario = Usuario.Create(_grupo.get("Usuario"), new Usuario());
//        }
//        return grupo;
//    },
//    ObtenerGrupos: function (callback) {
//        'use strict';
//        var query = new Parse.Query(Grupo);
//        query.equalTo("Usuario", UsuarioActual);
//        return query.find().then(function (results) {
//            var i;
//            for (i = 0; i < results.length; i++) {
//                UsuarioActual.Grupos.push(Grupo.Create(results[i], new Grupo()));
//            }
//            if (callback !== undefined)
//                callback();
//        },function(error) {
//            console.error("Failed to retrieve user groups: " + error);
//        });    
//    },
//    Buscar: function(idGrupo) {
//        "use strict";
//        console.log("Buscando Grupo " + idGrupo);
//        var query = new Parse.Query(Grupo);
//        query.equalTo("GrupoID", this.GrupoID);
//        query.equalTo("Usuario", UsuarioActual);
//        return query.find();
//    }, 
//    BuscarCrear: function (idGrupo) {
//        "use strict";
//        console.log("Buscando Grupo " + idGrupo);
//        var query = new Parse.Query(Grupo);
//        query.equalTo("GrupoID", idGrupo);
//        query.equalTo("Usuario", UsuarioActual);
//        return query.find().then(function (resultados) {
//            console.log("Grupo " + idGrupo + " encontrado? " + (resultados.length > 0).toString());
//            if(resultados.length == 0) {
//                console.log("Creando el grupo " + idGrupo);
//                resultados.push(new Grupo());
//                resultados[0].GrupoID = idGrupo;
//                resultados[0].Usuario = UsuarioActual;
//            }
//            resultados[0].Save();
//        });
//    }
//});
//
//var Post = Parse.Object.extend("Post", {
//    PostID: '',
//    Usuario: {},
//    Grupo: {},
//    Save: function (callBack) {
//        'use strict';
//        this.save({
//            PostID: this.PostID,
//            Usuario: this.Usuario,
//            Grupo: this.Grupo,
//        },{
//            error: function (_function, _error) {
//                console.error("Can't save Post: " + error);
//            },
//        }).then(function (post) {
//            this.id = post.id;
//            if(callBack !== undefined) {
//                callBack();
//            }
//        });
//    }
//}, {
//    Create: function (_base) {
//        'use strict';
//        var obj = new Post();
//        obj.id = _base.id;
//        obj.PostID = _base.get("PostID");
//        if (_base.get("Usuario") !== undefined) {
//            obj.Usuario = Usuario.Create(_base.get("Usuario"), new Usuario());
//        }
//        if (_base.get("Grupo") !== undefined){
//            obj.Grupo = Grupo.Create(_base.get("Grupo"), new Grupo());
//        }
//        return obj;
//    },
//    ObtenerPost: function (callback) {
//        'use strict';
//        var query = new Parse.Query(Post);
//        query.equalTo("Usuario", UsuarioActual);
//        return query.find().then(function (results) {
//            var i;
//            for (i = 0; i < results.length; i++) {
//                UsuarioActual.Posts.push(Post.Create(results[i]));
//            }
//            if (callback !== undefined)
//                callback();
//        },function(result, error) {
//            console.error("Failed to retrieve user post: " + error);
//        });    
//    }
//});
//
//var Repeticiones = Parse.Object.extend("Repeticiones", {
//    Usuario: {},
//    Post: {},
//    Frecuencia: 0,
//    Tipo: 0,
//    Save: function (callBack) {
//        'use strict';
//        this.save({
//            Post: this.Post,
//            Usuario: this.Usuario,
//            Frecuencia: this.Frecuencia,
//            Tipo: this.Tipo,
//        },{
//            error: function (_function, _error) {
//                console.error("Can't save Repeticion: " + error);
//            },
//        }).then(function (rep) {
//            this.id = rep.id;
//            if(callBack !== undefined)
//                callBack();
//        });
//    },    
//},{
//    Create: function (_base) {
//        'use strict';
//        var obj = new Repeticiones();
//        obj.id = _base.id;
//        if (_base.get("Post") !== undefined) {
//            obj.Post = Post.Create(_base.get("Post"));
//        }
//        if (_base.get("Usuario") !== undefined) {
//            obj.Usuario = Usuario.Create(_base.get("Usuario"), new Usuario());
//        }
//        obj.Frecuencia = _base.get("Frecuencia");
//        obj.Tipo = _base.get("Tipo");
//        return obj;
//    },
//    ObtenerRepeticiones: function(callback) {
//        'use strict';
//        var query = new Parse.Query(Repeticiones);
//        query.equalTo("Usuario", UsuarioActual);
//        return query.find().then(function(results) {
//            for(var i = 0; i < results.length; i++) {
//                UsuarioActual.Repeticiones.push(Repeticiones.Create(results[i]));
//            }
//            if(callback !== undefined)
//                callback();
//        },function(result, error) {
//            console.error("Failed to retrieve user repeticiones: " + error);
//        });    
//    },
//    Activar: function(postId, frecuencia) {
//        'use strict';
//        var query = new Parse.Query(Repeticiones);
//        query.equalTo("Post", postId);
//        query.find().then(function(result){
//            if(results.length > 0) {
//                var rep = Repeticiones.Create(result[0]);
//                rep.Frecuencia = frecuencia;
//                rep.Save();
//            } else {
//                var rep = new Repeticiones();
//                rep.Post = postId;
//                rep.Frecuencia = frecuencia;
//                rep.Usuario = UsuarioActual;
//                rep.Save();
//            }                
//        }, function(result, error){
//            console.error("Failed to retrieve user: " + error);
//        })
//    }
//});
//
///***** Testing **************/
////var UsuarioActual;
//
//function LoginUser() { 
////    var _user = new Parse.User();
////    _user.set("username", "test");
////    _user.set("password", "test1");
////    _user.signUp(null, {
////        success: function (user) {
////            UsuarioActual = user;
////        },
////        error: function (response) {
////            
////        }
////    })
//    Parse.User.logIn("test", "test1").then(function (user) {
//            var promise = new Promise(function (resolve, reject) {
//                UsuarioActual = new Usuario();
//                UsuarioActual.UsuarioID = user;
//                UsuarioActual.Buscar(resolve, reject);                
//            });
//            promise.then(function () {
//                Grupo.ObtenerGrupos();
//            }).then(function () {
//                Post.ObtenerPost();
//            }).then(function () {
//                Repeticiones.ObtenerRepeticiones();                
//            }).then(function () {
//                console.log("Termino!");
//            }).catch(function (error) {
//                console.error(error);
//            });
//    });
//}
//
//function BuscarGrupo(idGrupo) {
//    Grupo.Buscar(idGrupo).then(function(resultados){
//        console.log(resultados);
//    });
//}
//
//function CrearGrupos() {
//    var grupos = ["a1", "a2", "a3", "a4", "a5", "a2"];
//    for (var i = 0; i < grupos.length; i++) {
//        console.log("revisando " + grupos[i]);
//        Grupo.BuscarCrear(grupos[i]).then(function (resultado) {
//            console.log("Termino con " + grupos[i]);
//        });
//    }
//}