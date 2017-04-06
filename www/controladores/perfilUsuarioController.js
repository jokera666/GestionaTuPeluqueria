angular.module('starterMiApp.contrsPerfilUsuario', [])

.controller('perfilUsuarioCtrl', ['$scope','$state','$stateParams','$ionicLoading','$cordovaCamera','$cordovaFileTransfer','$ionicModal','$ionicPopover','$ionicPopup','servUsuario', function($scope,$state,$stateParams,$ionicLoading,$cordovaCamera,$cordovaFileTransfer,$ionicModal,$ionicPopover,$ionicPopup,servUsuario){

  var idUsuario = localStorage.getItem("idUser");
	$scope.nombreUsuario = $stateParams.nombreUsuario;

  servUsuario.listarUsuario(idUsuario).then(function(servResponse){
    
    if(servResponse==-1)
    {
      $state.go('login',null,{reload:true});
    }
    else
    {
      $scope.form = servResponse;
      console.log($scope.form);
    }

  });

	$scope.clickModificarPerfilUsuario = function (form)
	{
    form['idUser'] = idUsuario;
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
                  servUsuario.modificarPerfilUsuario(form).then(function(servResponse){
                      console.log(servResponse);
                      $state.go($state.current,null,{reload:true});
                  });
              }
            }
          }
        ]
      });

	}

	$scope.showPassOld = true;
	$scope.showPassNew = true;
	$scope.showPassRepeat = true;
	$scope.verPass = function (event)
	{
		console.log(event.currentTarget.id);
		var idInputPass = event.currentTarget.id;
		switch(idInputPass)
		{
			case 'contrasenaOld':
				if($scope.showPassOld == true)
				{
					$scope.showPassOld = false;
				}
				else
				{
					$scope.showPassOld = true;
				}
			break;

			case 'contrasenaNew':
				if($scope.showPassNew == true)
				{
					$scope.showPassNew = false;
				}
				else
				{
					$scope.showPassNew = true;
				}
			break;

			case 'contrasenaRepeat':
				if($scope.showPassRepeat == true)
				{
					$scope.showPassRepeat = false;
				}
				else
				{
					$scope.showPassRepeat = true;
				}
			break;
		}
	} // Fin verPass()

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
                params : {'idUser':idUsuario}
            };
            $cordovaFileTransfer.upload("http://gestionestetica.fonotecaumh.es/Usuarios/subirFoto.php",imageData, options).then(function(result) {
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
    $ionicModal.fromTemplateUrl('plantillas/Usuarios/modalVerFotoPerfil.html', {
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

	// console.log($stateParams.idCita);
	//console.log($stateParams.fechaCita);

}]) // Fin CajaCtrl