class Table {
	constructor(id, objects) {
		this.draw(id, objects);
	}

	draw(id, objects) {
		let table = document.getElementById(id);
		table.innerHTML = '';
		setTableTitle('showOrdersTableTitle'); // se puede sacar de aqui.
		objects[0] ? table.appendChild(this.drawHeader(objects[0])) : false;
		for (let i = 0; i < objects.length; i++) {
			table.appendChild(this.drawRow(objects[i]));
		}
	}

	drawHeader(object) {
		let titles = object.columnTitles();
		let row = this.createHTML('th', titles);
		return row;
	}

	drawRow(object) {
		let content = object.rowContent();
		let row = this.createHTML('td', content);
		row.setAttribute('data-id', object.id);
		return row;
	}

	createHTML(typeOfCell, values) {
		let row, cell;
		row = document.createElement('tr');
		for (let i = 0; i < values.length; i++) {
			cell = document.createElement(typeOfCell);
			cell.innerHTML = values[i];
			row.appendChild(cell);
		}
		return row;
	}
}

function appendToTable(tableId, object) {
	table = document.getElementById(tableId);
	table.appendChild(drawTableRow(object));
}

function setTableTitle(elementId) {
	document.getElementById(elementId).innerHTML = currentlyShowing();
}

// pagination

function currentlyShowing() {
	// returns a string
	let current = moment(SHOWING.current.format('X'), 'X');
	return `${current.startOf(SHOWING.period).format('D MMMM')} - ${current.endOf(SHOWING.period).format('D MMMM')}`;
}

function showNext(table, constructor) {
	SHOWING.current.add(1, SHOWING.period);
	array = constructor.byPeriod(SHOWING.current, SHOWING.period);
	new Table(table, array);
}

function showPrevious(table, constructor) {
	SHOWING.current.subtract(1, SHOWING.period);
	array = constructor.byPeriod(SHOWING.current, SHOWING.period);
	new Table(table, array);
}
