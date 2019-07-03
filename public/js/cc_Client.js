class Client extends FireClass {
	constructor(id, email, phone, address) {
		super(id);
		this.email = email || '';
		this.phone = phone || '';
		this.address = address || '';
	}

	static directory() {
		return 'clients';
	}
}
