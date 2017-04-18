angular.module('starterMiApp.contrsCaja', [])

.controller('CajaCtrl', ['$scope','$state','$stateParams','servEmpleados','servSecciones','servServicios','servCompras','servProductos','$ionicPopup','$ionicLoading', function($scope,$state,$stateParams,servEmpleados,servSecciones,servServicios,servCompras,servProductos,$ionicPopup,$ionicLoading){

	var idUser = localStorage.getItem("idUser");

	var nombreCliente = $stateParams.nombreCliente;
	var fechaCita 	  = $stateParams.fechaCita;
	var idCliente 	  = $stateParams.idCliente;

	$scope.ventaNueva = $stateParams.idCliente;

	$scope.nombreCliente = nombreCliente;

	$scope.form = {
		fecha: new Date(fechaCita)
	};

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
	  	var valorRestado = $scope.todoListServicios[index].precioVenta;
  		$scope.precioTotalVenta -= valorRestado;
        $scope.todoListServicios.splice(index, 1);
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
  		var valorRestado = $scope.todoListProductos[index].precioVentaProducto;
  		var unidades = $scope.todoListProductos[index].unidades;
  		$scope.precioTotalVenta -= valorRestado*unidades;
        $scope.todoListProductos.splice(index, 1); 	
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
		console.log(servResponse);
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
		console.log(index);
		if(objSeccion!=null)
		{
			var idSeccion = objSeccion.id_seccion;
			console.log(idSeccion);

			/*------------------------- LISTAR SERVICIOS -----------------------*/
			servServicios.nombreServicio(idSeccion).then(function(servResponse){
				console.log(index);
				console.log(servResponse);
				if(servResponse == -1)
			    {
			    	// No hay servicios
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
					console.log(objServicio);
					var nombreServicio = objServicio.nombreServicio;
					console.log(nombreServicio);

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
					totalVentaServicios = 0;
					var precio = 0;
					var precioVenta = objCategoria.precioVenta;
					$scope.todoListServicios[index].precioVenta = precioVenta;

					for(i=0; i<$scope.todoListServicios.length; i++)
					{
						precio = $scope.todoListServicios[i].precioVenta;
						totalVentaServicios += precio;
					}

					auxTotalServicios = totalVentaServicios;
					$scope.precioTotalVenta = auxTotalServicios + auxTotalProductos;
				}	
			}
		}
	}

	$scope.getPrecioVentaServicio = function(index)
	{
		totalVentaServicios = 0;
		var precio = 0;
		for(i=0; i<$scope.todoListServicios.length; i++)
		{
			precio = $scope.todoListServicios[i].precioVenta;
			totalVentaServicios += precio;
		}
		auxTotalServicios = totalVentaServicios;
		$scope.precioTotalVenta = auxTotalServicios + auxTotalProductos;
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
			    	// No hay productos
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
					var precio = 0;
					totalVentaProductos = 0;
					$scope.todoListProductos[index].precioVentaProducto =  precioVentaProducto;
					$scope.todoListProductos[index].unidades = 1;
					for(i=0; i<$scope.todoListProductos.length; i++)
					{
						precio = $scope.todoListProductos[i].precioVentaProducto;
						totalVentaProductos += precio;
					}
					auxTotalProductos = totalVentaProductos;
					$scope.precioTotalVenta = auxTotalServicios + auxTotalProductos;
				}
			}
		}
	}

	$scope.getPrecioVentaProducto = function(index)
	{
		totalVentaProductos = 0;
		var unidades = 1;
		var precio 	 = 0;

		for(i=0; i<$scope.todoListProductos.length; i++)
		{
			precio = $scope.todoListProductos[i].precioVentaProducto;
			unidades = $scope.todoListProductos[i].unidades;
			totalVentaProductos += unidades*precio;
		}
		auxTotalProductos = totalVentaProductos; 
		$scope.precioTotalVenta = auxTotalServicios + auxTotalProductos;
	}

	$scope.aplicarDescuento = function(descuento)
	{
		var aux = 0;
		if(descuento > $scope.precioTotalVenta)
		{
			var alertPopup = $ionicPopup.alert({
			     title: 'Error al realizar el descuento',
			     template: 'Descuento incorrecto.',
			     okText: 'Volver', 
  				 okType: 'button-assertive'
   			});
		}
		else
		{
			 aux = descuento;
			 $scope.precioTotalVenta -= aux;
		}
	}
	
	$scope.realizarVenta = function(form)
	{
		//$ionicLoading.show();
		form['lineasVentasServicios'] = $scope.todoListServicios;
		form['lineasVentasProductos'] = $scope.todoListProductos;
		form['precioVentalTotal'] = $scope.precioTotalVenta;
		console.log(form);
		$scope.forma = form;
	}

}]) // Fin CajaCtrl