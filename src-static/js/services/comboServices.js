app.factory('comboServices', function ($http) {
	var services = {};

	services.getCombos = function () {
		return $http.get('/service/combos');
	}

	return services;
});
