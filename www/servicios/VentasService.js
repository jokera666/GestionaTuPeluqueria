angular.module('starterMiApp.servsVentas', [])


.service('servVentas',['$q','$http', 'baseURL', function($q, $http, baseURL){
    return{
        insertarVenta: insertSell,
        listarVentas: listSells,
        listarCabeceraVenta: listHeadSell,
        listarServiciosVenta: listServicesSell,
        listarProductosVenta: listProductsSell,
        modificarVenta: editSell,
        eliminarLineaVenta: deleteSellLine,
        eliminarVenta: deleteSell
    }

    function insertSell(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Ventas/insertarVenta.php";
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

        var url = baseURL+"Ventas/listarVentas.php";
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

    function listHeadSell(idVenta)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Ventas/listarCabeceraVenta.php";
        var data = {'idVenta':idVenta};
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

    function listServicesSell(idVenta)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Ventas/listarServiciosVenta.php";
        var data = {'idVenta':idVenta};
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

    function listProductsSell(idVenta)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Ventas/listarProductosVenta.php";
        var data = {'idVenta':idVenta};
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

    function editSell(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Ventas/modificarVenta.php";
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

    function deleteSellLine(idVenta,idLinea,idElemento)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+'Ventas/eliminarLineaVenta.php';
        var data = {'idVenta':idVenta,'idLinea':idLinea,'idElemento':idElemento};
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function(response){
                defered.resolve(response);
            })
            .error(function(err){
                defered.reject(err);
            });

        return promesa;
    }

    function deleteSell(id)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Ventas/eliminarVenta.php";
        var data = {'idVenta':id};
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