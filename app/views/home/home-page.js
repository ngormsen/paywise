const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");

// TODO delete all console log messages

var page;

exports.loaded = loaded;
function loaded(args) {
  page = args.object;
}

// Navigate to register view
exports.navToRegister = function () {
  getFrameById("topframe").navigate("views/register/register-page");
}

exports.Register = function () {
  const email = page.getViewById("email").text;
  const password = page.getViewById("password").text;

  firebase.createUser({
    email: email,
    password: password
  }).then(function (result) {
    console.log("userid: " + result.key);
    alert("Sie wurden registriert!")
  }).catch(function (err) {
    console.log("createUser error: " + err);
    Fehler("Es gabe leider einen Fehler:" + err)
    dialogs.alert(err);
  });
};

/* 
exports.FacebookLogin = function (){
  firebase.login({
    type: firebase.LoginType.FACEBOOK,
    // Optional
    facebookOptions: {
      // defaults to ['public_profile', 'email']
      scopes: ['public_profile', 'email'] // note: this property was renamed from "scope" in 8.4.0
    }
  }).then(
      function (result) {
        JSON.stringify(result);
        alert("Logged in with Facebook!")
      },
      function (errorMessage) {
        console.log(errorMessage);
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

function success(result) {
  data.guest = result.email;
  const navigationEntry = {
    moduleName: "views/qr/qr-page",
    clearHistory: true
  };
  getFrameById("topframe").navigate(navigationEntry);
}

exports.success = success;
// Facebook Entwickler-Account: tdavidjin@gmail.com pw: paywise

exports.LogIn = function () {
  const email = page.getViewById("email").text;
  const password = page.getViewById("password").text;
  firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: email,
        password: password
      }
    })
    .then(result => success(result))
    .catch(error => alert("Falsches Passwort/Email Adrersse"));

}
//JSON.stringify(result)



exports.guest = function () {
  firebase.login({
      type: firebase.LoginType.ANONYMOUS
    })
    .then(result => success(result))
  //console.log("User uid: " + user.uid)
  alert("Sie wurden mit einem Gastzugang eingeloggt")
    .catch(function (err) {
      console.log("createUser error: " + err);
      Fehler("Es gabe leider einen Fehler:" + err)
      dialogs.alert(err);
      s
    });


}


exports.resetPassword = function () {
  const email = page.getViewById("email").text;
  firebase.sendPasswordResetEmail(email)
    .then(() => console.log("Password reset email sent"))
  alert("Password reset email sent")
    .catch(error => console.log("Error sending password reset email: " + error));
}
//Sign out Function:
/*

exports.SignOut = function(){
  firebase.logout()
  .then(console.log("user logged out"))
}
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