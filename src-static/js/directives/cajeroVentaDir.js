app.directive('gsCajeroVenta', function () {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/cajero-venta.html',
		scope: {
			carrito: '='
		}
	}
});
