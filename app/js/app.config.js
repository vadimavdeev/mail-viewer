"use strict";

let checkAuth = function($location, authService) {
	return authService.checkAuth()
		.catch((err) => { 
			console.log(err.message);
			$location.path('/login'); 
			throw err;
		});
};

export function routing($routeProvider, $mdThemingProvider) {
	$routeProvider
	.when('/emails', {
		templateUrl: chrome.extension.getURL('partials/email-list.html'),
		controller: 'EmailListCtrl',
		controllerAs: 'vm',
		resolve: {
			authResult: checkAuth
		}
	})
	.when('/login', {
		templateUrl: chrome.extension.getURL('partials/login.html'),
		controller: 'LoginCtrl',
		controllerAs: 'vm'
	})
	.otherwise({
		redirectTo: '/emails'
	});

	$mdThemingProvider.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('green');
};