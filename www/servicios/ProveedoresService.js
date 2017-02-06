angular.module('starterMiApp.servsProveedores', [])

.service('servProveedores', ['$q', '$http', function($q, $http){

	return{
		listarProveedores: listProviders,
		listarPerfilProveedor: listProviderProfile
	}

	function listProviders(idUsuario)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Proveedores/listarProveedores.php';
		var data = {'idUser':idUsuario};
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
		
	}


}]);