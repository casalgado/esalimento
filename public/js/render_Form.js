class Form {
	constructor(parentId, constructor) {
		this.sheet = `${constructor.sheet()}`;
		const formCont = HTML.create('section', 'formCont', 'formCont');
		const buttonCont = HTML.create('div', 'buttonCont', 'buttonCont');
		const local_form = constructor.form();
		const parent = HTML.get(parentId);
		const title = HTML.create('h6', 'formTitleId', 'formTitle', {
			ondblclick : 'Form.reset()',
			onclick    : 'Form.drawSelectMenus(); Form.removeFormEvents()'
		});
		const form = HTML.create('form', `${constructor.sheet()}Form`, 'localForm', {
			'data-constructor' : constructor.sheet()
		});

		title.innerHTML = local_form.title;
		form.appendChild(title);
		this.createFields(form, local_form.fields);

		buttonCont.appendChild(this.submitBtn(`Crear ${local_form.button}`));
		form.appendChild(buttonCont);
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

				form.appendChild(this[key](value));
			}
		}
	}

	basicField({ property, type, defaultValue = '', label = null }) {
		let formGroup = HTML.create('div', '', 'form-group basicFieldGroup');
		let labelDOM = HTML.create('label', '', `${type}-${property}`, { for: `${this.sheet}-${property}` });
		labelDOM.innerHTML = label || property;
		let input = HTML.create('input', `${this.sheet}-${property}`, 'basicField form-control form-control-sm', {
			type  : type,
			value : defaultValue
		});
		if (property != 'paid') {
			input.setAttribute('required', true);
		}
		formGroup.appendChild(labelDOM);
		formGroup.appendChild(input);
		return formGroup;
	}

	priceField({ property, step = 1, defaultValue = '', label = null }) {
		// If the three 'price' fields are included
		// (this means quantity, unitPrice, total),
		// the interactions between them are added atomatically.

		// create elements
		let formGroup = HTML.create('div', '', 'form-group priceFieldGroup');
		let labelDOM = HTML.create('label', '', '', { for: `${this.sheet}-${property}` });
		let firstProperty = this.sheet == 'orders' ? 'unitPrice' : 'total';
		labelDOM.innerHTML = label || property;
		let input = HTML.create('input', `${this.sheet}-${property}`, 'priceField form-control form-control-sm', {
			type     : 'number',
			min      : '0',
			step     : step,
			onchange : `updatePriceValues(this, '${firstProperty}')`,
			onkeyup  : `updatePriceValues(this, '${firstProperty}')`,
			value    : defaultValue
		});
		formGroup.appendChild(labelDOM);
		formGroup.appendChild(input);
		return formGroup;
	}

	customSelectField({ property, target }) {
		// custom-select means that these fields will modify another field's select menus.
		// @separate: this should be broken into custom select with text and without

		// create elements
		let formGroup = HTML.create('div', '', 'form-group input-group select-group');
		let inputGroupPrepend = HTML.create('div', '', 'input-group-prepend');
		let textField = HTML.create(
			'input',
			`${this.sheet}-${property}`,
			'customSelectField form-control form-control-sm',
			{
				type : 'text'
			}
		);
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
		let button = HTML.create('button', `${this.sheet}-button`, 'btn btn-transparent btnSubmit', {
			type : 'submit'
		});
		button.innerHTML = innerHTML;
		return button;
	}

	static basicField({ property, type, defaultValue = '', label = null }) {
		let formGroup = HTML.create('div', '', 'form-group basicFieldGroup');
		let labelDOM = HTML.create('label', '', `${type}-${property}`, { for: `${this.sheet}-${property}` });
		labelDOM.innerHTML = label || property;
		let input = HTML.create('input', `${this.sheet}-${property}`, 'basicField form-control form-control-sm', {
			type  : type,
			value : defaultValue
		});
		if (property != 'paid') {
			input.setAttribute('required', true);
		}
		formGroup.appendChild(labelDOM);
		formGroup.appendChild(input);
		return formGroup;
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
		drawSelectMenu('orders-client-selection', Order.spotlight('client', Client, 'name', 20), 'name');
		drawSelectMenu('orders-product-selection', PRODUCTS.sortBy('name'), 'name');
		drawSelectMenu('expenses-name-selection', Expense.spotlight('name', Expense, 'name', 10), 'name');
		drawSelectMenu(
			'expenses-provider-selection',
			Expense.spotlight('provider', Expense, 'provider', 10),
			'provider'
		);
		drawSelectMenu('expenses-category-selection', EXPENSES.sortBy('category'), 'category');
	}

	static removeFormEvents() {
		Array.from(document.querySelectorAll('.custom-select')).map((e) => {
			e.setAttribute('onchange', 'fillInSelection(this)');
		});
	}

	// for create()

	static getFormValues(from_form) {
		const props = {};
		Array.from(from_form.getElementsByTagName('input')).map((e) => {
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

		if (constructor.combo) {
			let comboButtons = constructor.comboButtons();
			comboButtons.map((e) => {
				let btn = HTML.createSquareButton(e);
				form.appendChild(btn);
			});
			console.log('I am here');
		}
	}

	static render(constructor) {
		new FormCreate('square', constructor);
		// @refactor below with table.render
		HTML.addClass('rectangle', 'hide');
		window.scrollTo(0, 0);
	}
}

class FormEdit extends Form {
	constructor(parentId, constructor, object) {
		super(parentId, constructor);
		this.edit = true;
		const buttonCont = HTML.get(`buttonCont`);
		const form = HTML.get(`${constructor.sheet()}Form`);
		const submitButton = HTML.get(`${constructor.sheet()}-button`);
		const title = document.getElementById('formTitleId');
		title.innerHTML = `${constructor.form().editTitle}`;

		Form.removeFormEvents();

		form.setAttribute('id', `${constructor.sheet()}EditForm`);
		form.classList.add('editForm');

		form.addEventListener('submit', (e) => {
			constructor.update(form, object);
			e.preventDefault();
			window.history.go(-1);
		});

		if (constructor == Order) {
			this.createFields(form, Order.form().editFormFields);
		}
		fillInForm(form, object);
		submitButton.innerHTML = `Editar ${constructor.form().button}`;
		buttonCont.appendChild(submitButton);
		form.appendChild(buttonCont);
	}

	static render(constructor) {
		// is it good practice to take the id from history.state?
		let object = constructor.getFromLocal('id', window.history.state.objectId);
		new FormEdit('square', constructor, object);
		HTML.addClass('rectangle', 'hide');
		window.scrollTo(0, 0);
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

function updatePriceValues(input, firstProperty) {
	let sheet = input.form.dataset.constructor;
	[ unit, quantity, total ] = getPriceInputs(sheet);
	// @refactor horrible code below, needs work.
	if (firstProperty == 'total') {
		if (input.id == `${sheet}-total`) {
			quantity.value = quantity.value || 1;
			unit.value = parseFloat(Math.floor(total.value * 100 / quantity.value) / 100);
		} else if (input.id == `${sheet}-quantity`) {
			unit.value = parseFloat(Math.floor(total.value * 100 / quantity.value) / 100);
		} else {
			total.value = parseFloat(Math.floor(unit.value * 100 * quantity.value) / 100);
		}
	} else if (firstProperty == 'unitPrice') {
		if (input.id == `${sheet}-unitPrice`) {
			quantity.value = quantity.value || 1;
			total.value = parseFloat(Math.floor(unit.value * 100 * quantity.value) / 100);
		} else if (input.id == `${sheet}-quantity`) {
			total.value = parseFloat(Math.floor(unit.value * 100 * quantity.value) / 100);
		} else {
			unit.value = parseFloat(Math.floor(total.value * 100 / quantity.value) / 100);
		}
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
