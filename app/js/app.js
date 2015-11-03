import angular from 'angular';
import router from 'angular-route';
import ngMaterial from 'angular-material';
import ngMoment from 'angular-moment';
import AppController from './app.controller';
import LoginController from './login/login.controller';
import EmailListController from './email/email-list.controller';
import EmailService from './email/email.service';
import AuthService from './common/auth.service';
import GapiClient from './common/gapi-client';
import ChromeUtils from './common/chrome-utils';
import { routing } from './app.config';
import { loadGapiClient } from './common/gapi-client-loader';

let app = angular.module('mailViewerApp', [
		router,
		ngMaterial,
		ngMoment
	])
	.service('emailService', EmailService)
	.service('authService', AuthService)
	.service('gapiClient', GapiClient)
	.factory('chromeUtils', ChromeUtils)
	.controller('AppCtrl', AppController)
	.controller('EmailListCtrl', EmailListController)
	.controller('LoginCtrl', LoginController);


app.config(routing);

loadGapiClient()
.then(() => angular.bootstrap(document, ['mailViewerApp']))
.catch((err) => window.alert('Could not initialize the app. Please make sure you have a valid internet connection.'));

export default app.name;
