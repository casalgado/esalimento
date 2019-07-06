function onLoad() {
	SQUARE = document.getElementById('square');
	CLIENTS = [];
	PRODUCTS = [];
	ORDERS = [];
	EXPENSES = [];
	REPORTS = [];
	SHOWING = { period: 'Week', current: moment() };
	FILTERS = {};
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			loadPage(user);
		} else {
			document.getElementById('siteContainer').setAttribute('style', 'display:block');
		}
	});
}

function loadPage(user) {
	SQUARE = document.getElementById('square');
	Client.all().then((objs) => {
		CLIENTS = objs;
	});
	Product.all().then((objs) => {
		PRODUCTS = objs;
	});
	Order.all().then((objs) => {
		ORDERS = objs;
		new Table('square', objs);
	});
	Expense.all().then((objs) => {
		EXPENSES = objs;
	});
	// REPORTS = Report.all();
	SHOWING = { period: 'Week', current: moment() };
	FILTERS = {};
	document.getElementById('siteContainer').setAttribute('style', 'display:none');
	document.getElementById('loaderContainer').setAttribute('style', 'display:none');
	document.getElementById('appContainer').setAttribute('style', 'display:block');
	Inter.loadEvents();
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
