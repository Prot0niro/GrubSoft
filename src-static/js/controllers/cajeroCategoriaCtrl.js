app.controller('cajeroCategoriaCtrl', function ($scope) {
	var _this = this;

	$scope.isAllSelected = function () {
		return !$scope.catSelected;
	}

	$scope.selectAll = function () {
		_this.deselectAllCategorias();
		$scope.catSelected = '';
	}

	$scope.selectCategoria = function (categoria) {
		_this.deselectAllCategorias();
		categoria.seleccionada = true;
		$scope.catSelected = categoria.nombre;
	};

	_this.deselectAllCategorias = function () {
		for (var i = 0; i < $scope.categorias.length; i++) {
			$scope.categorias[i].seleccionada = false;
		}
	}

});
