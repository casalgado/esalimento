function addCustomModalEvent(tableId) {
	let id = '#' + tableId;
	rows = document.querySelectorAll(`${id} tr`);
	for (let i = 1; i < rows.length; i++) {
		rows[i].addEventListener('click', showCustomModal);
	}
}

function showCustomModal() {
	let modal = document.getElementById('customModalContainer');
	modal.classList.add('show');
	modal.velocity({ backgroundColor: 'rgba(0, 0, 0, 0.4)' }, { duration: MODAL.speed });
	drawCustomModal(Order.getById(this.getAttribute('data-id')));
}

function hideCustomModal() {
	let modal = document.getElementById('customModalContainer');
	modal.velocity({ backgroundColor: 'rgba(0, 0, 0, 0)' }, { duration: MODAL.speed }).then(() => {
		modal.classList.remove('show');
	});
}

function drawCustomModal(object) {
	let modal, titles, content, row, tp, cp;
	modal = document.getElementById('customModalContent');
	modal.innerHTML = '';
	titles = object.getCustomModalTitles();
	content = object.getCustomModalContent();
	for (let i = 0; i < titles.length; i++) {
		row = document.createElement('div');
		row.classList.add('customModalRow');
		tp = document.createElement('p');
		cp = document.createElement('p');
		tp.innerHTML = titles[i];
		cp.innerHTML = content[i];
		row.appendChild(tp);
		row.appendChild(cp);
		modal.appendChild(row);
	}
}
