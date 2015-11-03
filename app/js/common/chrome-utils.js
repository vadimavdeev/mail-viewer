'use strict';

export default function ChromeUtils() {

	const gmailUrl = 'https://mail.google.com/mail/';

	return {
		goToGmail,
		openMessageInGmail
	}

	function goToGmail(path) {
		path = path || '';

		chrome.tabs.getAllInWindow(undefined, function(tabs) {
			for (let i = 0, tab; tab = tabs[i]; i++) {
				if (tab.url && tab.url.indexOf(gmailUrl) === 0) {
					chrome.tabs.update(tab.id, { selected: true });
					return;
				}
			}
			chrome.tabs.create({url: gmailUrl + path });
		});
	}

	function openMessageInGmail(messageId) {
		let path = '/#inbox/' + messageId;
		goToGmail(path);
	}
};