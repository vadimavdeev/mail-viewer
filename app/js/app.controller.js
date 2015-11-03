class AppController {

	constructor($scope, $location, $window, chromeUtils) {
		this.$scope = $scope;
		this.$location = $location;
		this.$window = $window;
		this.chromeUtils = chromeUtils;
		this.initialized = true;

		this.$scope.$on('authorized', () => {
			this.$location.path('/emails');
		});
	}

	openGmail() {
		this.chromeUtils.goToGmail();
	}

	closePopup() {
		this.$window.close();
	}
}

AppController.$inject = ['$scope', '$location', '$window', 'chromeUtils'];

export default AppController;