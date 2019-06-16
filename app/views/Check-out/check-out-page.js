exports.navigate = function() {
//code transfer back to navigate-view
}

exports.SignOut = function(){
        firebase.logout()
        .then(console.log("user logged out"))
        alert("Du wurdest ausgeloggt")    
    }