angular.module('starterMiApp.contrsCaja', [])

.controller('CajaCtrl', ['$scope','$state','$stateParams', function($scope,$state,$stateParams){

	console.log($stateParams.idCita);
	console.log($stateParams.fechaCita);

}]) // Fin CajaCtrl