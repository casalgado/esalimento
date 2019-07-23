class Report extends Sheet {
	constructor(date, wealthAtStart, cash, bank, id, name) {
		super(id, name);
		this.date = date || moment();
		this.cash = cash;
		this.bank = bank;
		this.week = this.date.week();
		this.wealthAtStart = wealthAtStart;
		this.grossIncome = this.getGrossIncome();
		this.totalExpenses = this.getTotalExpenses();
		this.profit = this.grossIncome - this.totalExpenses;
		this.idealWealthAtEnd = this.wealthAtStart + this.profit;
		this.realWealthAtEnd = this.getRealWealthAtEnd();
		this.errorMargin = this.realWealthAtEnd - this.idealWealthAtEnd;
		this.locked = false;
	}

	save() {
		REPORTS.push(this);
	}

	static sheet() {
		return 'reports';
	}

	static local() {
		return REPORTS;
	}

	static extendsCreate() {
		return true;
	}

	static create(form) {
		const newObject = super.create(form);
		const props = {
			name : Report.setLocalId()
		};
		Object.assign(newObject, props);
		newObject.save();
		Form.reset();
	}

	datestr() {
		return 'TBD';
	}

	static setLocalId() {
		// this is the name property
		return 'R-' + moment().format('YY') + '-' + zeroPad(Report.local().length + 1, 2);
	}

	previousReport() {
		if (REPORTS.length == 0) {
			return { date: moment().subtract('1', 'week').format(), realWealthAtEnd: 0 };
		} else {
			return REPORTS.slice('-1')[0];
		}
	}

	getGrossIncome() {
		return Order.getWeekTotals(moment(this.date));
	}

	getTotalExpenses() {
		return Expense.getWeekTotals(moment(this.date));
	}

	getRealWealthAtEnd() {
		return this.cash + this.bank + Order.totalUnpaid(moment(this.date));
	}

	table() {
		return {
			title  : 'Reports',
			header : [ 'Nombre', 'Categoria', 'Costo', 'Venta' ],
			row    : [ this.name, this.category, this.cost, this.price ]
		};
	}
}
