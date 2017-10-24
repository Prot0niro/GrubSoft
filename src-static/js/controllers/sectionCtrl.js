app.controller('sectionCtrl', function ($scope, userServices) {
	var _this = this;
	$scope.admin = false;

	this.init = function () {
		userServices.isUserAdmin().then(isUserAdminSuccess, isUserAdminError);
	};

	function isUserAdminSuccess () {
		$scope.admin = true;
	}

	function isUserAdminError () {
		$scope.admin = false;
	}

	_this.init();
});
