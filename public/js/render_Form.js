class Form {
	constructor(parentId, constructor) {
		this.sheet = `${constructor.sheet()}`;
		const formCont = HTML.create('section', 'formCont', 'formCont');
		const props = constructor.form();
		const parent = HTML.get(parentId);
		const title = HTML.create('h6', 'formTitleId', 'formTitle', {
			ondblclick : 'Form.reset()',
			onclick    : 'Form.drawSelectMenus(); Form.removeFormEvents()'
		});
		const form = HTML.create('form', `${constructor.sheet()}Form`, 'localForm', {
			'data-constructor' : constructor.sheet()
		});

		title.innerHTML = this.sheet;
		form.appendChild(title);
		this.createFields(form, props.fields);
		form.appendChild(this.submitBtn(`Crear ${props.button}`));
		formCont.appendChild(form);

		parent.innerHTML = '';
		parent.appendChild(formCont);
		Form.reset();
	}

	createFields(form, props) {
		for (let i = 0; i < props.length; i++) {
			for (const [ key, value ] of Object.entries(props[i])) {
				// key's here correspond to methods below: basicField, priceField and customSelectField
				// values correspond to the arguments of these methods. Both come from Sheet.form()
				form.appendChild(this[key](...value));
			}
		}
	}

	basicField(property, type) {
		let formGroup = HTML.create('div', '', 'form-group');
		let label = HTML.create('label', '', `${type}-${property}`, { for: `${this.sheet}-${property}` });
		label.innerHTML = property;
		let input = HTML.create('input', `${this.sheet}-${property}`, 'form-control form-control-sm', {
			type : type
		});
		if (property != 'paid') {
			input.setAttribute('required', true);
		}
		formGroup.appendChild(label);
		formGroup.appendChild(input);
		return formGroup;
	}

	priceField(property, step, defaultValue) {
		// If the three 'price' fields are included
		// (this means quantity, unitPrice, total),
		// the interactions between are added atomatically.

		// create elements
		let formGroup = HTML.create('div', '', 'form-group');
		let label = HTML.create('label', '', '', { for: `${this.sheet}-${property}` });
		label.innerHTML = property;
		let input = HTML.create('input', `${this.sheet}-${property}`, 'form-control form-control-sm', {
			type     : 'number',
			min      : '1',
			step     : step || '1',
			onchange : 'updatePriceValues(this)',
			onkeyup  : 'updatePriceValues(this)',
			value    : defaultValue
		});
		formGroup.appendChild(label);
		formGroup.appendChild(input);
		return formGroup;
	}

	customSelectField(property, target) {
		// custom-select means that these fields will modify another field's select menus.
		// @separate: this should be broken into custom select with text and without

		// create elements
		let formGroup = HTML.create('div', '', 'form-group input-group select-group');
		let inputGroupPrepend = HTML.create('div', '', 'input-group-prepend');
		let textField = HTML.create('input', `${this.sheet}-${property}`, 'form-control form-control-sm', {
			type : 'text'
		});
		let selectMenu = HTML.create(
			'select',
			`${this.sheet}-${property}-selection`,
			'custom-select custom-select-sm',
			{
				'data-property'     : `${property}`,
				'data-input'        : `${this.sheet}-${property}`,
				'data-modifiesMenu' : `${this.sheet}-${target}-selection`,
				onchange            : 'selectionChangeEventHandler(this)'
			}
		);
		let option = HTML.create('option', '', 'selectPlaceholder');
		option.innerHTML = property;

		// append elements to each other
		selectMenu.appendChild(option);
		inputGroupPrepend.appendChild(selectMenu);
		formGroup.appendChild(inputGroupPrepend);
		formGroup.appendChild(textField);
		return formGroup;
	}

	submitBtn(innerHTML) {
		// @refactor move this declaration to the constructor method  for easier access.
		let button = HTML.create('button', `${this.sheet}-button`, 'btn btn-default btnSubmit', {
			type : 'submit'
		});
		button.innerHTML = innerHTML;
		return button;
	}

	static reset() {
		let forms = Array.from(document.getElementsByTagName('form'));
		for (let i = 0; i < forms.length; i++) {
			forms[i].reset();
		}
		FILTERS = {};
		this.drawSelectMenus();
	}

	static drawSelectMenus() {
		drawSelectMenu('orders-client-selection', Order.spotlight('client', Client, 'name', 10), 'name');
		drawSelectMenu('orders-product-selection', PRODUCTS.sortBy('name'), 'name');
		drawSelectMenu('expenses-name-selection', Expense.spotlight('name', Expense, 'name', 10), 'name');
		drawSelectMenu(
			'expenses-provider-selection',
			Expense.spotlight('provider', Expense, 'provider', 10),
			'provider'
		);
		drawSelectMenu('expenses-category-selection', EXPENSES.sortBy('name'), 'category');
	}

	static removeFormEvents() {
		Array.from(document.querySelectorAll('.custom-select')).map((e) => {
			e.setAttribute('onchange', 'fillInSelection(this)');
		});
	}

	// for create()

	static getFormValues(form) {
		const props = {};
		Array.from(form.getElementsByTagName('input')).map((e) => {
			if (e.type == 'date' && e.value != '') {
				props[e.id.split('-')[1]] = moment(e.value).format();
			} else {
				props[e.id.split('-')[1]] = e.value.toLowerCase();
			}
		});
		return props;
	}
}

