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

	static extendsCreate() {
		return true;
	}

	static create(form) {
		const newObject = super.create(form);
		newObject.save();
		Form.reset();
		let category = document.getElementById('expenses-category');
		let provider = document.getElementById('expenses-provider');
		category.value = newObject.category;
		provider.value = newObject.provider;
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
				total    : accounting.fomatMoney(this.total)
			}
		};
	}

	table() {
		return {
			title   : 'Gastos',
			header  : [ 'Nombre', 'Total' ],
			row     : [ this.name, accounting.formatMoney(this.total) ],
			sortby  : [ 'name', 'total' ],
			datestr : this.date
		};
	}

	static form() {
		return {
			fields : [
				{ customSelectField: [ 'category', 'provider' ] },
				{ customSelectField: [ 'provider', 'name' ] },
				{ customSelectField: [ 'name', 'provider' ] },
				{ priceField: [ 'total' ] },
				{ priceField: [ 'quantity', '0.5', '1' ] },
				{ priceField: [ 'unitPrice', '0.01' ] },
				{ basicField: [ 'units' ] },
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
