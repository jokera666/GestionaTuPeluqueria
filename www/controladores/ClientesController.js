angular.module('starterMiApp.contrsClientes', [])

.controller('ClientesCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','$ionicModal','servClientes', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,$ionicModal,servClientes){
    

    $scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);
    $scope.animacion = "hide";

    //Listar los clientes en el list item
    servClientes.listarClientes('listaClientes',$scope.sesionIdUser).then(function(data){
      console.log(data);
      if(data==-1)
      {
        $scope.noClientes = -1;
        $scope.mensajeError = "No hay clientes introducidos.";
        $scope.animacion = "animated shake show";
      }
      else
      {
        $scope.animacion = "hide";
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
      $scope.modal.hide();
      $ionicLoading.show();
      console.log(form);
      form['idUser'] = $scope.sesionIdUser;
      
      servClientes.insertarCliente(form).then(function(){
        $state.go($state.current,null,{reload:true});
      });
    };

    //Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin ClientesCtrl

.controller('ClientePerfilCtrl', ['$scope','$state','$stateParams','$ionicLoading','$ionicPopup','servClientes','$cordovaCamera','$cordovaFileTransfer','$ionicModal','$ionicPopover','$ionicSlideBoxDelegate','$ionicSideMenuDelegate', function($scope,$state,$stateParams,$ionicLoading,$ionicPopup,servClientes,$cordovaCamera,$cordovaFileTransfer,$ionicModal,$ionicPopover,$ionicSlideBoxDelegate,$ionicSideMenuDelegate){

    var idCliente = $stateParams.idCliente;

    servClientes.mostrarCabeceraPerfilCliente(idCliente).then(function(datosCliente){
  //       $scope.servicios = datosCliente;
  //       console.log($scope.servicios);
  //        $scope.event = [];
  //       // for(var i=1; i<datosCliente.length; i++)
  //       // {
  //       //    $scope.servicios = datosCliente[i];

  //       //    //$scope.event.push({lineas:datosCliente[i]});

  //       // }
  //       $ionicSlideBoxDelegate.update();

  //   console.log($scope.event);



        //$scope.servicios = datosCliente[1];
        //console.log($scope.servicios);
        /*$scope.data es la informacion que se va mostrar en el perfil del cliente a
        partir de los datos obtenidos del servicio servClientes.mostrarPerfilCliente*/
        $scope.data = datosCliente[0];
        $scope.fotoPerfil = datosCliente[0].urlFoto;
        
        /* this.form es la directiva ng-model en la vista perfilCliente donde inicializo las directivas
        con los valores/datos obtenidos del servicio servClientes.mostrarPerfilCliente*/
        this.form = $scope.data;
        $scope.reiniciarForm = function(){
         this.form = angular.copy($scope.data);   
        };
        $scope.reiniciarForm();
    });

    servClientes.mostrarPerfilCliente(idCliente).then(function(servResponse){
      console.log(servResponse);

      if(servResponse == -1)
      {
        $scope.noElementosComperciales = -1;
        $scope.mensajeError = "No hay ventas disponibles.";
      }
      else
      {
        $ionicSlideBoxDelegate.update();
        $scope.servicios = servResponse;
        

        $scope.numVenta = $scope.servicios[$scope.servicios.length-1][0].numVenta;
        $scope.fechaVenta = $scope.servicios[$scope.servicios.length-1][0].fechaVenta;
        
        // var lastIndex = $scope.servicios.length-1;
        //   for(var i = 0; i<$scope.servicios[lastIndex].length; i++)
        //   {
        //     var aux = $scope.servicios[lastIndex][i].nombreServicio;
        //     if(aux == '' || aux == null)
        //     {
        //       $scope.noServicio = -1;
        //       $scope.mensajeError1 = "No hay servicios utilizados";
        //     }
        //     else
        //     {
        //       $scope.noServicio = 1;
        //     } 
        //   }

        //   for(var i = 0; i<$scope.servicios[lastIndex].length; i++)
        //   {
        //     var aux = $scope.servicios[lastIndex][i].nombreProducto;

        //     if(aux == '' || aux == null)
        //     {
        //       $scope.noProductos = -1;
        //       $scope.mensajeError2 = "No hay productos adqueridos";
        //     }
        //     else
        //     {
        //       $scope.noProductos = 1;
        //     } 
        //   }

        //   for(var i = 0; i<$scope.servicios[lastIndex].length; i++)
        //   {
        //     var aux = $scope.servicios[lastIndex][i].observaciones;
        //     if(aux == '' || aux == null)
        //     {
        //       $scope.noObservaciones = -1;
        //       $scope.mensajeError3 = "No hay observaciones anotadas";
        //     }
        //     else
        //     {
        //       $scope.noObservaciones = 1;
        //     } 
        //   }
      }

    });

    // $scope.slideHasChanged = function(index)
    // {
    //     $ionicSlideBoxDelegate.update();
    //     $scope.numVenta = $scope.servicios[index][0].numVenta;
    //     $scope.fechaVenta = $scope.servicios[index][0].fechaVenta;

    //     for(var i = 0; i<$scope.servicios[index].length; i++)
    //     {
    //       var aux = $scope.servicios[index][i].nombreServicio;
    //       if(aux == '' || aux == null)
    //       {
    //         $scope.noServicio = -1;
    //         $scope.mensajeError1 = "No hay servicios utilizados";
    //       }
    //       else
    //       {
    //         $scope.noServicio = 1;
    //       } 
    //     }

    //     for(var i = 0; i<$scope.servicios[index].length; i++)
    //     {
    //       var aux = $scope.servicios[index][i].nombreProducto;
    //       if(aux == '' || aux == null)
    //       {
    //         $scope.noProductos = -1;
    //         $scope.mensajeError2 = "No hay productos adqueridos";
    //       }
    //       else
    //       {
    //         $scope.noProductos = 1;
    //       } 
    //     }

    //     for(var i = 0; i<$scope.servicios[index].length; i++)
    //     {
    //       var aux = $scope.servicios[index][i].observaciones;
    //       if(aux == '' || aux == null)
    //       {
    //         $scope.noObservaciones = -1;
    //         $scope.mensajeError3 = "No hay observaciones anotadas";
    //       }
    //       else
    //       {
    //         $scope.noObservaciones = 1;
    //       } 
    //     }
    // };

    //     $scope.productos = {
    //     0: [{
    //         idVenta: 32,
    //         nombreProducto: "Wella Champu 1L"
    //     }, {
    //         idVenta: 32,
    //         nombreProducto: "Wella Champu 2L"
    //     }, {
    //         idVenta: 32,
    //         nombreProducto: "Wella Champu 3L"
    //     }, {
    //         idVenta: 32,
    //         nombreProducto: "Wella Champu 4L"
    //     }],
    //     1: [{
    //         idVenta: 333,
    //         nombreProducto: "Fructis Acondicionador 1L"
    //     }, {
    //         idVenta: 333,
    //         nombreProducto: "Fructis Acondicionador 2L"
    //     }, {
    //         idVenta: 333,
    //         nombreProducto: "Fructis Acondicionador 3L"
    //     }, {
    //         idVenta: 333,
    //         nombreProducto: "Fructis Acondicionador 4L"
    //     }]
    // }

    $scope.nextSlide = function(fecha) {
      $ionicSlideBoxDelegate.next();
    }

    $scope.previousSlide = function() {
      $ionicSlideBoxDelegate.previous();
    }


    $scope.clickModificarCliente = function (form){
        console.log(form);
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

  var plantillaPopover = '<ion-popover-view style="height: 114px;">'+
    '<ion-content scroll="false">'+
        '<div class="list">'+
            '<a class="item item-icon-left" ng-click="obtenerFoto(\'CAMERA\')">'+
              '<i class="icon ion-camera"></i>'+
                'Hacer una foto'+
            '</a>'+
            '<a class="item item-icon-left" ng-click="obtenerFoto(\'PHOTOLIBRARY\')">'+
              '<i class="icon ion-image"></i>'+
                'Elegir foto'+
            '</a>'+
        '</div>'+
    '</ion-content>'+
  '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(plantillaPopover, {
    scope: $scope
  });

   $scope.openPopoverFoto = function($event) {
    $scope.popover.show($event);
    document.body.classList.add('platform-ionic');
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };


    //BUG PENDIENTE REEMPLAZAR FOTO Y BACK BUTTON AL NO SELECCIONAR UNA FOTO 
    $scope.obtenerFoto = function(opcion){
      $scope.popover.hide();
      $ionicLoading.show();
      var tipoFuente = '';
      switch(opcion)
      {
        case 'CAMERA':
        tipoFuente = Camera.PictureSourceType.CAMERA;
        break;

        case 'PHOTOLIBRARY':
        tipoFuente = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
      }
      var options = { 
            quality : 90, 
            destinationType : Camera.DestinationType.FILE_URI, 
            sourceType : tipoFuente, 
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