function addPopoverEvent(tableId) {
	let id = '#' + tableId;
	rows = document.querySelectorAll(`${id} tr`);
	for (let i = 1; i < rows.length; i++) {
		rows[i].addEventListener('click', showPopover);
	}
}

function showPopover() {
	let popover = document.getElementById('popoverContainer');
	popover.classList.add('show');
	popover.velocity({ backgroundColor: 'rgba(0, 0, 0, 0.8)' }, { duration: POPOVER.speed });
	drawPopover(Order.getById(this.getAttribute('data-id')));
}

function hidePopover() {
	let popover = document.getElementById('popoverContainer');
	popover.velocity({ backgroundColor: 'rgba(0, 0, 0, 0)' }, { duration: POPOVER.speed }).then(() => {
		popover.classList.remove('show');
	});
}

function drawPopover(object) {
	let content, keys, values;
	content = document.getElementById('popoverContent');
	content.innerHTML = '';
	keys = Object.keys(object);
	values = Object.values(object);
	for (let i = 0; i < keys.length; i++) {
		kdiv = document.createElement('div');
		vdiv = document.createElement('div');
		kdiv.classList.add('pdiv');
		vdiv.classList.add('pdiv');
		kdiv.innerHTML = keys[i];
		vdiv.innerHTML = values[i];
		content.appendChild(kdiv);
		content.appendChild(vdiv);
	}
}
