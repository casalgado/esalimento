class Production extends Order {
	constructor(id, name, client, product, quantity) {
		super(id, name, client, product);
		this.quantity = quantity;
	}

	static table() {
		return { title: 'Produccion del Dia', hasPagination: true };
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

	static byDay(momentObj) {
		let objects = super.byDay(momentObj);
		return objects.map((o) => {
			return Production.instantiate(o);
		});
	}

	table() {
		return {
			title   : 'Produccion del Dia',
			header  : [ 'Producto', 'Ctd', 'Cliente' ],
			row     : [ this.product, this.quantity, this.client ],
			datestr : this.date
		};
	}
}
