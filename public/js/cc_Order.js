class Order extends Sheet {
	constructor(
		id,
		name,
		client,
		product,
		quantity,
		unitPrice,
		total,
		submitted,
		confirmed,
		produced,
		delivered,
		paid
	) {
		super(id, name);
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.submitted = submitted || '';
		this.confirmed = confirmed || '';
		this.produced = produced || null;
		this.delivered = delivered || null;
		this.paid = paid || '';
	}

	static sheet() {
		return 'orders';
	}

	static local() {
		return ORDERS;
	}

	static extendsCreate() {
		return true;
	}

	static create(form) {
		const newObject = super.create(form);
		const props = {
			name      : Order.setLocalId(),
			submitted : newObject.confirmed || moment().format()
		};
		Object.assign(newObject, props);
		newObject.save();
		Form.reset();
	}

	static setLocalId() {
		// this is the name property
		return 'P-' + moment().format('YY') + '-' + zeroPad(Order.local().length + 1, 3);
	}

	datestr() {
		return this.produced || this.confirmed;
	}

	paidstr() {
		if (this.paid != '') {
			return moment(this.paid).format('D-MMM');
		} else {
			return 'No';
		}
	}

	currentStatus() {
		if (this.delivered) {
			return 'entregada';
		} else if (this.produced) {
			return 'producida';
		} else if (this.confirmed) {
			return 'confirmada';
		} else {
			return 'recibida';
		}
	}

	static table() {
		return { title: 'Pedidos', hasPagination: true };
	}

	table() {
		return {
			title   : 'Pedidos',
			header  : [ 'Fecha', 'Producto', 'Cliente', 'Ctd', 'Total' ],
			row     : [ moment(this.confirmed).format('DD/MM'), this.product, this.client, this.quantity, this.total ],
			sortby  : [ 'confirmed', 'product', 'client', 'quantity', 'total' ],
			datestr : this.datestr()
		};
	}

	card() {
		return {
			t    : 'Pedido ' + this.name,
			main : {
				p      : this.product,
				c      : this.client,
				pagada : this.paidstr(),
				status : this.currentStatus()
			},
			side : {
				unidad   : this.unitPrice,
				cantidad : this.quantity,
				total    : this.total
			}
		};
	}

	static form() {
		return {
			fields         : [
				// the fields array is coded as follows:
				// keys = method called by Form
				// values = arguments for method called by form.
				// even though there is only one argument, it must be in an array.
				{ customSelectField: [ 'client', 'product' ] },
				{ customSelectField: [ 'product', 'client' ] },
				{ priceField: [ 'unitPrice' ] },
				{ priceField: [ 'quantity', '0.5', '1' ] },
				{ priceField: [ 'total' ] },
				{ basicField: [ 'confirmed', 'date' ] },
				{ basicField: [ 'produced', 'date' ] },
				{ basicField: [ 'delivered', 'date' ] }
			],
			editFormFields : [
				{ basicField: [ 'produced', 'date' ] },
				{ basicField: [ 'delivered', 'date' ] },
				{ basicField: [ 'paid', 'date' ] }
			],
			button         : 'Pedido'
		};
	}

	static totalUnpaid() {
		return this.local().reduce((total, current) => {
			if (current.paid != '') {
				return total;
			} else {
				return total + parseInt(current.total);
			}
		}, 0);
	}

	static listUnpaid() {
		return this.local().filter((e) => {
			return e.paid == '';
		});
	}
}
