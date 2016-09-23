// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starterMiApp', ['ionic', 'starterMiApp.controllers','starterMiApp.service','ngAnimate'])

.run(function($ionicPlatform,$state,$ionicSideMenuDelegate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
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

    if ($state.current.name=="login")
    {
      navigator.app.exitApp();
    }

    if ($state.current.name=="sidemenu.single" || $state.current.name=="sidemenu.perfil")
    {
      navigator.app.backHistory();
    }

    else
    {
       $ionicSideMenuDelegate.toggleLeft();
    }

  }, 100);

})

.constant('$ionicLoadingConfig', {
              template: '<ion-spinner icon="spiral" class="spinner-light"></ion-spinner><p>Cargando...</p>',
              hideOnStateChange: true
  })

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.navBar.alignTitle("center");
  $ionicConfigProvider.views.maxCache(0);
  
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'plantillas/login.html',
    controller: 'LoginCtrl'
  })


  .state('sidemenu', {
    url: '/side',
    abstract: true,
    templateUrl: 'plantillas/menu.html',
    controller: 'SidemenuCtrl'
  })

 
  .state('sidemenu.perfil', {
    url: '/clientes/:idCliente',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/perfilCliente.html',
        controller: 'ClientePerfilCtrl'
      }
    }
  })


  .state('sidemenu.agenda', {
      url: '/agenda',
      views: {
        'menuContent': {
          templateUrl: 'plantillas/agenda.html',
          controller: 'AgendaCtrl'
        }
      }
  })

  .state('sidemenu.clientes', {
    url: '/clientes',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/clientes.html',
        controller: 'ClientesCtrl'
      }
    }
  })

  .state('sidemenu.productos', {
    url: '/productos',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/productos.html',
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
        templateUrl: 'plantillas/secciones.html',
        controller: 'SeccionesCtrl'
      }
    }
  })

  .state('sidemenu.servicios', {
    url: '/servicios',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/servicios.html',
        controller: 'ServiciosCtrl'
      }
    }
  })

  .state('sidemenu.facturas', {
    url: '/facturas',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/facturas.html',
        controller: 'FacturasCtrl'
      }
    }
  })

  .state('sidemenu.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'plantillas/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
  })

  .state('sidemenu.single', {
    url: '/playlists/:playlistId/:titulo',
    views: {
      'menuContent': {
        templateUrl: 'plantillas/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');


});
