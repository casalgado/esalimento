function onLoad() {
	CLIENTS = [];
	PRODUCTS = [];
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
			Client.drawAll('showClients');
		});
	fetchAll(Product, 'products')
		.then((products) => {
			PRODUCTS = products;
		})
		.then(() => {
			Product.drawAll('showProducts');
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
