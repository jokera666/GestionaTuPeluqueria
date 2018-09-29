angular.module('starterMiApp.servsSignup', [])


.service('servSignup',['$q','$http','baseURL', function($q, $http, baseURL){
    return{
        registrarUsuario: signUp
    }

    function signUp(datosForm)
    {
        var defered = $q.defer();
        var promesa = defered.promise;

        var url = baseURL+"Signup.php";
        var data = datosForm;
        var config = {
            headers : {'Content-Type' : 'application/json'}
        }

        $http.post(url,data,config)
            .success(function(respuesta){
                defered.resolve(respuesta);
            })
            .error(function(err){
                defered.reject(err);
            });
        return promesa;
    }

}])