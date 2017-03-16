angular.module('starterMiApp.contrsProveedores', [])

.controller('ProveedoresCtrl', ['$scope','$state','$stateParams','$ionicModal','$ionicLoading','$ionicPopup','servProveedores', function($scope,$state,$stateParams,$ionicModal,$ionicLoading,$ionicPopup,servProveedores){


  $scope.sesionIdUser = localStorage.getItem("idUser");

  servProveedores.listarProveedores($scope.sesionIdUser,'getAllProveedores').then(function(servResponse){
    if(servResponse == -1)
    {
      $scope.noProveedores = 'No tiene proveedores introducidos';
    }
    else
    {
      $scope.Proveedores = servResponse;
    }
  });

  $scope.todoListInsertarMarca = [];

  $scope.anadirNuevaMarca  = function()
  {
    $scope.todoListInsertarMarca.push({});
  }

  $scope.eliminarNuevaMarca = function (index) {
        $scope.todoListInsertarMarca.splice(index, 1);
  };


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
      
      $ionicLoading.show();

      form['idUser'] = $scope.sesionIdUser;
      form['nuevasMarcas']  = $scope.todoListInsertarMarca;
      console.log(form);

      if($scope.todoListInsertarMarca=='')
      {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
                 title: 'Error',
                 template: 'Debe de introducir al menos una marca.',
                 okText: 'Volver', 
                 okType: 'button-assertive'
            });
      }
      else
      {
        $scope.modal.hide();
        servProveedores.insertarProveedor(form).then(function(data){
          $state.go($state.current,null,{reload:true});
        });
      }
    };

    //Limpiar la barra de busqueda
    $scope.borrarBuscador = function(){
      $scope.buscador = '';
    };

}]) // Fin ProveedoresCtrl

.controller('ProveedorPerfilCtrl', ['$scope','$state','$stateParams','$ionicLoading','$ionicPopup','servProveedores', function($scope,$state,$stateParams,$ionicLoading,$ionicPopup,servProveedores){

	$scope.sesionIdUser = localStorage.getItem("idUser");
  var idProveedor = $stateParams.idProveedor;

  //variables necesarias para almacenar el contenido del provedor
  //para reiniciar el formulario
  var datosPerfilProveedorIniciales;
  var elementosMarcaIniciales;

  //Como el servicio web devuelve el perfil del proveedor en funcion de objeto
  //tambien devuelve las marcas del proveedor tambien en formato de objeto
  //El objeto 0 son los datos del proveedor y el resto de objetos el id y el nombre
  //de la marca de dicho proveedor.
  servProveedores.listarPerfilProveedor(idProveedor).then(function(servResponse){

    var datosPerfilProveedor = servResponse[0];
    datosPerfilProveedorIniciales = angular.copy(servResponse[0]);
    $scope.form = datosPerfilProveedor;
    
    $scope.elementosMarca = [];

    for(var i = 1; i<servResponse.length; i++)
    {
       $scope.elementosMarca.push(servResponse[i]);
    }
    elementosMarcaIniciales = angular.copy($scope.elementosMarca);       
  });

  $scope.todoListNuevasMarcas = [];

  $scope.anadirNuevaMarca  = function()
  {
    $scope.todoListNuevasMarcas.push({});
  }

  $scope.eliminarNuevaMarca = function (index) {
        $scope.todoListNuevasMarcas.splice(index, 1);
  };

  $scope.clickModificarProveedor = function(form)
  {
    form['idProvedor']        = idProveedor;
    form['nuevasMarcas']      = $scope.todoListNuevasMarcas;
    form['marcasExistentes']  = $scope.elementosMarca;
    console.log(form);
    var myPopup = $ionicPopup.show({
      title: 'Modificar proveedor',
      subTitle: '<span>¿Estás seguro de que deseas modificar el proveedor?</span>',
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
                servProveedores.modificarPerfilProveedor(form).then(function(data){
                  $state.go($state.current,null,{reload:true});
                  $scope.modal.hide();
                });
            }
          }
        }
      ]
      });
    }

  $scope.clickEliminarProveedor = function()
  {
    var myPopup = $ionicPopup.show({
      title: 'Eliminar proveedor',
      subTitle: '<span>¿Estás seguro de que deseas eliminar el proveedor?</span>',
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
                servProveedores.eliminarProveedor(idProveedor).then(function(){
                  $state.go('sidemenu.proveedores',null,{reload:true});
                  $scope.modal.hide();
                });
            }
          }
        }
      ]
      });
    }

  $scope.reiniciarForm = function()
  {
    $scope.form = angular.copy(datosPerfilProveedorIniciales);
    $scope.elementosMarca = angular.copy(elementosMarcaIniciales);
 }

}]) // Fin PerfilProveedoresCtrl