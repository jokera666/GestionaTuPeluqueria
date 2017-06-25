angular.module('starterMiApp.contrsVentas', [])

.controller('VentasCtrl', ['$scope','$state','$stateParams','$ionicPopup','servVentas', function($scope,$state,$stateParams,$ionicPopup,servVentas){

	var idUser = localStorage.getItem("idUser");
	$scope.animacion = "hide";

	var fechaIni = new Date();
	fechaIni.setHours(00, 00, 00);
	fechaIni.setDate(fechaIni.getDate() - 7);
	$scope.fechaDesde = fechaIni;

	var fechaActual = new Date();
	fechaActual.setHours(23, 59, 00);
	var fechaActualMasMes  = fechaActual.setMonth(fechaActual.getMonth());
	$scope.fechaHasta = new Date(fechaActualMasMes);

	servVentas.listarVentas(idUser,$scope.fechaDesde,$scope.fechaHasta).then(function(servResponse){
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

	$scope.getFechas = function(fechaDesde,fechaHasta)
	{
		$scope.animacion = "hide";
		if(fechaDesde > fechaHasta || fechaHasta < fechaDesde)
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
			fechaDesde.setHours(00, 00, 00);
			fechaHasta.setHours(23, 59, 00);

			$scope.fechaDesde = fechaDesde;
			$scope.fechaHasta = fechaHasta;

			servVentas.listarVentas(idUser,$scope.fechaDesde,$scope.fechaHasta).then(function(servResponse){
				if(servResponse==-1)
				{
					$scope.ventas = '';
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

.controller('VentasPerfilCtrl', ['$scope','$state','$stateParams','$ionicPopup','$ionicLoading','servClientes','servEmpleados','servSecciones','servServicios','servVentas','servCompras','servProductos', function($scope,$state,$stateParams,$ionicPopup,$ionicLoading,servClientes,servEmpleados,servSecciones,servServicios,servVentas,servCompras,servProductos){

	var idVenta = $stateParams.idVenta;
	var idUser = localStorage.getItem("idUser");
	$scope.nombres = [];
	$scope.empleados = [];
	$scope.secciones = [];
	$scope.form = this;
	

	servVentas.listarCabeceraVenta(idVenta).then(function(servResponse){
		var idCliente = servResponse.idCliente;
		$scope.form['idVenta'] = idVenta;
		$scope.form['fecha'] = new Date(servResponse.fechaVenta);
		$scope.form['numVenta'] = servResponse.numVenta;
		$scope.form['observaciones'] = servResponse.observaciones;
		$scope.precioTotalVenta = parseFloat(servResponse.precioVentaTotal);
		$scope.form['descuento'] = parseFloat(servResponse.descuento);
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
	var idSeccion = 0; // Variable global para el change de la Seccion

	servVentas.listarServiciosVenta(idVenta).then(function(servResponse){
		if(servResponse == -1)
		{
			$scope.noServiciosVenta = -1;
			$scope.mensajeErrorServicio = "No hay servicios adquiridos en esta venta.";
		}
		else
		{
			$scope.noServiciosVenta = 0;
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
				$scope.misCategorias.push({idElemento:servResponse[i].idElemento,nombreElemento:servResponse[i].nombreElemento});
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
		}
	}); // FIN listaarServiciosVenta

		$scope.getIdSeccion = function(objSeccion,index)
		{
			if(objSeccion!=null)
			{
				idSeccion = objSeccion.id_seccion;

				/*------------------------- LISTAR SERVICIOS -----------------------*/
				servServicios.nombreServicio(idSeccion).then(function(servResponse){
					if(servResponse == -1)
				    {
				    	// No hay servicios
				    }
				    else
				    {
				      	$scope['servicios'+index] = servResponse;
				    }
				});
			}
		}

		$scope.getNombreServicio = function(objServicio,objSeccion,index)
		{	
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
				var precioVenta = objCategoria.precioVenta;
				$scope.todoListServicios[index].precioVenta = precioVenta;
				$scope.calcularPrecioTotal(index);
			}	
		}

	/* ========================== FIN CARGAR LINEAS DE VENTAS SERVICIOS =========================== */
	
	


	/* ============================= CARGAR LINEAS DE VENTAS PRODUCTOS ============================= */	
	$scope.marca = [];		
	servVentas.listarProductosVenta(idVenta).then(function(servResponse){
		if(servResponse == -1)
		{
			$scope.noProductosVenta = -1;
			$scope.mensajeErrorProducto = "No hay productos vendidos en esta venta.";
		}
		else
		{	
			$scope.noProductosVenta = 0;
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
				$scope.misProductos.push({idElemento:servResponse[i].idElemento, nombreProducto:servResponse[i].nombreProducto,unidades:servResponse[i].cantidad});
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
		        		$scope.todoListProductos[key].oldProducto =  val;
		        	});

					angular.forEach($scope.misUnidades, function(val, key,obj) {
		        		$scope.todoListProductos[key].unidades =  val.unidades;
		        	});

		        	angular.forEach($scope.misPreciosVentaPro, function(val, key,obj) {
		        		$scope.todoListProductos[key].precioVentaProducto =  val.precioVenta;
		        	});
			    }
			});// Fin servicio listarMarcas
		}
		
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
			$scope.todoListProductos[index].unidades = 1;
			$scope.todoListProductos[index].precioVentaProducto =  precioVentaProducto;
			$scope.calcularPrecioTotal(index);
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

	/* ========================== FIN CARGAR LINEAS DE VENTAS PRODUCTOS =========================== */


	/*--------------------------TODOLIST SERVICIOS VENTAS------------------------------*/
	$scope.todoListServicios = [];
	$scope.anadirServicio  = function()
	{
		$scope.noServiciosVenta = 0;
		listarServicio();
		if($scope.todoListServicios == '' && $scope.todoListProductos == '')
	  	{
	  		$scope.precioTotalVenta = 0;
	  	}
		$scope.todoListServicios.push({});
	};

	$scope.eliminarServicio = function (index,idLinea,idElemento,nombreServicio,nombreElemento)
  	{	

  		var myPopup = $ionicPopup.show({
	    title: 'Borrar línea de venta',
	    subTitle: '<span>¿Estás seguro de que deseas borrar la línea de la venta con el servicio <b>'+nombreServicio+' '+nombreElemento+'</b> ?</span>',
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
	          	//idVenta es una variable global que se pasa por get desde listarFacturas              
			    servVentas.eliminarLineaVenta(idVenta,idLinea,idElemento).then(function(servResponse){
				  	var valorRestado = $scope.todoListServicios[index].precioVenta;
			  		$scope.precioTotalVenta -= valorRestado;
			        $scope.todoListServicios.splice(index, 1);
			        $state.go($state.current,null,{reload:true});
		  		});
	          }
	        }
	      }
	    ]
	   	});
  	};
	/*--------------------------FIN TODOLIST SERVICIOS VENTAS------------------------------*/

 	/*--------------------------TODOLIST PRODUCTOS VENTAS----------------------------------*/ 
	$scope.todoListProductos = [];
	$scope.anadirProducto  = function()
	{
		$scope.noProductosVenta = 0;
		listarProducto();
		if($scope.todoListServicios == '' && $scope.todoListProductos == '')
	  	{
	  		$scope.precioTotalVenta = 0;
	  	}
		$scope.todoListProductos.push({});
	};

	$scope.eliminarProducto = function (index,idLinea,idElemento,nombreMarca,nombreProducto)
  	{
	  	var myPopup = $ionicPopup.show({
	    title: 'Borrar línea de venta',
	    subTitle: '<span>¿Estás seguro de que deseas borrar la línea de la venta con el producto <b>'+nombreMarca+' '+nombreProducto+'</b> ?</span>',
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
	          	//idVenta es una variable global que se pasa por get desde listarFacturas              
			    servVentas.eliminarLineaVenta(idVenta,idLinea,idElemento).then(function(servResponse){
			  		var valorRestado = $scope.todoListProductos[index].precioVentaProducto;
			  		var unidades = $scope.todoListProductos[index].unidades;
			  		$scope.precioTotalVenta -= valorRestado*unidades;
			        $scope.todoListProductos.splice(index, 1); 	
			        $state.go($state.current,null,{reload:true});
		  		});
	          }
	        }
	      }
	    ]
	   	});
  	};

  	/*--------------------------FIN TODOLIST PRODUCTOS VENTAS-----------------------------*/ 


  	/*Es una funcion necesaria si la venta no tiene servicios o productos introducidos
	para cuando carge la linea nueva se inicialice*/
	function listarProducto()
	{
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
	}

	/*Es una funcion necesaria si la venta no tiene servicios o productos introducidos
	para cuando carge la linea nueva se inicialice*/
	function listarServicio()
	{
		servSecciones.listarSecciones(idUser).then(function(servResponse){
				if(servResponse==-1)
			    {
			    	// No hay secciones
			    }
		      	else
		      	{
		      		//Listar todas las opciones del SELECT Secciones
		        	$scope.secciones = servResponse;


		      	}//Fin else
			});

		$scope.getIdSeccion = function(objSeccion,index)
		{
			if(objSeccion!=null)
			{
				idSeccion = objSeccion.id_seccion;

				/*------------------------- LISTAR SERVICIOS -----------------------*/
				servServicios.nombreServicio(idSeccion).then(function(servResponse){
					if(servResponse == -1)
				    {
				    	// No hay servicios
				    }
				    else
				    {
				      	$scope['servicios'+index] = servResponse;
				    }
				});
			}
		}

		$scope.getNombreServicio = function(objServicio,objSeccion,index)
		{	
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
	}

	$scope.clickModificarVenta = function(form)
	{
		var myPopup = $ionicPopup.show({
        title: 'Modificar venta',
        subTitle: '<span>¿Estás seguro de que deseas modificar la venta con numero <b>'+form.numVenta+'</b> ?</span>',
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
					if($scope.todoListServicios == '' && $scope.todoListProductos == '')
					{
						$ionicLoading.hide();
						var alertPopup = $ionicPopup.alert({
						     title: 'Error al modificar la venta',
						     template: 'No hay nada que modificar.',
						     okText: 'Volver', 
			  				 okType: 'button-assertive'
			   			});
					}
					else
					{	
				        angular.forEach($scope.todoListServicios, function(val, key,obj) {
							/*Estos elementos del objeto se eliminan ya que solo se utilizaron
							para inicializar las lineas de la venta*/

							/*Elementos eliminados para los Servicios*/
				    		delete val.id_seccion;
				    		delete val.idElemento;
				    		delete val.nombreElemento;
				    		delete val.nombreSeccion;
				    		delete val.nombreServicio;
				    		delete val.precioVentaUnd;

				    	});

						form['lineasVentaServicio'] = $scope.todoListServicios;
						form['lineasVentasProducto'] = $scope.todoListProductos;
						form['precioVentaTotal'] = $scope.precioTotalVenta;

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
							servVentas.modificarVenta(form).then(function(){
								$state.go('sidemenu.ventas',null,{reload:true});
							});
						}
					}
              	}
            }
          }
        ]
    	});
	}

	$scope.clickEliminarVenta = function(numVenta)
	{
		var myPopup = $ionicPopup.show({
        title: 'Borrar venta',
        subTitle: '<span>¿Estás seguro de que deseas borrar la venta con numero <b>'+numVenta+'</b> ?</span>',
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
                servVentas.eliminarVenta(idVenta).then(function(servResponse){
                	$state.go('sidemenu.ventas',null,{reload:true});
                });
              }
            }
          }
        ]
    	});
	}

	// $scope.reiniciarForm = function()
	// {
	// 	console.log($scope.form);
	// 	$scope.form = {
	// 	        numFactura: cabeceraInicial.numFactura,
	// 	        fecha: new Date()
	// 	};

	// 	// $scope.todoListLineasCompra = angular.copy(lineasFacturaIniciales);
	// 	// for(i=0; i<$scope.todoListLineasCompra.length; i++)
	// 	// {
	// 	//   $scope.todoListLineasCompra[i].objMarca = angular.copy(marcasIniciales[i]);
	// 	// }
	// }

}]) // Fin VentasPerfilCtrl