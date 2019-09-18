function signInAdmin(from_form) {
	let props = Form.getFormValues(from_form);
	firebase
		.auth()
		.signInWithEmailAndPassword(props.email, props.password)
		.catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
		})
		.then(() => {
			loadPage(firebase.auth().currentUser);
		});
}
