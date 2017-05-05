angular.module('starterMiApp.contrsFacturas', [])

.controller('FacturasCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servProveedores','servCompras','servProductos', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servProveedores,servCompras,servProductos){

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
        console.log($scope.proveedoresModal);
        //Inciar el select con el primer Proveedor en listarFacturas
        $scope.model = {
            proveedor: $scope.proveedores[0]
        }

        var idProveedor = $scope.model['proveedor'].id_proveedor;
        var nombreProveedor = $scope.model['proveedor'].nombre;
        $scope.nombreProUrl = $scope.model['proveedor'].nombre;

        if($scope.model!=null)
        {
            servCompras.listarFacturas(idProveedor,'proveedor').then(function(servResponse){
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
                    
                    for(i=0; i<servResponse.length; i++)
                    {
                      $scope.compras[i].fechaCompra = moment(new Date($scope.compras[i].fechaCompra)).format('DD/MM/YYYY');
                    }
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
			servCompras.listarFacturas(idProveedor,'proveedor').then(function(servResponse){
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
            for(i=0; i<servResponse.length; i++)
            {
              $scope.compras[i].fechaCompra = moment(new Date($scope.compras[i].fechaCompra)).format('DD/MM/YYYY');
            }
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

    $scope.getTipoProducto = function(objMarca,idTipo,index)
    {
        switch(parseInt(idTipo))
        {
          case 1:
          if(objMarca != null)
          {
            var idMarca = objMarca.id_marca;
            servProductos.listarProductos(idMarca).then(function(servResponse){
              console.log(servResponse);
              if(servResponse == -1)
                {
                  // No hay productos
                }
                else
                {
                  $scope.todoListLineasCompra[index].showTipo = 1;
                  $scope['productos'+index] = servResponse;
                }
            });

            $scope.getIdProducto = function (objProducto,index)
            {
              if(objProducto!=null)
              { 
                var precioVentaProducto = objProducto.precioVenta;
                var precioCompraProducto = objProducto.precioCompraUnd;

                $scope.todoListLineasCompra[index].precioVentaUnd =  precioVentaProducto;
                $scope.todoListLineasCompra[index].precioCompraUnd =  precioCompraProducto;
              }
            }
          }

          $scope.todoListLineasCompra[index].showTipo = 1;
          break;
          case 2:
          $scope.todoListLineasCompra[index].producto = '';
          $scope.todoListLineasCompra[index].nombreProducto =  '';
          $scope.todoListLineasCompra[index].precioVentaUnd =  '';
          $scope.todoListLineasCompra[index].precioCompraUnd =  '';
          $scope.todoListLineasCompra[index].showTipo = 2;
          break;
        }
    }

    $scope.getIdMarca = function (objMarca,index)
    {
      if(objMarca != null)
      {
        var idMarca = objMarca.id_marca;
        servProductos.listarProductos(idMarca).then(function(servResponse){
          console.log(servResponse);
          if(servResponse == -1)
            {
              // No hay productos
            }
            else
            {
              $scope.todoListLineasCompra[index].showTipo = 1;
              $scope.idTipo = '1';
              $scope['productos'+index] = servResponse;
            }
        });

        $scope.getIdProducto = function (objProducto,index)
        {
          if(objProducto!=null)
          { 
            var precioVentaProducto = objProducto.precioVenta;
            var precioCompraProducto = objProducto.precioCompraUnd;

            $scope.todoListLineasCompra[index].precioVentaUnd =  precioVentaProducto;
            $scope.todoListLineasCompra[index].precioCompraUnd =  precioCompraProducto;
          }
        }
      }
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

    $scope.reiniciarForm = function()
    {
      $scope.form = {};
      $scope.marcas = {};
      $scope.todoListLineasCompra = {};
    }

    //Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin FacturasCtrl

.controller('FacturaPerfilCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servProveedores','servCompras', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servProveedores,servCompras){

	var sesionIdUser = localStorage.getItem("idUser");
	console.log('Usuario con id de sesion---> '+sesionIdUser);
  $scope.animacion = "hide";
	var idCompra = $stateParams.idCompra;
  $scope.nombreProveedor = $stateParams.nombre;

  var cabeceraInicial = '';
  var lineasFacturaIniciales = '';
  var marcasIniciales = '';

  ////////////////Inciar los la cabecera de la factura CON LINEAS///////////////////////
  servCompras.listarFacturas(idCompra,'factura').then(function(servResponse){
    $scope.form = {
      numFactura: servResponse[0].numFactura,
      fechaCompra: new Date(servResponse[0].fechaCompra)
    }
    cabeceraInicial = angular.copy(servResponse[0]); 
    $scope.totalFactura = servResponse[0].precioCompraTotal;
  });
  //////////////////////////////////////////////////////////////////////////////////////

	servCompras.listarPerfilFactura(idCompra).then(function(servResponse){

    if(servResponse==-1)
    {
        $scope.mensajeError = "La factura no tiene lineas.";
        $scope.animacion = "animated shake show";
        /*Inciar los la cabecera de la factura en caso de linias no existentes y las 
        /marcas corrspondiente del proveedor.*/
        servCompras.listarFacturas(idCompra,'factura').then(function(servResponse){
          $scope.form = {
            numFactura: servResponse[0].numFactura,
            fechaCompra: new Date(servResponse[0].fechaCompra)
          }
          $scope.totalFactura = servResponse[0].precioCompraTotal;
          $scope.form['idCompra'] = idCompra;
          $scope.form['idProveedor'] = servResponse[0].idProveedor;
          console.log($scope.form);
          $scope.formulario = $scope.form;

          //Iniciar las marcas segun el proveedor en caso de que las lineas esten vacias
          var idProveedor = servResponse[0].idProveedor;
          servCompras.listarMarcas(idProveedor,'proveedor').then(function(servResponse){
            $scope.marcas = servResponse;
          });
    });
        //////////////////////////////////////////////////////////////////////////
    }
    else
    {
      $scope.mensajeError = "";
      $scope.animacion = "hide";
      // Convierte la fecha obtenida(DD/MM/YYYY) del servidior en formato Date de javascript
      //var formattedDate = moment(servResponse[0].fechaCompra,'DD/MM/YYYY').format();
      //var fechaAdaptada = new Date(formattedDate);

      /*Establesco una hora de las 7 de la mañana porque por tiempo de zonas
      por defecto la hora es 00:00 y al cambiar de fecha a veces se pone 23:00 y
      no cambia de dia.*/
      //fechaAdaptada.setHours(07, 00, 00, 00);
      
      ///////////////////////Inciar las lineas de compra/////////////////////// 
      $scope.todoListLineasCompra = servResponse;
       lineasFacturaIniciales = angular.copy(servResponse); 
      /////////////////////////////////////////////////////////////////////////

      /* Оbtener las marcas de cada linea de compra para poder iniciar el select en 
       cada linea de compra.*/
      $scope.misMarcas = [];
      var numeroLineasCompras = servResponse.length;
      for(i=0; i<numeroLineasCompras; i++)
      {
        $scope.misMarcas.push({id_marca:servResponse[i].id_marca, nombre:servResponse[i].nombre});
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
      marcasIniciales = angular.copy($scope.misMarcas);
    }
    
	});

  $scope.eliminarLineaCompra = function (index,idLinea,nombreProducto,unidades,idCompra,idMarca)
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
                  servCompras.eliminarLineaFactura(idLinea,nombreProducto,unidades,idCompra,idMarca).then(function(servResponse){
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

  //Todolist Nuevas lineas de compras
  $scope.todoListNuevasLineasCompra = [];
  $scope.anadirLineaCompra  = function()
  {
    $scope.todoListNuevasLineasCompra.push({});
  };
  $scope.eliminarNuevaLinea  = function(index)
  {
    $scope.todoListNuevasLineasCompra.splice(index, 1);
  };


  $scope.clickModificarFactura = function(form)
  {
    form['lineasExistentes'] = $scope.todoListLineasCompra;
    form['nuevasLineas'] = $scope.todoListNuevasLineasCompra;

    var myPopup = $ionicPopup.show({
        title: 'Modificar factura',
        subTitle: '<span>¿Estás seguro de que deseas modificar la factura con numero <b>'+form.numFactura+'</b> ?</span>',
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
                  servCompras.modificarPerfilFactura(form).then(function(servResponse){
                    console.log(servResponse);
                    $state.go($state.current,null,{reload:true});
                  });
              }
            }
          }
        ]
    });
  }

  $scope.clickEliminarFactura = function(form)
  {
    form['lineasExistentes'] = $scope.todoListLineasCompra;
    form['idCompra'] = idCompra;
    console.log(form);
    var myPopup = $ionicPopup.show({
        title: 'Borrar factura',
        subTitle: '<span>¿Estás seguro de que deseas modificar la factura con numero <b>'+form.numFactura+'</b> ?</span>',
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
                  servCompras.eliminarFactura(form).then(function(servResponse){
                    console.log(servResponse);
                    $state.go('sidemenu.facturas',null,{reload:true});
                  });
              }
            }
          }
        ]
    });
  }

  $scope.reiniciarForm = function()
  {
    $scope.form = {
            numFactura: cabeceraInicial.numFactura,
            fechaCompra: new Date(cabeceraInicial.fechaCompra)
    };

    $scope.todoListLineasCompra = angular.copy(lineasFacturaIniciales);
    for(i=0; i<$scope.todoListLineasCompra.length; i++)
    {
      $scope.todoListLineasCompra[i].objMarca = angular.copy(marcasIniciales[i]);
    }
 }
    

}]) // Fin FacturasCtrl