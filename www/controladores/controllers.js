angular.module('starterMiApp.controllers', [])

.controller('LoginCtrl', ['$scope', '$http', '$state', '$rootScope','$ionicLoading', function($scope, $http, $state,$rootScope,$ionicLoading){
  $scope.enviarFormulario = function(form){

    $ionicLoading.show();

    $scope.animacion = "";
    $scope.msgError = "Usuario o contraseña incorrecto."; 

    if(form == undefined)
    {
      $ionicLoading.hide();
      $scope.visibilidadMensaje = true;
      $scope.msgError;
      $scope.animacion = "animated shake";
      return;
    }    
    else if( form.user == undefined || form.pass  == undefined )
    {
      $ionicLoading.hide();
      $scope.visibilidadMensaje = true; 
      $scope.msgError = "Usuario o contraseña incorrecto."; 
      $scope.animacion = "animated shake";
      return;
    }

      //var serviceUrl = 'file:///android_asset/www/'; // esta variable es necesaria para que funcione en el dispositivo.
      //$http.get(serviceUrl+'js/data.json') // cargar los datos del fichero data.json

    else
    {

      var url = "http://gestionestetica.fonotecaumh.es/Login.php";

       $http({
          method: 'POST',
          url: url,
          data: form,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
      }).then(function successCallback(response) {
            $scope.statuscode = response.status;
            console.log('Estado del servidor '+$scope.statuscode);
            //data es el array de parametros de la consulta php
            console.log(response);
            $scope.userServ = "";
            $scope.userServ = response.data;
            var abv = response.data;
          
            //$scope.result = angular.equals($scope.userServ, $scope.msgError);
           //console.log($scope.result);

            //userServ en esta variable me añade \r\n y no se pueden compara las cadenas bien
            console.log('La respuesta del servidor es: '+$scope.userServ);
            if($scope.userServ==-1)
            {
              $ionicLoading.hide();
              $scope.visibilidadMensaje = true; 
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
          $scope.msgError; 
          $scope.animacion = "animated shake";
          console.log("el error es: "+error);
      });

    } // Fin else

  } // Fin de enviarFormulario

}]) //Fin LoginCtrl


.controller('SidemenuCtrl', ['$scope', '$http', '$state','$stateParams','$ionicPopup','$ionicPlatform','$ionicLoading', function($scope, $http, $state,$stateParams,$ionicPopup,$ionicPlatform,$ionicLoading){

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
          $ionicLoading.show();
          if (e) {
              
           $http({
              url: 'http://gestionestetica.fonotecaumh.es/Logout.php'
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

.controller('ClientesCtrl', ['$scope', '$http', '$state','$stateParams','$ionicLoading','$ionicPopup','hexafy','$ionicModal', function($scope, $http, $state,$stateParams,$ionicLoading,$ionicPopup,hexafy,$ionicModal){

  $http.post('http://gestionestetica.fonotecaumh.es/Clientes/listarClientes.php')
    .success(function(dataClientes){ // crea un objeto con los datos que se han cargado
    //console.log(dataClientes);
    $scope.clientes = dataClientes.clientes;
  });

    $ionicModal.fromTemplateUrl('../plantillas/modalInsertarCliente.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };




    $scope.clickInsertarCliente = function (form){
      var miForm = form;
      console.log(miForm);
      var myPopup = $ionicPopup.show({
      title: 'Borrar cliente',
      subTitle: '<span>¿Estás seguro de que deseas insertar el cliente?</span>',
      buttons: [
        { text: 'No' },
        {
          text: '<b>Sí</b>',
          type: 'button-positive',
          onTap: function(e) {
            $ionicLoading.show();
            if (e)
            {              
                $scope.InsertarCliente = function (miForm){
                    var url = "http://gestionestetica.fonotecaumh.es/Clientes/insertarCliente.php";
                    $http({
                        method: 'POST',
                        url: url,
                        data: miForm,
                        headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                          console.log(response.data);
                          $state.go('sidemenu.clientes');
                          window.location.reload();
                    }, function errorCallback(error) {
                        console.log('Error '+error);
                    });
                }; // Fin InsertarCliente
                $scope.InsertarCliente(miForm);
            }
            else
            {
              //El boton NO de no hacer nada
              return; 
            }
          }
        }
      ]
      });
    };


  $scope.borrarBuscador = function(){
    $scope.buscador = '';
  };

}]) // Fin ClientesCtrl

.controller('ProductosCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     // console.log($stateParams);
     // $scope.parametro = $stateParams.param1;
     // $scope.contrasena = $stateParams.param2;
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

  $scope.btnAnadirCliente = function (){
    alert('Копчето не работи. :)');
  };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
     console.log($stateParams);
     $scope.playId = $stateParams.playlistId;
     $scope.titulo = $stateParams.titulo;
})


.controller('ClientePerfilCtrl', ['$scope', '$http', '$state','$stateParams','$ionicLoading','$ionicPopup', function($scope, $http, $state,$stateParams,$ionicLoading,$ionicPopup){

 
    console.log($stateParams.idCliente);
    $scope.id = $stateParams.idCliente;


      var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarPerfilCliente.php";

       $http({
          method: 'POST',
          url: url,
          data: $stateParams.idCliente,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
      }).then(function successCallback(dataClientes) {
          //console.log(dataClientes);
          $scope.data = dataClientes.data.clientes[0];
          $scope.form = this;
          $scope.form = $scope.data;
          this.id_cliente = $scope.data.id_cliente;
          this.nombre = $scope.data.nombre;
          this.apellido1 = $scope.data.apellido1;
          this.apellido2 = $scope.data.apellido2;
          this.telefono = $scope.data.telefono;



          $scope.borrarCliente = function (){
                console.log(this.form.id_cliente);
          };

          $scope.reiniciarForm = function(){
           $scope.form = angular.copy($scope.data);
            
          };
          $scope.reiniciarForm();

      }, function errorCallback(error) {
          console.log('Error '+error);
      });


      $scope.modificarCliente = function (){
          var url = "http://gestionestetica.fonotecaumh.es/Clientes/modificarPerfilCliente.php";
          $http({
              method: 'POST',
              url: url,
              data: this.form,
              headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
          }).then(function successCallback(response) {
                $state.go('sidemenu.clientes');
                window.location.reload();

          }, function errorCallback(error) {
              console.log('Error '+error);
          });
      }; // Fin modificarCliente



    $scope.clickModificarCliente = function (){
      var myPopup = $ionicPopup.show({
      title: 'Modificar datos',
      subTitle: '<span>¿Estás seguro de que deseas realizar los cambios?</span>',
      buttons: [
        { text: 'No' },
        {
          text: '<b>Sí</b>',
          type: 'button-positive',
          onTap: function(e) {
            $ionicLoading.show();
            if (e)
            {              
              $scope.modificarCliente();
            }
            else
            {
              //El boton NO de no hacer nada
              return; 
            }
          }
        }
      ]
      });
    };


    $scope.eliminarCliente = function (){
        var url = "http://gestionestetica.fonotecaumh.es/Clientes/eliminarPerfilCliente.php";
        $http({
            method: 'POST',
            url: url,
            data: this.form.id_cliente,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
              $state.go('sidemenu.clientes');
              window.location.reload();
        }, function errorCallback(error) {
            console.log('Error '+error);
        });
    }; // Fin eliminarCliente


    $scope.clickEliminarCliente = function (){
      var myPopup = $ionicPopup.show({
      title: 'Borrar cliente',
      subTitle: '<span>¿Estás seguro de que deseas eliminar el cliente?</span>',
      buttons: [
        { text: 'No' },
        {
          text: '<b>Sí</b>',
          type: 'button-positive',
          onTap: function(e) {
            $ionicLoading.show();
            if (e)
            {              
              $scope.eliminarCliente();
            }
            else
            {
              //El boton NO de no hacer nada
              return; 
            }
          }
        }
      ]
      });
    };


}])