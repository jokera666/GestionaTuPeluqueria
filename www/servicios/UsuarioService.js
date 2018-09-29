angular.module('starterMiApp.servsUsuario', [])


.service('servUsuario',['$q','$http', 'baseURL', function($q, $http, baseURL){
    return{
        listarUsuario: listUser,
        modificarPerfilUsuario: editUserProfile,
        eliminarCuentaUsuario: deleteUserAcount
    }

    function listUser(idUser)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Usuarios/listarUsuario.php";
        var data = {'idUser':idUser};
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function(respuesta){
                defered.resolve(respuesta);
            })
            .error(function(err){
                defered.reject(err);
            });
        return promesa;
    }

    function editUserProfile(formData)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Usuarios/modificarPerfilUsuario.php";
        var data = formData;
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function(respuesta){
                defered.resolve(respuesta);
            })
            .error(function(err){
                defered.reject(err);
            });
        return promesa;
    }

    function deleteUserAcount(idUser)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Usuarios/eliminarCuentaUsuario.php";
        var data = {'idUser':idUser};
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function(respuesta){
                defered.resolve(respuesta);
            })
            .error(function(err){
                defered.reject(err);
            });
        return promesa;
    }

}])