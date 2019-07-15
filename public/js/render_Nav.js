class Nav {
	static renderMainButton() {
		const nav = HTML.get('custom-nav');
		const button = HTML.createIconButton('fas fa-angle-up fa-2x', Nav.showNav);
		nav.appendChild(button);
	}

	static showNav() {
		const rect = HTML.get('rectangle');
		let nav = HTML.create('section', '', 'localNav');
		HTML.removeClass('rectangle', 'hide');
		for (const [ key, value ] of Object.entries(Nav.props())) {
			let button = HTML.createButton('test', 'btn navBtn', [ key ], value[0], value[1]);
			nav.appendChild(button);
		}
		rect.innerHTML = '';
		rect.appendChild(nav);
	}

	static props() {
		return {
			'ver pedidos'    : [ Table.render, Order ],
			'ver gastos'     : [ Table.render, Expense ],
			'nuevo pedido'   : [ Form.render, Order ],
			'nuevo gasto'    : [ Form.render, Expense ],
			'nuevo producto' : [ Form.render, Product ],
			'nuevo cliente'  : [ Form.render, Client ]
		};
	}
}
