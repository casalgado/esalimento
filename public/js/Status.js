class Status {
	constructor(submitted, confirmed, produced, delivered) {
		this.submitted = submitted || moment().format();
		this.confirmed = confirmed || moment().format();
		this.produced = produced || false;
		this.delivered = delivered || false;
	}

	static parse(object) {
		return new Status(object.submitted, object.confirmed, object.produced, object.delivered);
	}
}
