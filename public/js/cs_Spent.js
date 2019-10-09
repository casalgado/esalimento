class Spent extends Expense {
	constructor(id, name, total, date) {
		super(id, name);
		this.total = total;
		this.date = moment(date).format() || moment().format();
	}

	static local() {
		return EXPENSES;
	}

	static sheet() {
		return 'spent';
	}

	static hasDayTable() {
		return true;
	}

	static instantiate(expenseInstance) {
		const o = expenseInstance;
		return new this(o.id, o.name, o.total, o.date);
	}

	static byPeriod(momentObj, period) {
		let objects = super.byPeriod(momentObj, period);
		return objects.map((o) => {
			return Spent.instantiate(o);
		});
	}

	static table() {
		return {
			title         : 'Egresos',
			header        : [ 'Dia ', 'Nombre', 'Total' ],
			sortby        : [ 'date', 'name', 'total' ],
			hasPagination : true,
			period        : 'day'
		};
	}

	table() {
		return {
			row     : [ moment(this.date).format('DD/M'), this.name, accounting.formatMoney(this.total) ],
			datestr : this.date
		};
	}
}
