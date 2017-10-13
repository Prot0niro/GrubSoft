app.controller('cajeroCtrl', function ($scope, itemServices, categoriaServices, comboServices, ofertaServices) {
	$scope.categorias = [];
	$scope.items = [];
	$scope.combos = [];
	$scope.ofertas = [];
	$scope.carrito = [];
	$scope.catSelected = '';

	function getItems () {
		itemServices.getItems().then(getItemsSuccess, getItemsError);
	}

	function getItemsSuccess (response) {
		$scope.items = response.data;
	}

	function getItemsError (response) {
		console.log(response);
	}

	function getCategorias () {
		categoriaServices.getCategorias().then(getCategoriasSuccess, getCategoriasError);
	}

	function getCategoriasSuccess (response) {
		$scope.categorias = response.data;
	}

	function getCategoriasError (response) {
		console.log(response);
	}

	function getOfertas () {
		ofertaServices.getOfertas().then(getOfertasSuccess, getOfertasError);
	}

	function getOfertasSuccess (response) {
		$scope.ofertas = response.data;
	}

	function getOfertasError (response) {
		console.log(response);
	}

	function getCombos () {
		comboServices.getCombos().then(getCombosSuccess, getCombosError);
	}

	function getCombosSuccess (response) {
		$scope.combos = response.data;
	}

	function getCombosError (response) {
		console.log(response);
	}

	getItems();
	getCategorias();
	getOfertas();
	getCombos();

});
