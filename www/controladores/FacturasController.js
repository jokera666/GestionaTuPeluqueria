angular.module('starterMiApp.contrsFacturas', [])

.controller('FacturasCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servProveedores','servCompras', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servProveedores,servCompras){

	var sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+sesionIdUser);

	$scope.proveedores = [];
	$scope.proveedoresModal = [];
	
	//Obtener los proveedores en el select en la vista listarFacturas
	servProveedores.listarProveedores(sesionIdUser,'getNameProveedores').then(function(servResponse){
		console.log(servResponse);
	    if(servResponse == -1)
	    {
	    	$scope.noProveedores = 'No tiene proveedores introducidos.';
	    }
	    else
	    {
	      	$scope.proveedores = servResponse;
	      	$scope.proveedoresModal = servResponse;
	    }
	});

	//Listar las facturas segun el proveedor seleccionado
	$scope.getProveedor = function(infoProveedor)
	{
		//console.log(infoProveedor.id_proveedor);
		$scope.noProveedores = '';
		//null es la opcion de Seleccionar...
		if(infoProveedor!=null)
		{
			var idProveedor = infoProveedor.id_proveedor; 
			//console.log(idProveedor);
			servCompras.listarFacturas(idProveedor).then(function(servResponse){
				//console.log(servResponse);
				if(servResponse == -1)
			    {
			    	$scope.compras = '';
			    	$scope.noProveedores = 'No hay facturas disponibles del proveedor.';
			    }
			    else
			    {
			    	$scope.noProveedores = '';
			      	$scope.compras = servResponse;
			    }
			});
		}
	}


	//Insertar compra
	$ionicModal.fromTemplateUrl('plantillas/Facturas/modalInsertarCompra.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalCompra = function() {
      $scope.modal.show();
      //Incializar el formulario al abrir el modal de insertar Compra
      $scope.form = {
      	fechaCompra : new Date() 
      }
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Insertar la factura segun el proveedor seleccionado
    $scope.getProveedorModal = function(infoProveedor)
    {
    	//Reiniciar el todoList cada vez que se cambia de proovedor
    	//ya que se evite conflictos de marcas y proveedores
    	//asi forzamos que la factura sea de un unico proovedor
    	$scope.todoListLineasCompra = [];

    	var idProveedor = infoProveedor.id_proveedor;
    	console.log(infoProveedor.id_proveedor);
    	
    	//Obtener las marcas segun el proveedor seleccionado
    	servCompras.listarMarcas(idProveedor,'proveedor').then(function(servResponse){
    		$scope.marcas = servResponse;
    	});
    }

    $scope.todoListLineasCompra = [];

	$scope.anadirLineaCompra  = function()
	{
		$scope.todoListLineasCompra.push({});
	}

	$scope.eliminarLineaCompra = function (index) {
        $scope.todoListLineasCompra.splice(index, 1);
    };

    $scope.clickInsertarCompra = function(form)
    {
    	$ionicLoading.show();
    	form['Lineas'] = $scope.todoListLineasCompra;
    	console.log(form); 
    	if($scope.todoListLineasCompra=='')
    	{
    		$ionicLoading.hide();
    		var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: 'Debe de introducir al menos una linea de factura.',
                 okText: 'Volver', 
                 okType: 'button-assertive'
            });
    	}
    	else if($scope.marcas=='')
    	{
    		$ionicLoading.hide();
    		var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: 'Debe de seleccionar una marca.',
                 okText: 'Volver', 
                 okType: 'button-assertive'
            });
    	}
    	else
    	{
     		servCompras.insertarFactura(form).then(function(servResponse){
     			console.log(servResponse);
     			if(servResponse == -1)
     			{
     				$ionicLoading.hide();
		    		var alertPopup = $ionicPopup.alert({
		                 title: 'Error',
		                 template: 'La factura ya existe.',
		                 okText: 'Volver', 
		                 okType: 'button-assertive'
		            });
     			}
     			else
     			{
	     			$scope.modal.hide();
				    $state.go('sidemenu.facturas',null,{reload:true});
     			}

			});
    	}
    }

    //Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin FacturasCtrl

.controller('FacturaPerfilCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servProveedores','servCompras', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servProveedores,servCompras){

	var sesionIdUser = localStorage.getItem("idUser");
	console.log('Usuario con id de sesion---> '+sesionIdUser);

	var idCompra = $stateParams.idCompra;
	servCompras.listarPerfilFactura(idCompra).then(function(servResponse){
		
	});
    

}]) // Fin FacturasCtrl