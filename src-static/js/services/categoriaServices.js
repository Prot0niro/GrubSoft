app.factory('categoriaServices', function ($http) {
	var services = {};

	services.getCategorias = function () {
		return $http.get('/service/categorias');
	}

	return services;
});
