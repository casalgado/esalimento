class Report extends Sheet {
	constructor(id, name, category, price, cost) {
		super(id, name);
		this.category = category || '';
		this.price = price;
		this.cost = cost;
	}

	static sheet() {
		return 'reports';
	}

	static local() {
		return REPORTS;
	}

	table() {
		return {
			title   : 'Reports',
			header  : [ 'Nombre', 'Categoria', 'Costo', 'Venta' ],
			row     : [ this.name, this.category, this.cost, this.price ],
			datestr : ''
		};
	}
}
