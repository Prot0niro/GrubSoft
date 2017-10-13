app.controller('cajeroVentaCtrl', function ($scope, ticketServices) {
	$scope.total = 0;

	$scope.remover = function (index) {
		if (index < $scope.carrito.length) {
			$scope.carrito.splice($scope.carrito.length - 1 - index, 1);
		}
	}

	$scope.cancelar = function () {
		$scope.carrito = [];
	}

	$scope.calcularTotal = function () {
		var total = 0;
		for (var i = 0; i < $scope.carrito.length; i++) {
			total += $scope.carrito[i].precio;
		}

		return total;
	}

	$scope.$watch('carrito', calcularTotal);

	function calcularTotal (newVal, oldVal) {
		console.log(getItemsIds());
		//ticketServices.calcularTotal()
	}

	function getItemsIds() {
		return $scope.carrito.map(function (item) {
			return item._id;
		});
	}

});
