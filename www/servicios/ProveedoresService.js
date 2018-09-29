angular.module('starterMiApp.servsProveedores', [])

.service('servProveedores', ['$q', '$http', 'baseURL', function($q, $http, baseURL){

	return{
		listarProveedores: listProviders,
		listarPerfilProveedor: listProviderProfile,
		insertarProveedor: insertProvider,
		modificarPerfilProveedor: modifyProviderProfile,
		eliminarProveedor: deleteProvider,
		eliminarMarca: deleteBrand
	}

	/*Segun el parametro que le pasamos la la funcion de listar informacion
	del proveedor nos devolvera una u otra cosa.*/
	function listProviders(idUsuario,parametro)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Proveedores/listarProveedores.php';
		var data = {'idUser':idUsuario,'parametro':parametro};
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

	function listProviderProfile(idProveedor)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Proveedores/listarPerfilProveedor.php';
		var data = {'idProoveedor':idProveedor};
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

	function insertProvider(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Proveedores/insertarProveedor.php';
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

	function modifyProviderProfile(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Proveedores/modificarProveedor.php';
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

	function deleteProvider(idProveedor)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Proveedores/eliminarProveedor.php';
		var data = {'idProvee':idProveedor};
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

	function deleteBrand(idMarca)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Proveedores/eliminarMarca.php';
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


}]);