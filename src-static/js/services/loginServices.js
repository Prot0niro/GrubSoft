app.factory('loginServices', function ($http) {
	var services = {};

	services.login = function (form) {
		return $http.post('/login', form);
	}

	return services;
});
