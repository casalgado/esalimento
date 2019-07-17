class Sheet {
	constructor(id, name) {
		this.id = id || '';
		this.name = name;
	}

	static path() {
		return `devAccount/${this.sheet()}`;
	}

	save() {
		const c = this.constructor;
		firebase.database().ref(c.path()).push(this).then((e) => {
			firebase.database().ref(c.path()).child(e.getKey()).update({
				id : e.getKey()
			});
			this.id = e.getKey();
			c.local().push(this);
		});
	}

	static create(form) {
		const newObject = new this();
		const props = Form.getFormValues(form);
		Object.assign(newObject, props);
		if (this.extendsCreate) {
			return newObject;
		} else {
			newObject.save();
		}
		Form.reset();
	}

	static all() {
		return new Promise((resolve) => {
			const c = this;
			const objects = [];
			firebase
				.database()
				.ref(c.path())
				.once('value')
				.then(function(snapshot) {
					snapshot.forEach(function(obj) {
						objects.push(instantiate(c, obj.val()));
					});
				})
				.then(() => {
					resolve(objects);
				});
		});
	}

	static getFromDB(id) {
		const c = this;
		let objects = [];
		firebase.database().ref(`${this.path()}`).child(id).once('value').then(function(snapshot) {
			objects.push(instantiate(c, snapshot.val()));
		});
		return objects;
	}

	static get(id) {
		const local = this.local();
		for (let i = 0; i < local.length; i++) {
			if (local[i].id == id) {
				return local[i];
			}
		}
	}

	belongsToWeek(momentObj) {
		return moment(this.table().datestr).isSame(momentObj, 'week') ? true : false;
	}

	static byWeek(momentObj) {
		return this.local().filter((localObj) => {
			return localObj.belongsToWeek(momentObj);
		});
	}

	static getLocal(sheet) {
		switch (sheet) {
			case 'orders':
				return Order.local();
				break;
			case 'products':
				return Product.local();
				break;
			case 'expenses':
				return Expense.local();
				break;
			case 'clients':
				return Client.local();
				break;
			case 'reports':
				return Report.local();
				break;
		}
	}

	static getTotals(momentObj) {
		// only works if objects of these sheet have the property 'total'
		return this.byWeek(momentObj).reduce((total, current) => {
			return total + parseInt(current.total);
		}, 0);
	}
}

function instantiate(constructor, dbObj) {
	// called when retreiving objects from database
	var localObj = new constructor();
	for (var i = 0; i < Object.keys(dbObj).length; i++) {
		localObj[Object.keys(dbObj)[i]] = Object.values(dbObj)[i];
	}
	return localObj;
}

function zeroPad(value, padding) {
	var zeroes = new Array(padding + 1).join('0');
	return (zeroes + value).slice(-padding);
}
