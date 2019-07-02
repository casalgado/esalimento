class Report {
	constructor(cash, bank, id) {
		this.id = id || moment().format('X');
		this.cash = cash;
		this.bank = bank;
	}

	weekly() {
		columnTitles = [ 'ingresos', 'gastos', 'utilidad neta' ];
	}

	getTableColumnTitles() {
		return [
			'inicio periodo',
			'ingresos',
			'gastos',
			'utilidad neta',
			'fin periodo',
			'efectivo',
			'banco',
			'por cobrar',
			'capital total'
		];
	}

	getTableContent() {
		return [ ',', this.grossIncome(), this.expenses(), this.netIncome(), ',', '_', '_', '_', '_' ];
	}

	grossIncome(date) {
		let orders = Order.byWeek(date);
		return orders.reduce((t, e) => {
			return { total: parseInt(t.total) + parseInt(e.total) };
		}).total;
		// last .total is necessary because reduce is returning an object of the form {total: 1234}
	}

	expenses(date) {
		let expenses = Expense.byWeek(date);
		return expenses.reduce((t, e) => {
			return { total: parseInt(t.total) + parseInt(e.total) };
		}).total;
		// last .total is necessary because reduce is returning an object of the form {total: 1234}
	}

	netIncome(date) {
		return this.grossIncome(date) - this.expenses(date);
	}
}
