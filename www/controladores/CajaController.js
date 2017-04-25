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

	var aux1 = [];
	$scope.aplicarDescuento = function(descuento)
	{
		var totalDescuento = 0;
		aux1.push(parseInt(descuento));
		for(var i=0; i<aux1.length; i++)
		{
			totalDescuento += aux1[i];
		}
		console.log(totalDescuento);

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
			$scope.forma = form;

			var checkUnidades = false;

			for(i=0; i<form.lineasVentasProductos.length; i++)
			{
				var undsVenta = form.lineasVentasProductos[i].unidades;
				var undsStock = form.lineasVentasProductos[i].producto.cantidadStock;
				var nombreProducto = form.lineasVentasProductos[i].producto.nombreProducto;
				var nombreMarca = form.lineasVentasProductos[i].marca.nombre;
				var idProducto = form.lineasVentasProductos[i].producto.idElemento;
				// comprobar si se venden dos productos iguales.
				//alert(idProducto);
				if(undsVenta > undsStock)
				{
					$ionicLoading.hide();
					checkUnidades = true;
					var alertPopup = $ionicPopup.alert({
					     title: 'Error al realizar la venta',
					     template: 'El producto <b>'+nombreMarca+' '+nombreProducto+'</b> disponse de <b>'+undsStock+'</b> unidades en Stock y pretende vender <b>'+undsVenta+'.</b>',
					     okText: 'Volver', 
		  				 okType: 'button-assertive'
		   			});
				}
			}

			var totalUnidades = 0;
			var undsVenta = 0;
			for(var i=0; i<form.lineasVentasProductos.length; i++)
			{
				var idProductoI = form.lineasVentasProductos[i].producto.idElemento;
				var undsStock = form.lineasVentasProductos[i].producto.cantidadStock;
				var nombreMarca = form.lineasVentasProductos[i].marca.nombre;
				var nombreProducto = form.lineasVentasProductos[i].producto.nombreProducto;
				console.log('ENTRO i '+i);
				for(var j=0; j<form.lineasVentasProductos.length; j++)
				{
					var idProductoJ = form.lineasVentasProductos[j].producto.idElemento;
					if(idProductoI == idProductoJ)
					{
						console.log('ENTRO j '+j);
						undsVenta = form.lineasVentasProductos[j].unidades;
						console.log(undsVenta);
						totalUnidades += undsVenta;
						break;
					}
				}
			}

			if(totalUnidades > undsStock)
			{
				$ionicLoading.hide();
				checkUnidades = true;
				var alertPopup = $ionicPopup.alert({
				     title: 'Error al realizar la venta',
				     template: 'El producto <b>'+nombreMarca+' '+nombreProducto+'</b> disponse de <b>'+undsStock+'</b> unidades en Stock y pretende vender <b>'+totalUnidades+'.</b>',
				     okText: 'Volver', 
	  				 okType: 'button-assertive'
	   			});
	   			totalUnidades = 0;
			}

			if(checkUnidades!=true)
			{
				servVentas.insertarVenta(form).then(function(servResponse){
					$state.go($state.current,null,{reload:true});
				});
			}
		}
	}

}]) // Fin CajaCtrl