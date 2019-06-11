function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
              loadPage(user)
        } else {
              document.getElementById('landingContainer').setAttribute('style', 'display:block')
        }
    });
}

function loadPage(user){
    if (user){
        document.getElementById('landingContainer').setAttribute('style', 'display:none')
        document.getElementById('mainContainer').setAttribute('style', 'display:block')
    }
}

