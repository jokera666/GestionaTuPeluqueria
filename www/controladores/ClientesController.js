angular.module('starterMiApp.contrsClientes', [])

.controller('ClientesCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','$ionicModal','servClientes', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,$ionicModal,servClientes){
  
    //Listar los clientes en el list item
    servClientes.getNombreCompleto().then(function(data){
      $scope.clientes = data;
    });

    //Insertar un nuevo cliente a atraves del un modal
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

    //Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin ClientesCtrl

.controller('ClientePerfilCtrl', ['$scope','$state','$stateParams','$ionicLoading','$ionicPopup','servClientes','$cordovaCamera','$cordovaFileTransfer', function($scope,$state,$stateParams,$ionicLoading,$ionicPopup,servClientes,$cordovaCamera,$cordovaFileTransfer){

    clienteForm.$error = {
      'required': true
    }

    var idCliente = $stateParams.idCliente;

    servClientes.mostrarPerfilCliente(idCliente).then(function(datosCliente){
        console.log(datosCliente);

        /*$scope.data es la informacion que se va mostrar en el perfil del cliente a
        partir de los datos obtenidos del servicio servClientes.mostrarPerfilCliente*/
        $scope.data = datosCliente;
        
        /* this.form es la directiva ng-model en la vista perfilCliente donde inicializo las directivas
        con los valores/datos obtenidos del servicio servClientes.mostrarPerfilCliente*/
        this.form = $scope.data;

        $scope.reiniciarForm = function(){
         this.form = angular.copy($scope.data);    
        };
        $scope.reiniciarForm();
    });



    $scope.clickModificarCliente = function (form){
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
                  servClientes.modificarPerfilCliente(form).then(function(){
                      $state.go('sidemenu.clientes',null,{reload:true});
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
                servClientes.borrarPerfilCliente(idCliente).then(function(data){
                  $state.go('sidemenu.clientes',null,{reload:true});
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

    $scope.hacerFoto = function(){
      var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.FILE_URI, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 120,
            targetHeight: 126,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };

      $cordovaCamera.getPicture(options).then(function(imageData) {
             $scope.imgURI = imageData;


              $scope.upload = function(imageData) {
                var options = {
                    fileKey: "avatar",
                    fileName: "image.png",
                    chunkedMode: false,
                    mimeType: "image/png"
                };
                $cordovaFileTransfer.upload("http://gestionestetica.fonotecaumh.es/", "/android_asset/www/img/foto1.jpg", options).then(function(result) {
                    console.log("SUCCESS: " + JSON.stringify(result.response));
                    $scope.opciones = "SUCCESS: " + JSON.stringify(result.response);
                }, function(err) {
                    console.log("ERROR: " + JSON.stringify(err));
                    $scope.opciones = "ERROR: " + JSON.stringify(err);
                }, function (progress) {
                    // constant progress updates
                });
              }
              $scope.upload(imageData);

            //$scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.opciones = options;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
}]) //Fin  ClientePerfilCtrl