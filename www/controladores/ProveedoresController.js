angular.module('starterMiApp.contrsProveedores', [])

.controller('ProveedoresCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicLoading','$ionicPopup','servProveedores', function($scope,$state,$stateParams,$ionicModal,$ionicLoading,$ionicPopup,servProveedores){


  $scope.sesionIdUser = localStorage.getItem("idUser");

  servProveedores.listarProveedores($scope.sesionIdUser).then(function(servResponse){
    if(servResponse == -1)
    {
      $scope.noProveedores = 'No tiene proveedores introducidos';
    }
    else
    {
      $scope.Proveedores = servResponse;
    }
  });


	// 'plantillas/modalInsertarEmpleado.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/Proveedores/modalInsertarProveedor.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalProveedores = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };


    $scope.clickInsertarProveedor = function (form){
      form['idUser'] = $scope.sesionIdUser;
      console.log(form);
      var myPopup = $ionicPopup.show({
      title: 'Añadir proveedor',
      subTitle: '<span>¿Estás seguro de que deseas añadir el proveedor?</span>',
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
                servProveedores.insertarProveedor(form).then(function(data){
                  $state.go($state.current,null,{reload:true});
                  $scope.modal.hide();
                });
            }
          }
        }
      ]
      });
    };

}]) // Fin ProveedoresCtrl

.controller('ProveedorPerfilCtrl', ['$scope','$state','$stateParams', function($scope,$state,$stateParams){

	$scope.proveedores = [
		{id_proveedor: '1', nombre: 'Jose Luis', marca:'H&S', telefono:'647154820'},
		{id_proveedor: '2', nombre: 'Carlos', marca:'Loureal', telefono:'999999999'}
	];

}]) // Fin PerfilProveedoresCtrl