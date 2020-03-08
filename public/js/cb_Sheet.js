class Sheet {
	constructor(id, name, comment) {
		this.id = id || '';
		this.name = name || '';
		this.createdAt = moment().format();
		this.lastModified = moment().format();
		this.comment = comment || '';
	}

	static path() {
		return `${DB_REF}/${this.sheet()}`;
	}

	static create(from_form) {
		const newObject = new this();
		const props = Form.getFormValues(from_form);
		Object.assign(newObject, props);
		if (this.extendsCreate) {
			return newObject;
		} else {
			newObject.save();
		}
		Form.reset();
	}

	save() {
		const c = this.constructor;
		firebase
			.database()
			.ref(c.path())
			.push(this, function(error) {
				if (error || c.sheet() == 'reports') {
					console.log('The write failed');
				} else {
					console.log('Data saved successfully!');
					alert('Data saved successfully');
				}
			})
			.then((e) => {
				let eKey = e.getKey();
				firebase.database().ref(c.path()).child(eKey).update({
					id        : eKey,
					bug_probe : Order.local().length
				});
				this.id = eKey;
				c.local().push(this);
			});
	}

	static updateClientsFromJson(array) {
		console.log(array.length);
		for (let i = 0; i < array.length; i++) {
			let localClient = Client.getFromLocal('name', array[i].nombre.toLowerCase());
			let id = Client.getFromLocal('name', array[i].nombre.toLowerCase()).id;

			let newClient = {
				name         : array[i].nombre.toLowerCase(),
				id           : id,
				email        : '',
				address      : array[i].direccion,
				phone        : array[i].telefono,
				birthday     : array[i].cumpleaños,
				lastModified : localClient.lastModified,
				createdAt    : localClient.createdAt
			};
			console.log(newClient);
			firebase.database().ref(`devAccount/clients/${id}`).set(newClient);
		}
	}

	update(noRefresh) {
		// @refactor no refresh
		// refresh should not be a part of this method.
		// refactor when using router
		const c = this.constructor;
		const key = this.id;
		const path = c.path() + '/' + key;
		let quote = smith[Math.floor(Math.random() * smith.length)];
		this.lastModified = moment().format();
		if (key == '') {
			alert(quote);
		} else {
			firebase.database().ref(path).update(this, function(error) {
				if (error) {
					console.log('The write failed');
				} else {
					console.log('Data saved successfully!');
				}
			});
			if (noRefresh != 'noRefresh') {
				Table.render(c);
			}
		}
	}

	static updateAll(property, value, oldValue) {
		const objs = this.local();
		for (let i = 0; i < objs.length; i++) {
			const o = objs[i];
			if (oldValue) {
				if (o[property] == oldValue) {
					o[property] = value;
					o.update();
				}
			} else {
				o[property] = value;
				o.update();
			}
		}
	}

	static update(from_form, object) {
		const props = Form.getFormValues(from_form);
		Object.assign(object, props);
		object.update();
		Form.reset();
	}

	remove() {
		const c = this.constructor;
		const key = this.id;
		const path = c.path() + '/' + key;
		let local = c.local();
		let result = confirm('Estas seguro que deseas borrar?');
		if (result) {
			firebase
				.database()
				.ref(path)
				.set(null, function(error) {
					if (error) {
						console.log('The delete failed');
					} else {
						console.log('Data deleted successfully!');
						alert('Data deleted successfully!');
					}
				})
				.then(() => {
					local.splice(local.indexOf(c.getFromLocal('id', key)), 1);
				});
		}
	}

	static remove(object) {
		object.remove();
		HTML.addClass('rectangle', 'hide');
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

	static extendsEditForm() {
		return !(this.form().editFormFields == undefined);
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
			.sortBy(targetProperty)
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

	static getFromLocal(key, value) {
		const local = this.local();
		for (let i = 0; i < local.length; i++) {
			if (local[i][key] == value) {
				return local[i];
			}
		}
	}

	belongsToWeek(momentObj) {
		// constructor must have the datestr() method.
		return moment(this.datestr()).isSame(momentObj, 'week');
	}

	belongsToDay(momentObj) {
		// constructor must have the datestr() method.
		return moment(this.datestr()).isSame(momentObj, 'day');
	}

	belongsToPeriod(momentObj, period) {
		// constructor must have the datestr() method.
		return moment(this.datestr()).isSame(momentObj, period);
	}

	static byPeriod(momentObj, period) {
		return this.local().filter((e) => {
			return e.belongsToPeriod(momentObj, period);
		});
	}

	static hasDayTable() {
		return false;
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

let smith = [
	'Mr. Anderson.',
	'Hmm, Mr. Anderson. You disappoint me.',
	'We meet again Mr. Anderson',
	"And tell me, Mr. Anderson, what good is a phone call if you're unable to speak?",
	"You're going to help us, Mr. Anderson. Whether you want to or not.",
	'The great Morpheus; we meet at last.',
	"I'd like to share a revelation I've had during my time here. It came to me when I tried to classify your species. I realized that you're not actually mammals. Every mammal on this planet instinctively develops a natural equilibrium with their surrounding environment, but you humans do not. You move to another area, and you multiply, and you multiply, until every natural resource is consumed. The only way you can survive is to spread to another area. There is another organism on this planet that follows the same pattern. Do you know what it is? A virus. Human beings are a disease, a cancer of this planet. You are a plague, and we are the cure.",
	"Can you hear me, Morpheus? I'm going to be honest with you: I hate this place. This zoo. This prison. This reality, whatever you want to call it. I can't stand it any longer. It's the smell- if there is such a thing. I feel... saturated by it.",
	'Find them and destroy them.',
	"Never send a human to do a machine's job.",
	"I'm going to enjoy watching you die, Mr. Anderson.",
	'You hear that, Mr. Anderson? That is the sound of inevitability. It is the sound of your death. Goodbye, Mr. Anderson.'
];

// const moment = require('moment');

// module.exports = { Sheet, zeroPad };

// console.log(module);
// console.log(moment);

let clientDB = [
	{
		nombre               : 'Alexandra Vives',
		telefono             : 3153335429,
		direccion            : 'Cra 59b #85-64',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '4 de agosto',
		elección             : 'zaatar',
		'de donde vienen'    : 'voz a voz',
		particularidad       : 'le gusta el pan masa madre 100% integral con avena'
	},
	{
		nombre               : 'Alfonso Manzano',
		telefono             : 3206618237,
		direccion            : 'cra 52b#96-68edf dublin apto 603b',
		'ultima vez hablado' : '17/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '7 de diciembre',
		elección             : 'queso',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Alma Perez',
		telefono             : 3146691402,
		direccion            : 'Calle 79 #49c-38 local 1',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '8 de febrero',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga abuela',
		particularidad       : ''
	},
	{
		nombre               : 'Amalin Hazbun',
		telefono             : 3008152634,
		direccion            : 'cra 64b #94-128 dejar en porteria',
		'ultima vez hablado' : '17/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '25 de febrero',
		elección             : 'zaatar',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Ana María Slevi',
		telefono             : 3135097150,
		direccion            : 'club lagos del caujaral lote 13 calle del no me olvides casa reinaldo slevi',
		'ultima vez hablado' : '17/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '17 de agosto',
		elección             : 'zaatar',
		'de donde vienen'    : 'voz a voz',
		particularidad       :
			'hace parte de un grupo de mujeres q viven en el caujaral y compran en conjunto para llevar.'
	},
	{
		nombre               : 'Ana Maria Zuñiga',
		telefono             : 3013041252,
		direccion            : 'cra 57 #84-155 apto 4b edf. Odessa',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '28 de septiembre',
		elección             : 'zaatar',
		'de donde vienen'    : 'voz a voz',
		particularidad       : 'le gusta el pan masa madre 100% integral con avena'
	},
	{
		nombre               : 'Andrea Kopp',
		telefono             : 3157559805,
		direccion            : 'cra 64c #84-132',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso',
		'de donde vienen'    : 'amiga',
		particularidad       :
			'su papa compra pan fresco todos los dias en la baguette a las 7 de la manana, bacano ver si podemos ahorrarle la salida y q le llegue a lacasa'
	},
	{
		nombre               : 'Andrea Saieh',
		telefono             : 3226066831,
		direccion            : 'cra 52b #94 -229 domenico 52 apto 304',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'Andres Ribbon',
		telefono             : 3017698196,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'el caminante',
		particularidad       : 'vive solo, le gusta tener pan en la casa'
	},
	{
		nombre               : 'Andrés Santiago',
		telefono             : 3205315479,
		direccion            : 'cra 56 #84-101',
		'ultima vez hablado' : '2/17/2020',
		'hablar el'          : '',
		cumpleaños           : '11 de marzo',
		elección             : 'zaatar',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Angie Choperena',
		telefono             : 3135742713,
		direccion            : 'calle 78 #57-95',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '14 de octubre',
		elección             : 'queso',
		'de donde vienen'    : 'amiga madre',
		particularidad       : 'le encanta la torta de zanahoria'
	},
	{
		nombre               : 'Blanca Dolly Giraldo',
		telefono             : 3103529733,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'instagram',
		particularidad       : ''
	},
	{
		nombre               : 'Camila Boudez',
		telefono             : 3008054262,
		direccion            : 'cra 64b # 86 - 141 edificio coral',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Carlo Acevedo',
		telefono             : 3116600130,
		direccion            : 'calle 90 #58-51 apto 701',
		'ultima vez hablado' : '17/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '27 de junio',
		elección             : 'zaatar',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Carlos De Las Aguas',
		telefono             : 3145706453,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'no recurdo',
		particularidad       : ''
	},
	{
		nombre               : 'Carlos Murgas',
		telefono             : 3105533598,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Clara Calle',
		telefono             : 3155010026,
		direccion            : 'cra 64b #91-96 casa 4',
		'ultima vez hablado' : '17/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '13 de julio',
		elección             : 'queso',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Cuchi Salcedo',
		telefono             : 3016276795,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga',
		particularidad       : 'le gusta tener pan en la casa'
	},
	{
		nombre               : 'Daniel Castañeda',
		telefono             : 3016167918,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'instagram',
		particularidad       : ''
	},
	{
		nombre               : 'Daniela Guerrero',
		telefono             : 3043818847,
		direccion            : 'calle 78 #57-95 edf tuquesa real apto702',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso',
		'de donde vienen'    : '',
		particularidad       : ''
	},
	{
		nombre               : 'Daniela Pabon',
		telefono             : 3145958040,
		direccion            : 'cra 56 #84-90 apto 6 a',
		'ultima vez hablado' : '19/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '2 de septiembre',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'David Escaf',
		telefono             : 3008167074,
		direccion            : 'calle 83 # 42d-123 apto 804',
		'ultima vez hablado' : '17/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '13 de diciembre',
		elección             : 'queso',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'David Montero',
		telefono             : 3126981356,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amigo david',
		particularidad       : ''
	},
	{
		nombre               : 'Diana Paternina',
		telefono             : 3157449664,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Dimas Bauza',
		telefono             : 3003502938,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'voz a voz primo de vale riascos',
		particularidad       : ''
	},
	{
		nombre               : 'Elena Carriazo',
		telefono             : 3157226071,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Elizabeth Pardo',
		telefono             : 3043976575,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'voz a voz',
		particularidad       : ''
	},
	{
		nombre               : 'Elvirita',
		telefono             : 3017758011,
		direccion            : 'cra 57 # 77 - 53 apto 504',
		'ultima vez hablado' : '25/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga abuela',
		particularidad       : ''
	},
	{
		nombre               : 'Esteban Henao',
		telefono             : 3117770849,
		direccion            : 'cra 52 #106 213 edf oceana 52 apto 1510',
		'ultima vez hablado' : '25/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'instagram',
		particularidad       : ''
	},
	{
		nombre               : 'Ethna Elizondo',
		telefono             : 3008441868,
		direccion            : 'calle 78 #57-135 apto 4a',
		'ultima vez hablado' : '26/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Eugenia Escaff',
		telefono             : 3134775058,
		direccion            : 'cra 55 #82-181 apto 802 edf antonella',
		'ultima vez hablado' : '28/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Faride Rocha',
		telefono             : 3235673692,
		direccion            : 'cra 50 3103-24 casa 2 villa santos',
		'ultima vez hablado' : '25/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'cualquiera',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Francisco Guerra',
		telefono             : 3157522203,
		direccion            : 'cra 56 #84-90 apto 4b',
		'ultima vez hablado' : '28/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '11 de septiembre',
		elección             : 'zaatar',
		'de donde vienen'    : '',
		particularidad       : ''
	},
	{
		nombre               : 'Hernando Cotes',
		telefono             : 3135717177,
		direccion            : 'calle 78 #57-115 apto 2 edf Lamas',
		'ultima vez hablado' : '29/Feb/2020',
		'hablar el'          : '7 de marzo',
		cumpleaños           : '21 abril',
		elección             : '',
		'de donde vienen'    : 'tio de sebastian cotes',
		particularidad       : ''
	},
	{
		nombre               : 'Isabela El Caminante',
		telefono             : 3002836109,
		direccion            : 'cra 64#68-36 edf. parques cisneros apto 401',
		'ultima vez hablado' : '26/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'administradora de el cafe el caminante',
		particularidad       : ''
	},
	{
		nombre               : 'Joan Velazquez',
		telefono             : 3185744298,
		direccion            : 'cra 50 #98-40 casa 8 castilla vieja',
		'ultima vez hablado' : '25/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'Juan Camilo Olmos',
		telefono             : 3163656256,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Kelly Chico',
		telefono             : 3022796765,
		direccion            : 'no ha respondido',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso',
		'de donde vienen'    : 'tres fuegos',
		particularidad       : 'hay que estar pendiente de sus pedidos'
	},
	{
		nombre               : 'Leo Barrios',
		telefono             : 3013745727,
		direccion            : 'cra 59 #68-117 apto 303A edificio condado del prado',
		'ultima vez hablado' : '6/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '18/enero',
		elección             : 'zaatar',
		'de donde vienen'    : 'amigo madre',
		particularidad       : ''
	},
	{
		nombre               : 'Mabel Guerra De Vives',
		telefono             : 3135121476,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Marcela Emilia',
		telefono             : 3008157656,
		direccion            : 'cra 58 #81-160 apto8',
		'ultima vez hablado' : '26/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'cualquiera',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'María Alejandra Kaled',
		telefono             : 3022270555,
		direccion            : 'cra 50 #107-110',
		'ultima vez hablado' : '26/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso',
		'de donde vienen'    : 'amiga vianny',
		particularidad       : ''
	},
	{
		nombre               : 'Maria Carolina Osorio',
		telefono             : 3116881565,
		direccion            : 'cra 58 # 82-40',
		'ultima vez hablado' : '25/Feb/20',
		'hablar el'          : '',
		cumpleaños           : 'Sep 26',
		elección             : 'zaatar',
		'de donde vienen'    : 'taller de paula silva en casa manoa',
		particularidad       : ''
	},
	{
		nombre               : 'Maria Elvira De Cuello',
		telefono             : 3157226946,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'mama de andres vergara, dueño del caminante',
		particularidad       : ''
	},
	{
		nombre               : 'Maria Eugenia Peña',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Maria Eugenia Samur',
		telefono             : 3157232343,
		direccion            : 'cra 58 #79-295 edf Acqualina apto 10b',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '25 de septiembre',
		elección             : 'cualquiera',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Maria Majami',
		telefono             : 3156251098,
		direccion            : 'cra 52 #82-234 apto 402 edf loft 82',
		'ultima vez hablado' : '27/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '8 dic',
		elección             : 'zaatar',
		'de donde vienen'    : 'instagram',
		particularidad       : 'compro pan sin sal para su bebe de un año, le encanto.'
	},
	{
		nombre               : 'Maria Patricia Cotes',
		telefono             : 3186966985,
		direccion            : '',
		'ultima vez hablado' : '26/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '29 Nov',
		elección             : 'queso',
		'de donde vienen'    : 'no recuerdo',
		particularidad       : ''
	},
	{
		nombre               : 'Maria Patricia Salcedo',
		telefono             : 'no tenemo el numero',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'hermana de cuchi salcedo',
		particularidad       : ''
	},
	{
		nombre               : 'María Paula Dangon',
		telefono             : 3008102961,
		direccion            : 'calle 83 #42d-123 edf romero y loto',
		'ultima vez hablado' : '26/Feb/20',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'Mariana Gonzales',
		telefono             : 3006307213,
		direccion            : 'cra 57 #77-24 apto 4f edf las trinitarias',
		'ultima vez hablado' : '26/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso costeño',
		'de donde vienen'    : 'prima de david escaf',
		particularidad       : ''
	},
	{
		nombre               : 'Marina Davila',
		telefono             : 'no tenemo el numero',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'no recuerdo',
		particularidad       : ''
	},
	{
		nombre               : 'Marta Acevedo',
		telefono             : 3186979777,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'no recuerdo',
		particularidad       : ''
	},
	{
		nombre               : 'Mary Castro',
		telefono             : 'no tenemo el numero',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'no recuerdo',
		particularidad       : ''
	},
	{
		nombre               : 'Merci Lopez',
		telefono             : 'no tenemo el numero',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'no recuerdo',
		particularidad       : ''
	},
	{
		nombre               : 'Mitch Olmos',
		telefono             : 3153405731,
		direccion            : 'cra 56 #82-174 apto 903',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'queso costeño',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Monica De Jaramillo',
		telefono             : 3106315973,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Nestor Barrios',
		telefono             : 3008879473,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amigo',
		particularidad       : ''
	},
	{
		nombre               : 'Nicole Hill',
		telefono             : 3145870381,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'el caminante',
		particularidad       : ''
	},
	{
		nombre               : 'Olga De Loewy',
		telefono             : 3205422132,
		direccion            : 'cra 13 #5-66 lagos del caujaral',
		'ultima vez hablado' : '8/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'voz a voz',
		particularidad       : ''
	},
	{
		nombre               : 'Owen Jones',
		telefono             : 3116592464,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'no ha contestado',
		'de donde vienen'    : "dueño de el restaurante la scarpetta y l' America",
		particularidad       : ''
	},
	{
		nombre               : 'Pao Rodriguez',
		telefono             : 3135648883,
		direccion            : 'cra 36 #63b esquina triple a recreo ext 318',
		'ultima vez hablado' : '28/Feb/20',
		'hablar el'          : '07/Mar/2020',
		cumpleaños           : '27 de nov',
		elección             : 'queso',
		'de donde vienen'    : 'instagram',
		particularidad       : ''
	},
	{
		nombre               : 'Paola Acuña',
		telefono             : 3046562174,
		direccion            : 'cra 52b #94-47',
		'ultima vez hablado' : '11/Feb/2020',
		'hablar el'          : '',
		cumpleaños           : '3 de noviembre',
		elección             : 'queso',
		'de donde vienen'    : 'taller de paula silva en casa manoa',
		particularidad       : ''
	},
	{
		nombre               : 'Pia Monor',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'NR',
		particularidad       : ''
	},
	{
		nombre               : 'Roberto Caridi',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amigo padre',
		particularidad       : ''
	},
	{
		nombre               : 'Rochy Moreno',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga madre?',
		particularidad       : ''
	},
	{
		nombre               : 'Rodolfo Schmulson',
		telefono             : 3157212121,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Rose Khbeis',
		telefono             : 3015554683,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'Roxana Capella',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'NR',
		particularidad       : ''
	},
	{
		nombre               : 'Silvana Maria',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'NR',
		particularidad       : ''
	},
	{
		nombre               : 'Tania Jassit',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'NR',
		particularidad       : ''
	},
	{
		nombre               : 'Tatiana Charris',
		telefono             : '',
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'NR',
		particularidad       : ''
	},
	{
		nombre               : 'Traice Biggs',
		telefono             : 3135741437,
		direccion            : '',
		'ultima vez hablado' : '29/Feb/2020',
		'hablar el'          : '7/Mar/2020',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'el caminante',
		particularidad       : ''
	},
	{
		nombre               : 'Valentina Riascos',
		telefono             : 3108978061,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'Valerie Hazbun',
		telefono             : 3216652703,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	},
	{
		nombre               : 'Veronica Duarte',
		telefono             : 3205213683,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga madre',
		particularidad       : ''
	},
	{
		nombre               : 'Vicky Garcia',
		telefono             : 3157225523,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'amiga',
		particularidad       : ''
	},
	{
		nombre               : 'Viri Amiga De Vicky',
		telefono             : 3007572132,
		direccion            : '',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : '',
		'de donde vienen'    : 'pues',
		particularidad       : ''
	},
	{
		nombre               : 'Wicho Jose Escaf',
		telefono             : 3187071815,
		direccion            : 'cra 57 #96-38 apto 2c',
		'ultima vez hablado' : '',
		'hablar el'          : '',
		cumpleaños           : '',
		elección             : 'zaatar',
		'de donde vienen'    : 'familia',
		particularidad       : ''
	}
];
