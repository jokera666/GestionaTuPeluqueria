angular.module('starterMiApp.servsSecciones', [])

.service('servSecciones', ['$q','$http', function($q,$http){
	return{
		listarSecciones: getSections
	}

	function getSections(idUsuario)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Secciones/listarSecciones.php';
		var data = {'idUser':idUsuario};
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function (response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;		
	}
}])