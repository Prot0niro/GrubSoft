app.directive('gsCajeroCategorias', function () {
	return {
		restrict: 'E',
		templateUrl: '/templates/directives/cajero-categorias.html',
		controller: 'cajeroCategoriaCtrl',
		scope: {
			categorias: '=',
			catSelected: '='
		}
	}
});