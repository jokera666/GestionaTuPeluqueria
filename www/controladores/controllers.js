angular.module('starterMiApp.controllers', [])

.controller('LoginCtrl', ['$scope','$state','$rootScope','$ionicLoading','servLogin', function($scope,$state,$rootScope,$ionicLoading,servLogin){
  
    loginForm.$error = {
      'required': true
    }

  $scope.enviarFormulario = function(form){

    $ionicLoading.show();

    $scope.animacion = "";
    $scope.msgError = "Usuario o contraseña incorrecto."; 


      //var serviceUrl = 'file:///android_asset/www/'; // esta variable es necesaria para que funcione en el dispositivo.
      //$http.get(serviceUrl+'js/data.json') // cargar los datos del fichero data.json

      servLogin.iniciarSesion(form).then(function(servResponse){

        $scope.respuestaServ = servResponse;

          if($scope.respuestaServ==-1)
          {
            $ionicLoading.hide();
            $scope.visibilidadMensaje = true; 
            $scope.animacion = "animated shake";
            return;
          }
          else 
          {
           $scope.visibilidadMensaje = false;
           //var myError = angular.element( document.querySelector( '#msgError' ) );
           //myError.remove();   //removes element
           
           //$state.go('sidemenu.agenda' ,{param1: $scope.userServ, param2: form.pass});
           $rootScope.globalVarSesion = $scope.respuestaServ;
           $state.go('sidemenu.agenda',null,{reload:true});
           //form.user = "";
           //form.pass = "";
          }
      });
  }// Fin de enviarFormulario

}]) //Fin LoginCtrl


.controller('SidemenuCtrl', ['$scope', '$state','$ionicPopup','$ionicLoading','servLogout', function($scope, $state,$ionicPopup,$ionicLoading,servLogout){

  $scope.cerrarSesion = function() {

  var myPopup = $ionicPopup.show({
    title: 'Salir',
    subTitle: '¿Estás seguro de que deseas salir de la aplicación?',
    buttons: [
      { text: '<b>No</b>',
        type: 'button-dark' 
      },
      {
        text: '<b>Sí</b>',
        type: 'button-positive',
        onTap: function(e) {
          $ionicLoading.show();
          if (e)//Pulsar Sí
          { 
            servLogout.cerrarSesion().then(function(data){
              $state.go('login',null,{reload:true});
            });   
          }
          else//Pulsar No
          {
            return; 
          }
        }
      }
    ]
  });
}


}]) // Fin SidemenuCtrl

