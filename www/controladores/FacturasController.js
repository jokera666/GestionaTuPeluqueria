angular.module('starterMiApp.contrsFacturas', [])

.controller('FacturasCtrl', ['$scope','$state','$stateParams','$ionicModal', function($scope,$state,$stateParams,$ionicModal){

	$scope.proveedores = [
		{id_proveedor: '1',nombre:'Joaquin'},
		{id_proveedor: '2',nombre:'Jose'}
	];

	$scope.compras = [
		{id_compra:'1',numFactura: '3232A',fechaCompra: '01/12/2016',precioCompraTotal: 55.5},
		{id_compra:'2',numFactura: '555',fechaCompra: '02/12/2016',precioCompraTotal: 65.5},
		{id_compra:'3',numFactura: '3',fechaCompra: '03/12/2016',precioCompraTotal: 75.5}
	];

	$scope.proveedoresModal = [
		{id_proveedor: '1',nombre:'Joaquin'},
		{id_proveedor: '2',nombre:'Jose'}
	];

	$ionicModal.fromTemplateUrl('plantillas/Facturas/modalInsertarCompra.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModalCompra = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.getProveedorModal = function(form)
    {
    	console.log(form);
    	$scope.todoListLineasCompra = [];
    }


    $scope.marcas = [
		{id_marca: '1',nombre:'Genus'},
		{id_marca: '2',nombre:'Wella'}
	];

    $scope.todoListLineasCompra = [];

	$scope.anadirLineaCompra  = function()
	{
		$scope.todoListLineasCompra.push({});
	}

	$scope.eliminarLineaCompra = function (index) {
        $scope.todoListLineasCompra.splice(index, 1);
    };

}]) // Fin FacturasCtrl