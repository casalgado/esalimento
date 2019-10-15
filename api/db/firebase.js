// This file handles connection logic to the firebase database

var admin = require('firebase-admin');
var serviceAccount = require('../../../serviceAccountKey.json');

admin.initializeApp({
	credential  : admin.credential.cert(serviceAccount),
	databaseURL : 'https://es-alimento.firebaseio.com'
});

module.exports = admin;
