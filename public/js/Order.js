class Order {
	constructor(client, product, quantity, unitPrice, total, id) {
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.status = new Status();
		this.paid = false;
		this.id = '';
	}

	static create(form) {
		let [ client, product, unitPrice, quantity, total ] = getFormValues(form);
		let order = new Order(client, product, quantity, unitPrice, total);
		order.save().then((order) => {
			appendToTable('showOrdersTable', order);
			form.reset();
		});
	}

	save() {
		return new Promise((resolve) => {
			let order, status;
			status = this.status;
			this.status = JSON.stringify(this.status);
			order = firebase.database().ref(`devAccount/orders`).push(this);
			return resolve([ order.key, status ]);
		}).then((values) => {
			firebase.database().ref(`devAccount/orders`).child(values[0]).update({
				id : values[0]
			});
			this.id = values[0];
			this.status = values[1];
			ORDERS.push(this);
			return this;
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

	getColumnTitles() {
		return [ 'producto', 'cantidad', 'estado' ];
	}

	getTableContent() {
		return [ this.product, this.quantity, this.currentStatus() ];
	}

	currentStatus() {
		let keys, values, stat;
		keys = Object.keys(this.status);
		values = Object.values(this.status);
		for (let i = keys.length - 1; i >= 0; i--) {
			if (values[i]) {
				stat = keys[i];
				break;
			}
		}
		return stat;
	}
}
