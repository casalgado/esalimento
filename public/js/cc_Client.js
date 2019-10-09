class Client extends Sheet {
	constructor(id, name, email, phone, address) {
		super(id, name);
		this.email = email || '';
		this.phone = phone || '';
		this.address = address || '';
	}

	static sheet() {
		return 'clients';
	}

	static local() {
		return CLIENTS;
	}

	datestr() {
		return this.createdAt;
	}

	totalOrders() {
		return ORDERS.filter((e) => {
			return e.client == this.name;
		}).length;
	}

	orderDetails() {
		let tally = {};
		let tallyArray = [];
		ORDERS.filter((e) => {
			return e.client == this.name;
		}).map((e) => {
			if (tally[e.product]) {
				tally[e.product]++;
			} else {
				tally[e.product] = 1;
			}
		});
		for (const prop in tally) {
			tallyArray.push({ product: prop, amount: tally[prop] });
		}
		return tallyArray.sortBy('amount').reverse();
	}

	lastOrder() {
		let daysAgo = moment().diff(
			moment(
				ORDERS.filter((e) => {
					return e.client == this.name;
				})
					.map((e) => {
						return e.produced;
					})
					.reduce((latest, current) => {
						return moment(current).isAfter(latest) ? current : latest;
					}, '2018-01-01T00:00:00-05:00')
			),
			'days'
		);
		let string = `${daysAgo} Dia`;
		if (daysAgo == 1) {
			return string;
		} else {
			return string + 's';
		}
	}

	static byPeriod() {
		return this.local().sortBy('name').reverse();
	}

	static table() {
		return {
			title         : 'Clientes',
			header        : [ 'Nombre', 'Pedidos', 'Pidio hace' ],
			hasPagination : false,
			period        : false
		};
	}

	table() {
		return {
			row     : [ this.name, this.totalOrders(), this.lastOrder() ],
			datestr : this.datestr()
		};
	}

	card() {
		return {
			t    : this.name,
			main : {
				nombre : this.name,
				email  : this.email
			},
			side : {
				telefono  : this.phone,
				direccion : this.address
			}
		};
	}

	static form() {
		return {
			fields : [
				{ basicField: { property: 'name', type: 'text' } },
				{ basicField: { property: 'email', type: 'email' } },
				{ basicField: { property: 'phone', type: 'number' } },
				{ basicField: { property: 'address', type: 'text' } }
			],
			button : 'Cliente'
		};
	}
}
