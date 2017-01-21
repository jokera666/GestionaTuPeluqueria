angular.module('starterMiApp.servsEmpleados', [])

.service('servEmpleados', ['$q', '$http', function($q, $http){
	
	return{
		listarEmpleados: listEmployees,
		listarPerfilEmpleado: listEmployeeProfile,
		insertarEmpleado: addEmployee,
		modificarEmpleado: editEmployee
	}

	function listEmployees(idUsuario)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Empleados/listarEmpleados.php';
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

	function listEmployeeProfile(idEmpleado)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Empleados/listarPerfilEmpleado.php';
		var data = {'idEmpli' : idEmpleado};
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

	function addEmployee(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Empleados/insertarEmpleado.php';
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


	function editEmployee(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/Empleados/modificarEmpleado.php';
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

}])