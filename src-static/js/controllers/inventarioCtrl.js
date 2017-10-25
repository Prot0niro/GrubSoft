app.controller('inventarioCtrl', function ($scope, STRINGS) {
	var _this = this;
	var NAV_LI_ID = '#navInventarioLi';

	this.init = function () {
		window.activarNavLi(NAV_LI_ID);
	};

	_this.init();

});
