function signInUser(){
	var email = document.getElementById('signInEmail').value
	var password = document.getElementById('signInPassword').value
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
	}).then(()=> {loadPage(firebase.auth().currentUser)});
}
