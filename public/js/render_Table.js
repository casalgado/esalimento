class Table {
	constructor(parentId, objects) {
		if (!objects[0]) {
			let q;
			q = document.querySelectorAll('.rowObject');
			Array.from(q).map((e) => {
				e.innerHTML = '';
			});
			return '';
		}
		const t = this;
		const o = objects[0];
		const c = o.constructor;
		const p = document.getElementById(parentId);
		const s = document.createElement('section');

		const table = t.createTable(c.sheet());

		table.appendChild(t.createHeader(o.table().header));

		for (let i = 0; i < objects.length; i++) {
			let row = t.createRow(objects[i].table().row);
			row.setAttribute('data-id', objects[i].id);
			row.setAttribute('class', 'rowObject');
			table.appendChild(row);
		}

		s.setAttribute('class', 'localTable');
		s.appendChild(t.createTitle(o.table().title));
		s.appendChild(t.createPagination(o));
		s.appendChild(table);

		p.innerHTML = '';
		p.appendChild(s);
	}

	createTable(id) {
		let idstr = id + 'Table';
		let table = document.createElement('table');
		table.setAttribute('id', idstr);
		return table;
	}

	createTableRow(typeOfCell, values) {
		let row, cell;
		row = document.createElement('tr');
		for (let i = 0; i < values.length; i++) {
			cell = document.createElement(typeOfCell);
			cell.innerHTML = values[i];
			row.appendChild(cell);
		}
		return row;
	}

	createTitle(title) {
		let t = document.createElement('h6');
		t.innerHTML = title;
		return t;
	}

	createPagination(object) {
		let o = object;
		let p = document.createElement('div');
		if (o.table().datestr.isEmpty()) {
			p.setAttribute('class', 'pagination');
			return p;
		} else {
			return new Pagination(o);
		}
	}

	createHeader(values) {
		return this.createTableRow('th', values);
	}

	createRow(values) {
		return this.createTableRow('td', values);
	}

	static reRender(constructor) {
		let objects = constructor.byWeek(SHOWING.current);
		new Table('square', objects);
	}
}

class Pagination {
	constructor(object) {
		let t = this;
		let o = object;
		let c = o.constructor;

		let p = this.createPagination(c.sheet());

		p.appendChild(t.createButton('fas fa-caret-left fa-lg', showPrevious, c));
		p.appendChild(Pagination.renderCurrentlyShowing());
		p.appendChild(t.createButton('fas fa-caret-right fa-lg', showNext, c));
		return p;
	}

	createPagination(id) {
		let p = document.createElement('div');
		let idstr = id + 'Pagination';
		p.setAttribute('id', idstr);
		p.setAttribute('class', 'pagination');
		return p;
	}

	createButton(iconClass, funcToCall, constructor) {
		let button = document.createElement('button');
		button.setAttribute('class', 'btn');
		button.addEventListener('click', function() {
			funcToCall(constructor);
		});
		let icon = document.createElement('i');
		icon.setAttribute('class', iconClass);
		button.appendChild(icon);
		return button;
	}

	static renderCurrentlyShowing() {
		let p = document.getElementById('currentlyShowing') || document.createElement('h6');
		p.setAttribute('id', 'currentlyShowing');
		let current = moment(SHOWING.current.format('X'), 'X');
		p.innerHTML = `${current.startOf(SHOWING.period).format('D MMMM')} - ${current
			.endOf(SHOWING.period)
			.format('D MMMM')}`;
		return p;
	}
}

function currentlyShowing() {
	// returns a string
	let current = moment(SHOWING.current.format('X'), 'X');
	return `${current.startOf(SHOWING.period).format('D MMMM')} - ${current.endOf(SHOWING.period).format('D MMMM')}`;
}

function showNext(constructor) {
	SHOWING.current.add(1, SHOWING.period);
	Pagination.renderCurrentlyShowing();
	Table.reRender(constructor);
}

function showPrevious(constructor) {
	SHOWING.current.subtract(1, SHOWING.period);
	Pagination.renderCurrentlyShowing();
	Table.reRender(constructor);
}
