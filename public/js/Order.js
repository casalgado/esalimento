class Order {
	constructor(client, product, quantity, unitPrice, total) {
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.status = new Status();
	}

	static create(form) {
		let [ client, product, quantity, unitPrice, total ] = getFormValues(form);
		let order = new Order(client, product, quantity, unitPrice, total);
		order.save().then(() => {
			form.reset();
		});
	}

	save() {
		return new Promise((resolve) => {
			let status = this.status;
			this.status = JSON.stringify(this.status);
			firebase.database().ref(`devAccount/orders`).push(this);
			return resolve(status);
		}).then((status) => {
			this.status = status;
			ORDERS.push(this);
		});
	}

	static instantiateStatus(orders) {
		for (let i = 0; i < orders.length; i++) {
			orders[i].status = new Status(JSON.parse(orders[i].status));
		}
		return orders;
	}

	dateConfirmed() {
		if (this.status.confirmed) {
			return this.status.confirmed.format('dddd MMMM D');
		}
	}

	datePrepared() {
		if (this.status.prepared) {
			return this.status.prepared.format('dddd MMMM D');
		}
	}

	dateDelivered() {
		if (this.status.delivered) {
			return this.status.delivered.format('dddd MMMM D');
		}
	}

	date(stage) {
		if (this.status[stage]) {
			return this.status[stage].format('dddd MMMM D');
		}
	}
}
