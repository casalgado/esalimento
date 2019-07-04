class Form {
	constructor(parentId, constructor) {
		this.id = `${constructor.sheet()}Form`;

		let form = document.createElement('form');
		form.setAttribute('id', this.id);
		form.setAttribute('class', `localForm`);
		form.addEventListener('submit', (e) => {
			constructor.create();
			e.preventDefault();
		});

		let button = document.createElement('button');
		button.setAttribute('type', 'submit');
		button.setAttribute('class', 'btn btn-primary btnSubmit');
		button.innerHTML = 'Create';

		form.appendChild(Form.createSimpleField(constructor, 'Name', 'text', 'Nombre', true));
		form.appendChild(button);
		document.getElementById(parentId).appendChild(form);
	}

	static createSimpleField(constructor, property, type, name, required) {
		id = constructor.sheet() + property;
		let group = document.createElement('div');
		group.setAttribute('class', 'form-group');
		let label = document.createElement('label');
		label.setAttribute('for', id);
		label.innerHTML = name;
		let input = document.createElement('input');
		input.setAttribute('id', id);
		input.setAttribute('class', 'form-control form-control-sm');
		input.setAttribute('type', type);
		if (required) {
			input.required = true;
		}
		group.appendChild(label);
		group.appendChild(input);
		return group;
	}

	static createSelectField() {}

	static resetForm(form) {
		let id = form + 'Form';
		document.getElementById(id).reset();
		FILTERS = {};
		drawSelectMenu('clientSelection', CLIENTS, 'name');
		drawSelectMenu('productSelection', PRODUCTS, 'name');
	}
}
