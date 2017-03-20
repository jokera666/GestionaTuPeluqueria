angular.module('starterMiApp.contrsSidemenu', [])

.controller('SidemenuCtrl', ['$scope', '$state','$ionicPopup','$ionicLoading','$ionicPopover','servLogout', function($scope, $state,$ionicPopup,$ionicLoading,$ionicPopover,servLogout){

  $scope.nombreUsuario = localStorage.getItem("nombreUser");
  
  var plantillaPopover = '<ion-popover-view style="height: 168px;">'+
    '<ion-content scroll="false">'+
        '<div class="list">'+
            '<a class="item item-icon-left" href="#">'+
              '<i class="icon ion-help-circled"></i>'+
                'Ayuda'+
            '</a>'+
            '<a class="item item-icon-left" ng-click="acercaDe()">'+
              '<i class="icon ion-information-circled"></i>'+
                'Acerca de&hellip;'+
            '</a>'+
            '<a class="item item-icon-left" ng-click="cerrarSesion()">'+
              '<i class="icon ion-log-out"></i>'+
                'Cerrar sesión'+
            '</a>'+
        '</div>'+
    '</ion-content>'+
  '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(plantillaPopover, {
    scope: $scope
  });

   $scope.openPopover = function($event) {
    $scope.popover.show($event);
    document.body.classList.add('platform-ionic');
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $scope.acercaDe = function() {
    $scope.popover.hide();
    var alertPopup = $ionicPopup.alert({
     title: 'Acerca De...',
     cssClass: 'tamanoPopup',
     template: '<a class="button button-full button-balanced icon-left ion-email" href="mailto:jokera666@gmail.com" target="_blank"> Contancte con el administrador.</a>',
     okText: 'Ok', 
     okType: 'button-positive'
    });
  };

  $scope.cerrarSesion = function() {
      $scope.popover.hide();
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