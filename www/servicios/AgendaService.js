angular.module('starterMiApp.servsAgenda', [])


.service('servAgenda',['$q','$http', 'baseURL', function($q, $http, baseURL){
    return{
        listarCitas:    listBookings,
        insertarCita:   addBooking,
        modificarCita:  editBooking,
        borrarCita:     deleteBooking
    }

    function listBookings(id)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Agenda/listarCitas.php";
        var data = {'idUser':id};
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

    function addBooking(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Agenda/insertarCita.php";
        var data = datosForm;
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

    function editBooking(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;
        
        var url = baseURL+"Agenda/ModificarCita.php";
        var data = datosForm;
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

    function deleteBooking(id)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Agenda/BorrarCita.php";
        var data = {'idCita':id};
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