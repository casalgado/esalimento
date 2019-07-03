class FireClass {
	constructor(id) {
		this.id = id;
	}

	static path() {
		return `devAccount/${this.directory()}`;
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

	save() {
		const c = this.constructor;
		firebase.database().ref(c.path()).push(this).then(() => {
			c.local().push(this);
		});
	}
}
