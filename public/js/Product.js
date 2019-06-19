class Product {
	constructor(name, category, price, cost) {
		this.name = name;
		this.category = category || '';
		this.price = price;
		this.cost = cost;
	}

	static create(form) {
		let [ name, category, price, cost ] = getFormValues(form);
		let product = new Product(name, category, price, cost);
		product.save().then(() => {
			form.reset();
		});
	}

	save() {
		return new Promise((resolve) => {
			// @clean if id is not going to be used, this can be refactored
			// client var doesn't have to be declared or returned
			var product = firebase.database().ref(`devAccount/products`).push(this);
			return resolve(product);
		}).then((product) => {
			PRODUCTS.push(this);
		});
	}
}
