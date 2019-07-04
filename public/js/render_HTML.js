class HTML {
	static create(type, oid, oclass) {
		let id = oid || '';
		let classname = oclass || '';
		let element = document.createElement(type);
		element.setAttribute('id', id);
		element.setAttribute('class', classname);
		return element;
	}

	static get(id) {
		return document.getElementById(id);
	}

	static list(parent, childType, childClass, object) {
		for (const [ key, value ] of Object.entries(object)) {
			let child = HTML.create(childType, '', childClass);
			child.innerHTML = `${key}: ${value}`;
			parent.appendChild(child);
		}
		return parent;
	}
}
