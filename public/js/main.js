function onLoad() {
	CLIENTS = [];
	PRODUCTS = [];
	ORDERS = [];
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			loadPage(user);
		} else {
			document.getElementById('siteContainer').setAttribute('style', 'display:block');
		}
	});
}

function loadPage(user) {
	fetchAll(Client, 'clients')
		.then((clients) => {
			CLIENTS = clients;
		})
		.then(() => {
			drawAll(CLIENTS, 'showClients', 'name');
		});
	fetchAll(Product, 'products')
		.then((products) => {
			PRODUCTS = products;
		})
		.then(() => {
			drawAll(PRODUCTS, 'showProducts', 'name');
		});
	fetchAll(Order, 'orders')
		.then((orders) => {
			ORDERS = Order.instantiateStatus(orders);
		})
		.then(() => {
			drawAll(ORDERS, 'showOrders', 'product');
		});
	document.getElementById('siteContainer').setAttribute('style', 'display:none');
	document.getElementById('loaderContainer').setAttribute('style', 'display:none');
	document.getElementById('appContainer').setAttribute('style', 'display:block');
}

function instantiateEntry(constructor, dbObj) {
	// called when retreiving objects from database
	var entry = new constructor();
	var json = JSON.parse(JSON.stringify(dbObj));
	for (var i = 0; i < Object.keys(json).length; i++) {
		entry[Object.keys(json)[i]] = Object.values(json)[i];
	}
	return entry;
}

function drawAll(array, target, property) {
	let list, item;
	list = document.createElement('ul');
	document.getElementById(target).appendChild(list);
	for (let i = 0; i < array.length; i++) {
		item = document.createElement('li');
		item.innerHTML = array[i][property];
		list.appendChild(item);
	}
}
