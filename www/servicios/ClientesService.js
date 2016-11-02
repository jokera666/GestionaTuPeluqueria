angular.module('starterMiApp.servsClientes', [])


.service('servClientes',['$q', '$http', function($q, $http){

    return{

        getNombreCompleto:getFullName,
        insertarCliente: addClient,
        mostrarPerfilCliente: showClientProfile,
        modificarPerfilCliente: modifyClientProfile,
        borrarPerfilCliente: deleteClientProfile 
    }

    function getFullName()
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarClientes.php";
        var data = {'q':'nombreCompleto'};
        var config = {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
        }

        $http.post(url,data,config)
            .success(function (response){
                console.log(response);
                if(response == -1)
                {
                    defered.resolve(response);
                }
                else
                {
                    defered.resolve(response.nombreClientes);
                } 
                
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
            });

        return promesa;
    }

    function showClientProfile(idCliente)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarPerfilCliente.php";
        var data = idCliente;
        var config = {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
        }

        $http.post(url,data,config)
            .success(function (response){
                defered.resolve(response.infoCliente[0]);
            })
            .error(function (err){
                defered.reject(err);
            });

        return promesa;
    }

    function modifyClientProfile(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Clientes/modificarPerfilCliente.php";
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
            });

        return promesa;
    }

    function deleteClientProfile(idCliente)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = "http://gestionestetica.fonotecaumh.es/Clientes/eliminarPerfilCliente.php";
        var data = idCliente;
        var config = {
            headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
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

}])