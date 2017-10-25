app.controller('logoutCtrl', function ($scope, $location, $route, $localStorage) {

	$scope.showCerrarSesion = function () {
		return $localStorage.token ? true : false;
	}

	$scope.cerrarSesion = function () {
		$localStorage.token = '';
		$location.path('/');
		$route.reload();
	}

});
