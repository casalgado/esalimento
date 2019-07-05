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

	static addClass(id, classname) {
		document.getElementById(id).classList.add(classname);
	}

	static removeClass(id, classname) {
		document.getElementById(id).classList.remove(classname);
	}

	static removeClassAll(group, classname) {
		Array.from(document.querySelectorAll(group)).map((e) => {
			e.classList.remove(classname);
		});
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
