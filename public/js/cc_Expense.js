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
			t       : `${this.quantity}${this.units} ${this.name}, ${this.provider} `,
			btnData : [
				{
					btnId    : '',
					btnTitle : moment(this.date).format('MMMM'),
					btnMain  : moment(this.date).format('DD'),
					args     : this
				},
				{
					btnId      : 'editBtn',
					btnTitle   : 'edit',
					btnMain    : 'E',
					funcToCall : onNavigate,
					args       : { pathname: '/gastos#editar', state: { objectId: this.id } }
				},
				{ btnId: 'deleteBtn', btnTitle: 'delete', btnMain: 'X', funcToCall: Expense.remove, args: this }
			]
		};
	}

	static table() {
		return {
			title         : 'Gastos',
			header        : [ 'Dia ', 'Nombre', 'Total' ],
			sortby        : [ 'date', 'name', 'total' ],
			hasPagination : true,
			period        : 'week'
		};
	}

	table() {
		return {
			row      : [ moment(this.date).format('DD/M'), this.name, accounting.formatMoney(this.total) ],
			rowClass : this.paid == '' ? 'unpaid' : 'paid',
			datestr  : this.date
		};
	}

	static form() {
		return {
			fields    : [
				{ customSelectField: { property: 'provider', target: 'name' } },
				{ customSelectField: { property: 'category', target: 'provider' } },
				{ customSelectField: { property: 'name', target: 'provider' } },
				{ priceField: { property: 'total', label: 'total:' } },
				{ priceField: { property: 'quantity', step: '0.5', defaultValue: '1', label: 'cantidad:' } },
				{ priceField: { property: 'unitPrice', step: '0.01', label: 'precio unitario:' } },
				{ basicField: { property: 'units', type: 'text', defaultValue: 'g', label: 'unidades:' } },
				{ basicField: { property: 'date', type: 'date', label: 'fecha de compra:' } }
			],
			button    : 'Gasto',
			title     : 'Ingresar Gasto',
			editTitle : 'Editar Gasto'
		};
	}

	export() {
		return [
			moment(this.date).format('DD/MM/YYYY'),
			this.provider,
			this.name,
			this.total,
			this.quantity,
			this.units,
			this.category
		];
	}
}

// Costo de Mercancia Vendida
// Costos Indirectos de Fabricacion
// Gastos Administracion y Ventas
