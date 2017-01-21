angular.module('starterMiApp.contrsEmpleados', [])

.controller('EmpleadosCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','$ionicModal','servEmpleados', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,$ionicModal,servEmpleados){
    
	$scope.sesionIdUser = localStorage.getItem("idUser");

	servEmpleados.listarEmpleados($scope.sesionIdUser).then(function(servResponse){
		if(servResponse == -1)
		{
			$scope.noEmpleados = 'No tiene empleados introducidos';
		}
		else
		{
			$scope.Empleados = servResponse;
		}
	})

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
      form['idUser'] = $scope.sesionIdUser;
      var myPopup = $ionicPopup.show({
      title: 'Añadir empleado',
      subTitle: '<span>¿Estás seguro de que deseas añadir el empleado?</span>',
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
                servEmpleados.insertarEmpleado(form).then(function(){
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

    $scope.reiniciarForm = function(){
    	$scope.form = angular.copy(formOriginal);
    };


}]) //Fin EmpleadoPerfilCtrl