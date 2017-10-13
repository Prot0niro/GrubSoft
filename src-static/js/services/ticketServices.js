app.factory('ticketServices', function ($http) {
	var services = {};

	services.calcularTotal = function (itemsIds, combosIds) {
		return $http.post('/service/combos', {
			itemsIds: itemsIds,
			combosIds: combosIds
		});
	}

	return services;
});
