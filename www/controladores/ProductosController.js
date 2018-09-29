angular.module('starterMiApp.contrsProductos', [])

.controller('ProductosCtrl', ['$scope', '$state','$stateParams','servCompras','servProductos', function($scope, $state,$stateParams,servCompras,servProductos){
    
	var sesionIdUser = localStorage.getItem("idUser");
	$scope.animacion = "hide";

    //Obtener todas las marcas del usuario
	servCompras.listarMarcas(sesionIdUser,'usuario').then(function(servResponse){

		
		if(servResponse==-1)
		{
			$scope.mensajeError = 'No tiene productos adqueridos.<br />Para añadir un nuevo producto: <a href="#/side/facturas">Pulse aqui</a>';
	    	// Añade estilo a la clase mediante ng-class
	    	$scope.animacion = "animated shake show";
		}
		else
		{
			$scope.marcas = servResponse;
			//Inciar el select con la primera marca obtenida
			$scope.model = {
		      marca: $scope.marcas[0]
		    };
		    
		    var idMarca = $scope.model['marca'].id_marca;
		    var nombreMarca = $scope.model['marca'].nombre;

			//null es la opcion de Seleccionar...
			if($scope.model!=null)
			{
				servProductos.listarProductos(idMarca).then(function(servResponse){
					if(servResponse == -1)
				    {
				    	$scope.productos = '';
				    	$scope.mensajeError = 'No hay productos de la marca: <span class="msgErrorNombre">'+nombreMarca+'</span>';
				    	// Añade estilo a la clase mediante ng-class
				    	$scope.animacion = "animated shake show";
				    }
				    else
				    {
				    	$scope.animacion = "hide";
				      	$scope.productos = servResponse;
				    }
				});
			}
		}
	});


	//Listar todos los productos segun la marca seleccionada
	$scope.getProducto = function(infoMarca)
	{
		$scope.animacion = "hide";

		//null es la opcion de Seleccionar...
		if(infoMarca!=null)
		{
			var idMarca = infoMarca.id_marca;
			var nombreMarca = infoMarca.nombre; 
			servProductos.listarProductos(idMarca).then(function(servResponse){
				if(servResponse == -1)
			    {
			    	$scope.productos = '';
			    	$scope.mensajeError = 'No hay productos de la marca: <span class="msgErrorNombre">'+nombreMarca+'</span>';
			    	$scope.animacion = "animated shake show";
			    }
			    else
			    {
			    	$scope.animacion = "hide";
			      	$scope.productos = servResponse;
			    }
			});
		}
	}

	//Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin ProductosCtrl

.controller('ProductoPerfilCtrl', ['$scope', '$state','$stateParams','$ionicPopover','$cordovaCamera','$cordovaFileTransfer','$ionicLoading','$ionicPopup','$ionicModal','servCompras','servProductos', 'baseURL', function($scope, $state,$stateParams,$ionicPopover,$cordovaCamera,$cordovaFileTransfer,$ionicLoading,$ionicPopup,$ionicModal,servCompras,servProductos,baseURL){
    
	$scope.animacion = "hide";
	var sesionIdUser = localStorage.getItem("idUser");
	var idProducto = $stateParams.idProducto;

	servProductos.listarPerfilProducto(idProducto).then(function(servResponse){
		$scope.datosProducto = {
			nombreProveedor: servResponse['infoProducto'].nombreProveedor,
			nombreMarca: servResponse['infoProducto'].nombreMarca,
			nombreElemento: servResponse['infoProducto'].nombreElemento,
			cantidadStock: servResponse['infoProducto'].cantidadStock,
			precioVenta: servResponse['infoProducto'].precioVenta
		};

		$scope.fotoProducto = servResponse['infoProducto'].urlFoto;
		$scope.altNombreFoto = servResponse['infoProducto'].nombreElemento;

	  /* Оbtener los datos de cada linea de compra para de cada producto.*/
	  if(servResponse['Compras']!=null)
	  {
			$scope.animacion = "hide";
			$scope.auxLineasCompras = [];
			var numeroLineasCompras = servResponse['Compras'].length;
			for(i=0; i<numeroLineasCompras; i++)
			{
				$scope.auxLineasCompras.push({idCompra:servResponse['Compras'][i].id_compra, cantidad:servResponse['Compras'][i].cantidadCompra, nombreProveedor:servResponse['Compras'][i].nombreProveedor, precioCompra:servResponse['Compras'][i].precioCompraUnd, fechaCompra:new Date(servResponse['Compras'][i].fechaCompra)});
			}
			$scope.productosCompra = $scope.auxLineasCompras;
	  }
	  else
	  {
			$scope.noCompras = 1;
			$scope.mensajeError = "No hay compras realizadas.";
			$scope.animacion = "animated shake show";
	  }


	  /* Оbtener los datos de cada linea de venta para de cada producto.*/
	  if(servResponse['Ventas']!=null)
	  {
	  	  $scope.animacion = "hide";
		  $scope.auxLineasVentas = [];
		  var numeroLineasVentas = servResponse['Ventas'].length;
		  for(i=0; i<numeroLineasVentas; i++)
		  {
		    $scope.auxLineasVentas.push({idVenta:servResponse['Ventas'][i].id_venta,nombreProveedor:servResponse['Ventas'][i].nombreProveedor, cantidad:servResponse['Ventas'][i].cantidadVenta, precioVenta:servResponse['Ventas'][i].precioVentaUnd, fechaVenta:new Date(servResponse['Ventas'][i].fechaVenta)});
		  }
		  $scope.productosVenta = $scope.auxLineasVentas;
	  }
	  else
	  {
	  		$scope.noVentas = 1;
			$scope.mensajeError = "No hay ventas realizadas.";
			$scope.animacion = "animated shake show";
	  }

	});

	$scope.clickEliminarProducto = function(nombreProducto,nombreMarca)
	{

		var myPopup = $ionicPopup.show({
	        title: 'Eliminar producto',
	        subTitle: '<span>¿Estás seguro de que deseas eliminar el producto <b>'+nombreMarca+' '+nombreProducto+'</b>?</span>',
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
				    servProductos.eliminarProducto(idProducto).then(function(servResponse){

						if(servResponse==-1)
						{
							$ionicLoading.hide();
				   			var alertPopup = $ionicPopup.alert({
							     title: 'Error al borrar el producto',
							     template: 'El producto pertenece a una venta.',
							     okText: 'Volver', 
				  				 okType: 'button-assertive'
				   			});
						}
						else
						{
							$state.go('sidemenu.productos',null,{reload:true});
						}

					});
	              }
	            }
	          }
	        ]
        });
	}

	$scope.clickModificarPrecioVenta = function(precioVenta)
	{
		servProductos.modificarPrecioVenta(idProducto,precioVenta).then(function(){
			$state.go('sidemenu.productos',null,{reload:true});
		});
	}

	

	$scope.clickModificarNombreProducto = function(nuevoNombre)
	{
		servProductos.modificarNombreProducto(idProducto,nuevoNombre).then(function(){
			$state.go('sidemenu.productos',null,{reload:true});
		});
	}

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
	            params : {'idPro':idProducto}
	        };
	        $cordovaFileTransfer.upload(baseURL+"Productos/subirFoto.php",imageData, options).then(function(result) {
	            //console.log("SUCCESS: " + JSON.stringify(result.response));
	            $scope.opciones = result.response;
	            $state.go($state.current,null,{reload:true});
	            // location.reload(); // refrescar la pagina entera por javascript
	        }, function(err) {
	            //console.log("ERROR: " + JSON.stringify(err));
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
	$ionicModal.fromTemplateUrl('plantillas/Productos/modalVerFotoPerfil.html', {
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

}]) // Fin ProductoPerfilCtrl