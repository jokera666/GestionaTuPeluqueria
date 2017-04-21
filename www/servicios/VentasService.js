angular.module('starterMiApp.servsVentas', [])


.service('servVentas',['$q','$http', function($q, $http){
    return{
        insertarVenta: insertSell,
        listarVentas: listSells
    }

    function insertSell(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Ventas/insertarVenta.php";
        var data = datosForm;
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

    function listSells(id,fechaIni,FechaFin)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Ventas/listarVentas.php";
        var data = {'idUser':id, 'ini':fechaIni,'fin':FechaFin};
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