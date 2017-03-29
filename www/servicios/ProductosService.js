angular.module('starterMiApp.servsProductos', [])

.service('servProductos', ['$q', '$http', function($q, $http){
	
	return{
		listarProductos: listProducts,
		listarPerfilProducto: listProductProfile
	}

	function listProducts(idMarca)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Productos/listarProductos.php';
		var data = {'idMarca':idMarca};
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

	function listProductProfile(idProducto)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Productos/listarPerfilProducto.php';
		var data = {'idProducto':idProducto};
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