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

function playVideo(){
    document.getElementById('frame').src += '&autoplay=1'
    rbutton = document.getElementById('rbutton')
    rbutton.innerHTML = '... wait for it...'
    rbutton.velocity({ opacity: '0'}, {duration: '3000', easing: 'easeInQuint'} )
    setTimeout(()=> {
        movingBlocks()
    }, 5000)
    
}

function movingBlocks(){
    coverup = document.getElementById('coverup')
    rickroll = document.getElementById('rickrolled')
    coverup.velocity({ opacity: '0'}, {duration: '10000', easing: 'easeInQuint'} )
    rickroll.velocity({ opacity: '1'}, {duration: '10000', easing: 'easeInQuint'} )
    
}