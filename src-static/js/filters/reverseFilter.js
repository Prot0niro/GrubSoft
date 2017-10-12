app.filter('gsReverse', function () {
	return function (items) {
		return items.slice().reverse();
	}
});
