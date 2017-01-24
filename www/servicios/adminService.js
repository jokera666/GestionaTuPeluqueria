angular.module('starterMiApp.servsAdmin', [])


.service('servAdmin',['$q','$http', function($q, $http){
    return{
        listarUsuarios:       listUsers,
        mostrarPerfilUsuario: showUserProfile,
    }

    function listUsers()
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Admin/listarUsuarios.php";
        var data = '';
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function (response){
                defered.resolve(response);
            })
            .error(function(err){
                defered.reject(err);
            });

        return promesa;
    }

    function showUserProfile(idUser)
    {

    }

}])