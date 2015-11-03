import { expect } from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';

import EmailListController from './email-list.controller';
import EmailService from './email.service';

let controller;
let emailServiceStub;
let noop = function() {};

describe('EmailListController', function() {

	beforeEach(function() {
		let scopeStub = { $apply: noop };
		let chromeUtilsStub = { openMessageInGmail: noop };
		let messages = [ 
			{ id: 1 },
			{ id: 2 },
			{ id: 3 },
			{ id: 4 },
			{ id: 5 } 
		];
		let nextPageToken = '1';

		let messagesPromise = Promise.resolve({
			messages,
			nextPageToken
		});

		emailServiceStub = sinon.createStubInstance(EmailService);
		emailServiceStub.getMessages.returns(messagesPromise);

		controller = new EmailListController(scopeStub, emailServiceStub, chromeUtilsStub);
	});

	afterEach(function() {
		emailServiceStub.getMessages.restore();
	});

	describe('#constructor', function() {
		it('should load first page of messages', function() {
			expect(controller.messages.length).to.be.equal(5);
		});
	});

	describe('#prevPage()', function() {

		it('should not move to previous page from first page', function() {
			expect(controller.hasPrevPage()).to.be.falsy;
		});

		it('should move to previous page from second and following pages', function(done) {
			let origMessages = controller.messages;
			let origNextPageToken = '1';
			let prevPagePromise = Promise.resolve({
				messages: origMessages,
				nextPageToken: origNextPageToken
			});

			let messages = [ 
				{ id: 6 },
				{ id: 7 },
				{ id: 8 },
				{ id: 9 },
				{ id: 10 } 
			];
			let nextPageToken = '2';

			let nextPagePromise = Promise.resolve({
				messages,
				nextPageToken
			});

			// nextPage call
			emailServiceStub.getMessages
				.withArgs({ maxResults: controller.pageSize, pageToken: origNextPageToken})
				.returns(nextPagePromise);
			// prevPage call
			emailServiceStub.getMessages
				.withArgs({ maxResults: controller.pageSize, pageToken: ''})
				.returns(prevPagePromise);

			controller.nextPage()
			.then(function() {
				return controller.prevPage();
			})
			.then(function() {
				expect(controller.messages).to.be.equal(origMessages);
				done();
			});
		});
	});

	describe('#nextPage()', function() {

		it('should not move to next page without next page token', function(done) {
			let messages = [ 
				{ id: 6 },
				{ id: 7 },
				{ id: 8 },
				{ id: 9 },
				{ id: 10 } 
			];
			let nextPageToken = null;

			let nextPagePromise = Promise.resolve({
				messages,
				nextPageToken
			});

			emailServiceStub.getMessages.returns(nextPagePromise);

			controller.nextPage()
			.then(function(data) {
				expect(controller.hasNextPage()).to.be.falsy;
				done();
			});
		});

		it('should move to next page with next page token', function(done) {
			let origNextPageToken = '1';
			let messages = [ 
				{ id: 6 },
				{ id: 7 },
				{ id: 8 },
				{ id: 9 },
				{ id: 10 } 
			];
			let nextPageToken = '2';

			let nextPagePromise = Promise.resolve({
				messages,
				nextPageToken
			});

			emailServiceStub.getMessages
				.withArgs({ maxResults: controller.pageSize, pageToken: origNextPageToken})
				.returns(nextPagePromise);

			controller.nextPage()
			.then(function(data) {
				expect(controller.messages).to.be.equal(messages);
				expect(controller.hasNextPage()).to.be.truthy;
				done();
			});
		});
	});
});