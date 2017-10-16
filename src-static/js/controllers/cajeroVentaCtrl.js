app.controller('cajeroVentaCtrl', function ($scope, STRINGS) {
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
		var items = getItemsFromCarrito();
		var combos = getCombosFromCarrito();
		var itemsIds = formatItemsIds(getItemsIds(items));
		items = formatItems(items, itemsIds);
		var combosIds = formatCombosIds(getCombosIds(combos));
		combos = formatCombos(combos, combosIds);
		var ofertas = formatOfertas($scope.ofertas);

		return getTotal({
			items: items,
			combos: combos,
			ofertas: ofertas,
			itemsIds: itemsIds,
			combosIds: combosIds
		});
	};

	function getItemsFromCarrito () {
		var items = [];
		for (var i = 0; i < $scope.carrito.length; i++) {
			if ($scope.carrito[i].tipo === STRINGS.TIPO_ITEM) {
				items.push($scope.carrito[i]);
			}
		}

		return items;
	}

	function getCombosFromCarrito () {
		var items = [];
		for (var i = 0; i < $scope.carrito.length; i++) {
			if ($scope.carrito[i].tipo === STRINGS.TIPO_COMBO) {
				items.push($scope.carrito[i]);
			}
		}

		return items;
	}

	function getItemsIds (items) {
		return items.map(function (item) {
			return item._id;
		});
	}

	function getCombosIds (combos) {
		return combos.map(function (combo) {
			return combo._id;
		});
	}

	function formatItemsIds (itemsIds) {
		if (!itemsIds || !itemsIds.length) {
			return;
		}

		var formatedItemsIds = {};
		itemsIds.forEach(function (itemId) {
			if (!formatedItemsIds[itemId]) {
				formatedItemsIds[itemId] = {};
				formatedItemsIds[itemId]._id = itemId;
				formatedItemsIds[itemId].cantidad = 1;
			} else {
				formatedItemsIds[itemId].cantidad++;
			}
		});

		return formatedItemsIds;
	}

	function formatItems (items, itemsIds) {
		if (!items || !items.length) {
			return;
		}

		var formatedItems = {};
		items.forEach(function (item) {
			item.cantidad = itemsIds[item._id].cantidad;
			formatedItems[item._id] = item;
		});

		return formatedItems;
	}

	function formatCombosIds (ids) {
		if (!ids || !ids.length) {
			return;
		}

		var formatedIds = {};
		ids.forEach(function (id) {
			if (!formatedIds[id]) {
				formatedIds[id] = {};
				formatedIds[id]._id = id;
				formatedIds[id].cantidad = 1;
			} else {
				formatedIds[id].cantidad++;
			}
		});

		return formatedIds;
	}

	function formatCombos (combos, ids) {
		if (!combos || !combos.length) {
			return;
		}

		var formatedCombos = {};
		combos.forEach(function (combo) {
			combo.cantidad = ids[combo._id].cantidad;
			formatedCombos[combo._id] = combo;
		});

		return formatedCombos;
	}

	function formatOfertas (ofertas) {
		if (!ofertas || !ofertas.length) {
			return {};
		}

		var obj = {};
		ofertas.forEach(function (oferta) {
			oferta.items.forEach(itemId => obj[itemId] = oferta);
		});

		return obj;	
	}

	function getTotal (input) {
		var total = 0;

		total += getTotalFromCombos(input.combos);
		total += getTotalFromItems(input.items, input.ofertas);

		return monetizar(total);
	}

	function getTotalFromCombos (combos) {
		if (!combos) {
			return 0;
		}

		var total = 0;
		for (var comboId in combos) {
			if (combos.hasOwnProperty(comboId)) {
				var combo = combos[comboId];
				total += combo.precio * combo.cantidad;
			}
		}

		return total;
	}

	function getTotalFromItems (items, ofertas) {
		if (!items) {
			return 0;
		}

		var total = 0;
		for (var itemId in items) {
			if (items.hasOwnProperty(itemId)) {
				var item = items[itemId];
				if (ofertas[itemId]) {
					total += calcularTotalDeOferta(item, ofertas[itemId]);
				} else {
					total += item.cantidad * item.precio
				}
			}
		}

		return total;
	}

	function calcularTotalDeOferta(item, oferta) {
		const precio = item.precio;
		const cantidad = item.cantidad;
		const x = oferta.x_por_y_x;
		const y = oferta.x_por_y_y;

		switch (oferta.tipo) {
			case 'D':
				return (precio * cantidad * (oferta.descuento/100));

			case 'X':
				return (Math.floor(cantidad/x) * y * precio + cantidad%x * precio);

			default:
				return 0;
		}
	}

	function monetizar (num) {
		var dec = parseInt(('' + num).split('.')[1] || 0);

		if (dec < 40) {
			return Math.floor(num);
		} else if (dec > 60) {
			return Math.ceil(num);
		} else {
			return Math.floor(num) + .5;
		}
	}

});
