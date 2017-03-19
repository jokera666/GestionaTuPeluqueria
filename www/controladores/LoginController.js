angular.module('starterMiApp.contrsLogin', [])

.controller('LoginCtrl', ['$scope','$state','$rootScope','$ionicLoading','$filter','servLogin', function($scope,$state,$rootScope,$ionicLoading,$filter,servLogin){
  
  $scope.animacion = "hide";

  $scope.enviarFormulario = function(form){

    $scope.animacion = "hide";
    $ionicLoading.show();
    form.user = $filter('lowercase')(form.user);
    


      //var serviceUrl = 'file:///android_asset/www/'; // esta variable es necesaria para que funcione en el dispositivo.
      //$http.get(serviceUrl+'js/data.json') // cargar los datos del fichero data.json

      servLogin.iniciarSesion(form).then(function(servResponse){
          $scope.respuestaServ = servResponse;
          if($scope.respuestaServ==-1)
          {
            $ionicLoading.hide();
            $scope.mensajeError = "Usuario o contraseña incorrecto";  
            $scope.animacion = "animated shake show";
            return;
          }
          else 
          {
           $scope.animacion = "hide";
           //var myError = angular.element( document.querySelector( '#msgError' ) );
           //myError.remove();   //removes element
           
           //$state.go('sidemenu.agenda' ,{param1: $scope.userServ, param2: form.pass});
           //$rootScope.globalSesionUserId = $scope.respuestaServ.id;
           //$rootScope.globalSesionUserName = $scope.respuestaServ.userName;
           if($scope.respuestaServ.id == 1)
           {
              localStorage.setItem("idUser",     $scope.respuestaServ.id);
              $state.go('admin',null,{reload:true}); 
           }
           else
           {
              localStorage.setItem("idUser",     $scope.respuestaServ.id); 
              localStorage.setItem("nombreUser", $scope.respuestaServ.userName);
              $state.go('sidemenu.agenda',null,{reload:true});
           }

           //form.user = "";
           //form.pass = "";
          }
      });
  }// Fin de enviarFormulario

}]) //Fin LoginCtrl