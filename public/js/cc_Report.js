class Report extends Sheet {
	constructor(id, name, weekDate, cash, bank, realWealthAtStart, idealWealthAtEnd, realWealthAtEnd, locked) {
		super(id, name);
		this.weekDate = weekDate; // como guardo el dato de la semana?
		this.cash = cash || '';
		this.bank = bank || '';
		this.wealthAtStart = this.previousReport('realWealthAtEnd');
		this.profit = this.getProfit();
		this.expenses = this.getProfit();
		this.locked = false;
	}

	previousReport(prop) {
		console.log(prop);
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
