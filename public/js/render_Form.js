class Form {
	constructor(parentId, constructor) {
		this.sheet = `${constructor.sheet()}`;
		const props = constructor.form();
		const parent = HTML.get(parentId);
		const form = HTML.create('form', `${constructor.sheet()}Form`, 'localForm');

		form.addEventListener('submit', (e) => {
			constructor.create();
			e.preventDefault();
		});

		form.appendChild(this.customSelect('product', 'client'));
		form.appendChild(this.submitBtn(props.button));

		parent.innerHTML = '';
		parent.appendChild(form);
	}

	submitBtn(innerHTML) {
		let button = HTML.create('button', '', 'btn btn-primary btnSubmit', { type: 'submit' });
		button.innerHTML = innerHTML;
		return button;
	}

	customSelect(property, target) {
		// <div class="form-group input-group select-group">
		//       <div class="input-group-prepend">
		//         <select
		//           class="custom-select custom-select-sm"
		//           id="productSelection"
		//           data-property="product"
		//           data-input="orderProduct"
		//           data-modifiesMenu="clientSelection"
		//           onchange="selectionChangeEventHandler(this)"
		//           onkeyup="">
		//             <option value=" " class="selectPlaceholder">Producto</option>
		//         </select>
		//       </div>
		//       <input required type="text" onkeyup="" class="form-control form-control-sm" id="orderProduct" placeholder="">
		// </div>

		let formGroup = HTML.create('div', '', 'form-group input-group select group');
		let inputGroupPrepend = HTML.create('div', '', 'input-group-prepend');
		let textField = HTML.create('input', `${this.sheet}${property}`, 'form-control form-control-sm', {
			type : 'text'
		});
		let selectMenu = HTML.create('select', `${property}Selection`, 'custom-select custom-select-sm', {
			'data-property'     : `${property}`,
			'data-input'        : `${this.sheet}${property}`,
			'data-modifiesMenu' : `${target}Selection`,
			onchange            : 'testMethod()'
		});
		let option = HTML.create('option', '', 'selectPlaceholder');
		option.innerHTML = property;

		let option2 = HTML.create('option', '', 'selectPlaceholder');
		option2.innerHTML = 'test';
		selectMenu.appendChild(option);
		selectMenu.appendChild(option2);
		inputGroupPrepend.appendChild(selectMenu);
		formGroup.appendChild(inputGroupPrepend);
		formGroup.appendChild(textField);
		return formGroup;
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

function testMethod() {
	console.log('whatup');
}
