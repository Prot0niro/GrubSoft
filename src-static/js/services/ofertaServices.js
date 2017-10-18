app.factory('ofertaServices', function ($http) {
	var services = {};

	services.getOfertasDelDia = function () {
		return $http.get('/service/ofertas/hoy');
	}

	return services;
});
