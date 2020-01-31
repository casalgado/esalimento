class Order extends Sheet {
	constructor(
		id,
		name,
		client,
		product,
		quantity,
		unitPrice,
		total,
		submitted,
		confirmed,
		produced,
		delivered,
		paid
	) {
		super(id, name);
		this.client = client;
		this.product = product;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		this.total = total;
		this.submitted = submitted || '';
		this.confirmed = confirmed || '';
		this.produced = produced || null;
		this.delivered = delivered || null;
		this.paid = paid || '';
	}

	static sheet() {
		return 'orders';
	}

	static local() {
		return ORDERS;
	}

	static extendsCreate() {
		return true;
	}

	static create(form) {
		const newObject = super.create(form);
		const props = {
			name      : Order.setLocalId(),
			submitted : newObject.confirmed || moment().format()
		};
		Object.assign(newObject, props);
		let client_names = CLIENTS.map((e) => {
			return e.name;
		});
		if (!client_names.includes(newObject.client)) {
			let newClient = new Client('id', newObject.client, '', '', '');
			newClient.save();
			CLIENTS.push(newClient);
			alert('new client added to database');
		}
		newObject.save();
		Form.reset();
	}

	static setLocalId() {
		// this is the name property
		return 'P-' + moment().format('YY') + '-' + zeroPad(Order.local().length + 1, 3);
	}

	datestr() {
		return this.produced || this.confirmed;
	}

	paidstr() {
		if (this.paid != '') {
			return moment(this.paid).format('DD/MM/YYYY');
		} else {
			return '';
		}
	}

	static paidButton() {
		let button = HTML.createButton('paidButton', 'btn btn-default', 'marcar', Order.setAsPaid, 'id');
		return button;
	}

	static setAsPaid(obj) {
		if (obj.paid == '') {
			obj.paid = moment().format();
			obj.update('noRefresh');
			// @refactor code below
			document.getElementById('paidBtn').classList.add('paid');
			document.getElementById('paidBtn').classList.remove('unpaid');
		}
	}

	currentStatus() {
		if (this.delivered) {
			return 'entregada';
		} else if (this.produced) {
			return 'producida';
		} else if (this.confirmed) {
			return 'confirmada';
		} else {
			return 'recibida';
		}
	}

	static table() {
		return {
			title         : 'Pedidos',
			header        : [ 'Dia', 'Cliente', 'Producto', 'C', 'Total' ],
			sortby        : [ 'confirmed', 'client', 'product', 'quantity', 'total' ],
			hasPagination : true,
			period        : 'week'
		};
	}

	table() {
		return {
			row      : [
				moment(this.produced).format('DD/M'),
				this.client,
				this.product,
				this.quantity,
				this.total.formatK()
			],
			rowClass : this.paid == '' ? 'unpaid' : 'paid',
			datestr  : this.datestr()
		};
	}

	card() {
		return {
			t       : `${Client.getFromLocal('name', this.client).phone} &nbsp ${Client.getFromLocal(
				'name',
				this.client
			).address}`,
			btnData : [
				{
					btnId      : 'paidBtn',
					btnClass   : this.paid == '' ? 'unpaid' : 'paid',
					btnTitle   : this.paid == '' ? 'unpaid' : moment(this.paid).format('MMMM'),
					btnMain    : this.paid == '' ? '$' : moment(this.paid).format('DD'),
					funcToCall : Order.setAsPaid,
					args       : this
				},
				{
					btnId      : 'editBtn',
					btnTitle   : 'edit',
					btnMain    : 'E',
					funcToCall : onNavigate,
					args       : { pathname: '/pedidos#editar', state: { objectId: this.id } }
				},
				{ btnId: 'deleteBtn', btnTitle: 'delete', btnMain: 'X', funcToCall: Order.remove, args: this }
			]
		};
	}

	static form() {
		return {
			fields         : [
				// the fields array is coded as follows:
				// keys = method called by Form
				// values = arguments for method called by form.
				// even though there is only one argument, it must be in an array.
				{ customSelectField: { property: 'client', target: 'product' } },
				{ customSelectField: { property: 'product', target: 'client' } },
				{ priceField: { property: 'unitPrice', label: 'precio unitario:' } },
				{ priceField: { property: 'quantity', step: '0.5', defaultValue: '1', label: 'cantidad:' } },
				{ priceField: { property: 'total', label: 'total:' } },
				{ basicField: { property: 'confirmed', type: 'date', label: 'confirmado:' } },
				{ basicField: { property: 'produced', type: 'date', label: 'para producir:' } },
				{ basicField: { property: 'delivered', type: 'date', label: 'para entregar:' } }
			],
			editFormFields : [ { basicField: { property: 'paid', type: 'date' } } ],
			button         : 'Pedido',
			title          : 'Ingresar Pedido',
			editTitle      : 'Editar Pedido'
		};
	}

	export() {
		return [
			moment(this.confirmed).format('DD/MM/YYYY'),
			this.client,
			this.quantity,
			this.product,
			this.unitPrice,
			this.total,
			moment(this.produced).format('DD/MM/YYYY'),
			moment(this.delivered).format('DD/MM/YYYY'),
			this.paidstr()
		];
	}

	static totalUnpaid() {
		return this.local().reduce((total, current) => {
			if (current.paid != '') {
				return total;
			} else {
				return total + parseInt(current.total);
			}
		}, 0);
	}

	static listUnpaid() {
		return this.local().filter((e) => {
			return e.paid == '';
		});
	}

	static showUnpaid() {
		new Table('square', Order.listUnpaid(), Order);
		HTML.addClass('rectangle', 'hide');
	}
}

// const Sheet = require('./cb_Sheet');
// const moment = require('moment');
// module.exports = { Order };
