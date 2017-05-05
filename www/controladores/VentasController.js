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

.controller('VentasPerfilCtrl', ['$scope','$state','$stateParams','$ionicPopup','servClientes','servEmpleados','servVentas', function($scope,$state,$stateParams,$ionicPopup,servClientes,servEmpleados,servVentas){

	var idVenta = $stateParams.idVenta;
	var idUser = localStorage.getItem("idUser");
	$scope.form = [];
	$scope.nombres = [];
	$scope.empleados = [];

	//Listar los clientes
    servClientes.listarClientes('citasClientes',idUser).then(function(servResponse){
      if(servResponse==-1)
      {
        // No hay clientes.
      }
      else
      {
        $scope.nombres = servResponse;
      }
    });

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
	

	servVentas.listarCabeceraVenta(idVenta).then(function(servResponse){

		var idCliente = servResponse.idCliente;
		var idEmpleado = servResponse.idEmpleado;

		for(var i = 0; i<$scope.nombres.length; i++)
		{
			if($scope.nombres[i].id_cliente == idCliente)
			{
				var indexCliente = i;
			}
		}

		for(var i = 0; i<$scope.empleados.length; i++)
		{
			if($scope.empleados[i].id_empleado == idEmpleado)
			{
				var indexEmpleado = i;
			}
		}

		$scope.form['objCliente'] = $scope.nombres[indexCliente];
		$scope.form['objEmpleado'] = $scope.empleados[indexEmpleado];
	});

	$scope.modificarVenta = function(form)
	{
		console.log(form);
		$scope.forma = form;
		$state.go($state.current,null,{reload:true});
	}

}]) // Fin VentasPerfilCtrl