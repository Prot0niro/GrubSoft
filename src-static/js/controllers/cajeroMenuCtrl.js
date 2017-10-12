app.controller('cajeroMenuCtrl', function ($scope) {
	var _this = this;

	$scope.showItem = function (item) {
		return !$scope.catSelected || item.categoria === $scope.catSelected;
	}

	$scope.addToCarrito = function (item) {
		$scope.carrito.push(item);
	}

});
