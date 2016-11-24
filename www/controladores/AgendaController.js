angular.module('starterMiApp.contrsAgenda', [])

.controller('AgendaCtrl',['$scope', '$http', '$state','$stateParams','$ionicPopup','$ionicModal','$compile', '$timeout','$filter','$ionicLoading','uiCalendarConfig','servAgenda','servClientes','IonicClosePopupService', function($scope,$http,$state,$stateParams,$ionicPopup,$ionicModal,$compile, $timeout,$filter,$ionicLoading,uiCalendarConfig,servAgenda,servClientes,IonicClosePopupService){

    $scope.sesionIdUser = localStorage.getItem("idUser");
    console.log('Usuario con id de sesion---> '+$scope.sesionIdUser);
    

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


    $ionicModal.fromTemplateUrl('plantillas/modalModificarCita.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalModificarCita = modal;
    });
    
    $scope.openModalModificarCita = function(dataCita) {
    // Incializar formulario por defecto cuando se abra el modal
    var hIni = moment(dataCita.start._i).toDate();
    var hFin = moment(dataCita.end._i).toDate();
      $scope.form = {};
      $scope.form = {
        idCita: dataCita.id,
        tituloCita: dataCita.title,
        fecha: new Date(dataCita.start),
        horaIni:  hIni,
        horaFin:  hFin
      };
      $scope.modalModificarCita.show();
    }

    $scope.closeModalModificarCita = function() {
      
      $scope.modalModificarCita.hide();
      $scope.modalModificarCita.remove();
      $scope.form = {};
      $ionicModal.fromTemplateUrl('plantillas/modalModificarCita.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalModificarCita = modal;
      });
    };

    $scope.clickModificarCita = function(form){


      var formattedDate = moment(form.fecha).format('YYYY-MM-DD');
      var formattedHoraIni = moment(form.horaIni).format('HH:mm:ss');
      var formattedHoraFin = moment(form.horaFin).format('HH:mm:ss');

      var startCita = formattedDate.concat("T",formattedHoraIni);
      var finCita = formattedDate.concat("T",formattedHoraFin);


      $scope.formAdaptado = {
        idCita:  form.idCita,
        titulo:  form.tituloCita,
        horaIni: startCita,
        horaFin: finCita
      }

      var myPopup = $ionicPopup.show({
      title: 'Modificar cita',
      subTitle: '<span>¿Estás seguro de que deseas modificar la cita?</span>',
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
                servAgenda.modificarCita($scope.formAdaptado).then(function(){
                  $state.go('sidemenu.agenda',null,{reload:true});
                  $scope.modalModificarCita.hide();
                });
            }
          }
        }
      ]
      });
    };


    /* alert on eventClick */
    $scope.alertOnEventClick = function( dataCita, jsEvent, view){
        //alert(date.title + ' was clicked ');
        console.log(dataCita);

        var myPopup = $ionicPopup.show({
        title: 'Gestionar cita de: <b>'+dataCita.title+'</b>',
        cssClass: 'alertStyle',
        buttons: [
          { 
            text: '<b>Gestionar cita</b>',
            type: 'button-balanced',
            onTap: function(e){
              if(e)
              {
                alert('GESTIONAR CITA !!!');
              }
              else
              {
                return;
              }
            }
          },
          {
            text: '<b>Modificar cita</b>',
            type: 'button-positive',
            onTap: function(e) {
              //$ionicLoading.show();
              if (e)
              {
                  $scope.openModalModificarCita(dataCita);
              }
              else
              {
                return; 
              }
            }
          },
          {
            text: '<b>Borrar cita</b>',
            type: 'button-assertive',
            onTap: function(e) {
              //$ionicLoading.show();
              if (e)
              {            
                alert('BORRAR CITA !!!!!');
              }
              else
              {
                return; 
              }
            }
          }
        ]
        });
        //Cerrar popup cuando pulses fuera
        IonicClosePopupService.register(myPopup);




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
    // Incializar formulario por defecto cuando se abra el modal
    $scope.form = {
       fecha: new Date()
     };
      $scope.modal.show();
    }

    $scope.closeModal = function() {
      
      $scope.modal.hide();
      $scope.modal.remove();
      $scope.form = {};
      $ionicModal.fromTemplateUrl('plantillas/modalInsertarCita.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
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
        $scope.nombres = data;   
      }
    });




      $scope.clickInsertarCita = function(form){
      
      var formattedDate = moment(form.fecha).format('YYYY-MM-DD');
      var formattedHourIni = moment(form.horaIni).format('HH:mm:ss');

      var formattedHourFin = moment(form.horaIni).add(30, 'minutes').format('HH:mm:ss');  // see the cloning?

      var startCita = formattedDate.concat("T",formattedHourIni);
      var finCita   = formattedDate.concat("T",formattedHourFin);

      //Convertir moment formato al new Date de javascript
      var finHora = moment(finCita).toDate();


          //Inciar form con los datos introducidos por el usuarios
          $scope.form = {
            tituloCita: form.tituloCita,
            fecha: form.fecha,
            horaIni:  form.horaIni,
            horaFin:  finHora
          };


      //Objeto con propiedades para insertar la cita correctamente en la BBDD
      // para que luego al realizar la visualizacion de las citas sea mas facil.
       $scope.formattedFormCita = {
        title:form.tituloCita,
        start:startCita,
        end:finCita,
        idUser: $scope.sesionIdUser 
       };

      //Obtener hora cita
      var auxHorasIni   = new Date (form.horaIni);
      var horasIni      = auxHorasIni.getHours();

      var auxHorasFin   = new Date (form.horaFin);
      var horasFin      = auxHorasFin.getHours();

      if(horasIni > horasFin || horasFin < horasIni )
      {
        var alertPopup = $ionicPopup.alert({
             title: 'Error al añadir cita',
             template: 'La hora de inicio tiene que ser menor que la hora fin y viceversa',
             okText: 'Intentar de nuevo', 
             okType: 'button-assertive'
        });
      } 
      else
      {
        var myPopup = $ionicPopup.show({
        title: 'Añadir cita',
        subTitle: '<span>¿Estás seguro de que deseas añadir la cita?</span>',
        buttons: [
          { 
            text: '<b>No</b>',
            type: 'button-dark',
            onTap: function(e){
              if(e)
              {
                $scope.form = {
                  tituloCita: form.tituloCita,
                  fecha: form.fecha,
                  horaIni:  form.horaIni,
                  horaFin:  ''
                };
              }
              else
              {
                return;
              }
            }
          },
          {
            text: '<b>Sí</b>',
            type: 'button-positive',
            onTap: function(e) {
              $ionicLoading.show();
              if (e)
              {            
                  //Insertar cita en el calendario
                  servAgenda.insertarCita($scope.formattedFormCita).then(function(data){
                    //console.log(data);
                    if(data==-1)
                    {
                        var alertPopup = $ionicPopup.alert({
                             title: 'Error al añadir cita',
                             template: 'Ha habido un problema a la hora de insertar la cita.',
                             okText: 'Intentar de nuevo', 
                             okType: 'button-assertive'
                        });
                    }
                    else
                    {
                      console.log("Cita insertada correctamente.");
                      $state.go('sidemenu.agenda',null,{reload:true});
                      $scope.modal.hide();
                    }
                  });
              }
              else
              {
                return; 
              }
            }
          }
        ]
        });

      }

    };
}]) // Fin AgendaCtrl