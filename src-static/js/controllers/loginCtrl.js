app.controller('loginCtrl', function ($scope, $location, $localStorage, loginServices) {
	$scope.form = {
		username: '',
		password: ''
	};
	$scope.error = false;
	$scope.errorMsg = '';

	$scope.login = function () {
		if (!$scope.form.username || !$scope.form.password) {
			return;
		}

		$scope.error = false;
		loginServices.login($scope.form).then(loginSuccess, loginError);
	}

	function loginSuccess(response) {
		$localStorage.token = response.data.token;
		$location.path('/');
	}

	function loginError(response) {
		$scope.error = true;
		$scope.errorMsg = response.data.message;
	}

});