//.controller('AgendaCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){
//.controller('AgendaCtrl',['$scope', '$http', '$state','$stateParams','$ionicPopup','$ionicModal','uiCalendarConfig', function($scope, $compile, $timeout,$ionicPopup,$ionicModal,uiCalendarConfig,$http) {
.controller('AgendaCtrl',['$scope', '$http', '$state','$stateParams','$ionicPopup','$ionicModal','$compile', '$timeout','uiCalendarConfig', function($scope,$http,$state,$stateParams,$ionicPopup,$ionicModal,$compile, $timeout,uiCalendarConfig) {

    console.log($scope.globalVarSesion); 
    $scope.nombreUsuario = $scope.globalVarSesion;
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            //url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'Europe/Madrid' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 21, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28, 09, 15),end: new Date(y, m, 28, 10, 25),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
        date.start = new Date();
        console.log('entro');
        alert(date.title+' fue pulsada '+date.start);
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      console.log('entro');
       $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function(titulo,anyo,mes,dia,hIni,mIni,hFin,mFin) {
      $scope.events.push({
        title: titulo,
        start: new Date(anyo, mes, dia, hIni, mIni),
        end: new Date(anyo, mes, dia, hFin, mFin),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    // $scope.eventRender = function( event, element, view ) {
    //     element.attr({'tooltip': event.title,
    //                   'tooltip-append-to-body': true});
    //     $compile(element)($scope);
    // };

      $scope.uiConfig = {
        calendar: {
            lang: 'es',
            locale: 'es',
            height: 550,
            editable: false,
            droppable: false,
            allDaySlot: false,
            titleFormat: 'DD MMMM YYYY',
            slotLabelFormat: 'HH:mm',
            slotDuration: '00:15:00',
            defaultView: 'agendaDay',
            minTime: '08:00',
            maxTime: '21:00',
            drop: $scope.drop,
            header: {
                left: 'list, month, basicDay, agendaWeek',
                center: 'title',
                right: 'prev,today,next'
            },
            buttonText: {
              // prev: 'Anterior',
              // next: 'Siguiente',
              // prevYear: '&nbsp;&lt;&lt;&nbsp;',
              // nextYear: '&nbsp;&gt;&gt;&nbsp;',
              today:  'Hoy',
              month:  'Mes',
              week:   'Semana',
              day:    'Dia Actual'
          },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
            //eventRender: $scope.eventRender
        }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

    // 'plantillas/modalInsertarCliente.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/modalInsertarCita.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };



        var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarClientes.php";
        var query = {'q':'nombreCompleto'};
        $http({
            method: 'POST',
            url: url,
            data: query,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
              console.log(response.data);
              $scope.nombresCompletos = response.data.nombreClientes;
              console.log($scope.nombresCompletos);
        }, function errorCallback(error) {
            console.log(error);
        });


      $scope.clickInsertarCita = function(form){
  
      var titulo = form.tituloCita;
      alert(titulo);
      
      //Obtener fecha cita
      var fechaAux  = new Date (form.fecha);
      var dia   = fechaAux.getDate();
      var mes   = fechaAux.getMonth(); // +1 porque enero es la posicion 0
      var anyo  = fechaAux.getFullYear();
      console.log(dia+' '+mes+' '+anyo);

      //Obtener hora cita
      var auxHorasIni   = new Date (form.horaIni);
      var horasIni      = auxHorasIni.getHours();
      var minutosIni    = auxHorasIni.getMinutes();
      console.log('Hora de inicio cita: '+horasIni+' '+minutosIni);

      var auxHorasFin   = new Date (form.horaFin);
      var horasFin      = auxHorasFin.getHours();
      var minutosFin    = auxHorasFin.getMinutes();
      console.log('Hora de inicio cita: '+horasFin+' '+minutosFin);
      
      if(horasIni > horasFin || horasFin < horasIni )
      {
        alert('ERROR: La hora de inicio tiene que ser menor que la hora fin y viceversa');
      } 
      else
      {
        var myPopup = $ionicPopup.show({
        title: 'Añadir cita',
        subTitle: '<span>¿Estás seguro de que deseas añadir la cita?</span>',
        buttons: [
          { 
            text: '<b>No</b>',
            type: 'button-dark'
          },
          {
            text: '<b>Sí</b>',
            type: 'button-positive',
            onTap: function(e) {
              //$ionicLoading.show();
              if (e)
              {            
                $scope.addEvent(titulo,anyo,mes,dia,horasIni,minutosIni,horasFin,minutosFin);
                $scope.closeModal();
              }
              else
              {
                //El boton NO de no hacer nada
                return; 
              }
            }
          }
        ]
        });

      }

    };



}]) // Fin AgendaCtrl

.controller('ClientesCtrl', ['$scope', '$state','$stateParams','$ionicLoading','$ionicPopup','servClientes','$ionicModal', function($scope, $state,$stateParams,$ionicLoading,$ionicPopup,servClientes,$ionicModal){
  
    servClientes.getNombreCompleto().then(function(data){
      $scope.clientes = data;
    });

    // 'plantillas/modalInsertarCliente.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/modalInsertarCliente.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };


    $scope.clickInsertarCliente = function (form){
      var myPopup = $ionicPopup.show({
      title: 'Añadir cliente',
      subTitle: '<span>¿Estás seguro de que deseas añadir el cliente?</span>',
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
                servClientes.insertarCliente(form).then(function(){
                  $state.go('sidemenu.clientes',null,{reload:true});
                  $scope.modal.hide();
                });
            }
            else
            {
              //El boton NO de no hacer nada
              return; 
            }
          }
        }
      ]
      });
    };


  $scope.borrarBuscador = function(){
    $scope.buscador = '';
  };

}]) // Fin ClientesCtrl

