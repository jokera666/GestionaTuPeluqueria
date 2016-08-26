angular.module('starterMiApp.controllers', [])

.controller('LoginCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){
  $scope.enviarFormulario = function(form){
    //$scope.visibilidadMensaje = false;
    $scope.animacion = ""; 
    var url = "http://dokich.esy.es/IonicServer/resibir.php";
    console.log(url);

    if(form == undefined)
    {
       $scope.visibilidadMensaje = true;
       $scope.userServ = "Usuario o contraseña incorrecto."; 
       $scope.animacion = "animated shake";
       return;
       
    }    


    if( form.user == undefined || form.pass  == undefined )
      {
        $scope.visibilidadMensaje = true; 
        $scope.userServ = "Usuario o contraseña incorrecto."; 
        $scope.animacion = "animated shake";
        return;
        
      }

    //var serviceUrl = 'file:///android_asset/www/'; // esta variable es necesaria para que funcione en el dispositivo.
  //$http.get(serviceUrl+'js/data.json') // cargar los datos del fichero data.json


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
            //userServ en esta variable me añade \r\n y no se pueden compara las cadenas bien
            console.log($scope.userServ);
            console.log($scope.msgError);
            var sin_salto = $scope.userServ.split("\n").join("");
            console.log(sin_salto);



            $scope.result = angular.equals($scope.userServ, $scope.msgError);
            console.log($scope.result);

            if($scope.userServ==$scope.msgError)
            {
              console.log('entroooooooooooooooooo!');
              $scope.visibilidadMensaje = true; 
              $scope.userServ = "Usuario o contraseña incorrecto."; 
              $scope.animacion = "animated shake";
            }

            else 
            {
               $scope.visibilidadMensaje = false;
               var myError = angular.element( document.querySelector( '#msgError' ) );
               myError.remove();   //removes element
               
               $state.go('sidemenu.agenda' ,{param1: $scope.userServ, param2: form.pass});
               //$state.transitionTo('sidemenu.agenda',{param1: $scope.userServ, param2: form.pass});
            } 

            /**
            var str1 = $scope.userServ;
            var str2 = "ERROR AL LOGEAR";

            console.log("str1 es: "+str1+" y str2 es: "+str2);

            //compara dos cadenas si n es igual a 0 son iguales
            var n = str1.localeCompare(str2); 
            console.log("n es igual a: "+n);
            */



      }, function errorCallback(error) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
                      $scope.visibilidadMensaje = true; 
              $scope.userServ = "Usuario o contraseña incorrecto."; 
              $scope.animacion = "animated shake";
        console.error("el error es: "+error);
      });

  } // fin de enviarFormulario

}]) //Fin LoginCtrl


.controller('SidemenuCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     /*console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;*/

     $scope.cerrarSesion = function(){
      $state.go('login');
     }


}]) // Fin SidemenuCtrl

.controller('AgendaCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.nombreUsuario = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin AgendaCtrl

.controller('ClientesCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
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