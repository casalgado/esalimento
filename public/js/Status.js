class Status {
	constructor() {
		this.submitted = moment();
		this.confirmed = moment();
		this.prepared = false;
		this.delivered = false;
	}
}
