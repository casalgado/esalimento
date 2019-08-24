class Expense extends Sheet {
	constructor(id, name, category, provider, quantity, units, unitPrice, total, date, comment) {
		super(id, name, comment);
		this.category = category;
		this.provider = provider;
		this.quantity = quantity;
		this.units = units || '';
		this.unitPrice = unitPrice;
		this.total = total;
		this.date = moment(date).format() || moment().format();
	}

	static sheet() {
		return 'expenses';
	}

	static local() {
		return EXPENSES;
	}

	static table() {
		return { title: 'Gastos', hasPagination: true };
	}

	card() {
		return {
			t    : this.category,
			main : {
				p : this.provider
			},
			side : {
				unidad   : this.unitPrice,
				cantidad : this.quantity,
				total    : this.total
			}
		};
	}

	table() {
		return {
			title   : 'Gastos',
			header  : [ 'Nombre', 'Total' ],
			row     : [ this.name, this.total ],
			sortby  : [ 'name', 'total' ],
			datestr : this.date
		};
	}

	static form() {
		return {
			fields : [
				{ customSelectField: [ 'name', 'provider' ] },
				{ customSelectField: [ 'provider', 'name' ] },
				{ customSelectField: [ 'category', 'name' ] },
				{ priceField: [ 'unitPrice', '0.01' ] },
				{ priceField: [ 'quantity', '0.5', '1' ] },
				{ basicField: [ 'units' ] },
				{ priceField: [ 'total' ] },
				{ basicField: [ 'date', 'date' ] }
			],
			button : 'Gasto'
		};
	}

	export() {
		return [
			moment(this.date).format('DD/MM/YYYY'),
			this.provider,
			this.name,
			this.total,
			this.quantity,
			this.units
		];
	}
}
