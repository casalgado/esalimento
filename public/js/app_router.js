function homePage() {
	// FormCreate.render(Order);
	console.log('hello');
	return 'hello';
}
const contact = '<h1> yo, c  whatup </h1>';
const resume = '<h1> yo, r whatup </h1>';

const rootDiv = document.getElementById('root');

routes = {
	'/public/'         : homePage(),
	'/public/orders'   : contact,
	'/public/expenses' : resume,
	'/contact'         : 'contactPage'
};

// routes[window.location.pathname];

const onNavigate = (pathname) => {
	window.history.pushState({}, pathname, window.location.origin + pathname);
	rootDiv.innerHTML = routes[pathname];
};
