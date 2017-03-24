angular.module('starterMiApp.contrsFacturas', [])

.controller('FacturasCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servProveedores','servCompras', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servProveedores,servCompras){

    var sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+sesionIdUser);
    $scope.animacion = "hide";
	
	//Obtener los proveedores en el select en la vista listarFacturas
	servProveedores.listarProveedores(sesionIdUser,'getNameProveedores').then(function(servResponse){
		  console.log(servResponse);
	    if(servResponse == -1)
	    {
	    	$scope.mensajeError = 'No hay proveedores introducidos.<br />Para añadir un nuevo proveedor: <a href="#/side/proveedores">Pulse aqui</a>';
        $scope.animacion = "animated shake show";
	    }
	    else
	    {
      	$scope.proveedores = servResponse;
      	$scope.proveedoresModal = servResponse;

        //Inciar el select con el primer Proveedor en listarFacturas
        $scope.model = {
            proveedor: $scope.proveedores[0]
        }

        var idProveedor = $scope.model['proveedor'].id_proveedor;
        var nombreProveedor = $scope.model['proveedor'].nombre;
        $scope.nombreProUrl = $scope.model['proveedor'].nombre;

        if($scope.model!=null)
        {
            servCompras.listarFacturas(idProveedor).then(function(servResponse){
                console.log(servResponse);
                if(servResponse == -1)
                {
                    $scope.compras = '';
                    $scope.mensajeError = 'No hay facturas disponibles del proveedor: <span class="msgErrorNombre">'+nombreProveedor+'</span>';
                    $scope.animacion = "animated shake show";
                }
                else
                {
                    $scope.mensajeError = '';
                    $scope.animacion = "hide";
                    $scope.compras = servResponse;
                }
            });
        }
	    }
	});

	//Listar las facturas segun el proveedor seleccionado
	$scope.getProveedor = function(infoProveedor)
	{
		$scope.mensajeError = '';
    $scope.animacion = "hide";
		//null es la opcion de Seleccionar...
		if(infoProveedor!=null)
		{
			var idProveedor = infoProveedor.id_proveedor;
      var nombreProveedor = infoProveedor.nombre;
      $scope.nombreProUrl = infoProveedor.nombre;
			//console.log(idProveedor);
			servCompras.listarFacturas(idProveedor).then(function(servResponse){
				console.log(servResponse);
				if(servResponse == -1)
			    {
			    	$scope.compras = '';
			    	$scope.mensajeError = 'No hay facturas disponibles del proveedor: <span class="msgErrorNombre">'+nombreProveedor+'</span>';
                    $scope.animacion = "animated shake show";
			    }
			    else
			    {
			    	$scope.mensajeError = '';
                    $scope.animacion = "hide";
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
            console.log(servResponse);
    		$scope.marcas = servResponse;
    	});
    }

  $scope.todoListLineasCompra = [];

	$scope.anadirLineaCompra  = function()
	{
		$scope.todoListLineasCompra.push({});
	};

	$scope.eliminarLineaCompra = function (index)
  {
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
  $scope.nombreProveedor = $stateParams.nombre;

	servCompras.listarPerfilFactura(idCompra).then(function(servResponse){

    // Convierte la fecha obtenida del servidior en formato Date de javascript
    var formattedDate = moment(servResponse[0].fechaCompra,'DD/MM/YYYY').format();
    var fechaAdaptada = new Date(formattedDate);

    /*Establesco una hora de las 7 de la mañana porque por tiempo de zonas
    por defecto la hora es 00:00 y al cambiar de fecha a veces se pone 23:00 y
    no cambia de dia.*/
    fechaAdaptada.setHours(07, 00, 00, 00);

    //Inciar los datos de la factura///////////////////////
    $scope.form = {
      numFactura: servResponse[0].numFactura,
      fechaCompra: fechaAdaptada
    }
    $scope.totalFactura = servResponse[0].precioCompraTotal;
    ///////////////////////////////////////////////////////
    
    //Inciar las lineas de compra 
    $scope.todoListLineasCompra = servResponse;

    /* Оbtener las marcas de cada linea de compra para poder iniciar el select en 
     cada linea de compra.*/
    $scope.misMarcas = [];
    var numeroLineasCompras = servResponse.length;
    for(i=0; i<numeroLineasCompras; i++)
    {
      $scope.misMarcas.push({id:servResponse[i].id_marca, nombre:servResponse[i].nombre});
    }
      
    var idProveedor = servResponse[0].idProveedor;
    servCompras.listarMarcas(idProveedor,'proveedor').then(function(servResponse){
      $scope.marcas = servResponse;
      /*Iniciar cada select con su marca correspondiete de las marcas
      que ofrecidas por el proveedor*/
      for(i=0; i<numeroLineasCompras; i++)
      {
        $scope.todoListLineasCompra[i].objMarca =  $scope.misMarcas[i];
      }
    });

    $scope.formulario = $scope.form;

    $scope.respuesta = servResponse;
	});

  $scope.anadirLineaCompra  = function()
  {
    $scope.todoListLineasCompra.push({});
  };

  $scope.eliminarLineaCompra = function (index,idLinea,nombreProducto,unidades)
  {
    
        var myPopup = $ionicPopup.show({
        title: 'Borrar linea de factura',
        subTitle: '<span>¿Estás seguro de que deseas borrar la linea de la factura con producto <b>'+nombreProducto+'</b> ?</span>',
        buttons: [
          { 
            text: '<b>No</b>',
            type: 'button-dark'
          },
          {
            text: '<b>Sí</b>',
            type: 'button-positive',
            onTap: function(e) {
              $ionicLoading.show();
              if (e)
              {              
                  servCompras.eliminarLineaFactura(idLinea,nombreProducto,unidades).then(function(servResponse){
                      console.log(servResponse);
                      $scope.todoListLineasCompra.splice(index, 1);
                      $state.go($state.current,null,{reload:true});
                  });
              }
            }
          }
        ]
        });
  };

  $scope.clickModificarFactura = function(form)
  {
    form['lineasNuevas'] = $scope.todoListLineasCompra;
    console.log(form); 
  }
    

}]) // Fin FacturasCtrl