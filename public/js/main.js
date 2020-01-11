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
	DB_REF = '';
	HTML = new Html();
	Nav.renderMainButton();
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log(`User: ${moment().format('mm:ss.SS')}`);
			DB_REF = dbPath(firebase.auth().currentUser.uid);
			loadPage();
		} else {
			document.getElementById('siteContainer').setAttribute('style', 'display:block');
		}
	});
}

function loadPage() {
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
	Promise.all([ orderPromise, expensePromise, reportPromise ])
		.then(() => {
			onNavigate({ pathname: window.location.pathname });
			console.log(`Promises O + E + R: ${moment().format('mm:ss.SS')}`);
		})
		.then(() => {
			Client.all().then((objs) => {
				CLIENTS = objs;
				console.log(`Clients: ${moment().format('mm:ss.SS')}`);
			});
			Product.all().then((objs) => {
				PRODUCTS = objs;
				console.log(`Products: ${moment().format('mm:ss.SS')}`);
			});
		});

	SHOWING = { period: 'Week', current: moment() };
	FILTERS = {};
	document.getElementById('siteContainer').classList.add('hide');
	document.getElementById('appContainer').classList.add('show');
}

function dbPath(uid) {
	const db_paths = {
		QetHHTYdJxMITVG4fwBksq3uD0z2 : 'devAccount',
		WvbSPu6YNMZlwxEas5qEx8uqRCZ2 : 'devAccount',
		qmS5zdK0UuVXnCFofAeyc244DPp1 : 'devAccount',
		s2LmuhBpKAg2np85D653Iqdx8hX2 : 'devAccount',
		mvmSzFpWnSVCSVwxKj7kXrqTTM63 : 'nutriplantas'
	};
	return db_paths[uid];
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
	if (this.endsWith(',000')) {
		return this.slice(0, -4) + 'k';
	} else if (this.endsWith('000')) {
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
	if (document.getElementsByClassName('pagination').length > 0) {
		if (window.scrollY > 50) {
			document.getElementsByClassName('pagination')[0].classList.add('whiteBorderBottom');
		} else {
			document.getElementsByClassName('pagination')[0].classList.remove('whiteBorderBottom');
		}
	}
});

function rowComparer(idx, asc) {
	return function(a, b) {
		return compare(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
	};
}

function getCellValue(tr, idx) {
	return tr.children[idx].innerText || tr.children[idx].textContent;
}

function compare(v1, v2) {
	if (parseInt(v1[0])) {
		v1 = convertToInteger(v1);
		v2 = convertToInteger(v2);
		return v1 - v2;
	} else {
		return v1.toString().localeCompare(v2);
	}
}

function convertToInteger(string) {
	// strip the k at the end of the string
	if (string[string.length - 1] == 'k' && parseInt(string[0])) {
		return parseInt(string.slice(0, -1));
	} else if (parseInt(string[0])) {
		return parseInt(string);
	}
}
