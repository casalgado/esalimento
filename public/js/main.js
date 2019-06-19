function onLoad() {
	CLIENTS = [];
	PRODUCTS = [];
	ORDERS = [];
	EXPENSES = [];
	PROVIDERS = [];
	SHOWING = { period: 'Week', current: moment() };
	MODAL = { speed: 150 };
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			loadPage(user);
		} else {
			document.getElementById('siteContainer').setAttribute('style', 'display:block');
		}
	});
	document.getElementById('customModalContainer').addEventListener('click', hideCustomModal);
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
			drawTable('showOrdersTable', Order.byWeek());
			setTableTitle();
			addCustomModalEvent('showOrdersTable');
		});
	fetchAll(Expense, 'expenses')
		.then((expenses) => {
			EXPENSES = expenses;
			EXPENSE_CATEGORIES = propList(EXPENSES, 'category');
		})
		.then(() => {
			drawTable('showExpensesTable', EXPENSES);
		});
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

// pagination

function currentlyShowing() {
	// returns a string
	let current = moment(SHOWING.current.format('X'), 'X');
	return `${current.startOf(SHOWING.period).format('D MMMM')} - ${current.endOf(SHOWING.period).format('D MMMM')}`;
}

function setTableTitle() {
	document.getElementById('showOrdersTableTitle').innerHTML = currentlyShowing();
}

function showNext(table, constructor) {
	SHOWING.current.add(1, SHOWING.period);
	array = constructor.byWeek();
	drawTable(table, array);
	setTableTitle();
}

function showPrevious(table, constructor) {
	SHOWING.current.subtract(1, SHOWING.period);
	array = constructor.byWeek();
	drawTable(table, array);
	setTableTitle();
}
