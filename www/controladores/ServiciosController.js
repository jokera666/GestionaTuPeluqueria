angular.module('starterMiApp.contrsServicios', [])

.controller('ServiciosCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servSecciones','servServicios', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servSecciones,servServicios){

   	$scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);
    $scope.animacion = "hide";

	servSecciones.listarSecciones($scope.sesionIdUser).then(function(servResponse){
		if(servResponse==-1)
		{
	    	$scope.mensajeError = 'No hay secciones añadidas.<br />Para añadir una sección <a href="#/side/secciones">Pulse aqui</a>';
	    	// Añade estilo a la clase mediante ng-class
	    	$scope.animacion = "animated shake show";
		}
		else
		{
			$scope.secciones = servResponse;
			$scope.seccionesModal = servResponse;

			//Inciar el Select con la primera seccion obtenida en ListarServicios
			$scope.model = {
		      seccion: $scope.secciones[0]
		    };
		    //Inciar el Select con la primera seccion obtenida en InsertarServicios
		    $scope.form = {
		    	seccionModal: $scope.seccionesModal[0]
		    }

		    var idSeccion 	  = $scope.model['seccion'].id_seccion;
		    var nombreSeccion = $scope.model['seccion'].nombre;
		    $scope.nombreSeccion = $scope.model['seccion'].nombre;
		    $scope.idSeccion  = idSeccion;

			if($scope.model!=null)
			{
				servServicios.nombreServicio(idSeccion).then(function(servResponse){
					if(servResponse == -1)
				    {
				    	$scope.servicios = '';
				    	$scope.mensajeError = 'No hay servicios introducidos de la sección: <span class="msgErrorNombre">'+nombreSeccion+'</span>';
				    	$scope.animacion = "animated shake show";
				    }
				    else
				    {
				    	$scope.animacion = "hide";
				      	$scope.servicios = servResponse;
				    }
				});
			}
		}

	});

	$scope.servicios = [];

	$scope.getSeccion = function(seccion)
	{
		$scope.mensajeError = '';
		$scope.animacion = "hide";
		//null es la opcion de Seleccionar...
		if(seccion!=null)
		{
			var nombreSeccion = seccion.nombre;
			$scope.nombreSeccion = seccion.nombre;
			$scope.idSeccion = seccion.id_seccion;

			servServicios.nombreServicio($scope.idSeccion).then(function(servResponse){
				if(servResponse == -1)
			    {
			    	$scope.servicios = '';
			    	$scope.mensajeError = 'No hay servicios introducidos de la sección: <span class="msgErrorNombre">'+nombreSeccion+'</span>';
			    	$scope.animacion = "animated shake show";
			    }
			    else
			    {
			    	$scope.mensajeError = '';
			    	$scope.animacion = "hide";
			      	$scope.servicios = servResponse;
			    }
			});
		}
	}

	$ionicModal.fromTemplateUrl('plantillas/Servicios/modalInsertarServicio.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalServicio = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.todoListElementos = [];

	$scope.anadirCategoria  = function()
	{
		$scope.todoListElementos.push({});
	}

	$scope.eliminarCategoria = function (index) {
        $scope.todoListElementos.splice(index, 1);
    };

	$scope.clickInsertarServicio = function(form)
	{
		$ionicLoading.show();
		//Añadir al objeto form(que el formulario del post de insertar servicio)
		//los elementos_comerciales 
		form['Elementos'] = $scope.todoListElementos;
		//console.log(form);
		//console.log("SUCCESS: " + JSON.stringify(form));
		//console.log('Elementos a vender---> '+$scope.todoListElementos);
		//console.log('Elementos a vender---> '+JSON.stringify($scope.todoListElementos));
		//console.log(form.seccionModal);
		if($scope.todoListElementos == '')
		{
			$ionicLoading.hide();
    		var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: 'Debe de introducir al menos un servicio.',
                 okText: 'Volver', 
                 okType: 'button-assertive'
            });
		}
		else
		{
			servServicios.insertarServicio(form).then(function(servResponse){
				console.log(servResponse);
				if(servResponse == -1)
				{
					$ionicLoading.hide();
		            var alertPopup = $ionicPopup.alert({
		                 title: 'Error al introducir el servicio',
		                 template: 'El servicio ya existe.',
		                 okText: 'Volver', 
		                 okType: 'button-assertive'
		            });
				}
				else
				{
					$scope.modal.hide();
					$state.go($state.current,null,{reload:true});
				}	
			});
		}
	}

	//Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };


}]) // Fin ServiciosCtrl

.controller('ServicioPerfilCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servSecciones','servServicios', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servSecciones,servServicios){
	
	var idSeccion 	  		= $stateParams.idSeccion;
	$scope.nombreServicio 	= $stateParams.nombreServicio;
	
	$scope.form  = {
     	nombreServicio: $scope.nombreServicio
     };

     var nombreServicioOrginal = angular.copy($scope.form);
     $scope.categoriasOriginales = [];

     servServicios.listarPerfilServicio(idSeccion,$scope.nombreServicio).then(function(data){
     	$scope.elementosServicioExistentes = data;
     	 $scope.categoriasOriginales = angular.copy($scope.elementosServicioExistentes);
     });


    $scope.todoListElementosNuevos = [];

	$scope.anadirCategoria  = function()
	{
		$scope.todoListElementosNuevos.push({});
	}

    $scope.eliminarCategoriaExistentes = function (index,idServicio,nombreCategoria) {

   		var myPopup = $ionicPopup.show({
	        title: 'Eliminar categoría',
	        subTitle: '<span>¿Estás seguro de que deseas eliminar la categoría <b>'+nombreCategoria+'</b>?</span>',
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
	                  servServicios.eliminarCategoria(idServicio).then(function(servResponse){
	                      $state.go($state.current,null,{reload:true});
	                  });
	                  $scope.todoListElementosNuevos.splice(index, 1);
	              }
	            }
	          }
	        ]
        });
        
    };

    $scope.eliminarNuevaCategoria = function (index) {
        $scope.todoListElementosNuevos.splice(index, 1);
    };

     $scope.clickModificarServicio = function(form)
     {
     	form['categoriasExistentes'] = $scope.elementosServicioExistentes;
     	form['categoriasNuevas'] = $scope.todoListElementosNuevos;
     	form['idSeccion'] = idSeccion;
     	console.log(form);
     	var myPopup = $ionicPopup.show({
	        title: 'Modificar datos',
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
	                  servServicios.modificarServicio(form).then(function(servResponse){
	                      $state.go('sidemenu.servicios',null,{reload:true});
	                  });
	              }
	            }
	          }
	        ]
        });
     }

     $scope.clickEliminarServicio = function(nombreServicio)
     {
     	var elementServicios = $scope.elementosServicioExistentes; // array de objetos
     	var myPopup = $ionicPopup.show({
	        title: 'Eliminar servicio',
	        subTitle: '<span>¿Estás seguro de que deseas eliminar el servicio <b>'+nombreServicio+'</b>?</span>',
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
	                  servServicios.eliminarServicio(elementServicios).then(function(servResponse){
	                      $state.go('sidemenu.servicios',null,{reload:true});
	                  });
	              }
	            }
	          }
	        ]
        });
     }

     $scope.reiniciarForm = function()
     {
     	$scope.form = angular.copy(nombreServicioOrginal);
     	$scope.elementosServicioExistentes = angular.copy($scope.categoriasOriginales);
     }
     

}]) // Fin servicioPerfilCtrl