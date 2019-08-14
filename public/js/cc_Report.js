class Report extends Sheet {
	constructor(name, wealthAtStart, cash, bank, date, id) {
		super(id, name);
		this.date = date || moment().format();
		this.cash = cash || 0;
		this.bank = bank || 0;
		this.wealthAtStart = wealthAtStart;
	}

	static sheet() {
		return 'reports';
	}

	static local() {
		return REPORTS;
	}

	static create() {
		const past = Report.getLast();
		if (!moment(past.date).isSame(moment(), 'week')) {
			let newReport = new Report(this.setLocalId(), past.realWealthAtEnd());
			newReport.save();
		} else {
			console.log('Report not created');
		}
	}

	static setLocalId() {
		// this is the name property
		return 'R-' + moment().format('YY') + '-' + zeroPad(Report.local().length + 1, 2);
	}

	static getLast() {
		return REPORTS.slice('-1')[0];
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
		return this.cash + this.bank + Order.totalUnpaid();
	}
	errorMargin() {
		return this.idealWealthAtEnd() - this.realWealthAtEnd();
	}

	datestr() {
		return this.date;
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

	totalMoney() {
		return 'test';
	}

	static table() {
		return { title: 'Reportes', hasPagination: true };
	}

	card() {
		return {
			t    : 'Reporte ' + this.name,
			main : {
				start : accounting.formatMoney(this.wealthAtStart),
				income  : accounting.formatMoney(this.grossIncome()),
				expense : accounting.formatMoney(this.grossExpenses()),
				end   : accounting.formatMoney(this.idealWealthAtEnd())
			},
			side : {
				cash          : accounting.formatMoney(this.cash),
				bank          : accounting.formatMoney(this.bank),
				unpaid        : accounting.formatMoney(Order.totalUnpaid()),
				'total money' : accounting.formatMoney(this.realWealthAtEnd())
			}
		};
	}

	table() {
		return {
			header : [ 'Nombre', 'Ingresos', 'Gastos', 'U. Neta' ],
			row    : [ this.name, this.grossIncome(), this.grossExpenses(), this.profit() ]
		};
	}
}
