class Inter {
	static showCard(constructor, row) {
		const id = row.dataset.id;
		const obj = constructor.get(id);
		new Card('rectangle', obj);
	}
}
