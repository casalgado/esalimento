// const moment = require('moment');
// const firebase = require('../firebase');

// class Sheet {
// 	constructor(id, name, comment) {
// 		this.id = id || '';
// 		this.name = name || '';
// 		this.createdAt = moment().format();
// 		this.lastModified = moment().format();
// 		this.comment = comment || '';
// 	}

// 	static path() {
// 		return `devAccount/${this.sheet()}`;
// 	}

// 	static create(from_form) {
// 		const newObject = new this();
// 		const props = Form.getFormValues(from_form);
// 		Object.assign(newObject, props);
// 		if (this.extendsCreate) {
// 			return newObject;
// 		} else {
// 			newObject.save();
// 		}
// 		Form.reset();
// 	}

// 	save() {
// 		const c = this.constructor;
// 		firebase
// 			.database()
// 			.ref(c.path())
// 			.push(this, function(error) {
// 				if (error) {
// 					console.log('The write failed');
// 				} else {
// 					console.log('Data saved successfully!');
// 					alert('Data saved successfully');
// 				}
// 			})
// 			.then((e) => {
// 				firebase.database().ref(c.path()).child(e.getKey()).update({
// 					id : e.getKey()
// 				});
// 				this.id = e.getKey();
// 				c.local().push(this);
// 			});
// 	}

// 	update(noRefresh) {
// 		// @refactor no refresh
// 		// refresh should not be a part of this method.
// 		// refactor when using router
// 		const c = this.constructor;
// 		const key = this.id;
// 		const path = c.path() + '/' + key;
// 		this.lastModified = moment().format();
// 		firebase.database().ref(path).update(this, function(error) {
// 			if (error) {
// 				console.log('The write failed');
// 			} else {
// 				console.log('Data saved successfully!');
// 			}
// 		});
// 		if (noRefresh != 'noRefresh') {
// 			Table.render(c);
// 		}
// 	}

// 	static updateAll(property, value, oldValue) {
// 		const objs = this.local();
// 		for (let i = 0; i < objs.length; i++) {
// 			const o = objs[i];
// 			if (oldValue) {
// 				if (o[property] == oldValue) {
// 					o[property] = value;
// 					o.update();
// 				}
// 			} else {
// 				o[property] = value;
// 				o.update();
// 			}
// 		}
// 	}

// 	static update(from_form, object) {
// 		const props = Form.getFormValues(from_form);
// 		Object.assign(object, props);
// 		object.update();
// 		Form.reset();
// 	}

// 	remove() {
// 		const c = this.constructor;
// 		const key = this.id;
// 		const path = c.path() + '/' + key;
// 		let local = c.local();
// 		let result = confirm('Estas seguro que deseas borrar?');
// 		if (result) {
// 			firebase
// 				.database()
// 				.ref(path)
// 				.set(null, function(error) {
// 					if (error) {
// 						console.log('The delete failed');
// 					} else {
// 						console.log('Data deleted successfully!');
// 						alert('Data deleted successfully!');
// 					}
// 				})
// 				.then(() => {
// 					local.splice(local.indexOf(c.getFromLocal('id', key)), 1);
// 				});
// 		}
// 	}

// 	static remove(object) {
// 		object.remove();
// 		HTML.addClass('rectangle', 'hide');
// 	}

// 	static all() {
// 		return new Promise((resolve) => {
// 			const c = this;
// 			const objects = [];
// 			firebase
// 				.database()
// 				.ref(c.path())
// 				.once('value')
// 				.then(function(snapshot) {
// 					snapshot.forEach(function(obj) {
// 						objects.push(instantiate(c, obj.val()));
// 					});
// 				})
// 				.then(() => {
// 					resolve(objects);
// 				});
// 		});
// 	}

// 	static extendsEditForm() {
// 		return !(this.form().editFormFields == undefined);
// 	}

// 	static getRecent(prop, number) {
// 		const mostRecent = [];
// 		const objects = this.local().reverse();
// 		for (let i = 0; i < objects.length; i++) {
// 			mostRecent.push(objects[i][prop]);
// 			if (mostRecent.getUnique().length > number) {
// 				break;
// 			}
// 		}
// 		return mostRecent.getUnique();
// 	}

// 	static spotlight(localProperty, targetConstructor, targetProperty, number) {
// 		const objects = this.local();
// 		const filters = targetConstructor
// 			.local()
// 			.sortBy(targetProperty)
// 			.map((e) => {
// 				return e[targetProperty];
// 			})
// 			.getUnique();
// 		const useCount = [];
// 		let singleCount,
// 			sorted,
// 			mostUsed = [],
// 			wholeList = [];
// 		for (let i = 0; i < filters.length; i++) {
// 			singleCount = [
// 				filters[i],
// 				objects.filter((e) => {
// 					return e[localProperty] == filters[i];
// 				}).length
// 			];
// 			useCount.push(singleCount);
// 		}
// 		sorted = useCount
// 			.sort((a, b) => {
// 				return b[1] - a[1];
// 			})
// 			.slice(0, number);
// 		mostUsed = sorted.map((e) => {
// 			return { [targetProperty]: e[0] };
// 		});
// 		wholeList = mostUsed;
// 		for (let i = 0; i < filters.length; i++) {
// 			wholeList.push({ [targetProperty]: filters[i] });
// 		}
// 		return wholeList;
// 	}

// 	static getFromDB(id) {
// 		const c = this;
// 		let objects = [];
// 		firebase.database().ref(`${this.path()}`).child(id).once('value').then(function(snapshot) {
// 			objects.push(instantiate(c, snapshot.val()));
// 		});
// 		return objects;
// 	}

// 	static getFromLocal(key, value) {
// 		const local = this.local();
// 		for (let i = 0; i < local.length; i++) {
// 			if (local[i][key] == value) {
// 				return local[i];
// 			}
// 		}
// 	}

// 	belongsToWeek(momentObj) {
// 		// constructor must have the datestr() method.
// 		return moment(this.datestr()).isSame(momentObj, 'week');
// 	}

// 	belongsToDay(momentObj) {
// 		// constructor must have the datestr() method.
// 		return moment(this.datestr()).isSame(momentObj, 'day');
// 	}

// 	belongsToPeriod(momentObj, period) {
// 		// constructor must have the datestr() method.
// 		return moment(this.datestr()).isSame(momentObj, period);
// 	}

// 	static byPeriod(momentObj, period) {
// 		return this.local().filter((e) => {
// 			return e.belongsToPeriod(momentObj, period);
// 		});
// 	}

// 	static hasDayTable() {
// 		return false;
// 	}

// 	datestr() {
// 		return this.date;
// 	}

// 	static getLocal(sheet) {
// 		switch (sheet) {
// 			case 'orders':
// 				return Order.local();
// 				break;
// 			case 'products':
// 				return Product.local();
// 				break;
// 			case 'expenses':
// 				return Expense.local();
// 				break;
// 			case 'clients':
// 				return Client.local();
// 				break;
// 			case 'reports':
// 				return Report.local();
// 				break;
// 		}
// 	}

// 	static getWeekTotals(momentObj) {
// 		// only works if objects of these sheet have the property 'total'
// 		return this.byWeek(momentObj).reduce((total, current) => {
// 			return total + parseInt(current.total);
// 		}, 0);
// 	}

// 	static getAllTimeTotals() {
// 		return this.local().reduce((total, current) => {
// 			return total + parseInt(current.total);
// 		}, 0);
// 	}
// }

// module.exports = Sheet;
