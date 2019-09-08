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
		Form.removeFormEvents();
		document.getElementById('expenses-category').value = newObject.category;
		document.getElementById('expenses-provider').value = newObject.provider;
		document.getElementById('expenses-date').value = moment(newObject.date).format('YYYY-MM-DD');
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
				total    : accounting.formatMoney(this.total)
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
				{ customSelectField: { property: 'category', target: 'provider' } },
				{ customSelectField: { property: 'provider', target: 'name' } },
				{ customSelectField: { property: 'name', target: 'provider' } },
				{ priceField: { property: 'total', label: 'total:' } },
				{ priceField: { property: 'quantity', step: '0.5', defaultValue: '1', label: 'cantidad:' } },
				{ priceField: { property: 'unitPrice', step: '0.01', label: 'precio unitario:' } },
				{ basicField: { property: 'units', type: 'text', defaultValue: 'g', label: 'unidades:' } },
				{ basicField: { property: 'date', type: 'date', label: 'fecha de compra:' } }
			],
			button : 'Gasto',
			title  : 'Ingresar Gasto'
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
