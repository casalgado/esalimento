function toggleDisplay(form) {
	let id = form + 'Form';
	document.getElementById(id).classList.toggle('hide');
}

function getFormValues(form) {
	return Array.from(form.getElementsByTagName('input')).map((e) => e.value.toLowerCase());
}

function formatMoney(input) {
	var temp = input.value;
	input.value = accounting.formatMoney(temp);
}
