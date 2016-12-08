angular.module('starterMiApp.contrsServicios', [])

.controller('ServiciosCtrl', ['$scope','$state','$stateParams', function($scope,$state,$stateParams){

    $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light', notAnOption: true},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark', notAnOption: true},
      {name:'yellow', shade:'light', notAnOption: false}
    ];

	$scope.items = [
		{servicio:'Corte',seccion:'Peluqueria'},
		{servicio:'Color',seccion:'Peluqueria'},
		{servicio:'Moldeador',seccion:'Peluqueria'}
	];

	$scope.getSeccion = function(seccion)
	{
		console.log(seccion);
		alert(seccion.name);
	}


}]) // Fin ServiciosCtrl