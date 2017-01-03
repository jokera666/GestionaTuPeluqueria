angular.module('starterMiApp.contrsSecciones', [])

.controller('SeccionesCtrl', ['$scope','$state','$stateParams','servSecciones', function($scope,$state,$stateParams,servSecciones){

	$scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);

	$scope.secciones = [];

	servSecciones.listarSecciones($scope.sesionIdUser).then(function(data){
		console.log(data);
		$scope.secciones = data;
	})

}]) // Fin SeccionesCtrl



.controller('SeccionPerfilCtrl', ['$scope','$state','$stateParams','servSecciones', function($scope,$state,$stateParams,servSecciones){

	$scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);

	$scope.secciones = [];

	servSecciones.listarSecciones($scope.sesionIdUser).then(function(data){
		console.log(data);
		$scope.secciones = data;
	})

}]) // Fin SeccionesCtrl