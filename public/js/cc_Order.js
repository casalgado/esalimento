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

	localId() {
		return 'No. de Pedido';
	}

	datestr() {
		let current = this.delivered || this.prepared || this.confirmed || this.submitted;
		return current;
	}

	currentStatus() {
		if (this.delivered) {
			return 'entregada';
		}
		if (this.produced) {
			return 'producida';
		}
		if (this.confirmed) {
			return 'confirmada';
		}
		if (this.submitted) {
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
				producto : this.product,
				cliente  : this.client,
				pagada   : this.paid,
				status   : this.currentStatus()
			},
			side : {
				unidad   : this.unitPrice,
				cantidad : this.quantity,
				total    : this.total
			}
		};
	}
}
