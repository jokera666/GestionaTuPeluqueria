angular.module('starterMiApp.contrsCaja', [])

.controller('CajaCtrl', ['$scope','$state','$stateParams','$ionicPopup','$ionicLoading','servEmpleados','servSecciones','servServicios','servCompras','servProductos','servVentas','servClientes','$ionicPopup','$ionicLoading', function($scope,$state,$stateParams,$ionicPopup,$ionicLoading,servEmpleados,servSecciones,servServicios,servCompras,servProductos,servVentas,servClientes){

	var idUser = localStorage.getItem("idUser");

	var nombreCliente = $stateParams.nombreCliente;
	var fechaCita 	  = $stateParams.fechaCita;
	var idCliente 	  = $stateParams.idCliente;

	$scope.ventaNueva = $stateParams.idCliente;

	//Listar los clientes
    servClientes.listarClientes('citasClientes',idUser).then(function(data){
      if(data==-1)
      {
        // No hay clientes.
      }
      else
      {
        $scope.nombres = data;
      }
    });

	$scope.tipoCliente = [
	    {idTipoCliente: -77,tipo:'Genérico'},
	    {idTipoCliente: 66,tipo:'Existente'}
    ]; 

    //Inciar select tipoCliente
    $scope.tipoInsert = {
      obj: $scope.tipoCliente[0]
    }

    $scope.tipoEdit = {
      obj: $scope.tipoCliente[0]
    }

    $scope.showTipoCliente = $scope.tipoCliente[0].idTipoCliente;

    $scope.getTipoClienteCaja = function(tipoCliente)
    {
      $scope.showTipoCliente = tipoCliente.idTipoCliente;
    }


	$scope.nombreCliente = nombreCliente;
	$scope.form = [];

	function numRandom(min, max) {
  		return Math.floor(Math.random() * (max - min)) + min;
	}

	if(fechaCita != '')
	{
		var date = new Date(fechaCita);
	    var d = date.getDate();
	    var m = date.getMonth();
	    var y = date.getFullYear();

	   	var numeroAletorio = numRandom(1000,9000);

	    numVenta = String(d).concat(String(m+1),String(y),String(numeroAletorio));

		$scope.form = {
			fecha: new Date(fechaCita),
			numVenta: numVenta
		};
	}
	else
	{
		var objForm = $scope.form = {
			fecha: new Date()
		};

		var date = new Date(objForm.fecha);
	    var d = date.getDate();
	    var m = date.getMonth();
	    var y = date.getFullYear();

	   	var numeroAletorio = numRandom(1000,9000);

	    numVenta = String(d).concat(String(m+1),String(y),String(numeroAletorio));
		
		$scope.form = {
			fecha: new Date(),
			numVenta: numVenta
		};
	}

	$scope.getFecha = function(fecha)
	{
		var date = new Date(fecha);
	    var d = date.getDate();
	    var m = date.getMonth();
	    var y = date.getFullYear();

	    var numeroAletorio = numRandom(1000,9000);

	    numVenta = String(d).concat(String(m+1),String(y),String(numeroAletorio));

		$scope.form['numVenta'] = numVenta;
	}

	$scope.precioTotalVenta = 0;
	var totalVentaServicios = 0;
	var totalVentaProductos = 0;
	var auxTotalServicios = 0;
	var auxTotalProductos = 0;

	$scope.todoListServicios = [];
	/*--------------------------TODOLIST SERVICIOS VENTAS------------------------------*/

	$scope.anadirServicio  = function()
	{
		if($scope.todoListServicios == '' && $scope.todoListProductos == '')
	  	{
	  		auxTotalServicios = 0;
	  		auxTotalProductos = 0;
	  		$scope.precioTotalVenta = 0;
	  	}
		$scope.todoListServicios.push({});
	};

	$scope.eliminarServicio = function (index)
  	{
  		if($scope.todoListServicios[index].seccion==undefined && $scope.todoListServicios[index].servicio==undefined)
  		{
  			$scope.todoListServicios.splice(index, 1);
  		}
  		else if($scope.todoListServicios[index].precioVenta==undefined)
  		{
  			$scope.todoListServicios.splice(index, 1);
  		}
  		else
  		{
	  		var valorRestado = $scope.todoListServicios[index].precioVenta;
	  		$scope.precioTotalVenta -= valorRestado;
	        $scope.todoListServicios.splice(index, 1);
  		}
  	};

  	$scope.todoListProductos = [];
	/*--------------------------TODOLIST SERVICIOS VENTAS------------------------------*/

	$scope.anadirProducto  = function()
	{
		if($scope.todoListServicios == '' && $scope.todoListProductos == '')
	  	{
			auxTotalServicios = 0;
	  		auxTotalProductos = 0;
	  		$scope.precioTotalVenta = 0;
	  	}
		$scope.todoListProductos.push({});
	};

	$scope.eliminarProducto = function (index)
  	{
  		if($scope.todoListProductos[index].marca==undefined && $scope.todoListProductos[index].producto==undefined)
  		{
  			$scope.todoListProductos.splice(index, 1);
  		}
  		else if($scope.todoListProductos[index].precioVentaProducto==undefined)
  		{
  			$scope.todoListProductos.splice(index, 1);
  		}
  		else
  		{
	  		var valorRestado = $scope.todoListProductos[index].precioVentaProducto;
	  		var unidades = $scope.todoListProductos[index].unidades;
	  		$scope.precioTotalVenta -= valorRestado*unidades;
	        $scope.todoListProductos.splice(index, 1); 	
  		}
  	};

  	/*--------------------------FIN TODOLIST SERVICIOS VENTAS--------------------------*/
	
	servEmpleados.listarEmpleados(idUser).then(function(servResponse){
		if(servResponse == -1)
		{
			// No hay empleados
		}
		else
		{
			$scope.empleados = servResponse;
		}
	});

	/*------------------------- LISTAR SECCIONES-----------------------*/ 
	servSecciones.listarSecciones(idUser).then(function(servResponse){
		if(servResponse==-1)
	    {
	    	// No hay secciones
	    }
      	else
      	{
        	$scope.secciones = servResponse;   
      	}
	});

	$scope.getIdSeccion = function(objSeccion,index)
	{
		if(objSeccion!=null)
		{
			var idSeccion = objSeccion.id_seccion;

			/*------------------------- LISTAR SERVICIOS -----------------------*/
			servServicios.nombreServicio(idSeccion).then(function(servResponse){
				if(servResponse == -1)
			    {
			    	// No hay servicios
			    	$scope['servicios'+index] = [];
			    }
			    else
			    {
			      	$scope['servicios'+index] = servResponse;
			    }
			});

			$scope.getNombreServicio = function(objServicio)
			{
				if(objServicio!=null)
				{
					var nombreServicio = objServicio.nombreServicio;

					/*------------------------- LISTAR CATEGORIAS -----------------------*/
					servServicios.listarPerfilServicio(idSeccion,nombreServicio).then(function(servResponse){
						$scope['categorias'+index] = servResponse;
		     		});
				}
			}

			$scope.getCategoria = function(objCategoria,index)
			{
				if(objCategoria != null)
				{	
					var precioVenta = objCategoria.precioVenta;
					$scope.todoListServicios[index].precioVenta = precioVenta;
					$scope.calcularPrecioTotal(index);
				}	
			}
		}
	}

	//Obtener todas las marcas del usuario
	servCompras.listarMarcas(idUser,'usuario').then(function(servResponse){

		if(servResponse==-1)
		{
			// No hay marcas
		}
		else
		{
			$scope.marcas = servResponse;
		}
	});

	$scope.getIdMarca = function (objMarca,index)
	{
		if(objMarca != null)
		{
			var idMarca = objMarca.id_marca;
			servProductos.listarProductos(idMarca).then(function(servResponse){
				if(servResponse == -1)
			    {
			    	$scope['productos'+index] = [];
			    	// No hay productos y en la vista tiene que ir
			    	// con el track by $index
			    	// $scope['productos'+index] = [
			    	// 	{nombreProducto: 'no hay producto'}
			    	// ];

			    }
			    else
			    {
			      	$scope['productos'+index] = servResponse;
			    }
			});

			$scope.getIdProducto = function (objProducto,index)
			{
				if(objProducto!=null)
				{	
					var precioVentaProducto = objProducto.precioVenta;
					$scope.todoListProductos[index].unidades = 1;
					$scope.todoListProductos[index].precioVentaProducto =  precioVentaProducto;
					$scope.calcularPrecioTotal(index);
				}
			}
		}
	}

	$scope.calcularPrecioTotal = function(index)
	{
		var precioProducto = 0;
		var unidades = 1;
		var precioServicio = 0;
		var precioUnidadProducto = 0;
		
		var miArray = [];
		var auxTotalVenta = 0;

		angular.forEach($scope.todoListServicios, function(clave){
			precioServicio = clave.precioVenta;
			miArray.push(precioServicio);
		});

		angular.forEach($scope.todoListProductos, function(clave, key,obj) {
    		precioProducto = clave.precioVentaProducto;
    		unidades = clave.unidades;
    		precioUnidadProducto = unidades*precioProducto;
			miArray.push(precioUnidadProducto);
    	});
		
		for(var i = 0; i<miArray.length; i++)
		{
			auxTotalVenta += miArray[i];
		}

		$scope.precioTotalVenta = auxTotalVenta;
	}

	var aux1 = [];
	$scope.aplicarDescuento = function(descuento)
	{
		var totalDescuento = 0;
		aux1.push(parseFloat(descuento));
		for(var i=0; i<aux1.length; i++)
		{
			totalDescuento += aux1[i];
		}

		if(descuento > $scope.precioTotalVenta)
		{
			for(var i=0; i<aux1.length; i++)
			{
				aux1[i] = 0;
			}
			$scope.form['descuento'] = 0;
			$scope.precioTotalVenta += totalDescuento;
			var alertPopup = $ionicPopup.alert({
			     title: 'Error al realizar el descuento',
			     template: 'Descuento incorrecto.',
			     okText: 'Volver', 
  				 okType: 'button-assertive'
   			});
		}
		if(descuento == 0)
		{
			for(var i=0; i<aux1.length; i++)
			{
				aux1[i] = 0;
			}
			$scope.precioTotalVenta += totalDescuento;
			totalDescuento = 0;
		}
		else
		{
			 aux = descuento;
			 $scope.precioTotalVenta -= aux;
		}
	}
	
	$scope.realizarVenta = function(form)
	{
		$ionicLoading.show();	
		if($scope.todoListServicios == '' && $scope.todoListProductos == '')
		{
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
			     title: 'Error al realizar la venta',
			     template: 'Debe seleccionar al menos un servicio o producto.',
			     okText: 'Volver', 
  				 okType: 'button-assertive'
   			});
		}
		else
		{	
			form['lineasVentasServicios'] = $scope.todoListServicios;
			form['lineasVentasProductos'] = $scope.todoListProductos;
			form['precioVentaTotal'] = $scope.precioTotalVenta;
			form['tipoCliente'] =  $scope.showTipoCliente;
			form['idCliente'] = idCliente;
			form['idUser'] = idUser;

			/*Es un objeto para guardar como clave el id del producto y como valor las 
			veces que se repite.*/
			var objCountIdProductos = {};
			/*Variable global para calcular el sumatorio de las unidades que se preteden vender
			en caso de que un producto se repita*/
			var totalUnidades = 0;
			/*Es una variable global que si todo esta correcto con las unidades 
			de los productos que se pretenden vender respecto a su stock se realiza
			la venta y si no aparecen los mensajes de error.*/
			var checkUnidades = false;

			/*Comprobar en las lineas de venta hay productos que se repiten y sumar
			sus unidades que se pretenden vender para ver si se pasan del stock de
			este producto.*/
			angular.forEach($scope.todoListProductos, function(val, key,obj) {
				var idProducto = val['producto'].idElemento;
				var undsStock = val['producto'].cantidadStock;
				var nombreProducto = val['producto'].nombreProducto;
				var nombreMarca = val['marca'].nombre; 

				objCountIdProductos[idProducto] = (objCountIdProductos[idProducto] || 0)+1;
				if(objCountIdProductos[idProducto] > 1)
				{
				 	angular.forEach($scope.todoListProductos, function(val1, key,obj) {
				 		var idProductoRepetido = val1['producto'].idElemento;
				 		var unidadesProductoRepetido = val1.unidades;
				 		if(idProducto == idProductoRepetido)
				 		{
				 			totalUnidades += unidadesProductoRepetido;
				 		}
			    	});

		    		if( totalUnidades > undsStock)
			    	{
			    		$ionicLoading.hide();
				    	var alertPopup = $ionicPopup.alert({
						     title: 'Error al realizar la venta',
						     template: 'El producto <b>'+nombreMarca+' '+nombreProducto+'</b> disponse de <b>'+undsStock+'</b> unidades en Stock y pretende vender <b>'+totalUnidades+'.</b>',
						     okText: 'Volver', 
			  				 okType: 'button-assertive'
			   			});
			   			checkUnidades = true;
			    	}	
				}
				totalUnidades = 0;
	    	});


			/*Comprueba si solamente un producto se pasa de unidades comparado
			con su stock disponible*/
			angular.forEach($scope.todoListProductos, function(val){
				var undsVenta = val.unidades;
				var undsStock = val['producto'].cantidadStock;
				var nombreProducto = val['producto'].nombreProducto;
				var nombreMarca = val['marca'].nombre;

				if(undsVenta > undsStock)
				{
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
					     title: 'Error al realizar la venta',
					     template: 'El producto <b>'+nombreMarca+' '+nombreProducto+'</b> disponse de <b>'+undsStock+'</b> unidades en Stock y pretende vender <b>'+undsVenta+'.</b>',
					     okText: 'Volver', 
		  				 okType: 'button-assertive'
		   			});
		   			checkUnidades = true;
				}
			});

			if(checkUnidades!=true)
			{
				servVentas.insertarVenta(form).then(function(servResponse){
					$state.go('sidemenu.ventas',null,{reload:true});
				});
			}
		}
	}

}]) // Fin CajaCtrl