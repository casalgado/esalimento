class Product extends FireClass {
	constructor(id, category, price, cost) {
		super(id);
		this.category = category || '';
		this.price = price;
		this.cost = cost;
	}

	static directory() {
		return 'products';
	}

	static local() {
		return PRODUCTS;
	}
}
