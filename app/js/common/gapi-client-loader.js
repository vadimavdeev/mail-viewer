import Promise from 'bluebird'

// a hack to load the google api client library
export function loadGapiClient() {
	return new Promise((resolve, reject) => {
		window.clientLoadCallback = function() {
			resolve();
			delete window.clientLoadCallback;
		};

		let script = document.createElement('script');
		script.src = 'https://apis.google.com/js/client.js?onload=clientLoadCallback';
		script.onerror = reject;
		document.head.appendChild(script);
	});
};