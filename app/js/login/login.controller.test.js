import { expect } from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';

import LoginController from './login.controller';
import AuthService from '../common/auth.service';

let controller;
let authServiceStub;
let rootScopeMock;

describe('LoginController', function() {

	beforeEach(function() {
		rootScopeMock = { $broadcast: sinon.spy() };
		authServiceStub = sinon.createStubInstance(AuthService);
		controller = new LoginController(rootScopeMock, authServiceStub);
	});

	afterEach(function() {
		authServiceStub.authorize.restore();
	});

	describe('#authorize()', function() {

		it('should broadcast authorized event on successful authorization', function(done) {
			let authPromise = Promise.resolve('abc123');

			authServiceStub.authorize.returns(authPromise);

			controller.authorize();

			authPromise.then(() => {
				expect(rootScopeMock.$broadcast.calledOnce).to.be.truthy;
				expect(rootScopeMock.$broadcast.calledWith('authorized')).to.be.truthy;
				done();
			});
		});
	});
});