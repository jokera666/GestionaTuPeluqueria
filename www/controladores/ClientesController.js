angular.module('starterMiApp.contrsClientes', [])
.controller('ClientesCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','servClientes','$ionicModal', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,servClientes,$ionicModal){
  
    servClientes.getNombreCompleto().then(function(data){
      $scope.clientes = data;
    });

    // 'plantillas/modalInsertarCliente.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/modalInsertarCliente.html', {
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
      var myPopup = $ionicPopup.show({
      title: 'Añadir cliente',
      subTitle: '<span>¿Estás seguro de que deseas añadir el cliente?</span>',
      buttons: [
        {
         text: '<b>No</b>',
         type: 'button-dark'
        },
        {
          text: '<b>Sí</b>',
          type: 'button-positive',
          onTap: function(e) {
            $ionicLoading.show();
            if (e)
            {              
                servClientes.insertarCliente(form).then(function(){
                  $state.go('sidemenu.clientes',null,{reload:true});
                  $scope.modal.hide();
                });
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

.controller('ClientePerfilCtrl', ['$scope', '$http', '$state','$stateParams','$ionicLoading','$ionicPopup', function($scope, $http, $state,$stateParams,$ionicLoading,$ionicPopup){



    clienteForm.$error = {
      'required': true
    }

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



    $scope.clickModificarCliente = function (clienteForm){

      if(clienteForm.$valid==true)
      {
        var myPopup = $ionicPopup.show({
        title: 'Guardar datos',
        subTitle: '<span>¿Estás seguro de que deseas realizar los cambios?</span>',
        buttons: [
          { 
            text: '<b>No</b>',
            type: 'button-dark'
          },
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
      }
      else
      {
        alert('Error al guardar los datos');
        return;
      }


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
        { 
          text: '<b>No</b>',
          type: 'button-dark'
        },
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
}]) //Fin  ClientePerfilCtrl