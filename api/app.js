const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

/**
 * GET /orders
 * Purpose: Get all orders 
 */
app.get('/orders', (req, res) => {
	res.send([ 1, 2, 3 ]);
});

/**
 * GET /orders/:period/:day
 * Purpose: Get all orders for a given day and period.
 */
app.get('/orders/:period/:day', (req, res) => {
	res.send(req.params);
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));
