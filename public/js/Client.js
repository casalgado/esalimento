class Client {
	constructor(name, email, phone, address) {
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.address = address;
	}

	static create(form) {
		let [ name, email, phone, address ] = getFormValues(form);
		let client = new Client(name, email, phone, address);
		client.save().then(() => {
			form.reset();
		});
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

	static drawAll(id) {
		let list, item;
		list = document.createElement('ul');
		document.getElementById(id).appendChild(list);
		for (let i = 0; i < CLIENTS.length; i++) {
			item = document.createElement('li');
			item.innerHTML = CLIENTS[i].name;
			list.appendChild(item);
		}
	}
}
