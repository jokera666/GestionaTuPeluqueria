angular.module('starterMiApp.contrsCaja', [])

.controller('CajaCtrl', ['$scope','$state','$stateParams','servEmpleados','servSecciones','servServicios', function($scope,$state,$stateParams,servEmpleados,servSecciones,servServicios){

	var idUser = localStorage.getItem("idUser");

	var nombreCliente = $stateParams.nombreCliente;
	var fechaCita 	  = $stateParams.fechaCita;
	var idCliente 	  = $stateParams.idCliente;

	$scope.ventaNueva = $stateParams.idCliente;

	$scope.nombreCliente = nombreCliente;

	$scope.form = {
		fecha: new Date(fechaCita)
	};

	$scope.todoListServicios = [];
	/*--------------------------TODOLIST SERVICIOS VENTAS------------------------------*/

	$scope.anadirServicio  = function()
	{
		$scope.todoListServicios.push({});
	};

	$scope.eliminarServicio = function (index)
  	{
        $scope.todoListServicios.splice(index, 1);
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

			$scope.getCategoria = function(objCategoria)
			{
				if(objCategoria != null)
				{
					var precioVenta = objCategoria.precioVenta;
					$scope.todoListServicios[index].precioVenta = precioVenta;
				}	
			}
		}
	}

  $scope.realizarVenta = function(form)
  {
  	form['lineasVentas'] = $scope.todoListServicios;
  	console.log(form);
  }

}]) // Fin CajaCtrl