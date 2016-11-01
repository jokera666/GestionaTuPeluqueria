angular.module('starterMiApp.contrsSignup', [])

.controller('SignupCtrl', ['$scope','$state','$ionicPopup', function($scope,$state,$ionicPopup){



    $scope.enviarFormulario = function(form,repetirContrasena)
    {
    	$scope.checkContrasenas = angular.equals(repetirContrasena, form.contrasena);
    	if($scope.checkContrasenas==false)
    	{
   			var alertPopup = $ionicPopup.alert({
			     title: 'Error al registrarse',
			     template: 'Las contraseñas no coinciden',
			     okText: 'Volver', 
  				 okType: 'button-assertive'
   			});
    	}
    	else
    	{
    		console.log('SU cuenta fue c reada correctamente');
    		console.log(form);
    	}
    }


}])