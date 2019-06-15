function fetchAll(constructor, directory) {
	return new Promise((resolve) => {
		var clients = [];
		firebase.database().ref(`devAccount/${directory}`).once('value').then(function(snapshot) {
			snapshot.forEach(function(client) {
				clients.push(instantiateEntry(constructor, client.val()));
			});
			resolve(clients);
		});
	});
}
