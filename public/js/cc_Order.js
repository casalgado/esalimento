class Order extends Sheet {
	constructor(id, name, client, product, quantity, unitPrice, total, status) {
		super(id, name);
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.status = status || JSON.stringify(new Status());
		this.paid = false;
	}

	static sheet() {
		return 'orders';
	}

	static local() {
		return ORDERS;
	}

	table() {
		return {
			title   : 'Pedidos',
			header  : [ 'Producto', 'Cliente', 'Ctd', 'Total' ],
			row     : [ this.product, this.client, this.quantity, this.total ],
			datestr : JSON.parse(this.status).confirmed
		};
	}
}
