angular.module('starterMiApp.contrsEmpleados', [])

.controller('EmpleadosCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','$ionicModal','servEmpleados', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,$ionicModal,servEmpleados){
    
	$scope.sesionIdUser = localStorage.getItem("idUser");
  $scope.animacion = "hide";

	servEmpleados.listarEmpleados($scope.sesionIdUser).then(function(servResponse){
		if(servResponse == -1)
		{
			$scope.mensajeError = 'No hay empleados introducidos';
      $scope.animacion = "animated shake show";
		}
		else
		{
      $scope.animacion = "hide";
			$scope.Empleados = servResponse;
		}
	});

    // 'plantillas/modalInsertarEmpleado.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/Empleados/modalInsertarEmpleado.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalEmpleados = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };


    $scope.clickInsertarEmpleado = function (form){
      //console.log(form);
      $scope.modal.hide();
      $ionicLoading.show();
      form['idUser'] = $scope.sesionIdUser;
      
      servEmpleados.insertarEmpleado(form).then(function(){
        $state.go($state.current,null,{reload:true});            
      });
    };

    //Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };


}]) // Fin EmpleadosCtrl

.controller('EmpleadoPerfilCtrl', ['$scope','$state','$stateParams','$ionicLoading','$ionicPopup','$ionicModal','servEmpleados', function($scope,$state,$stateParams,$ionicLoading,$ionicPopup,$ionicModal,servEmpleados){

	$scope.sesionIdUser = localStorage.getItem("idUser");
	var idEmpleado = $stateParams.idEmpleado;
	var formOriginal = '';

	servEmpleados.listarPerfilEmpleado(idEmpleado).then(function(data){
		$scope.form = data;
		formOriginal = angular.copy(data);

	});

	$scope.clickModificarEmpleado = function(form){
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
                  servEmpleados.modificarEmpleado(form).then(function(){
                      $state.go('sidemenu.empleados',null,{reload:true});
                  });
              }
            }
          }
        ]
        });
    };

    $scope.clickEliminarEmpleado = function(nombre,apellido1){
        var myPopup = $ionicPopup.show({
        title: 'Eliminar empleado',
        subTitle: '<span>¿Estás seguro de que deseas eliminar el empleado <b>'+nombre+' '+apellido1+'</b>?</span>',
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
                  servEmpleados.borrarPerfilEmpleado(idEmpleado).then(function(){
                      $state.go('sidemenu.empleados',null,{reload:true});
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


}]) //Fin EmpleadoPerfilCtrl