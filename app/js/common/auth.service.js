class AuthService {

	constructor(gapiClient) {
		this.client = gapiClient;
	}

	checkAuth() {
		return this.client.authorize(false);
	}

	authorize() {
		return this.client.authorize(true);
	}
}

AuthService.$inject = ['gapiClient'];

export default AuthService