class Card {
	constructor(parentId, object) {
		let props = object.card();
		let card = HTML.create('section', '', 'localCard');
		let p = HTML.get(parentId);
		let t, st;

		t = HTML.create('h6', 'title');
		st = HTML.create('h6', 'subtitle');
		t.innerHTML = props.t || '';
		st.innerHTML = props.st || '';

		card.appendChild(t);
		card.appendChild(st);

		HTML.list(card, 'p', 'main', props.main);
		HTML.list(card, 'p', 'side', props.side);

		p.innerHTML = '';
		p.appendChild(card);
	}
}
