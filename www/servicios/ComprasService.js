angular.module('starterMiApp.servsCompras', [])

.service('servCompras', ['$q', '$http', 'baseURL', function($q, $http, baseURL){
	
	return{
		listarFacturas: listInvoice,
		insertarFactura: insertInvoice,
		listarMarcas: 	 listBrands,
		listarPerfilFactura: listInvoiceProfile,
		eliminarLineaFactura: deleteInvoiceLine,
		modificarPerfilFactura: editInvoiceProfile,
		eliminarFactura: deleteInvoice

	}

	function listInvoice(idRol,getBy)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/listarFacturas.php';
		var data = {'idRol':idRol,'getBy':getBy};
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function insertInvoice(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/insertarFactura.php';
		var data = datosForm;
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function listBrands(idRol,getBy)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/listarMarcas.php';
		var data = {'idRol':idRol,'getBy':getBy};
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function listInvoiceProfile(idCompra)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/listarPerfilFactura.php';
		var data = {'idCompra':idCompra};
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function deleteInvoiceLine(idCompra,idLinea,idProducto,unidades)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/eliminarLineaFactura.php';
		var data = {'idCompra':idCompra,'idLinea':idLinea,'idProducto':idProducto,'unidades':unidades};
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function editInvoiceProfile(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/modificarPerfilFactura.php';
		var data = datosForm;
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}

	function deleteInvoice(datosForm)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = baseURL+'ComprasFacturas/eliminarFactura.php';
		var data = datosForm;
		var config = {
			headers : {'Content-Type' : 'application/json'}
		}

		$http.post(url,data,config)
			.success(function(response){
				defered.resolve(response);
			})
			.error(function(err){
				defered.reject(err);
			});

		return promesa;
	}
}])