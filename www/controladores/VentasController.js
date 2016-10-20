angular.module('starterMiApp.contrsVentas', [])

.controller('VentasCtrl', ['$scope','$state','$stateParams', function($scope,$state,$stateParams){

     console.log($stateParams);
     $scope.nombreUsuario = $scope.globalVarSesion;
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin VentasCtrl