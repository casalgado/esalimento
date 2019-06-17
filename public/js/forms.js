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
