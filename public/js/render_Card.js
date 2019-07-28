class Card {
	constructor(parentId, object) {
		let props = object.card();
		let c = object.constructor;
		let card = HTML.create('section', '', 'localCard');
		let p = HTML.get(parentId);
		let t, st, eb;

		t = HTML.create('h6', 'title');
		st = HTML.create('h6', 'subtitle');
		t.innerHTML = props.t || '';
		st.innerHTML = props.st || '';

		eb = HTML.createIconButton('far fa-edit rectangle-button', FormEdit.render, [ c, object ]);

		card.appendChild(t);
		card.appendChild(st);
		card.appendChild(eb);

		HTML.list(card, 'p', 'main', props.main);
		HTML.list(card, 'p', 'side', props.side);

		p.innerHTML = '';
		p.appendChild(card);
	}
}
