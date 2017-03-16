angular.module('starterMiApp.contrsServicios', [])

.controller('ServiciosCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servSecciones','servServicios', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servSecciones,servServicios){

   	$scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);

	$scope.secciones = [];
	$scope.seccionesModal = [];

	servSecciones.listarSecciones($scope.sesionIdUser).then(function(data){
		//console.log(data);
		$scope.secciones = data;
		$scope.seccionesModal = data;
	});

	$scope.servicios = [];

	$scope.getSeccion = function(seccion)
	{
		$scope.noServicios = '';
		//null es la opcion de Seleccionar...
		if(seccion!=null)
		{
			$scope.nombreSeccion = seccion.nombre;
			$scope.idSeccion = seccion.id_seccion;

			servServicios.nombreServicio($scope.idSeccion).then(function(servResponse){
				if(servResponse == -1)
			    {
			    	$scope.servicios = '';
			    	$scope.noServicios = 'No hay servicios de esta sección.';
			    }
			    else
			    {
			    	$scope.noServicios = '';
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
     	console.log(data);
     	$scope.elementosServicio = data;
     	 $scope.categoriasOriginales = angular.copy($scope.elementosServicio);
     });

     $scope.clickModificarServicio = function(form)
     {
     	form['Elementos'] = $scope.elementosServicio;
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
	                  	  console.log('----->>> '+servResponse);
	                      $state.go('sidemenu.servicios',null,{reload:true});
	                  });
	              }
	            }
	          }
	        ]
        });
     }

     $scope.clickEliminarServicio = function()
     {
     	var elementServicios = {};
     	elementServicios['Elementos'] = $scope.elementosServicio; // array de objetos

     	var myPopup = $ionicPopup.show({
	        title: 'Eliminar servicio',
	        subTitle: '<span>¿Estás seguro de que deseas eliminar el servicio?</span>',
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
	                  	  console.log('----->>> '+servResponse);
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
     	$scope.elementosServicio = angular.copy($scope.categoriasOriginales);
     	console.log($scope.elementosServicio);
     }
     

}]) // Fin servicioPerfilCtrl