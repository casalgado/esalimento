class Unpaid extends Order {
	constructor(id, name, client, product, quantity, total, produced) {
		super(id, name, client, product);
		this.quantity = quantity;
		this.total = total;
		this.produced = produced;
	}

	static table() {
		return { title: 'Pedidos por Cobrar', hasPagination: false, period: false };
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
			return e.paid == '';
		});
		return objects.map((o) => {
			return Unpaid.instantiate(o);
		});
	}

	table() {
		return {
			title   : 'Ventas Dia',
			header  : [ 'Dia', 'Producto', 'Ctd', 'Cliente', 'Total' ],
			row     : [
				moment(this.produced).format('DD/M'),
				this.product,
				this.quantity,
				this.client,
				this.total.formatK()
			],
			sortby  : [ 'product', 'quantity', 'client', 'total' ],
			datestr : this.date
		};
	}
}
