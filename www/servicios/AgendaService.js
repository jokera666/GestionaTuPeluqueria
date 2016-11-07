angular.module('starterMiApp.servsAgenda', [])


.service('servAgenda',['$q','$http', function($q, $http){
    return{
        listarCitas: listBooking
    }

    function listBooking(id)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Agenda/listarCitas.php";
        var data = {'idUser':id};
        var config = {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
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