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
			fields : {
				// custom-select means that these fields will modify each others select menus.
				// this means, if client is selected, the product's select menu is filtered to show
				// only products that this client has bought before.
				// the same if a product is selected, the client's select menu is filtered to show
				// only clients who have bought this product.
				// it supports only two custom-select fields per form at the moment.
				'custom-select' : [ client, product ],
				// price means something similar. If the three 'price' fields are included
				// (this means quantity, unitPrice, total),
				// the interactions between them should be added. If only one price field
				// is necessary (like with the products class), it is not a price field!.
				// it is a normal number field because it has no special interaction.
				price           : [ unitPrice, quantity, total ]
			},
			button : 'Crear Pedido'
		};
	}
}
