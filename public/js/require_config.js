requirejs.config({
	baseUrl : 'public/js',
	paths   : {
		firebase            : [ 'https://www.gstatic.com/firebasejs/5.11.1/firebase-app' ],
		'firebase-auth'     : [ 'https://www.gstatic.com/firebasejs/5.11.1/firebase-auth' ],
		'firebase-database' : [ 'https://www.gstatic.com/firebasejs/5.11.1/firebase-database' ],
		moment              : [ 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment' ],
		jquery              : [ 'https://code.jquery.com/jquery-3.3.1.slim' ],
		bootstrap           : [ 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap' ],
		'firebase-config'   : 'firebase-config',
		main                : 'main'
	}
});
