class Sheet {
	constructor(id, name) {
		this.id = id || '';
		this.id = name;
	}

	static path() {
		return `devAccount/${this.sheet()}`;
	}

	save() {
		const c = this.constructor;
		firebase.database().ref(c.path()).push(this).then((e) => {
			this.id = e.getKey();
			c.local().push(this);
		});
	}

	static all() {
		const c = this;
		const objects = [];
		firebase.database().ref(c.path()).once('value').then(function(snapshot) {
			snapshot.forEach(function(obj) {
				objects.push(instantiate(c, obj.val()));
			});
		});
		return objects;
	}

	belongsToWeek(momentObj) {
		return moment(this.datestr()).isSame(momentObj, 'week') ? true : false;
	}

	static byWeek(momentObj) {
		return this.local().filter((localObj) => {
			return localObj.belongsToWeek(momentObj);
		});
	}
}
