const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const observableModule = require("tns-core-modules/data/observable");
const firebase = require("nativescript-plugin-firebase");
const firebaseWebApi = require("nativescript-plugin-firebase/app");
const dialogsModule = require("ui/dialogs");
const textFieldModule = require("ui/text-field");
var data = require("../shared/data.js");

var view = require("tns-core-modules/ui/core/view");
var getViewById = require("tns-core-modules/ui/core/view").getViewById;





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

*/
var page;

exports.loaded = loaded;
function loaded(args){
  page = args.object;
}



exports.Register = function(){
  //const email = txtemail.value
  //const passwort = txtpassword.value
  //var password = page.getViewedById("password");
 // const  page = args.object;
  const email = page.getViewById("email").text; 
  //const email = String(emailfield);
  const password = page.getViewById("password").text; 
  //const password = String(passwordfield);

//   var hello = "asdfasd"

//   alert("mail" + String(hello)) 
//   alert("email" + String(email))
//   alert("pw" +  String(password))



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

*/

function success(result){
    data.guest = result.email
    getFrameById("topframe").navigate("views/qr/qr-page")
}


exports.LogIn = function (){
  const email = page.getViewById("email").text;
  const password = page.getViewById("password").text;
    firebase.login(
      {
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: email,
          password: password
        }
      })
      .then(result => success(result))
      .catch(error => alert("Falsches Passwort/E-Mail Adresse."));
    }
//JSON.stringify(result)




  /*
  firebaseWebApi.auth().signInWithEmailAndPassword(email, password)
      .then(() => console.log("User logged in"))
      .catch(err => console.log("Login error: " + JSON.stringify(err)));

*/

 /* 
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    });  }



*/
/*
firebase.login(
    {
      type: firebase.LoginType.ANONYMOUS
    })
    .then(user => console.log("User uid: " + user.uid))
    .catch(error => console.log("Trouble in paradise: " + error));


  }

*/

//Sign out Function:


exports.SignOut = function(args){
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
});
}

/*
const frameModule = require("ui/frame");
const LoginViewModel = require("./login-view-model");

const loginViewModel = new LoginViewModel();
   
exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}
*/