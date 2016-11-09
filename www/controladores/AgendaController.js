angular.module('starterMiApp.contrsAgenda', [])

.controller('AgendaCtrl',['$scope', '$http', '$state','$stateParams','$ionicPopup','$ionicModal','$compile', '$timeout','$filter','uiCalendarConfig','servAgenda','servClientes', function($scope,$http,$state,$stateParams,$ionicPopup,$ionicModal,$compile, $timeout,$filter,uiCalendarConfig,servAgenda,servClientes){

    $scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);
    console.log($scope.globalSesionUserName);
    

    $scope.nombreUsuario = localStorage.getItem("nombreUser");
    
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    $scope.events = [];

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            //url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'Europe/Madrid' // an option!
    };
    // /* event source that contains custom events on the scope */
    // $scope.events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 21, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28, 09, 15),end: new Date(y, m, 28, 10, 25),url: 'http://google.com/'}
    // ];
    // console.log($scope.events);

    //Listar los citas en el calendario
    servAgenda.listarCitas($scope.sesionIdUser).then(function(data){
      //console.log(data);
      if(data==-1)
      {
        console.log("No tiene citas introducidos");
      }
      else
      {
        $scope.events = {
                color: 'blue',
                textColor: 'white',
                events: data
        };
        $scope.eventSources.push($scope.events);
        //console.log($scope.events);
      }
    });


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
        console.log(date);
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
                left: 'list, month, agendaWeek, basicDay, agendaDay',
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
    $scope.eventSources = [$scope.eventSource, $scope.eventsF];
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
    }

    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove();
      $ionicModal.fromTemplateUrl('plantillas/modalInsertarCita.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    };


    // Incializar formulario por defecto
    $scope.form = {
       fecha: new Date()
     };
    //Listar los clientes en el datalist del modal
    servClientes.getNombreCompleto($scope.sesionIdUser).then(function(data){
      if(data==-1)
      {
          $scope.form = {
             tituloCita: 'No hay clientes'
          };
      }
      else
      {
        console.log(data);
        $scope.nombres = data;   
      }
    });



        // var url = "http://gestionestetica.fonotecaumh.es/Clientes/listarClientes.php";
        // var query = {'q':'nombreCompleto'};
        // $http({
        //     method: 'POST',
        //     url: url,
        //     data: query,
        //     headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
        // }).then(function successCallback(response) {
        //       console.log(response.data);
        //       $scope.nombresCompletos = response.data.nombreClientes;
        //       //console.log($scope.nombresCompletos);
        // }, function errorCallback(error) {
        //     console.log(error);
        // });


      $scope.clickInsertarCita = function(form){
      console.log(form);

      
      var formattedDate = moment(form.fecha).format('YYYY-MM-DD');
      var formattedHourIni = moment(form.horaIni).format('HH:mm:ss');
      var formattedHourFin = moment(form.horaFin).format('HH:mm:ss');
      var startCita = formattedDate.concat("T",formattedHourIni);
      var finCita   = formattedDate.concat("T",formattedHourFin);
      console.log(startCita);
      console.log(finCita);






      var titulo = form.tituloCita;
      alert(titulo);

      // array de objetos
      // $scope.formattedFormCita = [
      //   {title:form.tituloCita},
      //   {start:startCita},
      //   {fin:finCita}
      // ];

      //Objeto con propiedades
       $scope.formattedFormCita = {
        title:form.tituloCita,
        start:startCita,
        end:finCita,
        idUser: $scope.sesionIdUser 
       };

      console.log($scope.formattedFormCita);




      
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
                
                   //Insertar cita en el calendario
                  servAgenda.insertarCita($scope.formattedFormCita).then(function(data){
                    //console.log(data);
                    if(data==-1)
                    {
                      console.log("Error al insertar la cita.");
                    }
                    else
                    {
                      console.log("Cita insertada correctamente.")
                      $state.go('sidemenu.agenda',null,{reload:true});
                      $scope.modal.hide();
                    }
                  });



                //$scope.addEvent(titulo,anyo,mes,dia,horasIni,minutosIni,horasFin,minutosFin);
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