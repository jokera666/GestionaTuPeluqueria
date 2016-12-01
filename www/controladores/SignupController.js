angular.module('starterMiApp.contrsSignup', [])

.controller('SignupCtrl', ['$scope','$state','$ionicPopup','$filter','$ionicLoading','servSignup', function($scope,$state,$ionicPopup,$filter,$ionicLoading,servSignup){



    $scope.enviarFormulario = function(form,repetirContrasena)
    {
        $ionicLoading.show();
        form.usuario = $filter('lowercase')(form.usuario);
    	$scope.checkContrasenas = angular.equals(repetirContrasena, form.contrasena);
    	if($scope.checkContrasenas==false)
    	{
   			var alertPopup = $ionicPopup.alert({
			     title: 'Error al registrarse',
			     template: 'Las contraseñas no coinciden.',
			     okText: 'Volver', 
  				 okType: 'button-assertive'
   			});
    	}
    	else
    	{
    		servSignup.registrarUsuario(form).then(function(servResponse){
    		  
                if(servResponse==-1)
                {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                         title: 'Error al registrarse',
                         template: 'El usuario ya existe.',
                         okText: 'Volver', 
                         okType: 'button-assertive'
                    });
                }
                else
                {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                         title: 'Registrar',
                         template: 'La cuenta fue creada correctamente',
                         okText: 'Ok', 
                         okType: 'button-positive'
                    });

                    alertPopup.then(function(res) {
                        
                        $state.go('login',null,{reload:true});
                    });
                }
            });
    	}
    }


}])