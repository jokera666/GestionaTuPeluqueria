angular.module('starterMiApp.contrsClientes', [])

.controller('ClientesCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','$ionicModal','servClientes', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,$ionicModal,servClientes){
    

    $scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);

    //Listar los clientes en el list item
    servClientes.getNombreCompleto($scope.sesionIdUser).then(function(data){
      console.log(data);
      if(data==-1)
      {
        $scope.noClientes = "No tiene usuarios introducidos";
      }
      else
      {
        $scope.clientes = data;   
      }
      
    });

    //Insertar un nuevo cliente a atraves del un modal
    // 'plantillas/modalInsertarCliente.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/Clientes/modalInsertarCliente.html', {
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
      console.log(form);
      form['idUser'] = $scope.sesionIdUser;
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
                  $state.go($state.current,null,{reload:true});
                  $scope.modal.hide();
                });
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

.controller('ClientePerfilCtrl', ['$scope','$state','$stateParams','$ionicLoading','$ionicPopup','servClientes','$cordovaCamera','$cordovaFileTransfer','$ionicModal', function($scope,$state,$stateParams,$ionicLoading,$ionicPopup,servClientes,$cordovaCamera,$cordovaFileTransfer,$ionicModal){

    clienteForm.$error = {
      'required': true
    }

    var idCliente = $stateParams.idCliente;

    servClientes.mostrarPerfilCliente(idCliente).then(function(datosCliente){

        /*$scope.data es la informacion que se va mostrar en el perfil del cliente a
        partir de los datos obtenidos del servicio servClientes.mostrarPerfilCliente*/
        $scope.data = datosCliente[0];
        $scope.fotoPerfil = datosCliente[0].urlFoto;
        console.log($scope.fotoPerfil);
        
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
                      $state.go($state.current,null,{reload:true});
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


    //BUG PENDIENTE REEMPLAZAR FOTO 
    $scope.hacerFoto = function(){
      $ionicLoading.show();
      var options = { 
            quality : 90, 
            destinationType : Camera.DestinationType.FILE_URI, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : false, // despues de echar la foto puedes seleccionar que parte quieres que se guarde
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1024,
            targetHeight: 780,
            saveToPhotoAlbum: false
        };

    $cordovaCamera.getPicture(options).then(function(imageData) {
            
            $scope.imgURItemp = imageData;

            var nombreImg = imageData.substr(imageData.lastIndexOf('/') + 1);
            var options = {
                fileKey: "file",
                fileName: nombreImg,
                chunkedMode: false,
                mimeType: "image/jpg",
                params : {'idCli':idCliente}
            };

            $cordovaFileTransfer.upload("http://gestionestetica.fonotecaumh.es/Clientes/subirFoto.php",imageData, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                $scope.opciones = result.response;
                $state.go($state.current,null,{reload:true});
                // location.reload(); // refrescar la pagina entera por javascript
            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                $scope.opciones = "ERROR: " + JSON.stringify(err);
            }, function (progress) {
                // constant progress updates
            });
                
            $scope.opciones = options;
            $scope.uploadOptions1 = uploadOptions;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }//Fin scope.hacerFoto

    // 'plantillas/modalVerFotoPerfil.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/Clientes/modalVerFotoPerfil.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalVerFoto = function() {
      $scope.modal.show();
    }

    $scope.closeModal = function() {
      
      $scope.modal.hide();
    };

    $scope.verFoto = function()
    {
      $scope.openModalVerFoto();
    }




}]) //Fin  ClientePerfilCtrl