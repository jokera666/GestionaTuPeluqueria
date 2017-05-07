angular.module('starterMiApp.contrsVentas', [])

.controller('VentasCtrl', ['$scope','$state','$stateParams','$ionicPopup','servVentas', function($scope,$state,$stateParams,$ionicPopup,servVentas){

	var idUser = localStorage.getItem("idUser");
	$scope.animacion = "hide";

	var fechaIni = new Date();
	fechaIni.setHours(00, 00, 00);
	$scope.fechaIni = fechaIni;

	var fechaActual = new Date();
	fechaActual.setHours(23, 59, 00);
	var fechaActualMasMes  = fechaActual.setMonth(fechaActual.getMonth()+1);
	$scope.fechaFin = new Date(fechaActualMasMes);

	servVentas.listarVentas(idUser,$scope.fechaIni,$scope.fechaFin).then(function(servResponse){
		console.log(servResponse);
		if(servResponse==-1)
		{
	        $scope.mensajeError = "No hay ventas realizadas entre el periodo seleccionado.";
	        $scope.animacion = "animated shake show";
		}
		else
		{
			$scope.animacion = "hide";
        	$scope.ventas = servResponse;
        	//Adaptar el formato de las fechas para el LIST
        	for(i=0; i<servResponse.length; i++)
            {
              $scope.ventas[i].fechaVenta = moment(new Date($scope.ventas[i].fechaVenta)).format('DD/MM/YYYY');
            }
		}
	});

	$scope.getFechas = function(fechaIni,fechaFin)
	{
		$scope.animacion = "hide";
		if(fechaIni > fechaFin || fechaFin < fechaIni)
		{
			var alertPopup = $ionicPopup.alert({
			     title: 'Error de fechas',
			     template: 'La hora de inicio tiene que ser menor que la hora fin y viceversa',
			     okText: 'Intentar de nuevo', 
			     okType: 'button-assertive'
			});
		}
		else
		{
			fechaIni.setHours(00, 00, 00);
			fechaFin.setHours(23, 59, 00);
			console.log('Fecha Ini-->'+fechaIni);
			console.log('Fecha Fin-->'+fechaFin);
			$scope.fechaIni = fechaIni;
			$scope.fechaFin = fechaFin;

			servVentas.listarVentas(idUser,$scope.fechaIni,$scope.fechaFin).then(function(servResponse){
				console.log(servResponse);
				if(servResponse==-1)
				{
			        $scope.mensajeError = "No hay ventas realizadas entre el periodo seleccionado.";
			        $scope.animacion = "animated shake show";
				}
				else
				{
					$scope.animacion = "hide";
		        	$scope.ventas = servResponse;
		        	//Adaptar el formato de las fechas para el LIST
		        	for(i=0; i<servResponse.length; i++)
		            {
		              $scope.ventas[i].fechaVenta = moment(new Date($scope.ventas[i].fechaVenta)).format('DD/MM/YYYY');
		            }
				}
			});
		} 
	}
}]) // Fin VentasCtrl

.controller('VentasPerfilCtrl', ['$scope','$state','$stateParams','$ionicPopup','servClientes','servEmpleados','servSecciones','servServicios','servVentas','$parse', function($scope,$state,$stateParams,$ionicPopup,servClientes,servEmpleados,servSecciones,servServicios,servVentas,$parse){

	var idVenta = $stateParams.idVenta;
	var idUser = localStorage.getItem("idUser");
	$scope.nombres = [];
	$scope.empleados = [];
	$scope.secciones = [];
	$scope.form = [];
	

	servVentas.listarCabeceraVenta(idVenta).then(function(servResponse){

		var idCliente = servResponse.idCliente;
		$scope.form['fecha'] = new Date(servResponse.fechaVenta);
		$scope.form['numVenta'] = servResponse.numVenta;
		var idEmpleado = servResponse.idEmpleado;

		servClientes.listarClientes('citasClientes',idUser).then(function(servResponse){
			if(servResponse==-1)
			{
			// No hay clientes.
			}
			else
			{
				//Listar los clientes en la etiqueta Select
				$scope.nombres = servResponse;
				//Iniciar la etiqueta Select con el cliente correspondiente de la venta
				for(var i = 0; i<$scope.nombres.length; i++)
				{
				if($scope.nombres[i].id_cliente == idCliente)
				{
					var indexCliente = i;
				}
				}
				$scope.form['objCliente'] = $scope.nombres[indexCliente];
			}
		});


		servEmpleados.listarEmpleados(idUser).then(function(servResponse){
			if(servResponse == -1)
			{
				// No hay empleados
			}
			else
			{
				//Listar los empleados en la etiqueta Select
				$scope.empleados = servResponse;
				//Iniciar la etiqueta Select con el empleado correspondiente de la venta
				for(var i = 0; i<$scope.empleados.length; i++)
				{
					if($scope.empleados[i].id_empleado == idEmpleado)
					{
						var indexEmpleado = i;
					}
				}
				$scope.form['objEmpleado'] = $scope.empleados[indexEmpleado];
			}
		});

	});//FIN listarCabeceraVenta


	$scope.todoListServicios = [];
	$scope.precioTotalVenta = 0;
	var totalVentaServicios = 0;
	var totalVentaProductos = 0;
	var auxTotalServicios = 0;
	var auxTotalProductos = 0;

	servVentas.listarServiciosVenta(idVenta).then(function(servResponse){
		//console.log(servResponse);
		$scope.todoListServicios = servResponse;

		/* Оbtener las secciones de cada linea de venta para poder iniciar el select en 
       cada linea de venta.*/
      $scope.misSecciones = [];
      $scope.misServicios = [];
      var numeroLineasVentas = servResponse.length;
      for(i=0; i<numeroLineasVentas; i++)
      {
        $scope.misSecciones.push({id_seccion:servResponse[i].id_seccion, nombre:servResponse[i].nombreSeccion});
        //$scope.misServicios.push({nombreServicio:servResponse[i].nombreServicio});
      }


		/*------------------------- LISTAR SECCIONES-----------------------*/ 
		servSecciones.listarSecciones(idUser).then(function(servResponse){
			if(servResponse==-1)
		    {
		    	// No hay secciones
		    }
	      	else
	      	{
	        	$scope.secciones = servResponse;

	        	for(var i=0; i<numeroLineasVentas; i++)
		        {
		         	$scope.todoListServicios[i].seccion =  $scope.misSecciones[i];

				
		        } 


	        	angular.forEach(servResponse, function(val, key,obj) {
    				// console.log(val.id_seccion);
    				// console.log(key);
    				// console.log(obj);
	    			servServicios.nombreServicio(val.id_seccion).then(function(servResponse){
				        	console.log(servResponse);
				        	// if(i != 0)
				        	// {
				        	// 	i--;
				        	// 	$scope[('servicios'+i)] = servResponse;
				        	// }
							//$scope.misServicios = servResponse;
							//console.log($scope.misServicios);
							//$scope.servicios0 = servResponse;
							if(servResponse == -1)
						    {
						    	// No hay servicios
						    }
						    else
						    {
						       
						    }
					});	
				});
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
				      	console.log(servResponse);
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

	}); // FIN listaarServiciosVenta

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



	$scope.modificarVenta = function(form)
	{
		console.log(form);
		$scope.forma = form;
		//$state.go($state.current,null,{reload:true});
	}

}]) // Fin VentasPerfilCtrl