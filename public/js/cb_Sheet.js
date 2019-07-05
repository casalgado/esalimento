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
		return moment(this.table().datestr).isSame(momentObj, 'week') ? true : false;
	}

	static byWeek(momentObj) {
		return this.local().filter((localObj) => {
			return localObj.belongsToWeek(momentObj);
		});
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
