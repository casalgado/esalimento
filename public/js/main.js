//export const getUnique = getUnique;
console.log(`document: ${moment().format('mm:ss.SS')}`);

function onLoad() {
	console.log(`onLoad: ${moment().format('mm:ss.SS')}`);
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
			console.log(`User: ${moment().format('mm:ss.SS')}`);
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
	let orderPromise = Order.all().then((objs) => {
		ORDERS = objs;
		console.log(`Orders: ${moment().format('mm:ss.SS')}`);
	});
	let expensePromise = Expense.all().then((objs) => {
		EXPENSES = objs;
		console.log(`Expenses: ${moment().format('mm:ss.SS')}`);
	});
	let reportPromise = Report.all().then((objs) => {
		REPORTS = objs;
		console.log(`Reports: ${moment().format('mm:ss.SS')}`);
		Report.create();
	});
	Promise.all([ orderPromise, expensePromise, reportPromise ]).then(() => {
		onNavigate({ pathname: window.location.pathname });
		console.log(`Promise all: ${moment().format('mm:ss.SS')}`);
	});

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

String.prototype.formatK = function() {
	if (this.endsWith('000')) {
		return this.slice(0, -3) + 'k';
	}
	return this;
};

Array.prototype.sortBy = function(property) {
	if (this[0] && parseInt(this[0][property])) {
		return this.sort((a, b) => (parseInt(a[property]) > parseInt(b[property]) ? 1 : -1));
	} else {
		return this.sort((a, b) => (a[property] > b[property] ? 1 : -1));
	}
};

Array.prototype.sortByDatestr = function() {
	return this.sort((a, b) => (moment(a.datestr()) > moment(b.datestr()) ? 1 : -1));
};

Array.prototype.countByProp = function(key, value) {
	let count = 0;
	for (let i = 0; i < this.length; i++) {
		if (this[i][key] == value) {
			count++;
		}
	}
	return count;
};

// scroll events
document.addEventListener('scroll', () => {
	document.documentElement.dataset.scroll = window.scrollY;
	if (window.scrollY > 50) {
		document.getElementsByClassName('pagination')[0].classList.add('whiteBorderBottom');
	} else {
		document.getElementsByClassName('pagination')[0].classList.remove('whiteBorderBottom');
	}
});
