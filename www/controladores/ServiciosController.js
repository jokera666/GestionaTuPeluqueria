angular.module('starterMiApp.contrsServicios', [])

.controller('ServiciosCtrl', ['$scope','$state','$stateParams','$ionicModal','servSecciones','servServicios', function($scope,$state,$stateParams,$ionicModal,servSecciones,servServicios){

   	$scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);

	$scope.secciones = [];

	servSecciones.listarSecciones($scope.sesionIdUser).then(function(data){
		console.log(data);
		$scope.secciones = data;
	});

    // $scope.colors = [
    //   {name:'black', shade:'dark'},
    //   {name:'white', shade:'light', notAnOption: true},
    //   {name:'red', shade:'dark'},
    //   {name:'blue', shade:'dark', notAnOption: true},
    //   {name:'yellow', shade:'light', notAnOption: false}
    // ];

	$scope.servicios = [];

	$scope.getSeccion = function(seccion)
	{
		console.log(seccion);

		$scope.nombreSeccion = seccion.nombre;
		var idSeccion = seccion.id_seccion;

		servServicios.nombreServicio(idSeccion).then(function(data){
			$scope.servicios = data;
		});
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

	//Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };


}]) // Fin ServiciosCtrl