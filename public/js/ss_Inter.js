class Inter {
	static showCard(constructor, row) {
		const id = row.dataset.id;
		const obj = constructor.get(id);
		HTML.removeClassAll('tr', 'selected');
		row.classList.add('selected');
		HTML.removeClass('rectangle', 'hide');
		new Card('rectangle', obj);
	}

	static hideCard() {
		if (
			// esto esta horrible
			arguments[0].target.parentElement.classList.contains('tableRow') ||
			arguments[0].target.parentElement.classList.contains('localCard') ||
			arguments[0].target.classList.contains('localCard')
		) {
		} else {
			HTML.get('rectangle').innerHTML = '';
			HTML.addClass('rectangle', 'hide');
			HTML.removeClassAll('tr', 'selected');
		}
	}

	static loadEvents() {
		document.body.addEventListener('click', this.hideCard);
	}
}
