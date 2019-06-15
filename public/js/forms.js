function getFormValues(form) {
	return Array.from(form.getElementsByTagName('input')).map((e) => e.value.toLowerCase());
}
