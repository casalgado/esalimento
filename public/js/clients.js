class Client {
	constructor(name, email, phone, address) {
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.address = address;
	}

	save() {
		return new Promise((resolve) => {
			// @clean if id is not going to be used, this can be refactored
			// client var doesn't have to be declared or returned
			var client = firebase.database().ref(`devAccount/clients`).push(this);
			return resolve(client);
		}).then((client) => {
			CLIENTS.push(this);
		});
	}
}

function createClient(form) {
	let [ name, email, phone, address ] = getFormValues(form);
	let client = new Client(name, email, phone, address);
	client.save().then(() => {
		form.reset();
	});
}
