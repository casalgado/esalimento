class Sheet {
	constructor(id, name, comment) {
		this.id = id || '';
		this.name = name;
		this.createdAt = moment().format();
		this.lastModified = moment().format();
		this.comment = comment || '';
	}

	static path() {
		return `devAccount/${this.sheet()}`;
	}

	save() {
		const c = this.constructor;
		firebase
			.database()
			.ref(c.path())
			.push(this, function(error) {
				if (error) {
					console.log('The write failed');
				} else {
					console.log('Data saved successfully!');
				}
			})
			.then((e) => {
				firebase.database().ref(c.path()).child(e.getKey()).update({
					id : e.getKey()
				});
				this.id = e.getKey();
				c.local().push(this);
			});
	}

	update() {
		const c = this.constructor;
		const key = this.id;
		const path = c.path() + '/' + key;
		firebase.database().ref(path).update(this, function(error) {
			if (error) {
				console.log('The write failed');
			} else {
				console.log('Data saved successfully!');
			}
		});
		Table.render(c);
	}

	remove() {
		const c = this.constructor;
		const key = this.id;
		const path = c.path() + '/' + key;
		var result = confirm('Estas seguro que deseas borrar?');
		if (result) {
			firebase.database().ref(path).remove();
			// remove from local as well
		}
	}

	static remove(object) {
		object.remove();
		HTML.addClass('rectangle', 'hide');
	}

	static create(form) {
		const newObject = new this();
		const props = Form.getFormValues(form);
		if (props.date) {
			props.date = moment(props.date).format();
		}
		Object.assign(newObject, props);
		if (this.extendsCreate) {
			return newObject;
		} else {
			newObject.save();
		}
		Form.reset();
	}

	static update(form, object) {
		const props = Form.getFormValues(form);
		Object.assign(object, props);
		object.update();
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

	static getRecent(prop, number) {
		const mostRecent = [];
		const objects = this.local().reverse();
		for (let i = 0; i < objects.length; i++) {
			mostRecent.push(objects[i][prop]);
			if (mostRecent.getUnique().length > number) {
				break;
			}
		}
		return mostRecent.getUnique();
	}

	static spotlight(localProperty, targetConstructor, targetProperty, number) {
		const objects = this.local();
		const filters = targetConstructor
			.local()
			.sort(byName)
			.map((e) => {
				return e[targetProperty];
			})
			.getUnique();
		const useCount = [];
		let singleCount,
			sorted,
			mostUsed = [],
			wholeList = [];
		for (let i = 0; i < filters.length; i++) {
			singleCount = [
				filters[i],
				objects.filter((e) => {
					return e[localProperty] == filters[i];
				}).length
			];
			useCount.push(singleCount);
		}
		sorted = useCount
			.sort((a, b) => {
				return b[1] - a[1];
			})
			.slice(0, number);
		mostUsed = sorted.map((e) => {
			return { [targetProperty]: e[0] };
		});
		wholeList = mostUsed;
		for (let i = 0; i < filters.length; i++) {
			wholeList.push({ [targetProperty]: filters[i] });
		}
		return wholeList;
	}

	static getFromDB(id) {
		const c = this;
		let objects = [];
		firebase.database().ref(`${this.path()}`).child(id).once('value').then(function(snapshot) {
			objects.push(instantiate(c, snapshot.val()));
		});
		return objects;
	}

	static get(key, value) {
		const local = this.local();
		for (let i = 0; i < local.length; i++) {
			if (local[i][key] == value) {
				return local[i];
			}
		}
	}

	belongsToWeek(momentObj) {
		// constructor must have the date() method.
		return moment(this.datestr()).isSame(momentObj, 'week') ? true : false;
	}

	static byWeek(momentObj) {
		return this.local().filter((localObj) => {
			return localObj.belongsToWeek(momentObj);
		});
	}

	datestr() {
		return this.date;
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

	static getWeekTotals(momentObj) {
		// only works if objects of these sheet have the property 'total'
		return this.byWeek(momentObj).reduce((total, current) => {
			return total + parseInt(current.total);
		}, 0);
	}

	static getAllTimeTotals() {
		return this.local().reduce((total, current) => {
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
