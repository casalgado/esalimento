class Nav {
	static renderMainButton() {
		const nav = HTML.get('custom-nav');
		const button = HTML.createIconButton('fas fa-angle-up fa-2x', Nav.showNav);
		nav.appendChild(button);
	}

	static showNav() {
		const rect = HTML.get('rectangle');
		rect.classList.toggle('hide');
		let nav = HTML.create('section', '', 'localNav');
		for (const [ key, value ] of Object.entries(Nav.props())) {
			let button = HTML.createButton('test', 'btn navBtn', [ key ], value[0], value[1]);
			nav.appendChild(button);
		}
		rect.innerHTML = '';
		rect.appendChild(nav);
	}

	static props() {
		return {
			'nuevo producto'     : [ FormCreate.render, Product ],
			'nuevo cliente'      : [ FormCreate.render, Client ],
			'nuevo gasto'        : [ FormCreate.render, Expense ],
			'nuevo pedido'       : [ FormCreate.render, Order ],
			'ver reportes'       : [ Table.render, Report ],
			'ver gastos'         : [ Table.render, Expense ],
			'ver pedidos'        : [ Table.render, Order ],
			'produccion del dia' : [ DayTable.render, Agenda ]
		};
	}
}
