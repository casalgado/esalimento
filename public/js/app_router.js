function homePage() {
	// FormCreate.render(Order);
	console.log('hello');
	return 'hello';
}
const contact = '<h1> yo, c  whatup </h1>';
const resume = '<h1> yo, r whatup </h1>';

const rootDiv = document.getElementById('root');

routes = {
	'/pedidos'       : { function: Table.render, argument: Order },
	'/'              : { function: Table.render, argument: Order },
	'/public/'       : { function: Table.render, argument: Order },
	'/pedidos#nuevo' : { function: FormCreate.render, argument: Order },
	'/gastos'        : { function: Table.render, argument: Expense },
	'/gastos#nuevo'  : { function: FormCreate.render, argument: Expense },
	'/produccion'    : { function: DayTable.render, argument: Agenda },
	'/reportes'      : { function: Table.render, argument: Report },
	'/porcobrar'     : { function: Order.showUnpaid, argument: '' },
	render           : function(pathname) {
		this[pathname].function(this[pathname].argument);
	}
};

window.onpopstate = function() {
	let path = '/' + window.location.href.split('/').pop();
	routes.render(path);
};

// routes[window.location.pathname];

const onNavigate = (pathname) => {
	window.history.pushState({}, pathname, window.location.origin + pathname);
	routes.render(pathname);
};
