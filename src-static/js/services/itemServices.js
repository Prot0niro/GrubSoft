app.factory('itemServices', function ($http) {
	var services = {};

	services.getItems = function () {
		return $http.get('/service/items');
	}

	return services;
});
