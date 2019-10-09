class Report extends Sheet {
	constructor(name, wealthAtStart, cash, bank, date, id) {
		super(id, name);
		this.date = date || moment().format();
		this.cash = cash || 0;
		this.bank = bank || 0;
		this.unpaid = null;
		this.wealthAtStart = wealthAtStart;
	}

	static sheet() {
		return 'reports';
	}

	static local() {
		return REPORTS;
	}

	static create() {
		const pastReport = Report.getLast();
		if (!moment(pastReport.date).isSame(moment(), 'week')) {
			pastReport.setUnpaid().update();
			let newReport = new Report(this.setLocalId(), pastReport.realWealthAtEnd());
			newReport.save();
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
		return this.cash + this.bank + this.getUnpaid();
	}

	getUnpaid() {
		return this.unpaid || Order.totalUnpaid();
	}

	setUnpaid() {
		let unpaid = this.unpaid || Order.totalUnpaid();
		this.unpaid = unpaid;
		return this;
	}

	datestr() {
		return this.date;
	}

	card() {
		return {
			t       : `${this.name}`,
			detail  : {
				main : {
					start   : accounting.formatMoney(this.wealthAtStart),
					income  : accounting.formatMoney(this.grossIncome()),
					expense : accounting.formatMoney(this.grossExpenses()),
					end     : accounting.formatMoney(this.idealWealthAtEnd()),
					'...'   : '...'
				},
				side : {
					cash   : accounting.formatMoney(this.cash),
					bank   : accounting.formatMoney(this.bank),
					unpaid : accounting.formatMoney(this.getUnpaid()),
					total  : accounting.formatMoney(this.realWealthAtEnd())
				}
			},
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
					args       : { pathname: '/reportes#editar', state: { objectId: this.id } }
				},
				{ btnId: 'deleteBtn', btnTitle: 'delete', btnMain: 'X', funcToCall: Report.remove, args: this }
			]
		};
	}

	static table() {
		return {
			title         : 'Reportes',
			header        : [ 'Nombre', 'Ingresos', 'Gastos', 'U. Neta' ],
			hasPagination : true
		};
	}

	table() {
		return {
			row      : [ this.name, this.grossIncome(), this.grossExpenses(), this.profit() ],
			rowClass : this.paid == '' ? 'unpaid' : 'paid'
		};
	}
}
