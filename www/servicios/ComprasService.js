angular.module('starterMiApp.servsCompras', [])

.service('servCompras', ['$q', '$http', function($q, $http){
	
	return{
		listarFacturas: listInvoice,
		insertarFactura: insertInvoice,
		listarMarcas: 	 listBrands,
		listarPerfilFactura: listInvoiceProfile,
		eliminarLineaFactura: deleteInvoiceLine,
		modificarPerfilFactura: editInvoiceProfile

	}

	function listInvoice(idProveedor)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/ComprasFacturas/listarFacturas.php';
		var data = {'idProveedor':idProveedor};
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

		var url = 'http://gestionestetica.fonotecaumh.es/ComprasFacturas/insertarFactura.php';
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

		var url = 'http://gestionestetica.fonotecaumh.es/ComprasFacturas/listarMarcas.php';
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

		var url = 'http://gestionestetica.fonotecaumh.es/ComprasFacturas/listarPerfilFactura.php';
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

	function deleteInvoiceLine(idLinea,nombreProducto,unidades,idCompra)
	{
		var defered = $q.defer();
		var promesa = defered.promise;

		var url = 'http://gestionestetica.fonotecaumh.es/ComprasFacturas/eliminarLineaFactura.php';
		var data = {'idLinea':idLinea, 'nombreProducto':nombreProducto,'unidades':unidades, 'idCompra':idCompra};
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

		var url = 'http://gestionestetica.fonotecaumh.es/ComprasFacturas/modificarPerfilFactura.php';
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