app.controller('cajeroMenuCtrl', function ($scope, STRINGS) {

	$scope.showItem = function (item) {
		return !$scope.catSelected || item.categoria === $scope.catSelected;
	};

	$scope.showCombos = function () {
		return !$scope.catSelected || $scope.catSelected === STRINGS.CATEGORIA_COMBOS;
	};

	$scope.addItemToCarrito = function (item) {
		item.tipo = STRINGS.TIPO_ITEM;
		$scope.carrito.push(item);
	};

	$scope.addComboToCarrito = function (combo) {
		combo.tipo = STRINGS.TIPO_COMBO;
		$scope.carrito.push(combo);
	};

	$scope.itemHasOferta = function (item) {
		for (var i = 0; i < $scope.ofertas.length; i++) {
			var oferta = $scope.ofertas[i];
			if (oferta.items.indexOf(item._id) > -1) {
				if (oferta.tipo === STRINGS.OFERTA_TIPO_X) {
					item.ofertaTxt = oferta.x_por_y_x + 'x' + oferta.x_por_y_y;
				} else if (oferta.tipo === STRINGS.OFERTA_TIPO_D) {
					item.ofertaTxt = oferta.descuento + '% desc.';
				}

				return true;
			}
		}

		return false;
	}

});
