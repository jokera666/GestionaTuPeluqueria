angular.module('starterMiApp.service', [])


.service('clientes', ['$http','$q', function($http,$q){

    

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

