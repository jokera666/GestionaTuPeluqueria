angular.module('starterMiApp.servsEmpleados', [])

.service('servEmpleados', ['$q', '$http', 'baseURL', function($q, $http, baseURL){
	
	return{
		listarEmpleados: listEmployees,
		listarPerfilEmpleado: listEmployeeProfile,
		insertarEmpleado: addEmployee,
		modificarEmpleado: editEmployee,
		borrarPerfilEmpleado: deleteEmployeeProfile
	}

	function listEmployees(idUsuario)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Empleados/listarEmpleados.php';
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

		var url = baseURL+'Empleados/listarPerfilEmpleado.php';
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

		var url = baseURL+'Empleados/insertarEmpleado.php';
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

		var url = baseURL+'Empleados/modificarEmpleado.php';
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

	function deleteEmployeeProfile(idEmpleado)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'Empleados/eliminarPerfilEmpleado.php';
		var data = {'idEmpli':idEmpleado};
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