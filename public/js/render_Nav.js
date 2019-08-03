class Nav {
	static renderMainButton() {
		const nav = HTML.get('custom-nav');
		const button = HTML.createIconButton('', 'navMainBtn btn-primary', 'fas fa-angle-up fa-2x nbMain', Nav.showNav);
		nav.appendChild(button);
	}

	static showNav() {
		const rect = HTML.get('rectangle');
		rect.classList.toggle('hide');
		let nav = HTML.create('section', '', 'insideNav');
		for (const [ key, value ] of Object.entries(Nav.props())) {
			let button = HTML.createButton('', 'navBtn btn-' + value[2], [ key ], value[0], value[1]);
			nav.appendChild(button);
		}
		rect.innerHTML = '';
		rect.appendChild(nav);
	}

	static props() {
		return {
			'ver pedidos'        : [ Table.render, Order, 'default' ],
			'ver gastos'         : [ Table.render, Expense, 'default' ],
			'ver reportes'       : [ Table.render, Report, 'basic' ],
			'crear producto'     : [ FormCreate.render, Product, 'basic' ],
			'crear cliente'      : [ FormCreate.render, Client, 'basic' ],
			'crear pedido'       : [ FormCreate.render, Order, 'default' ],
			'crear gasto'        : [ FormCreate.render, Expense, 'default' ],
			'produccion del dia' : [ DayTable.render, Agenda, 'primary' ]
		};
	}
}
