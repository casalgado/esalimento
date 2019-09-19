class Unpaid extends Order {
	constructor(id, name, client, product, quantity, total) {
		super(id, name, client, product);
		this.quantity = quantity;
		this.total = total;
	}

	static table() {
		return { title: 'Pedidos por Cobrar', hasPagination: false };
	}

	static sheet() {
		return 'pagados';
	}

	static instantiate(orderInstance) {
		const o = orderInstance;
		return new this(o.id, o.name, o.client, o.product, o.quantity, o.total);
	}

	static byWeek(momentObj) {
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
			header  : [ 'Producto', 'Ctd', 'Cliente', 'Total' ],
			row     : [ this.product, this.quantity, this.client, this.total ],
			datestr : this.date
		};
	}
}
