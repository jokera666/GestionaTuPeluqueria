angular.module('starterMiApp.contrsProductos', [])

.controller('ProductosCtrl', ['$scope', '$state','$stateParams','servCompras','servProductos', function($scope, $state,$stateParams,servCompras,servProductos){
    
	var sesionIdUser = localStorage.getItem("idUser");
	$scope.animacion = "hide";

    //Obtener todas las marcas del usuario
	servCompras.listarMarcas(sesionIdUser,'usuario').then(function(servResponse){

		
		if(servResponse==-1)
		{
			$scope.mensajeError = 'No tiene productos adqueridos.<br />Para añadir un nuevo producto: <a href="#/side/facturas">Pulse aqui</a>';
	    	// Añade estilo a la clase mediante ng-class
	    	$scope.animacion = "animated shake show";
		}
		else
		{
			$scope.marcas = servResponse;
			//Inciar el select con la primera marca obtenida
			$scope.model = {
		      marca: $scope.marcas[0]
		    };
		    
		    var idMarca = $scope.model['marca'].id_marca;
		    var nombreMarca = $scope.model['marca'].nombre;

			//null es la opcion de Seleccionar...
			if($scope.model!=null)
			{
				servProductos.listarProductos(idMarca).then(function(servResponse){
					console.log(servResponse);
					if(servResponse == -1)
				    {
				    	$scope.productos = '';
				    	$scope.mensajeError = 'No hay productos de la marca: <span class="msgErrorNombre">'+nombreMarca+'</span>';
				    	// Añade estilo a la clase mediante ng-class
				    	$scope.animacion = "animated shake show";
				    }
				    else
				    {
				    	$scope.animacion = "hide";
				      	$scope.productos = servResponse;
				    }
				});
			}
		}


	});



	//Listar todos los productos segun la marca seleccionada
	$scope.getProducto = function(infoMarca)
	{
		console.log(infoMarca);
		$scope.animacion = "hide";

		//null es la opcion de Seleccionar...
		if(infoMarca!=null)
		{
			var idMarca = infoMarca.id_marca;
			var nombreMarca = infoMarca.nombre; 
			servProductos.listarProductos(idMarca).then(function(servResponse){
				console.log(servResponse);
				if(servResponse == -1)
			    {
			    	$scope.productos = '';
			    	$scope.mensajeError = 'No hay productos de la marca: <span class="msgErrorNombre">'+nombreMarca+'</span>';
			    	$scope.animacion = "animated shake show";
			    }
			    else
			    {
			    	$scope.animacion = "hide";
			      	$scope.productos = servResponse;
			    }
			});
		}
	}

	//Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin ProductosCtrl

.controller('ProductoPerfilCtrl', ['$scope', '$state','$stateParams','servCompras','servProductos', function($scope, $state,$stateParams,servCompras,servProductos){
    
	var sesionIdUser = localStorage.getItem("idUser");
	console.log(sesionIdUser);

}]) // Fin ProductoPerfilCtrl