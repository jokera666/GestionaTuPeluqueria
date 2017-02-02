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
                                                                'starterMiApp.contrsCaja',
                                                                'starterMiApp.contrsClientes',
                                                                'starterMiApp.contrsProductos',
                                                                'starterMiApp.contrsVentas',
                                                                'starterMiApp.contrsSecciones',
                                                                'starterMiApp.contrsServicios',
                                                                'starterMiApp.contrsProveedores',
                                                                'starterMiApp.contrsFacturas',
                                                                'starterMiApp.contrsEmpleados',
                                                                'starterMiApp.contrsAdmin',
                                                                'starterMiApp.servsLogin',
                                                                'starterMiApp.servsSignup',
                                                                'starterMiApp.servsAgenda',
                                                                'starterMiApp.servsClientes',
                                                                'starterMiApp.servsSecciones',
                                                                'starterMiApp.servsEmpleados',
                                                                'starterMiApp.servsServicios',
                                                                'starterMiApp.servsAdmin'
                                                                ])

.run(function($ionicPlatform,$state,$ionicNavBarDelegate,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 300);

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

        case "sidemenu.perfilCliente":
           navigator.app.backHistory();
        break;

        case "sidemenu.perfilSeccion":
          navigator.app.backHistory();
        break;

        case "sidemenu.perfilEmpleado":
          navigator.app.backHistory();
        break;

        default:
          $ionicSideMenuDelegate.toggleLeft();
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

.state('sidemenu.caja', {
    url: '/caja/:idCita/:fechaCita',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/caja.html',
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

  .state('sidemenu.ventas', {
    url: '/ventas',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/ventas.html',
        controller: 'VentasCtrl'
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

  .state('sidemenu.provedores', {
    url: '/proveedores',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/Proveedores/proveedores.html',
        controller: 'ProveedoresCtrl'
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

  // .state('sidemenu.playlists', {
  //     url: '/playlists',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'plantillas/playlists.html',
  //         controller: 'PlaylistsCtrl'
  //       }
  //     }
  // })

  // .state('sidemenu.single', {
  //   url: '/playlists/:playlistId/:titulo',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'plantillas/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // })

  .state('admin',{
    url: '/admin',
    templateUrl: 'plantillas/Admin/admin.html',
    controller: 'AdminCtrl'

  })

  .state('perfilUsuario', {
    url: '/perfilUsuario/:idUsuario',
    templateUrl: 'plantillas/Admin/perfilUsuario.html',
    controller: 'AdminUserProfileCtrl'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');


});
