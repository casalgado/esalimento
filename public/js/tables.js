function drawTableRow(object) {
	let content = object.getTableContent();
	let row = createTableElements('td', content);
	row.setAttribute('data-id', object.id);
	return row;
}

function drawTableHeader(object) {
	let titles = object.getColumnTitles();
	return createTableElements('th', titles);
}

function drawTableFooter(objects) {}

function drawTable(tableId, objects) {
	table = document.getElementById(tableId);
	table.appendChild(drawTableHeader(objects[0]));
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
