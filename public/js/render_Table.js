class Table {
	constructor(parentId, objects, constructor) {
		const t = this;
		const o = objects[0] || { constructor: null };
		const c = o.constructor || constructor;
		const p = document.getElementById(parentId);
		const s = document.createElement('section');
		const table = t.createTable(c.sheet());
		let totals, totals_cont;
		s.setAttribute('class', 'localTable');
		s.appendChild(t.createTitle(c.table().title));
		s.appendChild(t.createPagination(c));
		if (objects[0]) {
			table.appendChild(t.createHeader(c, o.table()));

			for (let i = 0; i < objects.length; i++) {
				let row = t.createRow(objects[i].table().row);
				row.setAttribute('data-id', objects[i].id);
				row.setAttribute('class', 'tableRow');
				row.addEventListener('click', (e) => {
					Inter.toggleCard(c, row, e);
				});
				table.appendChild(row);
			}

			totals = objects.reduce((total, current) => {
				return total + parseInt(current.total);
			}, 0);
			totals_cont = HTML.create('p', 'total');
			totals_cont.innerHTML = totals;

			let encodedURI = encodeURI(exportExpensesAsCSV(objects));
			let download_link = HTML.create('a', '', '', { href: encodedURI, download: 'data.csv' });
			download_link.innerHTML = 'export';
			s.appendChild(table);
			s.appendChild(totals_cont);
			s.appendChild(download_link);
		} else {
			Table.clear();
		}

		p.innerHTML = '';
		p.appendChild(s);
	}

	static clear() {
		let rows;
		rows = document.querySelectorAll('.tableRow');
		Array.from(rows).map((e) => {
			e.innerHTML = '';
		});
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

	createPagination(constructor) {
		let c = constructor;
		let p = document.createElement('div');
		if (c.table().hasPagination) {
			return new Pagination(c);
		} else {
			p.setAttribute('class', 'pagination');
			return p;
		}
	}

	createHeader(c, tableObject) {
		let row = this.createTableRow('th', tableObject.header);
		for (let i = 0; i < row.children.length; i++) {
			row.children[i].addEventListener('click', function() {
				Table.render(c, tableObject.sortby[i]);
			});
		}
		row.setAttribute('class', 'tableHeader');
		return row;
	}

	createRow(values) {
		return this.createTableRow('td', values);
	}

	static render(constructor, property) {
		let prop = property || 'createdAt';
		SHOWING.period = 'week';
		let objects = constructor.byWeek(SHOWING.current).sortBy(prop);
		new Table('square', objects, constructor);
		HTML.addClass('rectangle', 'hide');
	}
}

class DayTable extends Table {
	constructor(parentId, objects, constructor) {
		super(parentId, objects, constructor);
	}

	static render(constructor) {
		SHOWING.period = 'day';
		let objects = constructor.byDay(SHOWING.current);
		new DayTable('square', objects, constructor);
		HTML.addClass('rectangle', 'hide');
	}
}

class Pagination {
	constructor(constructor) {
		let c = constructor;

		let p = this.createPagination(c.sheet());

		p.appendChild(HTML.createIconButton('', '', 'fas fa-caret-left fa-lg', showPrevious, c));
		p.appendChild(Pagination.renderCurrentlyShowing(SHOWING.period));
		p.appendChild(HTML.createIconButton('', '', 'fas fa-caret-right fa-lg', showNext, c));
		return p;
	}

	createPagination(id) {
		let p = document.createElement('div');
		let idstr = id + 'Pagination';
		p.setAttribute('id', idstr);
		p.setAttribute('class', 'pagination');
		return p;
	}

	static renderCurrentlyShowing(period) {
		let p = document.getElementById('currentlyShowing') || document.createElement('h6');
		p.setAttribute('id', 'currentlyShowing');
		let current = moment(SHOWING.current.format('X'), 'X');
		if (period == 'day') {
			p.innerHTML = `${current.startOf(SHOWING.period).format('ddd DD MMM')}`;
		} else {
			p.innerHTML = `${current.startOf(SHOWING.period).format('D MMMM')} - ${current
				.endOf(SHOWING.period)
				.format('D MMMM')}`;
		}

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
	if (constructor.hasDayTable()) {
		DayTable.render(constructor);
	} else {
		Table.render(constructor);
	}
	HTML.addClass('rectangle', 'hide');
}

function showPrevious(constructor) {
	SHOWING.current.subtract(1, SHOWING.period);
	Pagination.renderCurrentlyShowing();
	if (constructor.hasDayTable()) {
		DayTable.render(constructor);
	} else {
		Table.render(constructor);
	}
	HTML.addClass('rectangle', 'hide');
}
