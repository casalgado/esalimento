class Paid extends Order {
	constructor(id, name, client, product, quantity, total) {
		super(id, name, client, product);
		this.quantity = quantity;
		this.total = total;
	}

	static table() {
		return { title: 'Pedidos Pagados', hasPagination: true };
	}

	static sheet() {
		return 'pagados';
	}

	static hasDayTable() {
		return true;
	}

	static instantiate(orderInstance) {
		const o = orderInstance;
		return new this(o.id, o.name, o.client, o.product, o.quantity, o.total);
	}

	static byDay(momentObj) {
		let objects = this.local().filter((e) => {
			return moment(e.paid).isSame(momentObj, 'day');
		});
		return objects.map((o) => {
			return Paid.instantiate(o);
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
