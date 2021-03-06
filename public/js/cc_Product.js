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

	datestr() {
		return this.createdAt;
	}

	static table() {
		return {
			title         : 'Products',
			header        : [ 'Nombre', 'Categoria', 'Costo', 'Venta' ],
			hasPagination : false,
			period        : false
		};
	}

	table() {
		return {
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

	static form() {
		return {
			fields : [
				{ basicField: { property: 'name', type: 'text' } },
				{ basicField: { property: 'category', type: 'text' } },
				{ basicField: { property: 'price', type: 'number' } },
				{ basicField: { property: 'cost', type: 'number' } }
			],
			button : 'Producto'
		};
	}
}
