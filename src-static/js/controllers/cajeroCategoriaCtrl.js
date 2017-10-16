app.controller('cajeroCategoriaCtrl', function ($scope, STRINGS) {
	var _this = this;

	$scope.isAllSelected = function () {
		return !$scope.catSelected;
	};

	$scope.isCombosSelected = function () {
		return $scope.catSelected === STRINGS.CATEGORIA_COMBOS;
	};

	$scope.selectAll = function () {
		_this.deselectAllCategorias();
		$scope.catSelected = '';
	};

	$scope.selectCombos = function () {
		_this.deselectAllCategorias();
		$scope.catSelected = STRINGS.CATEGORIA_COMBOS;
	};

	$scope.selectCategoria = function (categoria) {
		_this.deselectAllCategorias();
		categoria.seleccionada = true;
		$scope.catSelected = categoria._id;
	};

	_this.deselectAllCategorias = function () {
		for (var i = 0; i < $scope.categorias.length; i++) {
			$scope.categorias[i].seleccionada = false;
		}
	}

});
