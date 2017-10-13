app.controller('cajeroMenuCtrl', function ($scope) {

	$scope.showItem = function (item) {
		return !$scope.catSelected || item.categoria === $scope.catSelected;
	}

	$scope.addToCarrito = function (item) {
		$scope.carrito.push(item);
	}

});
