class Report extends Sheet {
	constructor(id, name, cash, bank) {
		super(id, name);
		this.date = moment(this.previousReport().date).add('1', 'week').format(); // como guardo el dato de la semana?
		this.cash = cash;
		this.bank = bank;
		this.wealthAtStart = this.previousReport().realWealthAtEnd;
		this.grossIncome = this.getGrossIncome();
		this.totalExpenses = this.getTotalExpenses();
		this.profit = this.grossIncome - this.totalExpenses;
		this.idealWealthAtEnd = this.wealthAtStart + this.profit;
		this.realWealthAtEnd = this.getRealWealthAtEnd();
		this.errorMargin = this.realWealthAtEnd - this.idealWealthAtEnd;
		this.locked = false;
	}

	previousReport() {
		if (REPORTS.length == 0) {
			return { date: moment().subtract('1', 'week').format(), realWealthAtEnd: 0 };
		} else {
			return REPORTS.slice('-1')[0];
		}
	}

	getGrossIncome() {
		return Order.getTotals(moment(this.date));
	}

	getTotalExpenses() {
		return Expense.getTotals(moment(this.date));
	}

	getRealWealthAtEnd() {
		return this.cash + this.bank + Order.totalUnpaid(moment(this.date));
	}

	static sheet() {
		return 'reports';
	}

	static local() {
		return REPORTS;
	}

	table() {
		return {
			title   : 'Reports',
			header  : [ 'Nombre', 'Categoria', 'Costo', 'Venta' ],
			row     : [ this.name, this.category, this.cost, this.price ],
			datestr : ''
		};
	}
}
