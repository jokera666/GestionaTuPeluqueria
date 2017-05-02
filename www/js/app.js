// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starterMiApp', ['ionic','ngAnimate','ngMessages','ui.calendar','ngTouch','ngCordova','ionic.closePopup', 
                                                                'starterMiApp.contrsLogin',
                                                                'starterMiApp.contrsSignup',
                                                                'starterMiApp.contrsSidemenu',
                                                                'starterMiApp.contrsAgenda',
                                                                'starterMiApp.contrsPerfilUsuario',
                                                                'starterMiApp.contrsCaja',
                                                                'starterMiApp.contrsClientes',
                                                                'starterMiApp.contrsProductos',
                                                                'starterMiApp.contrsVentas',
                                                                'starterMiApp.contrsSecciones',
                                                                'starterMiApp.contrsServicios',
                                                                'starterMiApp.contrsProveedores',
                                                                'starterMiApp.contrsFacturas',
                                                                'starterMiApp.contrsEmpleados',
                                                                'starterMiApp.servsLogin',
                                                                'starterMiApp.servsSignup',
                                                                'starterMiApp.servsUsuario',
                                                                'starterMiApp.servsAgenda',
                                                                'starterMiApp.servsVentas',
                                                                'starterMiApp.servsClientes',
                                                                'starterMiApp.servsSecciones',
                                                                'starterMiApp.servsEmpleados',
                                                                'starterMiApp.servsServicios',
                                                                'starterMiApp.servsProveedores',
                                                                'starterMiApp.servsCompras',
                                                                'starterMiApp.servsProductos'
                                                                ])

.run(function($ionicPlatform,$state,$ionicNavBarDelegate,$rootScope,$ionicSideMenuDelegate) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 300);

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      
      var id = localStorage.getItem("idUser");
      console.log($state.current.name);
      console.log(event);
      if(id == '')
      {

      }
    // if (toState.authenticate && !AuthService.isAuthenticated()){
    //   // User isn’t authenticated
    //   $state.transitionTo("login");
    //   event.preventDefault(); 
    // }
  });

    //Al realizar el $state.go reload para no quitar el NavBar
    $rootScope.$on('$ionicView.enter', function(e) {
      $ionicNavBarDelegate.showBar(true);
    });

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.Connection)
    {
       if (navigator.connection.type == Connection.NONE)
       {
         alert("Necesita datos para poder utilizar la aplicación.");
         navigator.app.exitApp();
       }
       else
       {
        return;
       }
    }

  });

  $ionicPlatform.registerBackButtonAction(function(event) {

      var nombreEstado = $state.current.name; 
      switch(nombreEstado)
      {
        case "login":
          navigator.app.exitApp();
        break;

        case "signup":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilUsuario":
           navigator.app.backHistory();
        break;

        case "sidemenu.perfilCliente":
           navigator.app.backHistory();
        break;

        case "sidemenu.perfilSeccion":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilServicio":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilProveedor":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilFactura":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilProducto":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilEmpleado":
          navigator.app.backHistory();
        break;

        default:
          $ionicSideMenuDelegate.toggleLeft();
        break;
      }

    }, 100);
  
  })

.constant('$ionicLoadingConfig', {
              template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner><p>Cargando...</p>',
              hideOnStateChange: true
  })

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.navBar.alignTitle('center');
  // Si es true recoge el scrolling de JS i si es false el nativo de Sistema operativo
  // con false da problemas en el scrolling del sidemenu
  $ionicConfigProvider.scrolling.jsScrolling(true);
  $ionicConfigProvider.views.maxCache(0);

  
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'plantillas/login.html',
    controller: 'LoginCtrl'
  })

  .state('signup',{
    url: '/signup',
    templateUrl: 'plantillas/signup.html',
    controller: 'SignupCtrl'
  })

  .state('sidemenu', {
    url: '/side',
    abstract: true,
    templateUrl: 'plantillas/menu.html',
    controller: 'SidemenuCtrl'
  })

 
  .state('sidemenu.agenda', {
      url: '/agenda',
      views: {
        'menuContent': {
          templateUrl: 'plantillas/Agenda/agenda.html',
          controller: 'AgendaCtrl'
        }
      }
  })

  .state('sidemenu.perfilUsuario', {
    url: '/perfil/:nombreUsuario',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Usuarios/perfilUsuario.html',
        controller: 'perfilUsuarioCtrl'
      }
    }
  })

.state('sidemenu.caja', {
    url: '/caja/:nombreCliente/:fechaCita/:idCliente',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Ventas/caja.html',
        controller: 'CajaCtrl'
      }
    }
  })

  .state('sidemenu.clientes', {
    url: '/clientes',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Clientes/clientes.html',
        controller: 'ClientesCtrl'
      }
    }
  })

.state('sidemenu.perfilCliente', {
    url: '/perfilClientes/:idCliente',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Clientes/perfilCliente.html',
        controller: 'ClientePerfilCtrl'
      }
    }
  })

  .state('sidemenu.productos', {
    url: '/productos',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Productos/productos.html',
        controller: 'ProductosCtrl'
      }
    }
  })

  .state('sidemenu.perfilProducto', {
    url: '/perfilProducto/:idProducto',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Productos/perfilProducto.html',
        controller: 'ProductoPerfilCtrl'
      }
    }
  })

  .state('sidemenu.ventas', {
    url: '/ventas',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Ventas/ventas.html',
        controller: 'VentasCtrl'
      }
    }
  })

  .state('sidemenu.perfilVenta', {
    url: '/perfilVenta/:idVenta',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Ventas/perfilVenta.html',
        controller: 'VentasPerfilCtrl'
      }
    }
  })

  .state('sidemenu.secciones', {
    url: '/secciones',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Secciones/secciones.html',
        controller: 'SeccionesCtrl'
      }
    }
  })

  .state('sidemenu.perfilSeccion', {
    url: '/perfilSeccion/:idSeccion/:nombreSeccion',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Secciones/perfilSeccion.html',
        controller: 'SeccionPerfilCtrl'
      }
    }
  })

  .state('sidemenu.servicios', {
    url: '/servicios',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Servicios/servicios.html',
        controller: 'ServiciosCtrl'
      }
    }
  })

  .state('sidemenu.perfilServicio',{
    url: '/perfilServicio/:idSeccion/:nombreServicio',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Servicios/perfilServicio.html',
        controller: 'ServicioPerfilCtrl'
      }
    }
  })

  .state('sidemenu.proveedores', {
    url: '/proveedores',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Proveedores/proveedores.html',
        controller: 'ProveedoresCtrl'
      }
    }
  })

  .state('sidemenu.perfilProveedor', {
    url: '/perfilProveedor/:idProveedor',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Proveedores/perfilProveedor.html',
        controller: 'ProveedorPerfilCtrl'
      }
    }
  })

  .state('sidemenu.facturas', {
    url: '/facturas',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Facturas/facturas.html',
        controller: 'FacturasCtrl'
      }
    }
  })

  .state('sidemenu.perfilFactura', {
    url: '/perfilFactura/:idCompra/:nombre',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Facturas/perfilFactura.html',
        controller: 'FacturaPerfilCtrl'
      }
    }
  })

  .state('sidemenu.empleados', {
    url: '/empleados',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Empleados/empleados.html',
        controller: 'EmpleadosCtrl'
      }
    }
  })

  .state('sidemenu.perfilEmpleado', {
    url: '/perfilEmpleado/:idEmpleado',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Empleados/perfilEmpleado.html',
        controller: 'EmpleadoPerfilCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');
});
