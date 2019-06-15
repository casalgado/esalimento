function onLoad() {
	CLIENTS = [];
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			loadPage(user);
		} else {
			document.getElementById('siteContainer').setAttribute('style', 'display:block');
		}
	});
}

function loadPage(user) {
	if (user) {
		document.getElementById('siteContainer').setAttribute('style', 'display:none');
		document.getElementById('loaderContainer').setAttribute('style', 'display:none');
		document.getElementById('appContainer').setAttribute('style', 'display:block');
	}
}
