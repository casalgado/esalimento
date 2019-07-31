class Inter {
	// @refactor this class is useless, move these methods to card
	static showCard(constructor, row) {
		const id = row.dataset.id;
		const obj = constructor.get(id);
		HTML.removeClassAll('tr', 'selected');
		row.classList.add('selected');
		HTML.removeClass('rectangle', 'hide');
		new Card('rectangle', obj);
	}

	static hideCard() {
		if (arguments[0].target.parentElement.classList.contains('selected')) {
			HTML.get('rectangle').innerHTML = '';
			HTML.addClass('rectangle', 'hide');
			HTML.removeClassAll('tr', 'selected');
		}
	}

	static toggleCard(constructor, row, event) {
		const id = row.dataset.id;
		const obj = constructor.getFromLocal('id', id);
		if (event.target.parentElement.classList.contains('selected')) {
			HTML.get('rectangle').innerHTML = '';
			HTML.addClass('rectangle', 'hide');
			HTML.removeClassAll('tr', 'selected');
		} else {
			HTML.removeClassAll('tr', 'selected');
			row.classList.add('selected');
			HTML.removeClass('rectangle', 'hide');
			new Card('rectangle', obj);
		}
	}
}
