class Report {
	constructor(cash, bank, id) {
		this.id = id || '';
		this.cash = cash;
		this.bank = bank;
	}

	weekly() {
		columnTitles = [ 'ingresos', 'gastos', 'utilidad neta' ];
	}

	total() {
		columnTitles = [ 'inicio periodo', 'utilidad neta', 'fin periodo', 'efectivo', 'banco', 'por cobrar' ];
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
