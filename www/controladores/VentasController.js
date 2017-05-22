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

.controller('VentasPerfilCtrl', ['$scope','$state','$stateParams','$ionicPopup','servClientes','servEmpleados','servSecciones','servServicios','servVentas','servCompras','servProductos', function($scope,$state,$stateParams,$ionicPopup,servClientes,servEmpleados,servSecciones,servServicios,servVentas,servCompras,servProductos){

	var idVenta = $stateParams.idVenta;
	var idUser = localStorage.getItem("idUser");
	console.log('USER ID: '+idUser);
	$scope.nombres = [];
	$scope.empleados = [];
	$scope.secciones = [];
	$scope.form = [];
	

	servVentas.listarCabeceraVenta(idVenta).then(function(servResponse){
		var idCliente = servResponse.idCliente;
		$scope.form['fecha'] = new Date(servResponse.fechaVenta);
		$scope.form['numVenta'] = servResponse.numVenta;
		$scope.form['descuento'] = parseInt(servResponse.descuento);
		$scope.form['observaciones'] = servResponse.observaciones;
		$scope.precioTotalVenta = parseInt(servResponse.precioVentaTotal);
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


	/* ========================== CARGAR LINEAS DE VENTAS SERVICIOS =========================== */

	$scope.todoListServicios = [];
	$scope.precioTotalVenta = 0;
	var totalVentaServicios = 0;
	var totalVentaProductos = 0;
	var auxTotalServicios = 0;
	var auxTotalProductos = 0;
	var idSeccion = 0; // Variable global para el change de la Seccion

	servVentas.listarServiciosVenta(idVenta).then(function(servResponse){
		//console.log(servResponse);
		$scope.todoListServicios = servResponse;

		/* Оbtener las secciones de cada linea de venta para poder iniciar el select en 
       cada linea de venta.*/
		$scope.misSecciones = [];
		$scope.misServicios = [];
		$scope.misCategorias = [];
		$scope.misPreciosVenta = [];
		var numeroLineasVentas = servResponse.length;
		for(i=0; i<numeroLineasVentas; i++)
		{
			$scope.misSecciones.push({id_seccion:servResponse[i].id_seccion, nombre:servResponse[i].nombreSeccion});
			$scope.misServicios.push({nombreServicio:servResponse[i].nombreServicio, idSeccion:servResponse[i].id_seccion});
			$scope.misCategorias.push({nombreElemento:servResponse[i].nombreElemento});
			$scope.misPreciosVenta.push({precioVenta:servResponse[i].precioVentaUnd});
		}


		/*------------------------- LISTAR SECCIONES-----------------------*/ 
		servSecciones.listarSecciones(idUser).then(function(servResponse){
			if(servResponse==-1)
		    {
		    	// No hay secciones
		    }
	      	else
	      	{
	      		//Listar todas las opciones del SELECT Secciones
	        	$scope.secciones = servResponse;


	        	angular.forEach($scope.misSecciones, function(val, key,obj) {
	        		//Incializar el SELECT con el nombreSeccion de la linea de venta correspondiente
	        		$scope.todoListServicios[key].seccion = val;

	        		//Listar todas las opciones del SELECT Servicios
	    			servServicios.nombreServicio(val.id_seccion).then(function(servResponse1){
	    				$scope['servicios'+key] = servResponse1;

					});// Fin servicio nombreServicio	
				}); // Fin foreach misSecciones
	        	
	        	angular.forEach($scope.misServicios, function(val, key,obj) {
	        		//Incializar el SELECT con el nombreServicio de la linea de venta correspondiente
	        		$scope.todoListServicios[key].servicio =  val;
	        		
	        		var nombreServicio = val.nombreServicio;
	        		var id_seccion = val.idSeccion;

		        	servServicios.listarPerfilServicio(id_seccion,nombreServicio).then(function(servResponse){
		        		//Listar todas las opciones del SELECT Categorias segun la seccion y el servicio
						$scope['categorias'+key] = servResponse;
		     		});// Fin servicio listarPerfilServicio	
	        	});// Fin foreach misServicios

	        	angular.forEach($scope.misCategorias, function(val, key,obj) {
	        		$scope.todoListServicios[key].categoria =  val;
	        	});

	        	angular.forEach($scope.misPreciosVenta, function(val, key,obj) {
	        		$scope.todoListServicios[key].precioVenta =  val.precioVenta;
	        	});

	      	}//Fin else
		});
	}); // FIN listaarServiciosVenta

		$scope.getIdSeccion = function(objSeccion,index)
		{
			console.log(index);
			if(objSeccion!=null)
			{
				idSeccion = objSeccion.id_seccion;
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
			}
		}

		$scope.getNombreServicio = function(objServicio,objSeccion,index)
		{	
			console.log(objSeccion);
			if(objServicio!=null)
			{
				var nombreServicio = objServicio.nombreServicio;
				var id_seccion = objSeccion.id_seccion;

				if(idSeccion != 0)
				{
					/*------------------------- LISTAR CATEGORIAS -----------------------*/
					servServicios.listarPerfilServicio(idSeccion,nombreServicio).then(function(servResponse){
						$scope['categorias'+index] = servResponse;
		     		});
				}
				else
				{
					/*------------------------- LISTAR CATEGORIAS -----------------------*/
					servServicios.listarPerfilServicio(id_seccion,nombreServicio).then(function(servResponse){
						$scope['categorias'+index] = servResponse;
		     		});
				}


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

	/* ========================== FIN CARGAR LINEAS DE VENTAS SERVICIOS =========================== */
	
	


	/* ============================= CARGAR LINEAS DE VENTAS PRODUCTOS ============================= */	
	$scope.marca = [];		
	servVentas.listarProductosVenta(idVenta).then(function(servResponse){
		console.log(servResponse);
		$scope.todoListProductos = servResponse;

		/* Оbtener las secciones de cada linea de venta para poder iniciar el select en 
       cada linea de venta.*/
		$scope.misMarcas = [];
		$scope.misProductos = [];
		$scope. misUnidades = [];
		$scope.misPreciosVentaPro = [];
		var numeroLineasVentas = servResponse.length;
		for(i=0; i<numeroLineasVentas; i++)
		{
			$scope.misMarcas.push({id_marca:servResponse[i].id_marca, nombre:servResponse[i].nombre});
			$scope.misProductos.push({idElemento:servResponse[i].idElemento, nombreProducto:servResponse[i].nombreProducto});
			$scope.misUnidades.push({unidades:servResponse[i].cantidad});
			$scope.misPreciosVentaPro.push({precioVenta:servResponse[i].precioVentaUnd});
		}

		 servCompras.listarMarcas(idUser,'usuario').then(function(servResponse){
           	if(servResponse==-1)
		    {
		    	// No hay secciones
		    } 
		    else
		    {
		    	$scope.marcas = servResponse;

		    	angular.forEach($scope.misMarcas, function(val, key,obj) {
	        		//Incializar el SELECT con el nombreMarca de la linea de venta correspondiente
	        		$scope.todoListProductos[key].marca = val;

	        		//Listar todas las opciones del SELECT Productos
	    			servProductos.listarProductos(val.id_marca).then(function(servResponse1){
	    				$scope['productos'+key] = servResponse1;
					});// Fin servicio listarProductos	
				}); // Fin foreach misSecciones

				angular.forEach($scope.misProductos, function(val, key,obj) {
	        		//Incializar el SELECT con el nombreProducto de la linea de venta correspondiente
	        		$scope.todoListProductos[key].producto =  val;
	        	});

				angular.forEach($scope.misUnidades, function(val, key,obj) {
	        		$scope.todoListProductos[key].unidades =  val.unidades;
	        	});

	        	angular.forEach($scope.misPreciosVentaPro, function(val, key,obj) {
	        		$scope.todoListProductos[key].precioVentaProducto =  val.precioVenta;
	        	});
		    }
		});// Fin servicio listarMarcas
	}); // Fin listarProductosVenta

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
		}
	}
	
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

	/* ========================== FIN CARGAR LINEAS DE VENTAS PRODUCTOS =========================== */


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
	/*--------------------------FIN TODOLIST SERVICIOS VENTAS------------------------------*/

 	/*--------------------------TODOLIST PRODUCTOS VENTAS----------------------------------*/ 
	$scope.todoListProductos = [];
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

  	/*--------------------------FIN TODOLIST PRODUCTOS VENTAS-----------------------------*/ 




	$scope.modificarVenta = function(form)
	{
		console.log(form);
		$scope.forma = form;
		//$state.go($state.current,null,{reload:true});
	}

}]) // Fin VentasPerfilCtrl