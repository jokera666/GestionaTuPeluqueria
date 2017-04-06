angular.module('starterMiApp.servsUsuario', [])


.service('servUsuario',['$q','$http', function($q, $http){
    return{
        listarUsuario: listUser,
        modificarPerfilUsuario: editUserProfile
    }

    function listUser(idUser)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Usuarios/listarUsuario.php";
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

        var url = "http://gestionestetica.fonotecaumh.es/Usuarios/modificarPerfilUsuario.php";
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

}])