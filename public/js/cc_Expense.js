class Expense extends Sheet {
	constructor(id, name, category, provider, unitPrice, quantity, total) {
		super(id, name);
		this.category = category;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.provider = provider;
		this.date = moment().format();
	}

	static sheet() {
		return 'expenses';
	}

	static local() {
		return EXPENSES;
	}

	table() {
		return {
			title   : 'Expenses',
			header  : [ 'Nombre', 'Total' ],
			row     : [ this.name, this.total ],
			datestr : this.date
		};
	}
}
