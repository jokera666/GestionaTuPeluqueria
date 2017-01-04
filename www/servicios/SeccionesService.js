angular.module('starterMiApp.servsSecciones', [])

.service('servSecciones', ['$q','$http', function($q,$http){
	return{
		listarSecciones: 	getSections,
		modificarSeccion: 	updateSection,
		insertarSeccion: 	insertSection,
		borrarSeccion: 		deleteSection
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

	function updateSection(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Secciones/modificarSeccion.php';
		var data = datosForm;
		var config = {
			header : {'Content-Type' : 'application/json'}
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

	function insertSection(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Secciones/insertarSeccion.php';
		var data = datosForm;
		var config = {
			header : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(respuesta){
				defered.resolve(respuesta);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function deleteSection(idSection)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Secciones/eliminarSeccion.php';
		var data = {'idSeccion':idSection};
		var config = {
			header : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(respuesta){
				defered.resolve(respuesta);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}
}])