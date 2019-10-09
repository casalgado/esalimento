const onNavigate = ({ pathname, state = {} }) => {
	window.history.pushState(state, pathname, window.location.origin + pathname);
	routes.render(pathname);
	window.scrollTo(0, 0);
};

routes = {
	'/pedidos'           : { function: Table.render, argument: Order },
	'/'                  : { function: Table.render, argument: Order },
	'/public/'           : { function: Table.render, argument: Order },
	'/public/index.html' : { function: Table.render, argument: Order },
	'/pedidos#nuevo'     : { function: FormCreate.render, argument: Order },
	'/pedidos#editar'    : { function: FormEdit.render, argument: Order },
	'/gastos'            : { function: Table.render, argument: Expense },
	'/gastos#nuevo'      : { function: FormCreate.render, argument: Expense },
	'/gastos#editar'     : { function: FormEdit.render, argument: Expense },
	'/produccion'        : { function: Table.render, argument: Production },
	'/ingresos'          : { function: Table.render, argument: Paid },
	'/egresos'           : { function: Table.render, argument: Spent },
	'/reportes'          : { function: Table.render, argument: Report },
	'/reportes#editar'   : { function: FormEdit.render, argument: Report },
	'/porcobrar'         : { function: Table.render, argument: Unpaid },
	'/clientes'          : { function: Table.render, argument: Client },
	render               : function(pathname) {
		this[pathname].function(this[pathname].argument);
	}
};

// triggers re-render when pressing back and forwards buttons
window.onpopstate = function() {
	let path = '/' + window.location.href.split('/').pop();
	routes.render(path);
};

function fetchState() {
	let state = history.state || {};
	return state;
}
