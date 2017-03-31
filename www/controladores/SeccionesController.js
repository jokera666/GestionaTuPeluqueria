angular.module('starterMiApp.contrsSecciones', [])

.controller('SeccionesCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicPopup','$ionicLoading','servSecciones', function($scope,$state,$stateParams,$ionicModal,$ionicPopup,$ionicLoading,servSecciones){

	var sesionIdUser = localStorage.getItem("idUser");
  console.log('Usuario con id de sesion---> '+sesionIdUser);
  $scope.animacion = "hide";

	$scope.secciones = [];

	servSecciones.listarSecciones(sesionIdUser).then(function(data){
		console.log(data);
		if(data==-1)
	    {
	      	$scope.mensajeError = "No hay secciones introducidos";
          $scope.animacion = "animated shake show";
	    }
      	else
      	{
          $scope.animacion = "hide";
        	$scope.secciones = data;   
      	}
	})

	$ionicModal.fromTemplateUrl('plantillas/Secciones/modalInsertarSeccion.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalSeccion = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.clickInsertarSeccion = function (form){
      $ionicLoading.show();
      form['idUser'] = sesionIdUser;
      servSecciones.insertarSeccion(form).then(function(servResponse){

        if(servResponse==-1)
        {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                 title: 'Error al introducir la sección',
                 template: 'La sección ya existe.',
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
    };

	//Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };


}]) // Fin SeccionesCtrl



.controller('SeccionPerfilCtrl', ['$scope','$state','$stateParams','$ionicPopup','$ionicLoading','servSecciones', function($scope,$state,$stateParams,$ionicPopup,$ionicLoading,servSecciones){

	var sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+sesionIdUser);

    var idSeccion = $stateParams.idSeccion;

    var nombreSeccion = $stateParams.nombreSeccion;
    $scope.form  = {
     	nombre: nombreSeccion
     };

    var formOriginal = angular.copy($scope.form);

    $scope.clickModificarSeccion = function (form){
     	//Añadir propiedades a un objeto en este caso en el objeto form.
     	form['idSeccion'] = idSeccion;
     	form['idUser'] = sesionIdUser;

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
                  servSecciones.modificarSeccion(form).then(function(){
                      $state.go('sidemenu.secciones',null,{reload:true});
                  });
              }
            }
          }
        ]
        });
    };


    $scope.clickEliminarSeccion = function (){

        var myPopup = $ionicPopup.show({
        title: 'Borrar sección',
        subTitle: '<span>¿Estás seguro de que deseas eliminar la sección?</span>',
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
                  servSecciones.borrarSeccion(idSeccion).then(function(servResponse){
                      if(servResponse==-1)
                      {
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                               title: 'Error al borrar la sección',
                               template: 'La sección tiene servicios existentes.',
                               okText: 'Volver', 
                               okType: 'button-assertive'
                          });
                      }
                      else
                      {
                        $state.go('sidemenu.secciones',null,{reload:true});
                      }
                      
                  });
              }
            }
          }
        ]
        });
    };

    $scope.reiniciarForm = function(){
    	$scope.form = angular.copy(formOriginal);
    };

}]) // Fin SeccionPerfilCtrl