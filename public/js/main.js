function onLoad() {
	CLIENTS = [];
	PRODUCTS = [];
	ORDERS = [];
	EXPENSES = [];
	PROVIDERS = [];
	SHOWING = { period: 'Week', current: moment() };
	MODAL = { speed: 150 };
	FILTERS = {};
	// firebase.auth().onAuthStateChanged(function(user) {
	// 	if (user) {
	// 		loadPage(user);
	// 	} else {
	// 		document.getElementById('siteContainer').setAttribute('style', 'display:block');
	// 	}
	// });
	// three lines below should de deleted when uncommeting
	document.getElementById('siteContainer').setAttribute('style', 'display:none');
	document.getElementById('loaderContainer').setAttribute('style', 'display:none');
	document.getElementById('appContainer').setAttribute('style', 'display:block');
}

function loadPage(user) {
	fetchAll(Client, 'clients').then((clients) => {
		CLIENTS = clients;
		drawSelectMenu('clientSelection', clients, 'name');
	});
	fetchAll(Product, 'products').then((products) => {
		PRODUCTS = products;
		drawSelectMenu('productSelection', products, 'name');
	});
	fetchAll(Order, 'orders')
		.then((orders) => {
			ORDERS = Order.instantiateStatus(orders);
		})
		.then(() => {
			new Table('showOrdersTable', Order.byWeek(SHOWING.current));
			addCustomModalEvent('showOrdersTable');
		});
	fetchAll(Expense, 'expenses')
		.then((expenses) => {
			EXPENSES = expenses;
			EXPENSE_CATEGORIES = propList(EXPENSES, 'category');
		})
		.then(() => {
			new Table('showExpensesTable', EXPENSES);
		});
	resetForm('order');
	document.getElementById('siteContainer').setAttribute('style', 'display:none');
	document.getElementById('loaderContainer').setAttribute('style', 'display:none');
	document.getElementById('appContainer').setAttribute('style', 'display:block');
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

function propList(objects, property) {
	// returns list of property values of an array of objects
	onlyProps = objects.map((e) => e[property]).getUnique();
	return onlyProps;
}

Array.prototype.getUnique = function() {
	let uniq = [ ...new Set(this) ];
	return uniq;
};
