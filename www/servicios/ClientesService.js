angular.module('starterMiApp.servsClientes', [])


.service('servClientes',['$q', '$http', function($q, $http){

    return{

        getNombreCompleto:getFullName,
        insertarCliente: addClient
    }

    function getFullName()
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarClientes.php";
        var data = {'q':'listarClientes'};
        var config = {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
        }

        $http.post(url,data,config)
            .success(function (response){
                defered.resolve(response.clientes);
            })
            .error(function(err){
                defered.reject(err);
            });

        return promesa;
    }

    function addClient(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Clientes/insertarCliente.php";
        var data = datosForm;
        var config = {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
        }

        $http.post(url,data,config)
            .success(function(response){
                defered.resolve(response);
            })
            .error(function(err){
                defered.reject(err);
            })

        return promesa;
    }

}])