class Card {
	constructor(parentId, object) {
		let card = HTML.create('section', '', 'localCard');
		let p = HTML.get(parentId);
		let t, st;

		t = HTML.create('h6', 'title');
		st = HTML.create('h6', 'subtitle');
		t.innerHTML = object.card().t || '';
		st.innerHTML = object.card().st || '';

		card.appendChild(t);
		card.appendChild(st);

		HTML.list(card, 'p', 'main', object.card().main);
		HTML.list(card, 'p', 'side', object.card().side);

		p.innerHTML = '';
		p.appendChild(card);
	}
}
