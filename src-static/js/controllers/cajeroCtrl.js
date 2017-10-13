app.controller('cajeroCtrl', function ($scope, itemServices, categoriaServices) {
	$scope.categorias = [];
	$scope.items = [];
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

	getItems();
	getCategorias();

});
