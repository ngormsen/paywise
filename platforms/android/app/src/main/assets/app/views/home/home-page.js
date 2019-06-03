const frameModule = require("ui/frame");
const LoginViewModel = require("./login-view-model");
const observableModule = require("tns-core-modules/data/observable");
//const observableModule = require("data/observable");
const dialogsModule = require("ui/dialogs");
const userService = require("~/services/user-service");
const topmost = require("ui/frame").topmost;
const firebase = require("nativescript-plugin-firebase");
const firebaseWebApi = require("nativescript-plugin-firebase/app");
var view = require("tns-core-modules/ui/core/view");
var getViewById = require("tns-core-modules/ui/core/view").getViewById;

/*
const loginViewModel = new LoginViewModel();

exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}

*/


var page;

exports.loaded = loaded;
function loaded(args){
  page = args.object;
}

//sign Up /create Account function
exports.signUp = function(){
  var email = page.getViewById('email').text; 
  var password = page.getViewById('password').text; 

  var hello = "asdfasd";

  alert("mail" + String(hello)); 
  alert("email" + String(email));
  alert("pw" +  String(password));


//Firebase function:
      firebase.createUser({
        email: email,
        password: password
       }).then(function (result) {
        console.log("userid: " + result.key);
      }).catch(function (err) {
        console.log("createUser error: " + err);
        dialogs.alert(err);
      });
  };

/*
//Sign in / Login function  
exports.signIn = function(){
  firebase.login(
    {
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: email,
        password: password
      }
    })
    .then(result => JSON.stringify(result))
      //topmost().navigate("./qr/qr-page")
  
    .catch(error => console.log(error));
}

//
exports.SignOut = function(args){
  firebase.logout();

}
        
    
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

/*
var user = new observableModule.fromObject({
  var user.email: String
  var user.password String
});


var page;
var email;



exports.loaded = function (args) {
 const page = args.object;
}


  //auth.signInWithEmailAndPassword(email, password);
 // firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
 
 /*
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

        
        console.log("User created: " + JSON.stringify(user));
      })
      .catch(error => console.log("Error creating user: " + error));

    }
  
    // Handle Errors here.
   // var errorCode = error.code;
    //var errorMessage = error.message;
    // ...

  
  //});

/*


exports.LogIn = function (args){
  const page = args.object;
  const email = page.getViewById("email");
  const password = page.getViewById("password");
  firebaseWebApi.auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log("User logged in"))
      .catch(err => console.log("Login error: " + JSON.stringify(err)));



  /*
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    });  }


/*


firebase.login(
    {
      type: firebase.LoginType.ANONYMOUS
    })
    .then(user => console.log("User uid: " + user.uid))
    .catch(error => console.log("Trouble in paradise: " + error));


  }

//Sign out Function:

*/














/*
const frameModule = require("ui/frame");
const LoginViewModel = require("./login-view-model");

const loginViewModel = new LoginViewModel();
   
exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}
*/