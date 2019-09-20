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
			// refactor below to use object to assign arguments instead of array
			let button = HTML.createButton('', 'navBtn btn-' + value[2], [ key ], value[0], value[1]);
			nav.appendChild(button);
		}
		rect.innerHTML = '';
		rect.appendChild(nav);
	}

	static props() {
		return {
			'ver pedidos'        : [ onNavigate, { pathname: '/pedidos' }, 'default' ],
			'ver gastos'         : [ onNavigate, { pathname: '/gastos' }, 'default' ],
			'ver reportes'       : [ onNavigate, { pathname: '/reportes' }, 'default' ],
			'crear producto'     : [ FormCreate.render, Product, 'basic' ],
			'crear cliente'      : [ FormCreate.render, Client, 'basic' ],
			'por cobrar'         : [ onNavigate, { pathname: '/porcobrar' }, 'default' ],
			'ventas dia'         : [ onNavigate, { pathname: '/ventasdia' }, 'default' ],
			'nuevo pedido'       : [ onNavigate, { pathname: '/pedidos#nuevo' }, 'default' ],
			'nuevo gasto'        : [ onNavigate, { pathname: '/gastos#nuevo' }, 'default' ],
			'produccion del dia' : [ onNavigate, { pathname: '/produccion' }, 'primary' ]
		};
	}
}
