class EmailService {

	constructor(gapiClient) {
		this.client = gapiClient;
	}

	getMessages(options) {
		return this.client.getMessages(options);
	}
}

EmailService.$inject = ['gapiClient'];

export default EmailService;