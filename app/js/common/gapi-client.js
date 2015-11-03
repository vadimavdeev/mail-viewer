import Promise from 'bluebird'
import _ from 'lodash'

const MESSAGES_PATH = '/gmail/v1/users/me/messages';
const HEADERS = ['Delivered-To', 'Date', 'From', 'Subject'];
const MESSAGE_FORMAT = 'metadata';

class GapiClient {

	constructor() {
		this.token = null;
	}

	authorize(interactive) {
		return new Promise((resolve, reject) => {
			// using chrome.identity here instead of gapi.authorize becasue
			// gapi authorize does not close the popup after successful login
			// https://github.com/google/google-api-javascript-client/issues/74
			chrome.identity.getAuthToken({ interactive },
			(token) => {
				if(chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					this.token = token;
					gapi.auth.setToken({ 
						access_token: token
					});
					resolve(token);
				}
			});
		})
	}

	getMessages(options) {
		let nextPageToken;

		return Promise.resolve(gapi.client.request({
			path: MESSAGES_PATH,
			params: options
		}))
		.then((data) => {
			let { messages } = data.result;
			nextPageToken = data.result.nextPageToken;

			return messages.reduce((batch, message) => { 
				batch.add(gapi.client.request({ 
					path: MESSAGES_PATH + '/' + message.id,
					params: {
						format: MESSAGE_FORMAT
					}
				}));
				return batch;
			}, gapi.client.newBatch());
		})
		.then((data) => {
			let messageModels = _.map(data.result, (resp) => {
				return this._createMessageModel(resp.result);
			});
			return {
				messages: messageModels,
				nextPageToken
			};
		});
	}

	_createMessageModel(msg) {
		let payload = msg.payload;
		let headers = _.pick(payload.headers.reduce((memo, h) => { 
							memo[h.name] = h.value;
							return memo;
						}, {} ), HEADERS);
		let unread = msg.labelIds.indexOf("UNREAD") != -1;

		return { 
			id: msg.id,
			threadId: msg.threadId,
			snippet: _.unescape(msg.snippet),
			historyId: msg.historyId,
			internalDate: new Date(parseInt(msg.internalDate, 10)),
			headers,
			unread
		};
	}

}

export default GapiClient