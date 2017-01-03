angular.module('starterMiApp.contrsServicios', [])

.controller('ServiciosCtrl', ['$scope','$state','$stateParams','servSecciones', function($scope,$state,$stateParams,servSecciones){

   	$scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);

	$scope.secciones = [];

	servSecciones.listarSecciones($scope.sesionIdUser).then(function(data){
		console.log(data);
		$scope.secciones = data;
	});

    // $scope.colors = [
    //   {name:'black', shade:'dark'},
    //   {name:'white', shade:'light', notAnOption: true},
    //   {name:'red', shade:'dark'},
    //   {name:'blue', shade:'dark', notAnOption: true},
    //   {name:'yellow', shade:'light', notAnOption: false}
    // ];

	$scope.items = [];

	$scope.getSeccion = function(seccion)
	{
		console.log(seccion);

		var caso = seccion.nombre;

		switch(caso)
		{
			case 'Peluqueria':
				$scope.items = [
					{servicio:'Corte',seccion:'Peluqueria'},
					{servicio:'Color',seccion:'Peluqueria'},
					{servicio:'Moldeador',seccion:'Peluqueria'}
				];
			break;

			case 'Masajes':
			$scope.items = [
					{servicio:'Piernas',seccion:'Masajes'},
					{servicio:'Cuerpo',seccion:'Masajes'},
					{servicio:'Lumbago',seccion:'Masajes'}
			];
			break;

			case 'Estetica':
			$scope.items = [
					{servicio:'Maquillaje',seccion:'Estetica'},
					{servicio:'Bodas',seccion:'Estetica'},
					{servicio:'Divirsios',seccion:'Estetica'}
			];
			break;
		}
	}

	//Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };


}]) // Fin ServiciosCtrl