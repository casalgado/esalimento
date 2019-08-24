function fetchAll(constructor, directory) {
	return new Promise((resolve) => {
		var objects = [];
		firebase.database().ref(`devAccount/${directory}`).once('value').then(function(snapshot) {
			snapshot.forEach(function(item) {
				objects.push(instantiateEntry(constructor, item.val()));
			});
			resolve(objects);
		});
	});
}

function updateAll() {
	return new Promise((resolve) => {
		var objects = [];
		firebase.database().ref(`devAccount/orders`).once('value').then(function(snapshot) {
			snapshot.forEach(function(item) {
				objects.push(instantiateEntry(constructor, item.val()));
			});
			resolve(objects);
		});
	});
}

function instantiateEntry(constructor, dbObj) {
	// called when retreiving objects from database
	var entry = new constructor();
	for (var i = 0; i < Object.keys(dbObj).length; i++) {
		entry[Object.keys(dbObj)[i]] = Object.values(dbObj)[i];
	}
	return entry;
}

function reformatTime(s) {
	return moment(s.split('/').reverse().join('-')).format();
}

function importOrders(array) {
	let newOrder;
	j = array;
	currentOrders = ORDERS.length;
	for (let i = 0; i < j.length; i++) {
		// create order
		let count = i + currentOrders;
		let orderName = 'P-19-' + zeroPad(c + 1, 3);
		newOrder = new Order(
			'id',
			orderName,
			j[i].client,
			j[i].product,
			j[i].quantity,
			j[i].unitPrice,
			j[i].total,
			moment('2019-' + j[i].confirmed.split('/')[1] + '-' + j[i].confirmed.split('/')[0]).format(),
			moment('2019-' + j[i].confirmed.split('/')[1] + '-' + j[i].confirmed.split('/')[0]).format(),
			moment('2019-' + j[i].prepared.split('/')[1] + '-' + j[i].prepared.split('/')[0]).format(),
			moment('2019-' + j[i].delivered.split('/')[1] + '-' + j[i].delivered.split('/')[0]).format(),
			moment('2019-' + j[i].paid.split('/')[1] + '-' + j[i].paid.split('/')[0]).format()
		);
		newOrder.save();
	}
}

function importOrdersDatabase() {
	clients = [];
	products = [];
	let newClient, newProduct, newOrder;
	j = ordersFromDatabase;
	for (let i = 0; i < j.length; i++) {
		//create client
		if (!clients.includes(j[i].client)) {
			newClient = new Client('id', j[i].client, '', '', '');
			newClient.save();
			clients.push(j[i].client);
		}
		// create product
		if (!products.includes(j[i].product)) {
			let cost = j[i].unitPrice - j[i].cost;
			newProduct = new Product('id', j[i].product, '', j[i].unitPrice, cost);
			newProduct.save();
			products.push(j[i].product);
		}
		// create order
		let orderName = 'P-19-' + zeroPad(i + 1, 3);
		newOrder = new Order(
			'id',
			orderName,
			j[i].client,
			j[i].product,
			j[i].quantity,
			j[i].unitPrice,
			j[i].total,
			moment('2019-' + j[i].confirmed.split('/')[1] + '-' + j[i].confirmed.split('/')[0]).format(),
			moment('2019-' + j[i].confirmed.split('/')[1] + '-' + j[i].confirmed.split('/')[0]).format(),
			moment('2019-' + j[i].prepared.split('/')[1] + '-' + j[i].prepared.split('/')[0]).format(),
			moment('2019-' + j[i].delivered.split('/')[1] + '-' + j[i].delivered.split('/')[0]).format(),
			j[i].paid
		);
		newOrder.save();
	}
}

function importExpenses(array) {
	let newExpense;
	const j = array;
	for (let i = 0; i < j.length; i++) {
		newExpense = new Expense(
			'id',
			j[i].name,
			j[i].category,
			j[i].provider,
			j[i].quantity,
			j[i].unit,
			j[i].unitPrice,
			j[i].total.toString().replace(',', ''),
			reformatTime(j[i].date)
		);
		newExpense.save();
	}
}

function populateReports() {
	let current = moment(ORDERS[0].confirmed);
	let wealthAtStart = 0;
	while (current.week() < moment().week()) {
		if (REPORTS.length > 0) {
			wealthAtStart = REPORTS[REPORTS.length - 1].idealWealthAtEnd();
		}
		let r = new Report(current, wealthAtStart);
		r.name = Report.setLocalId();
		r.cash = r.wealthAtStart;
		r.bank = r.profit();
		r.date = r.date.format();
		REPORTS.push(r);
		r.save();
		current.add('1', 'week');
	}
}

function exportExpensesAsCSV(expenses) {
	const rows = expenses.map((e) => [
		moment(e.date).format('DD/MM'),
		e.name,
		e.provider,
		e.quantity,
		e.unitPrice,
		e.total
	]);

	let csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
	return csvContent;
}
