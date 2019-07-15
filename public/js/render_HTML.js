class HTML {
	static create(type, oid, oclass, attributes) {
		let id = oid || '';
		let classname = oclass || '';
		let element = document.createElement(type);
		element.setAttribute('id', id);
		element.setAttribute('class', classname);
		if (attributes) {
			for (const [ key, value ] of Object.entries(attributes)) {
				element.setAttribute([ key ], value);
			}
		}
		return element;
	}

	static createIconButton(iconClass, funcToCall, argument) {
		let button = document.createElement('button');
		button.setAttribute('class', 'btn');
		button.addEventListener('click', () => {
			funcToCall(argument);
		});
		let icon = document.createElement('i');
		icon.setAttribute('class', iconClass);
		button.appendChild(icon);
		return button;
	}

	static createButton(btnId, btnClass, display, funcToCall, argument) {
		let button = HTML.create('button', btnId, btnClass);
		button.addEventListener('click', () => {
			funcToCall(argument);
		});
		button.innerHTML = display;
		return button;
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
		// @this method is only used by card. is it possible to combine with navList()?
		for (const [ key, value ] of Object.entries(object)) {
			let child = HTML.create(childType, '', childClass);
			child.innerHTML = `${key}: ${value}`;
			parent.appendChild(child);
		}
		return parent;
	}
}
