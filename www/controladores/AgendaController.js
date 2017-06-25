angular.module('starterMiApp.contrsAgenda', [])

.controller('AgendaCtrl',['$scope', '$http', '$state','$stateParams','$ionicPopup','$ionicModal','$compile', '$timeout','$filter','$ionicLoading','uiCalendarConfig','servAgenda','servClientes','IonicClosePopupService', function($scope,$http,$state,$stateParams,$ionicPopup,$ionicModal,$compile, $timeout,$filter,$ionicLoading,uiCalendarConfig,servAgenda,servClientes,IonicClosePopupService){

    $scope.sesionIdUser = localStorage.getItem("idUser");

    $scope.nombreUsuario = localStorage.getItem("nombreUser");

    /*Eventos para el calendario*/
    $scope.events = [];
    $scope.eventSources = [];


    //Listar los citas en el calendario
    servAgenda.listarCitas($scope.sesionIdUser).then(function(data){
      if(data==-1)
      {
        /*El usuario no tiene citas.*/
      }
      else
      {
        $scope.events = {
                events: data
        };
        $scope.eventSources.push($scope.events);
      }
    });


    $ionicModal.fromTemplateUrl('plantillas/Agenda/modalModificarCita.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalModificarCita = modal;
    });
    
    $scope.openModalModificarCita = function(dataCita) {
    // Incializar formulario por defecto cuando se abra el modal
    var idCliente = dataCita.idCliente;
    var hIni = moment(dataCita.start._i).toDate();
    var hFin = moment(dataCita.end._i).toDate();
      $scope.form = {};
      $scope.form = {
        idCita: dataCita.id,
        tituloCita: dataCita.title,
        fecha: new Date(dataCita.start),
        horaIni:  hIni,
        horaFin:  hFin,
        idCliente: dataCita.idCliente
      };

      for(var i = 0; i<$scope.nombres.length; i++)
      {
        if($scope.nombres[i].id_cliente == idCliente)
        {
          var indexCliente = i;
        }
      }
      $scope.form['objClienteExistente'] = $scope.nombres[indexCliente];


      $scope.modalModificarCita.show();
    }

    $scope.closeModalModificarCita = function() {
      
      $scope.modalModificarCita.hide();
      $scope.modalModificarCita.remove();
      $scope.form = {};
      $ionicModal.fromTemplateUrl('plantillas/Agenda/modalModificarCita.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalModificarCita = modal;
      });
    };



    /*----------------------------- POPUP DE GESTIONAR CITA DE UN CLIENTE ----------------------*/
    /*----------------------------- CAJA - MODIFICAR CITA - BORRAR CITA  -----------------------*/
    $scope.alertOnEventClick = function( dataCita, jsEvent, view){

        var idCliente = dataCita.idCliente;
        $scope.nombreCliente = dataCita.title;

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
                $state.go('sidemenu.caja',{'nombreCliente' : dataCita.title, 'fechaCita': dataCita.start, 'idCliente': idCliente},{reload:false});
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
                  var myPopup = $ionicPopup.show({
                    title: 'Borrar Cita',
                    subTitle: '¿Estas seguro que deas borrar la cita de <b>' +dataCita.title+ '</b> ?',
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
                            servAgenda.borrarCita(dataCita.id).then(function(){
                              $state.go($state.current,null,{reload:true});
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
    /*--------------------------------FIN POPUP---------------------------*/

      $scope.uiConfig = {
        calendar: {
            lang: 'es',
            locale: 'es',
            height: 'auto',
            editable: false,
            droppable: false,
            allDaySlot: false,
            titleFormat: 'DD MMMM YYYY',
            slotLabelFormat: 'HH:mm',
            slotDuration: '00:15:00',
            defaultView: 'agendaDay',
            minTime: '08:00',
            maxTime: '21:00',
            header: {
                left: 'list, month, agendaWeek, agendaDay',
                center: 'title',
                right: 'prev,today,next'
            },
            buttonText: {
              today:  'Hoy',
              list:   'Día actual',
              month:  'Mes',
              week:   'Semana',
              day:    'Agenda'
          },
          eventLimit: true,//limita los eventos en la vista Mes
          eventLimitText: "Ver más",
          views: {
               month: {
                 eventLimit: 3
               }
           },
            eventClick: $scope.alertOnEventClick
        }
    };


    // 'plantillas/modalInsertarCliente.html' URL para ejecutar en el movil
    $ionicModal.fromTemplateUrl('plantillas/Agenda/modalInsertarCita.html', {
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
    };



    //Listar los clientes en el datalist del modal
    servClientes.listarClientes('citasClientes',$scope.sesionIdUser).then(function(data){
      if(data==-1)
      {
        // No hay clientes.
      }
      else
      {
        $scope.nombres = data;
      }
    });

    $scope.tipoCliente = [
    {idTipoCliente: -77,tipo:'Genérico'},
    {idTipoCliente: 66,tipo:'Existente'}
    ]; 

    //Inciar select tipoCliente
    $scope.tipoInsert = {
      obj: $scope.tipoCliente[0]
    }

    $scope.tipoEdit = {
      obj: $scope.tipoCliente[0]
    }

    $scope.showTipoClienteInsert = $scope.tipoCliente[0].idTipoCliente;
    $scope.showTipoClienteEdit = $scope.tipoCliente[0].idTipoCliente;

    $scope.getTipoClienteInset = function(tipoCliente)
    {
      $scope.showTipoClienteInsert = tipoCliente.idTipoCliente;
    }

    $scope.getTipoClienteEdit = function(tipoCliente)
    {
      $scope.showTipoClienteEdit = tipoCliente.idTipoCliente;
    }


      /*--------------------------- INSERTAR CITA ------------------------------*/
      $scope.clickInsertarCita = function(form,tipoCliente){
      $ionicLoading.show();
      var formattedDate = moment(form.fecha).format('YYYY-MM-DD');
      var formattedHourIni = moment(form.horaIni).format('HH:mm:ss');

      var formattedHourFin = moment(form.horaIni).add(30, 'minutes').format('HH:mm:ss');  // see the cloning?

      var startCita = formattedDate.concat("T",formattedHourIni);
      var finCita   = formattedDate.concat("T",formattedHourFin);

      //Convertir moment formato al new Date de javascript
      var finHora = moment(finCita).toDate();

      switch(tipoCliente)
      {
        //Clientes existentes
        case 66:

          /*Inciar form con los datos introducidos por 
          el usuarios para clientes existentes*/
          $scope.form = {
            objClienteExistente: form.objClienteExistente,
            fecha: form.fecha,
            horaIni:  form.horaIni,
            horaFin:  finHora
          };


          //Objeto con propiedades para insertar la cita correctamente en la BBDD
          // para que luego al realizar la visualizacion de las citas sea mas facil.
          var idCliente = form.objClienteExistente.id_cliente;
          var idTipo = form.objClienteExistente.id_tipo;
          var nombre = form.objClienteExistente.nombre;
          var apellido1 = form.objClienteExistente.apellido1;
          var apellido2 = form.objClienteExistente.apellido2;
          if(apellido2!=='')
          {
            var nombreCompleto = nombre.concat(' ',apellido1,' ', apellido2);
          }
          else
          {
            var nombreCompleto = nombre.concat(' ',apellido1);
          }
          
          $scope.formattedFormCita = {
            tipoCliente: tipoCliente,
            title:nombreCompleto,
            start:startCita,
            end:finCita,
            idUser: $scope.sesionIdUser,
            idTipo: idTipo,
            idCliente: idCliente  
          };

        break;

        /*Inciar form con los datos introducidos por 
        el usuarios para clientes generales*/
        case -77:
          $scope.formattedFormCita = {
            tipoCliente: tipoCliente,
            nombre: form.nombre,
            apellido1: form.apellido1,
            start:startCita,
            end:finCita,
            idUser: $scope.sesionIdUser
          };
        break;
      }


      //Obtener hora cita
      var auxHorasIni   = new Date (form.horaIni);
      var horasIni      = auxHorasIni.getHours();

      var auxHorasFin   = new Date (form.horaFin);
      var horasFin      = auxHorasFin.getHours();

      if(horasIni > horasFin || horasFin < horasIni )
      {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
             title: 'Error al añadir cita',
             template: 'La hora de inicio tiene que ser menor que la hora fin y viceversa',
             okText: 'Intentar de nuevo', 
             okType: 'button-assertive'
        });
      } 
      else
      {
        servAgenda.insertarCita($scope.formattedFormCita).then(function(servResponse){
          if(servResponse==-1)
          {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                   title: 'Error al añadir cita',
                   template: 'Ha acurrido un error a la hora de insertar la cita.',
                   okText: 'Intentar de nuevo', 
                   okType: 'button-assertive'
              });
          }
          else
          {
            $state.go('sidemenu.agenda',null,{reload:true});
            $scope.modal.hide();
          }
        });
      }
    };
    /*--------------------------- FIN INSERTAR CITA ------------------------------*/


    /*--------------------------- MODIFICAR CITA ---------------------------------*/
    $scope.clickModificarCita = function(form){
      var nombreClienteCita = $scope.nombreCliente;
      var formattedDate = moment(form.fecha).format('YYYY-MM-DD');
      var formattedHoraIni = moment(form.horaIni).format('HH:mm:ss');
      var formattedHoraFin = moment(form.horaIni).add(30, 'minutes').format('HH:mm:ss');  // see the cloning?

      var startCita = formattedDate.concat("T",formattedHoraIni);
      var finCita = formattedDate.concat("T",formattedHoraFin);

      var finHora = moment(finCita).toDate();


      /*Inciar form con los datos introducidos por 
      el usuarios para clientes existentes*/
      $scope.form = {
        objClienteExistente: form.objClienteExistente,
        fecha: form.fecha,
        horaIni:  form.horaIni,
        horaFin:  finHora
      };


          //Objeto con propiedades para insertar la cita correctamente en la BBDD
          // para que luego al realizar la visualizacion de las citas sea mas facil.
          var idCliente = form.objClienteExistente.id_cliente;
          var idTipo = form.objClienteExistente.id_tipo;
          var nombre = form.objClienteExistente.nombre;
          var apellido1 = form.objClienteExistente.apellido1;
          var apellido2 = form.objClienteExistente.apellido2;
          if(apellido2!=='')
          {
            var nombreCompleto = nombre.concat(' ',apellido1,' ', apellido2);
          }
          else
          {
            var nombreCompleto = nombre.concat(' ',apellido1);
          }

          //Formulario que sera enviado para realizar la modificacion de la cita
          $scope.formAdaptado = {
            idCita: form.idCita,
            title: nombreCompleto,
            start: startCita,
            end: finCita,
            idTipo: idTipo,
            idCliente: idCliente  
          }

      var myPopup = $ionicPopup.show({
      title: 'Modificar cita',
      subTitle: '<span>¿Estás seguro de que deseas modificar la cita de <b>'+nombreClienteCita+' </b>?</span>',
      buttons: [
        {
         text: '<b>No</b>',
         type: 'button-dark',
          onTap: function(e) {
            $ionicLoading.show();
            if (e)
            {
              $ionicLoading.hide();              
              $scope.form = {
                objClienteExistente: form.objClienteExistente,
                fecha: form.fecha,
                horaIni:  form.horaIni,
                horaFin:  finHora
              };
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
                servAgenda.modificarCita($scope.formAdaptado).then(function(){
                  $state.go($state.current,null,{reload:true});
                  $scope.modalModificarCita.hide();
                });
            }
          }
        }
      ]
      });
    };
    /*--------------------------- FIN MODIFICAR CITA ------------------------------*/

}]) // Fin AgendaCtrl