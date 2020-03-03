class Unpaid extends Order {
	constructor(id, name, client, product, quantity, total, produced) {
		super(id, name, client, product);
		this.quantity = quantity;
		this.total = total;
		this.produced = produced;
	}

	static sheet() {
		return 'unpaid';
	}

	static instantiate(orderInstance) {
		const o = orderInstance;
		return new this(o.id, o.name, o.client, o.product, o.quantity, o.total, o.produced);
	}

	static byPeriod() {
		let objects = this.local().filter((e) => {
			return e.paid == '' && e.client != '';
		});
		return objects.map((o) => {
			return Unpaid.instantiate(o);
		});
	}

	static table() {
		return {
			title         : 'Pedidos por cobrar',
			header        : [ 'Dia', 'Producto', 'Ctd', 'Cliente', 'Total' ],
			sortby        : [ 'product', 'quantity', 'client', 'total' ],
			hasPagination : false,
			period        : false
		};
	}

	table() {
		return {
			title   : 'Ventas Dia',
			row     : [ moment(this.produced).format('DD/M'), this.product, this.quantity, this.client, this.total ],
			datestr : this.date
		};
	}
}
