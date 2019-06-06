const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const observableModule = require("tns-core-modules/data/observable");
const firebase = require("nativescript-plugin-firebase");
const firebaseWebApi = require("nativescript-plugin-firebase/app");
const dialogsModule = require("ui/dialogs");
const textFieldModule = require("ui/text-field");


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
      .then(result => console.log("user logged in"))
      .catch(error => console.log(error));
      
    }
//JSON.stringify(result)



exports.guest = function (){
firebase.login(
    {
      type: firebase.LoginType.ANONYMOUS
    })
    .then(user => console.log("User uid: " + user.uid))
      alert("Sie wurden mit einem Gastzugang eingeloggt")
    .catch(function (err) {
      console.log("createUser error: " + err);
      Fehler("Es gabe leider einen Fehler:" + err)
      dialogs.alert(err);
    });


  }


exports.resetPassword = function(){
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