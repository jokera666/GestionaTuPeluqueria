angular.module('starterMiApp.contrsSidemenu', [])

.controller('SidemenuCtrl', ['$scope', '$state','$ionicPopup','$ionicLoading','servLogout', function($scope, $state,$ionicPopup,$ionicLoading,servLogout){

  $scope.nombreUsuario = localStorage.getItem("nombreUser");
  
  $scope.cerrarSesion = function() {

      var myPopup = $ionicPopup.show({
      title: 'Salir',
      subTitle: '¿Estás seguro de que deseas salir de la aplicación?',
      buttons: [
        { text: '<b>No</b>',
          type: 'button-dark' 
        },
        {
          text: '<b>Sí</b>',
          type: 'button-positive',
          onTap: function(e) {
            $ionicLoading.show();
            if (e)//Pulsar Sí
            { 
              servLogout.cerrarSesion().then(function(data){
                localStorage.setItem("idUser",""); 
                localStorage.setItem("nombreUser","");
                $state.go('login',null,{reload:true});
              });   
            }
            else//Pulsar No
            {
              return; 
            }
          }
        }
      ]
    });
  }
}]) // Fin SidemenuCtrl