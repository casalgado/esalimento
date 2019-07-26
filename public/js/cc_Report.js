class Report extends Sheet {
	constructor(date, wealthAtStart, cash, bank, id, name) {
		super(id, name);
		this.date = date || moment();
		this.cash = cash;
		this.bank = bank;
		this.wealthAtStart = wealthAtStart;
		this.locked = false;
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

	week() {
		return this.date.week();
	}

	grossIncome() {
		return Order.getWeekTotals(moment(this.date));
	}
	grossExpenses() {
		return Expense.getWeekTotals(moment(this.date));
	}
	profit() {
		return this.grossIncome() - this.grossExpenses();
	}
	idealWealthAtEnd() {
		return this.wealthAtStart + this.profit();
	}
	realWealthAtEnd() {
		return this.cash + this.bank; // + Order.totalUnpaid();
	}
	errorMargin() {
		return this.idealWealthAtEnd() - this.realWealthAtEnd();
	}

	datestr() {
		return this.date;
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

	getRealWealthAtEnd() {
		return this.cash + this.bank + Order.totalUnpaid(moment(this.date));
	}

	dateAtStart() {
		return moment(this.date).startOf('week').format('D MMM');
	}

	dateAtEnd() {
		return moment(this.date).endOf('week').format('D MMM');
	}

	static table() {
		return { title: 'Reportes', hasPagination: true };
	}

	card() {
		return {
			t    : 'Reporte ' + this.name,
			main : {
				d : this.dateAtStart(),
				i : this.grossIncome(),
				e : this.grossExpenses()
			},
			side : {
				error : this.errorMargin(),
				p     : this.profit()
			}
		};
	}

	table() {
		return {
			header : [ 'Nombre', 'start D', 'at Start', 'Profit', 'at End' ],
			row    : [ this.name, this.dateAtStart(), this.wealthAtStart, this.profit(), this.realWealthAtEnd() ]
		};
	}
}
