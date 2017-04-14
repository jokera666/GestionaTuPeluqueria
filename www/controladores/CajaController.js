angular.module('starterMiApp.contrsCaja', [])

.controller('CajaCtrl', ['$scope','$state','$stateParams', function($scope,$state,$stateParams){

	console.log($stateParams.idCita);
	console.log($stateParams.fechaCita);
	console.log($stateParams.idCliente);

	// $scope.nombreCliente = 'Nestor';

	$scope.empleados = [
		{nombre:'Jose', apellidos: 'Perez'},
		{nombre:'Manuel', apellidos: 'Perez'},
		{nombre:'Maria', apellidos: 'Perez'}
	];

	$scope.secciones = [
		{nombre:'Peluquería'},
		{nombre:'Estetica'},
		{nombre:'Manicura'}
	];

	$scope.servicios = [
		{nombre:'Corte'},
		{nombre:'Tinte'},
		{nombre:'Moldeador'}
	];

	$scope.categorias = [
		{nombre:'Hombre'},
		{nombre:'Mujer'},
		{nombre:'Niño'}
	];


	$scope.todoListServicios = [];



	$scope.anadirServicio  = function()
	{
		$scope.todoListServicios.push({});
	};

	$scope.eliminarServicio = function (index)
  {
        $scope.todoListServicios.splice(index, 1);
  };

}]) // Fin CajaCtrl