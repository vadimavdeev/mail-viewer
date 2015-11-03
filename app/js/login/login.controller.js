class LoginController {

	constructor($rootScope, authService) {
		this.$rootScope = $rootScope;
		this.authService = authService;
	}

	authorize() {
		this.authService.authorize()
		.then((authResult) => {
			this._onAuthorized();
		});
	}

	_onAuthorized() {
		this.$rootScope.$broadcast('authorized');
	}
}

LoginController.$inject = ['$rootScope', 'authService' ];

export default LoginController;