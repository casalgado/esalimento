class Expense {
	constructor(name, category, price, provider) {
		this.name = name;
		this.category = category;
		this.price = price;
		this.provider = provider;
	}

	static create(form) {
		let [ name, category, price, provider ] = getFormValues(form);
		let product = new Expense(name, category, price, provider);
		product.save().then(() => {
			form.reset();
		});
	}

	save() {
		return new Promise((resolve) => {
			// @clean if id is not going to be used, this can be refactored
			// client var doesn't have to be declared or returned
			var product = firebase.database().ref(`devAccount/expenses`).push(this);
			return resolve(product);
		}).then((product) => {
			EXPENSES.push(this);
		});
	}

	getColumnTitles() {
		return [ 'nombre', 'precio', 'proveedor' ];
	}

	getTableContent() {
		return [ this.name, this.price, this.provider ];
	}
}
