class Expense {
	constructor(name, category, provider, unitPrice, quantity, total) {
		this.name = name;
		this.category = category;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.provider = provider;
		this.date = moment().format();
	}

	static create(form) {
		let [ name, category, provider, unitPrice, quantity, total ] = getFormValues(form);
		let expense = new Expense(name, category, provider, unitPrice, quantity, total);
		expense.save().then(() => {
			form.reset();
		});
	}

	save() {
		return new Promise((resolve) => {
			// @clean if id is not going to be used, this can be refactored
			// expense var doesn't have to be declared or returned
			var expense = firebase.database().ref(`devAccount/expenses`).push(this);
			return resolve(expense);
		}).then((expense) => {
			firebase.database().ref(`devAccount/expenses`).child(expense.key).update({
				id : expense.key
			});
			this.id = expense.key;
			EXPENSES.push(this);
		});
	}

	instantiateDate() {
		return moment(JSON.parse(this.date));
	}

	getTableColumnTitles() {
		return [ 'nombre', 'precio', 'proveedor' ];
	}

	getTableContent() {
		return [ this.name, this.total, this.provider ];
	}

	belongsToWeek(momentObj) {
		return moment(this.date).isSame(momentObj, 'week') ? true : false;
	}

	static byWeek(momentObj) {
		return EXPENSES.filter((i) => {
			return i.belongsToWeek(momentObj);
		});
	}
}
