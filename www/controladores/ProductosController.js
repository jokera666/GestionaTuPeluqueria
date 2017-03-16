angular.module('starterMiApp.contrsProductos', [])

.controller('ProductosCtrl', ['$scope', '$state','$stateParams','servCompras','servProductos', function($scope, $state,$stateParams,servCompras,servProductos){
    
	var sesionIdUser = localStorage.getItem("idUser");
	$scope.marcas = [];

    //Obtener todas las marcas del usuario
	servCompras.listarMarcas(sesionIdUser,'usuario').then(function(servResponse){

		$scope.marcas = servResponse;

	});

	//Listar todos los productos segun la marca seleccionada
	$scope.getProducto = function(infoMarca)
	{
		console.log(infoMarca.id_marca);
		$scope.noProductos = '';
		//null es la opcion de Seleccionar...
		if(infoMarca!=null)
		{
			var idMarca = infoMarca.id_marca; 
			servProductos.listarProductos(idMarca).then(function(servResponse){
				console.log(servResponse);
				if(servResponse == -1)
			    {
			    	$scope.productos = '';
			    	$scope.noProductos = 'No hay productos de esta marca.';
			    }
			    else
			    {
			    	$scope.noProductos = '';
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