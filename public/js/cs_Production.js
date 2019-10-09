class Production extends Order {
	constructor(id, name, client, product, quantity) {
		super(id, name, client, product);
		this.quantity = quantity;
	}

	static local() {
		return ORDERS;
	}

	static sheet() {
		return 'production';
	}

	static hasDayTable() {
		return true;
	}

	static instantiate(orderInstance) {
		const o = orderInstance;
		return new this(o.id, o.name, o.client, o.product, o.quantity);
	}

	static byPeriod(momentObj, period) {
		let objects = super.byPeriod(momentObj, period);
		return objects.map((o) => {
			return Production.instantiate(o);
		});
	}

	static table() {
		return {
			title         : 'Produccion del Dia',
			header        : [ 'Producto', 'Ctd', 'Cliente' ],
			hasPagination : true,
			period        : 'day'
		};
	}

	table() {
		return {
			row     : [ this.product, this.quantity, this.client ],
			datestr : this.date
		};
	}
}
