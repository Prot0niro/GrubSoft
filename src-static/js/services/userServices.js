app.factory('userServices', function ($http) {
	var services = {};

	services.isUserAdmin = function () {
		return $http.get('/service/user/admin');
	}

	return services;
});
