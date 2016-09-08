angular.module('starterMiApp.controllers', [])

.controller('LoginCtrl', ['$scope', '$http', '$state', '$rootScope', function($scope, $http, $state,$rootScope){
  $scope.enviarFormulario = function(form){
    
    $scope.animacion = "";

    if(form == undefined)
    {
      $scope.visibilidadMensaje = true;
      $scope.userServ = "Usuario o contraseña incorrecto."; 
      $scope.animacion = "animated shake";
      return;
    }    
    else if( form.user == undefined || form.pass  == undefined )
    {
      $scope.visibilidadMensaje = true; 
      $scope.userServ = "Usuario o contraseña incorrecto."; 
      $scope.animacion = "animated shake";
      return;
    }

      //var serviceUrl = 'file:///android_asset/www/'; // esta variable es necesaria para que funcione en el dispositivo.
      //$http.get(serviceUrl+'js/data.json') // cargar los datos del fichero data.json

    else
    {
      var url = "http://dokich.esy.es/appBackEnd/Login.php";

       $http({
          method: 'POST',
          url: url,
          data: form,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {

            //data es el array de parametros de la consulta php
            console.log(response);
            $scope.userServ = "";
            $scope.msgError = "Usuario o contraseña incorrecto.\r\n";
            $scope.userServ = response.data;
            var abv = response.data;
            

            /*console.log($scope.userServ);
            console.log($scope.msgError);
            var sin_salto = $scope.userServ.split("\n").join("");
            console.log(sin_salto);



            $scope.result = angular.equals($scope.userServ, $scope.msgError);
            console.log($scope.result);*/

            //userServ en esta variable me añade \r\n y no se pueden compara las cadenas bien
            console.log('La respuesta del servidor es: '+$scope.userServ);
            if($scope.userServ==$scope.msgError)
            {
              $scope.visibilidadMensaje = true; 
              $scope.userServ = "Usuario o contraseña incorrecto."; 
              $scope.animacion = "animated shake";
              return;
            }

            else 
            {
               $scope.visibilidadMensaje = false;
               //var myError = angular.element( document.querySelector( '#msgError' ) );
               //myError.remove();   //removes element
               
               //$state.go('sidemenu.agenda' ,{param1: $scope.userServ, param2: form.pass});
               $rootScope.objetos = abv;
               $state.go('sidemenu.agenda');
               form.user = "";
               form.pass = "";
            } 

      }, function errorCallback(error) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.visibilidadMensaje = true; 
          $scope.userServ = "Usuario o contraseña incorrecto."; 
          $scope.animacion = "animated shake";
          console.log("el error es: "+error);
      });

    } // Fin else

  } // Fin de enviarFormulario

}]) //Fin LoginCtrl


.controller('SidemenuCtrl', ['$scope', '$http', '$state','$stateParams','$ionicPopup', function($scope, $http, $state,$stateParams,$ionicPopup){

  $scope.cerrarSesion = function() {

  var myPopup = $ionicPopup.show({
    title: 'Salir',
    subTitle: '¿Estás seguro de que deseas salir de la aplicación?',
    buttons: [
      { text: 'No' },
      {
        text: '<b>Sí</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (e) {
              
           $http({
              method: 'POST',
              url: 'http://dokich.esy.es/appBackEnd/Logout.php'
            }).then(function successCallback(response) {
                console.log('se cerro la sesion');
                window.location.reload();
                $state.go('login');
            }, function errorCallback(err) {
              console.log('error al cerrar la sesion: '+err);
            }); 
            //e.preventDefault(); // cuando pinches el pop se mantiene

          } else {
            return; 
          }
        }
      }
    ]
  });
}


}]) // Fin SidemenuCtrl

.controller('AgendaCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log('entro 1');
     // console.log($stateParams);
     // $scope.nombreUsuario = $stateParams.param1;
     // $scope.contrasena = $stateParams.param2;
     console.log($scope.objetos); 
     $scope.nombreUsuario = $scope.objetos;

}]) // Fin AgendaCtrl

.controller('ClientesCtrl', ['$scope', '$http', '$state','$stateParams','$ionicLoading', function($scope, $http, $state,$stateParams,$ionicLoading){

 $scope.showMe = function() {
    $ionicLoading.show({
      template: 'Cargando...'
    });
  };

  $scope.entrar = function ()
  {
    $scope.showMe();
  };

  $scope.salir = function ()
  {
    $ionicLoading.hide();
  };


  // $scope.hide = function(){
  //   $ionicLoading.hide().then(function(){
  //      console.log("The loading indicator is now hidden");
  //   });
  // };

}]) // Fin ClientesCtrl

.controller('ProductosCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin ProductosCtrl

.controller('VentasCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin VentasCtrl

.controller('SeccionesCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin SeccionesCtrl

.controller('ServiciosCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin ServiciosCtrl

.controller('FacturasCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin FacturasCtrl




.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})


/*.controller('PerfilCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}])*/