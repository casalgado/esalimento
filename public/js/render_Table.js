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
			table.appendChild(t.createHeader(c.table()));

			for (let i = 0; i < objects.length; i++) {
				let row = t.createRow(objects[i].table().row);
				row.setAttribute('data-id', objects[i].id);
				row.setAttribute('class', `tableRow ${objects[i].table().rowClass}`);
				row.addEventListener('click', (e) => {
					Inter.toggleCard(c, row, e);
				});
				table.appendChild(row);
			}

			s.appendChild(table);
			if (objects[0].total) {
				totals = objects.reduce((total, current) => {
					return total + parseInt(current.total);
				}, 0);
				totals_cont = HTML.create('p', 'total');
				totals_cont.innerHTML = `Total: ${accounting.formatMoney(totals)}`;
				s.appendChild(totals_cont);
			}

			if (objects[0].export) {
				let encodedURI = encodeURI(convertToCSV(objects));
				let current = moment(SHOWING.current.format('X'), 'X');
				let download_link = HTML.create('a', 'download-as-csv', 'btn', {
					href     : encodedURI,
					download : `${c.sheet()} - ${current.startOf(SHOWING.period).format('D MMM')} - ${current
						.endOf(SHOWING.period)
						.format('D MMM')}.csv`
				});
				download_link.innerHTML = 'exportar';
				let wrapper = HTML.create('div', 'download-link-wrapper');
				wrapper.appendChild(download_link);
				s.appendChild(wrapper);
			}
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
			p.setAttribute('id', 'paginationPlaceholder');
			return p;
		}
	}

	createHeader(tableObject) {
		let row = this.createTableRow('th', tableObject.header);
		row.setAttribute('class', 'tableHeader');
		return row;
	}

	createRow(values) {
		return this.createTableRow('td', values);
	}

	static render(constructor, property) {
		// refactor code below
		let c = constructor;
		let objects = c.byPeriod(SHOWING.current, c.table().period);
		if (objects.length > 0) {
			if (property) {
				objects.sortBy(property);
			} else if (objects[0].datestr()) {
				objects.sortByDatestr();
			} else {
				objects.sortBy('createdAt');
			}
		}
		SHOWING.period = c.table().period;

		new Table('square', objects, c);
		HTML.addClass('rectangle', 'hide');
		document.querySelectorAll('th').forEach((th) =>
			th.addEventListener('click', () => {
				const table = th.closest('table');
				let array = Array.from(table.querySelectorAll('tr:nth-child(n+2)'));
				let sub_array = Array.from(th.parentNode.children).indexOf(th);
				array.sort(rowComparer(sub_array, (this.asc = !this.asc))).forEach((tr) => table.appendChild(tr));
			})
		);
		window.scrollTo(0, 0);
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
			p.innerHTML = `${current.startOf(SHOWING.period).format('D MMM')} - ${current
				.endOf(SHOWING.period)
				.format('D MMM')}`;
		}

		return p;
	}
}

// @refactor add methods (below) to class Pagination

function currentlyShowing() {
	// returns a string
	let current = moment(SHOWING.current.format('X'), 'X');
	return `${current.startOf(SHOWING.period).format('D MMMM')} - ${current.endOf(SHOWING.period).format('D MMMM')}`;
}

function showNext(constructor) {
	SHOWING.current.add(1, SHOWING.period);
	Pagination.renderCurrentlyShowing();
	Table.render(constructor);
	HTML.addClass('rectangle', 'hide');
}

function showPrevious(constructor) {
	SHOWING.current.subtract(1, SHOWING.period);
	Pagination.renderCurrentlyShowing();
	Table.render(constructor);
	HTML.addClass('rectangle', 'hide');
}
