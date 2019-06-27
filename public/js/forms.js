function resetForm(form) {
	let id = form + 'Form';
	document.getElementById(id).reset();
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

function drawSelectMenu(menu, list, property) {
	menu = document.getElementById(menu);
	while (menu.children.length != 1) {
		menu.removeChild(menu.lastChild);
	}
	list = list.flat().getUnique();
	for (let i = 0; i < list.length; i++) {
		element = document.createElement('option');
		element.setAttribute('value', list[i][property].toLowerCase());
		element.innerHTML = list[i][property];
		menu.appendChild(element);
	}
}

function filterByPropertyValues(filter, array) {
	// filter is an object of the form {prop: value, prop: value}.
	// If filter = {category: alimentacion, subcategory: desayuno},
	// filters array and returns only elements that fit both values.
	// Returns most recent first.
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
