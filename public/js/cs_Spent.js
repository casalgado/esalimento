class Spent extends Expense {
	constructor(id, name, total, date) {
		super(id, name);
		this.total = total;
		this.date = moment(date).format() || moment().format();
	}

	static table() {
		return { title: 'Egresos', hasPagination: true };
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

	static byDay(momentObj) {
		let objects = super.byDay(momentObj);
		return objects.map((o) => {
			return Spent.instantiate(o);
		});
	}

	table() {
		return {
			title   : 'Egresos',
			header  : [ 'Dia ', 'Nombre', 'Total' ],
			row     : [ moment(this.date).format('DD/M'), this.name, accounting.formatMoney(this.total) ],
			sortby  : [ 'name', 'total' ],
			datestr : this.date
		};
	}
}
