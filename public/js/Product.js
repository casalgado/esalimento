class Product {
	constructor(name, price, cost) {
		this.name = name;
		this.price = price;
		this.cost = cost;
	}

	static create(form) {
		let [ name, price, cost ] = getFormValues(form);
		let product = new Product(name, price, cost);
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

	static drawAll(id) {
		let list, item;
		list = document.createElement('ul');
		document.getElementById(id).appendChild(list);
		for (let i = 0; i < PRODUCTS.length; i++) {
			item = document.createElement('li');
			item.innerHTML = PRODUCTS[i].name;
			list.appendChild(item);
		}
	}
}
