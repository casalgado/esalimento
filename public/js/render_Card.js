class Card {
	constructor(parentId, object) {
		let props = object.card();
		let c = object.constructor;
		let card = HTML.create('section', c.sheet(), 'localCard');
		let p = HTML.get(parentId);
		let t, st;

		t = HTML.create('p', 'cardTitle');
		t.innerHTML = props.t || '';
		card.appendChild(t);

		if (props.detail) {
			HTML.list(card, 'p', 'main', props.detail.main);
			HTML.list(card, 'p', 'side', props.detail.side);
		}

		//st = HTML.create('p', 'cardSubtitle');
		//st.innerHTML = props.st || '';
		//card.appendChild(st);
		for (let i = 0; i < props.btnData.length; i++) {
			let btn = HTML.createSquareButton(props.btnData[i]);
			card.appendChild(btn);
		}

		p.innerHTML = '';
		p.appendChild(card);
	}
}