class FormCreate extends Form {
	constructor(parentId, constructor) {
		super(parentId, constructor);
		const form = HTML.get(`${constructor.sheet()}Form`);

		form.addEventListener('submit', (e) => {
			constructor.create(form);
			e.preventDefault();
		});
	}

	static render(constructor) {
		new FormCreate('square', constructor);
		HTML.addClass('rectangle', 'hide');
	}
}

class FormEdit extends Form {
	constructor(parentId, constructor, object) {
		super(parentId, constructor);
		this.edit = true;
		const formCont = HTML.get(`formCont`);
		const form = HTML.get(`${constructor.sheet()}Form`);
		const submitButton = HTML.get(`${constructor.sheet()}-button`);
		let eb;

		Form.removeFormEvents();

		form.setAttribute('id', `${constructor.sheet()}EditForm`);
		form.classList.add('editForm');

		form.addEventListener('submit', (e) => {
			constructor.update(form, object);
			Table.render(constructor);
			e.preventDefault();
		});

		let wrapper = HTML.create('div', 'delete-button-wrapper', '');
		eb = HTML.createIconButton('', '', 'far fa-trash-alt', constructor.remove, object);

		if (constructor == Order) {
			this.createFields(form, Order.form().editFormFields);
		}
		wrapper.appendChild(eb);
		formCont.appendChild(wrapper);
		fillInForm(form, object);
		submitButton.innerHTML = `Editar ${constructor.form().button}`;
		form.appendChild(submitButton);
	}

	static render(array) {
		let [ constructor, object ] = array;
		new FormEdit('square', constructor, object);
		HTML.addClass('rectangle', 'hide');
	}
}

// select menu behavior

function selectionChangeEventHandler(option) {
	let targetMenu = option.dataset.modifiesmenu;
	let ownProperty = option.dataset.property;
	let objectArray = Sheet.getLocal(option.form.dataset.constructor);
	Object.assign(FILTERS, { [ownProperty]: option.value });
	fillInSelection(option);
	let objects = filterByPropertyValues(FILTERS, objectArray);
	let targetProperty = document.getElementById(targetMenu).dataset.property;
	drawSelectMenu(targetMenu, objects, targetProperty);
	if (firstSelectionFilled(option.form)) {
		fillInForm(option.form, objects.reverse()[0]);
	}
}

function fillInSelection(option) {
	// fills in the input associated with the selected option.
	// fills in only one input
	let input = document.getElementById(option.dataset.input);
	input.value = option.value;
	option.children[0].selected = 'selected';
}

function filterByPropertyValues(filter, array_of_objects) {
	// filter is an object of the form {prop: value, prop: value}.
	// If filter = {category: alimentacion, subcategory: desayuno},
	// filters array_of_objects and returns only elements that fit both values.
	for (const [ key, value ] of Object.entries(filter)) {
		array_of_objects = array_of_objects.filter((e) => {
			return e[key] == value;
		});
	}
	return array_of_objects;
}

function firstSelectionFilled(form) {
	let selections = Array.from(form.getElementsByTagName('select'));
	return filledIn(selections[0]);
}

function allSelectionFilled(form) {
	let selections = Array.from(form.getElementsByTagName('select'));
	selections = selections.filter((e) => {
		return !filledIn(e);
	});
	return selections.length == 0;
}

function filledIn(selection) {
	return !document.getElementById(selection.dataset.input).value.isEmpty();
}

function fillInForm(form, object) {
	let inputs = Array.from(form.getElementsByTagName('input'));
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].type == 'date') {
			if (form.classList.contains('editForm')) {
				inputs[i].value = moment(object[inputs[i].id.split('-')[1]]).format('YYYY-MM-DD');
			} else {
				inputs[i].value = moment().format('YYYY-MM-DD');
			}
		} else {
			if (object[inputs[i].id.split('-')[1]]) {
				inputs[i].value = object[inputs[i].id.split('-')[1]];
			}
		}
	}
}

// price input behaviors

function updatePriceValues(input) {
	let sheet = input.form.dataset.constructor;
	[ unit, quantity, total ] = getPriceInputs(sheet);
	if (input.id == `${sheet}-total`) {
		quantity.value = quantity.value || 1;
		unit.value = parseFloat(Math.floor(total.value * 100 / quantity.value) / 100);
	} else if (input.id == `${sheet}-quantity`) {
		unit.value = parseFloat(Math.floor(total.value * 100 / quantity.value) / 100);
	} else {
		total.value = parseFloat(Math.floor(unit.value * 100 * quantity.value) / 100);
	}
}

function getPriceInputs(sheet) {
	return [
		document.getElementById(`${sheet}-unitPrice`),
		document.getElementById(`${sheet}-quantity`),
		document.getElementById(`${sheet}-total`)
	];
}

// to draw select menus

function drawSelectMenu(menu, objects, property) {
	if (document.getElementById(menu)) {
		menu = document.getElementById(menu);
		while (menu.children.length != 1) {
			menu.removeChild(menu.lastChild);
		}
		list = getPropertyList(property, objects);
		for (let i = 0; i < list.length; i++) {
			element = document.createElement('option');
			element.setAttribute('value', list[i].toLowerCase());
			element.innerHTML = list[i];
			menu.appendChild(element);
		}
	}
}

function getPropertyList(prop, array) {
	// returns list of property values for an objects array
	onlyProps = array.map((e) => e[prop]).getUnique();
	return onlyProps;
}
