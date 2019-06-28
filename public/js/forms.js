function resetForm(form) {
	let id = form + 'Form';
	document.getElementById(id).reset();
	FILTERS = {};
}

function toggleDisplay(form) {
	let id = form + 'Form';
	document.getElementById(id).classList.toggle('hide');
}

function getFormValues(form) {
	return Array.from(form.getElementsByTagName('input')).map((e) => e.value.toLowerCase());
}

function updatePriceValues(input) {
	[ unit, quantity, total ] = getPriceInputs();
	if (input.id == 'orderTotal') {
		unit.value = total.value / quantity.value;
	} else {
		total.value = unit.value * quantity.value;
	}
}

function getPriceInputs() {
	return [
		document.getElementById('orderUnitPrice'),
		document.getElementById('orderQuantity'),
		document.getElementById('orderTotal')
	];
}

function formatMoney(input) {
	var temp = input.value;
	input.value = accounting.formatMoney(temp);
}

function drawSelectMenu(menu, objects, property) {
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

function filterByPropertyValues(filter, array) {
	// filter is an object of the form {prop: value, prop: value}.
	// If filter = {category: alimentacion, subcategory: desayuno},
	// filters array and returns only elements that fit both values.
	let keys = Object.keys(filter);
	let values = Object.values(filter);
	for (var i = 0; i < keys.length; i++) {
		array = array.filter((e) => {
			return e[keys[i]] == values[i];
		});
	}
	return array;
}

function getPropertyList(prop, array) {
	// returns list of property values for an objects array
	onlyProps = array.map((e) => e[prop]).getUnique();
	return onlyProps;
}

function selectionChangeEventHandler(option) {
	let targetMenu = option.dataset.modifiesmenu;
	let ownProperty = option.dataset.property;
	Object.assign(FILTERS, { [ownProperty]: option.value });
	// a filters falta agregarle el ownForm. ex. Filters.order = {}
	fillInSelection(option);
	let objects = filterByPropertyValues(FILTERS, ORDERS);
	let targetProperty = document.getElementById(targetMenu).dataset.property;
	// falta hacer ORDERS dynamic. Puede ser metiendo un constructor e implementando Order.all
	drawSelectMenu(targetMenu, objects, targetProperty);
	if (formSelectionFilled(option.form)) {
		fillInForm(option.form, objects[0].getFormValues());
	}
}

function formSelectionFilled(form) {
	let selections = Array.from(form.getElementsByTagName('select'));
	selections = selections.filter((e) => {
		return !filledIn(e);
	});
	return selections.length == 0;
}

function filledIn(selection) {
	var test = 'test';
	return !document.getElementById(selection.dataset.input).value.isEmpty();
}

function fillInForm(form, values) {
	let inputs = Array.from(form.getElementsByTagName('input'));
	for (let i = 0; i < inputs.length; i++) {
		if (values[i]) {
			inputs[i].value = values[i];
		}
	}
}

function fillInSelection(option) {
	// fills in the input associated with the selected option.
	// fills in only one input
	selection = document.getElementById(option.dataset.input);
	index = Array.from(option.form.getElementsByTagName('input')).indexOf(selection);
	values = [];
	values[index] = option.value;
	fillInForm(option.form, values);
	option.children[0].selected = 'selected';
}

String.prototype.isEmpty = function() {
	return this.length === 0 || !this.trim();
};
