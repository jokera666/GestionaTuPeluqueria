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

	//console.log('Fecha Ini-->'+$scope.fechaIni);
	//console.log('Fecha Fin-->'+$scope.fechaFin);
	

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

.controller('VentasPerfilCtrl', ['$scope','$state','$stateParams','$ionicPopup','servVentas', function($scope,$state,$stateParams,$ionicPopup,servVentas){

	var idVenta = $stateParams.idVenta;
	console.log(idVenta);

}]) // Fin VentasPerfilCtrl