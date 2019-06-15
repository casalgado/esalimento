function signInAdmin(form) {
	let [ email, password ] = getFormValues(form);
	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
		})
		.then(() => {
			loadPage(firebase.auth().currentUser);
		});
}
