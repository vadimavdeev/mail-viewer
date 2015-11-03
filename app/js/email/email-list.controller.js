class EmailListController {

	constructor($scope, emailService, chromeUtils) {
		this.$scope = $scope;
		this.emailService = emailService;
		this.chromeUtils = chromeUtils;
		this.messages = [];
		this.pageSize = 10;
		this._nextPageToken = null;
		this._pageTokenStack = [];

		this.getMessages();
	}

	getMessages(pageToken = '') {
		return this.emailService.getMessages({ 
			maxResults: this.pageSize, 
			pageToken 
		})
		.then((data) => {
			this.messages = data.messages;
			this._pageTokenStack.push(pageToken)
			this._nextPageToken = data.nextPageToken;
			this.$scope.$apply();
		})
		.catch((err) => {
			console.log(err.result.error.message);
		});
	}

	nextPage() {
		if(!this.hasNextPage()) {
			return false;
		}

		return this.getMessages(this._nextPageToken);
	}

	prevPage() {
		if(!this.hasPrevPage()) {
			return false;
		}

		let curPageToken = this._pageTokenStack.pop();
		let prevPageToken = this._pageTokenStack.pop();

		return this.getMessages(prevPageToken);
	}

	hasNextPage() {
		return !!this._nextPageToken;
	}

	hasPrevPage() {
		return this._pageTokenStack.length > 1;
	}

	openInGmail(id) {
		this.chromeUtils.openMessageInGmail(id);
	}
}

EmailListController.$inject = ['$scope', 'emailService', 'chromeUtils'];

export default EmailListController