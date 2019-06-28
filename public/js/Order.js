class Order {
	constructor(client, product, quantity, unitPrice, total, status, paid, id) {
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.status = status || new Status();
		this.paid = false;
		this.id = id || '';
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
			orders[i].status = Status.parse(JSON.parse(orders[i].status));
		}
		return orders;
	}

	dateConfirmed() {
		if (this.status.confirmed) {
			return this.status.confirmed.format('dddd MMMM D');
		}
	}

	dateProduced() {
		if (this.status.produced) {
			return this.status.produced.format('dddd MMMM D');
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

	getTableColumnTitles() {
		return [ 'producto', 'confirmed', 'ctd', 'estado' ];
	}

	getTableContent() {
		return [ this.product, moment(this.status.confirmed).format('D MMMM'), this.quantity, this.currentStatus() ];
	}

	getCustomModalTitles() {
		return [ 'producto', 'cliente', 'total', 'status' ];
	}

	getCustomModalContent() {
		return [ this.product, this.client, this.total, this.status ];
	}

	currentStatus() {
		let entries, currentStatus;
		entries = Object.entries(this.status);
		for (let i = entries.length - 1; i >= 0; i--) {
			if (entries[i][1]) {
				currentStatus = entries[i][0];
				break;
			}
		}
		return currentStatus;
	}

	getFormValues() {
		return [ this.client, this.product, this.unitPrice, this.quantity, this.total ];
	}

	clientCode() {
		return this.client
			.toUpperCase()
			.split(' ')
			.map((i) => {
				return i.charAt(0);
			})
			.join('.');
	}

	static getById(id) {
		return ORDERS.find((obj) => {
			return obj.id === id;
		});
	}

	belongsToWeek(date) {
		return moment(this.status.confirmed).isSame(date, 'week') ? true : false;
	}

	static byWeek() {
		return ORDERS.filter((i) => {
			return i.belongsToWeek(SHOWING.current);
		});
	}
}
