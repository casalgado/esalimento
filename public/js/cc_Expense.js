class Expense extends FireClass {
	constructor(id, category, provider, unitPrice, quantity, total) {
		super(id);
		this.category = category;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.provider = provider;
		this.date = moment().format();
	}

	static directory() {
		return 'expenses';
	}
}
