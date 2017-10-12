app.directive('gsCajeroMenu', function () {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/cajero-menu.html',
		controller: 'cajeroMenuCtrl',
		scope: {
			items: '=',
			catSelected: '=',
			carrito: '='
		}
	}
});