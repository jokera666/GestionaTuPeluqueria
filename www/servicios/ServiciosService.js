angular.module('starterMiApp.servsServicios', [])

.service('servServicios',['$q','$http', function($q,$http){
	return{
		nombreServicio: nameService
	}

	function nameService(idSeccion)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = "http://gestionestetica.fonotecaumh.es/Servicios/listarServicios.php";
        var data = {'idSeccion':idSeccion};
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