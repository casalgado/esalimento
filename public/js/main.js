function onLoad() {
	CLIENTS = [];
	PRODUCTS = [];
	ORDERS = [];
	EXPENSES = [];
	REPORTS = [];
	SHOWING = { period: 'Week', current: moment() };
	FILTERS = {};
	Nav.renderMainButton();
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			loadPage();
		} else {
			document.getElementById('siteContainer').setAttribute('style', 'display:block');
		}
	});
}

function loadPage() {
	Client.all().then((objs) => {
		CLIENTS = objs;
	});
	Product.all().then((objs) => {
		PRODUCTS = objs;
	});
	Order.all().then((objs) => {
		ORDERS = objs;
		Table.render(Order);
	});
	Expense.all().then((objs) => {
		EXPENSES = objs;
	});
	Report.all().then((objs) => {
		REPORTS = objs;
	});
	// REPORTS = Report.all();
	SHOWING = { period: 'Week', current: moment() };
	FILTERS = {};
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

String.prototype.isEmpty = function() {
	return this.length === 0 || !this.trim();
};
