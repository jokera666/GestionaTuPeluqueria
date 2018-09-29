angular.module('starterMiApp.servsClientes', [])

.service('servClientes',['$q', '$http', 'baseURL', function($q, $http, baseURL){

    return{

        listarClientes: listClients,
        insertarCliente: addClient,
        mostrarCabeceraPerfilCliente: showHeadClientProfile,
        mostrarPerfilCliente: showClientProfile,
        modificarPerfilCliente: modifyClientProfile,
        borrarPerfilCliente: deleteClientProfile 
    }

    function listClients(parametro,idUsuario)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Clientes/listarClientes.php";
        var data = {'q':parametro,'idUser':idUsuario};
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function (response){
                if(response == -1)
                {
                    defered.resolve(response);
                }
                else
                {
                    defered.resolve(response);
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

        var url = baseURL+"Clientes/insertarCliente.php";
        var data = datosForm;
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

    function showHeadClientProfile(idCliente)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Clientes/listarCabeceraPerfilCliente.php";
        var data = {'idCli':idCliente};
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function (response){
                defered.resolve(response);
            })
            .error(function (err){
                defered.reject(err);
            });

        return promesa;
    }

    function showClientProfile(idCliente)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Clientes/listarPerfilCliente.php";
        var data = {'idCli':idCliente};
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function (response){
                defered.resolve(response);
            })
            .error(function (err){
                defered.reject(err);
            });

        return promesa;
    }

    function modifyClientProfile(datosForm)
    {
        console.log(datosForm);
        var defered = $q.defer();
        var promesa = defered.promise;
        var url = baseURL+"Clientes/modificarPerfilCliente.php";
        var data = datosForm;
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

    function deleteClientProfile(idCliente)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Clientes/eliminarPerfilCliente.php";
        var data = {'idCli':idCliente};
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

}])

.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});