.controller('ProductosCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     // console.log($stateParams);
     // $scope.parametro = $stateParams.param1;
     // $scope.contrasena = $stateParams.param2;
}]) // Fin ProductosCtrl

.controller('VentasCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.nombreUsuario = $scope.globalVarSesion;
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin VentasCtrl

.controller('SeccionesCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin SeccionesCtrl

.controller('ServiciosCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin ServiciosCtrl

.controller('FacturasCtrl', ['$scope', '$http', '$state','$stateParams', function($scope, $http, $state,$stateParams){

     console.log($stateParams);
     $scope.parametro = $stateParams.param1;
     $scope.contrasena = $stateParams.param2;
}]) // Fin FacturasCtrl




.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

  $scope.btnAnadirCliente = function (){
    alert('Копчето не работи. :)');
  };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
     console.log($stateParams);
     $scope.playId = $stateParams.playlistId;
     $scope.titulo = $stateParams.titulo;
})


.controller('ClientePerfilCtrl', ['$scope', '$http', '$state','$stateParams','$ionicLoading','$ionicPopup', function($scope, $http, $state,$stateParams,$ionicLoading,$ionicPopup){



    clienteForm.$error = {
      'required': true
    }

    console.log($stateParams.idCliente);
    $scope.id = $stateParams.idCliente;


      var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarPerfilCliente.php";

       $http({
          method: 'POST',
          url: url,
          data: $stateParams.idCliente,
          headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
      }).then(function successCallback(dataClientes) {
          //console.log(dataClientes);
          $scope.data = dataClientes.data.clientes[0];
          $scope.form = this;
          $scope.form = $scope.data;
          this.id_cliente = $scope.data.id_cliente;
          this.nombre = $scope.data.nombre;
          this.apellido1 = $scope.data.apellido1;
          this.apellido2 = $scope.data.apellido2;
          this.telefono = $scope.data.telefono;



          $scope.borrarCliente = function (){
                console.log(this.form.id_cliente);
          };

          $scope.reiniciarForm = function(){
           $scope.form = angular.copy($scope.data);
            
          };
          $scope.reiniciarForm();

      }, function errorCallback(error) {
          console.log('Error '+error);
      });


      $scope.modificarCliente = function (){
          var url = "http://gestionestetica.fonotecaumh.es/Clientes/modificarPerfilCliente.php";
          $http({
              method: 'POST',
              url: url,
              data: this.form,
              headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
          }).then(function successCallback(response) {
                $state.go('sidemenu.clientes');
                window.location.reload();

          }, function errorCallback(error) {
              console.log('Error '+error);
          });
      }; // Fin modificarCliente



    $scope.clickModificarCliente = function (clienteForm){

      if(clienteForm.$valid==true)
      {
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
                $scope.modificarCliente();
              }
              else
              {
                //El boton NO de no hacer nada
                return; 
              }
            }
          }
        ]
        });
      }
      else
      {
        alert('Error al guardar los datos');
        return;
      }


    };


    $scope.eliminarCliente = function (){
        var url = "http://gestionestetica.fonotecaumh.es/Clientes/eliminarPerfilCliente.php";
        $http({
            method: 'POST',
            url: url,
            data: this.form.id_cliente,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
              $state.go('sidemenu.clientes');
              window.location.reload();
        }, function errorCallback(error) {
            console.log('Error '+error);
        });
    }; // Fin eliminarCliente


    $scope.clickEliminarCliente = function (){
      var myPopup = $ionicPopup.show({
      title: 'Borrar cliente',
      subTitle: '<span>¿Estás seguro de que deseas eliminar el cliente?</span>',
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
              $scope.eliminarCliente();
            }
            else
            {
              //El boton NO de no hacer nada
              return; 
            }
          }
        }
      ]
      });
    };


}])