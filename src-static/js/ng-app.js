var app = angular.module('grubsoft-main', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/templates/cajero.html',
		controller: 'cajeroCtrl'
	}).otherwise('/');
})
