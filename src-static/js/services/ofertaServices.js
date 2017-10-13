app.factory('ofertaServices', function ($http) {
	var services = {};

	services.getOfertas = function () {
		return $http.get('/service/ofertas');
	}

	return services;
});
