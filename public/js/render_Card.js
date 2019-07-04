class Card {
	constructor(parentId, object) {
		let card = HTML.create('div', 'card');
		let p = HTML.get(parentId);
		let t, st, main, side;

		t = HTML.create('h6', 'title');
		st = HTML.create('h6', 'subtitle');
		t.innerHTML = object.card().t || '';
		st.innerHTML = object.card().st || '';

		card.appendChild(t);
		card.appendChild(st);

		main = HTML.list(card, 'p', 'main', object.card().main);
		side = HTML.list(card, 'p', 'side', object.card().side);

		p.appendChild(card);
	}
}
