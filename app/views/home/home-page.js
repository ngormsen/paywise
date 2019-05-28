const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var observableModule = require("tns-core-modules/data/observable");
const firebase = require("nativescript-plugin-firebase");
const firebaseWebApi = require("nativescript-plugin-firebase/app");

const view = require("tns-core-modules/ui/core/view");
var getViewById = require("tns-core-modules/ui/core/view").getViewById;



firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
  persist: true
}).then(
    function () {
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
    }
);



//const HomeViewModel = require("home/home-view-model")
//const Button = require("tns-core-modules/ui/button").Button;



//exports.pageLoaded = function (args) {
  //const page = args.object;
  //page.bindingContext = LogIn;
  

  
//}


//const txtEmail = page.getViewedById("email");
//const txtPassword = page.getViewedById("password");
//const btnLogin = page.getViewedById("login");
//const btnSignin = page.getViewedById("signin");

//function onNavigatingTo(args) {

  
//}




exports.signIn = function(args){
  //const email = txtemail.value
  //const passwort = txtpassword.value
  //var password = page.getViewedById("password");
 // const  page = args.object;
  const page = args.object;
  const email = page.getViewById("email");
  const password = page.getViewById("password");
  //auth.signInWithEmailAndPassword(email, password);
 // firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
 
  firebaseWebApi.auth().createUserWithEmailAndPassword(email, password)
      .then(
        function(user){
          dialogs.alert({
            title: "User created",
            message: "email: " + user.email,
            okButtonText: "Nice!"
        })
      },
        function (errorMessage) {
          dialogs.alert({
            title: "No user created",
            message: errorMessage,
            okButtonText: "OK, got it"
        })
      }
  );
    }

        /*
        console.log("User created: " + JSON.stringify(user));
      })
      .catch(error => console.log("Error creating user: " + error));

    }
  
    // Handle Errors here.
   // var errorCode = error.code;
    //var errorMessage = error.message;
    // ...

  
  //});



exports.LogIn = function (args){
  const page = args.object;
  const email = page.getViewById("email");
  const password = page.getViewById("password");
  firebaseWebApi.auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log("User logged in"))
      .catch(err => console.log("Login error: " + JSON.stringify(err)));


}
  /*
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    });  }


/*

//Sign out Function:

exports.SignOut = function(args){
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
});
}
*/