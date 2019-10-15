const express = require('express');
const firebase = require('./db/firebase');
const app = express();

app.get('/', (req, res) => {
	let idToken = req.query.auth;
	firebase.auth().verifyIdToken(idToken).then(function(decodedToken) {
		let uid = decodedToken.uid;
		res.send('Hello World!');
	});
});

/**
 * GET /orders
 * Purpose: Get all orders 
 */
app.get('/orders', (req, res) => {
	var db = firebase.database();
	var ref = db.ref('devAccount/clients');
	ref.once('value', function(snapshot) {
		console.log(snapshot.val());
	});
	res.send([ 1, 2, 3 ]);
});

/**
 * GET /orders/:period/:day
 * Purpose: Get all orders for the period that contains the day.
 */
app.get('/orders/:period/:day', (req, res) => {
	res.send(req.params);
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));
