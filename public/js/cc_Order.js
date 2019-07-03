class Order extends FireClass {
	constructor(id, client, product, quantity, unitPrice, total, status) {
		super(id);
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.status = status || JSON.stringify(new Status());
		this.paid = false;
	}

	static directory() {
		return 'orders';
	}
}
