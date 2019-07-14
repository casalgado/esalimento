class Order extends Sheet {
	constructor(id, name, client, product, quantity, unitPrice, total, submitted, confirmed, produced, delivered) {
		super(id, name);
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.submitted = submitted;
		this.confirmed = confirmed || false;
		this.produced = produced || false;
		this.delivered = delivered || false;
		this.paid = false;
	}

	static sheet() {
		return 'orders';
	}

	static local() {
		return ORDERS;
	}

	static create() {
		console.log('create');
		Form.reset();
	}

	localId() {
		// @rename: this is the name property
		return 'No. de Pedido';
	}

	datestr() {
		return this.produced || this.confirmed || this.submitted;
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

	table() {
		return {
			title   : 'Pedidos',
			header  : [ 'Producto', 'Cliente', 'Ctd', 'Total' ],
			row     : [ this.product, this.client, this.quantity, this.total ],
			datestr : this.datestr()
		};
	}

	card() {
		return {
			t    : this.localId(),
			main : {
				p      : this.product,
				c      : this.client,
				pagada : this.paid,
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
			fields : [
				// the fields array is coded as follows:
				// keys = method called by Form
				// values = arguments for method called by form.
				// even though there is only one argument, it must be in an array.
				{ customSelectField: [ 'client', 'product' ] },
				{ customSelectField: [ 'product', 'client' ] },
				{ priceField: [ 'unitPrice' ] },
				{ priceField: [ 'quantity', '0.5', '1' ] },
				{ priceField: [ 'total' ] }
			],
			button : 'Crear Pedido'
		};
	}
}
