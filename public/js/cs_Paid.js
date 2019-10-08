class Paid extends Order {
	constructor(id, name, client, product, quantity, total) {
		super(id, name, client, product);
		this.quantity = quantity;
		this.total = total;
	}

	static sheet() {
		return 'ingresos';
	}

	static local() {
		return ORDERS;
	}

	static instantiate(orderInstance) {
		const o = orderInstance;
		return new this(o.id, o.name, o.client, o.product, o.quantity, o.total);
	}

	static byPeriod(momentObj) {
		return this.local()
			.filter((e) => {
				return moment(e.paid).isSame(momentObj, 'day');
			})
			.map((o) => {
				return Paid.instantiate(o);
			});
	}

	static hasDayTable() {
		return true;
	}

	static table() {
		return { title: 'Ingresos', hasPagination: true, period: 'day' };
	}

	table() {
		return {
			title   : 'Ingresos',
			header  : [ 'Producto', 'Ctd', 'Cliente', 'Total' ],
			row     : [ this.product, this.quantity, this.client, this.total ],
			datestr : this.date
		};
	}
}
