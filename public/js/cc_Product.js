class Product extends Sheet {
	constructor(id, name, category, price, cost) {
		super(id, name);
		this.category = category || '';
		this.price = price;
		this.cost = cost;
	}

	static sheet() {
		return 'products';
	}

	static local() {
		return PRODUCTS;
	}

	table() {
		return {
			title   : 'Products',
			header  : [ 'Nombre', 'Categoria', 'Costo', 'Venta' ],
			row     : [ this.name, this.category, this.cost, this.price ],
			datestr : ''
		};
	}

	card() {
		return {
			t    : this.name,
			main : {
				categoria : this.category
			},
			side : {
				precio : this.price,
				costo  : this.cost
			}
		};
	}
}
