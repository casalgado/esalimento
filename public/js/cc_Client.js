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

	table() {
		return {
			title   : 'Clientes',
			header  : [ 'Nombre', 'Telefono', 'Direccion' ],
			row     : [ this.name, this.phone, this.address ],
			datestr : ''
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
				{ basicField: [ 'name', 'text' ] },
				{ basicField: [ 'email', 'email' ] },
				{ basicField: [ 'phone', 'number' ] },
				{ basicField: [ 'address', 'text' ] }
			],
			button : 'Crear Cliente'
		};
	}
}
