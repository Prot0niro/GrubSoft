app.controller('inventarioCtrl', function ($scope, itemServices) {
	var _this = this;
	var NAV_LI_ID = '#navInventarioLi';

	$scope.showItem = function (item) {
		return !item.padre;
	}

	function getItems () {
		itemServices.getItems().then(getItemsSuccess, getItemsError);
	}

	function getItemsSuccess (response) {
		$scope.items = response.data;
	}

	function getItemsError (response) {
		console.log(response);
	}

	this.init = function () {
		window.activarNavLi(NAV_LI_ID);
		getItems();
	};

	_this.init();

});
