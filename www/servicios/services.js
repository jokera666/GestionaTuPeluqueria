angular.module('starterMiApp.service', [])


.service('servClientes',['$q', '$http', function($q, $http){

    return {

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

.service('hexafy', function() {
	this.variable = 10;
    this.myFunc = function (x) {
        return x.toString(16);
    }
})

.service('servListClientes', function($http) {
    this.getClientes = function () {
        return $http.post('http://dokich.esy.es/appBackEnd/listarClientes.php')
	    		.success(function(dataClientes){ // crea un objeto con los datos que se han cargado
	  			//console.log(dataClientes);
	  			});
    }
})