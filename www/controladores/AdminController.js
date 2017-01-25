angular.module('starterMiApp.contrsAdmin', [])

.controller('AdminCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servLogout','servAdmin', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servLogout,servAdmin){

  $scope.idUser = localStorage.getItem("idUser");
  console.log($scope.idUser+'<<<<<<');


  servAdmin.listarUsuarios().then(function(data){
    
    console.log(data);
    if(data==-1)
    {
      $scope.noUsuarios = "No tiene usuarios introducidos";
    }
    else
    {
      $scope.usuarios = data;
    }
  });


  
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
          }
        }
      ]
    });
  }


}]) // Fin AdminCtrl

.controller('AdminUserProfileCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','$ionicHistory','servLogout','servAdmin', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,$ionicHistory,servLogout,servAdmin){

  $scope.idUser = localStorage.getItem("idUser");
  console.log($scope.idUser+'<<<<<<');

   $scope.Atras = function() {
    $ionicHistory.goBack();
  };

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
          }
        }
      ]
    });
  }


}]) // Fin AdminUserProfileCtrl