//@optimization convert tables.js to Table.js (create a class)

function drawTableRow(object) {
	let content = object.getTableContent();
	let row = createTableElements('td', content);
	row.setAttribute('data-id', object.id);
	return row;
}

function drawTableHeader(object) {
	let titles = object.getTableColumnTitles();
	return createTableElements('th', titles);
}

function drawTableFooter(objects) {}

function drawTable(tableId, objects) {
	table = document.getElementById(tableId);
	table.innerHTML = '';
	setTableTitle();
	if (objects[0]) {
		table.appendChild(drawTableHeader(objects[0]));
	}
	for (let i = 0; i < objects.length; i++) {
		table.appendChild(drawTableRow(objects[i]));
	}
}

function createTableElements(typeOfCell, values) {
	let row, cell;
	row = document.createElement('tr');
	for (let i = 0; i < values.length; i++) {
		cell = document.createElement(typeOfCell);
		cell.innerHTML = values[i];
		row.appendChild(cell);
	}
	return row;
}

function appendToTable(tableId, object) {
	table = document.getElementById(tableId);
	table.appendChild(drawTableRow(object));
}

function setTableTitle() {
	document.getElementById('showOrdersTableTitle').innerHTML = currentlyShowing();
}

// pagination

function currentlyShowing() {
	// returns a string
	let current = moment(SHOWING.current.format('X'), 'X');
	return `${current.startOf(SHOWING.period).format('D MMMM')} - ${current.endOf(SHOWING.period).format('D MMMM')}`;
}

function showNext(table, constructor) {
	SHOWING.current.add(1, SHOWING.period);
	array = constructor.byWeek(SHOWING.current);
	drawTable(table, array);
}

function showPrevious(table, constructor) {
	SHOWING.current.subtract(1, SHOWING.period);
	array = constructor.byWeek(SHOWING.current);
	drawTable(table, array);
}
