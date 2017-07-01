angular.module('starterMiApp.servsProductos', [])

.service('servProductos', ['$q', '$http', function($q, $http){
	
	return{
		listarProductos: listProducts,
		listarPerfilProducto: listProductProfile,
		modificarPrecioVenta: editProductPrice,
		modificarNombreProducto: editProductName,
		eliminarProducto: deleteProduct
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

	function editProductPrice(idProducto,precioVenta)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Productos/modificarPrecioVenta.php';
		var data = {'idProducto':idProducto,'precioVenta':precioVenta};
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

	function editProductName(idProducto,nombre)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Productos/modificarNombreProducto.php';
		var data = {'idProducto':idProducto,'nombreProducto':nombre};
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

	function deleteProduct(idProducto)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Productos/eliminarProducto.php';
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