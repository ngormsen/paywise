const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const observableModule = require("tns-core-modules/data/observable");
const firebase = require("nativescript-plugin-firebase");
const firebaseWebApi = require("nativescript-plugin-firebase/app");
const dialogsModule = require("ui/dialogs");
const textFieldModule = require("ui/text-field");
var data = require("../shared/data.js");
var view = require("tns-core-modules/ui/core/view");
var getViewById = require("tns-core-modules/ui/core/view").getViewById;


var page;

// Page loaded
exports.loaded = loaded;
function loaded(args){
  page = args.object;
}

exports.testChg = navToLogin;
function navToLogin(){
  getFrameById("topframe").navigate("views/home/home-page");
}

// Register new user at firebase DB
exports.Register = register;
function register(){
  const email = page.getViewById("email").text;
  const password = page.getViewById("password").text;

  // TODO: Check if password=password AND check box checked

      firebase.createUser({
        email: email,
        password: password
       }).then(function (result) {
          // Registration successful
          console.log("User created; userid: " + result.key);
          navToLogin();
          alert("Es wurde erfolgreich ein Account angelegt. Du kannst dich nun mit E-Mail und Passwort einloggen.");

          // TODO: WRITE FUNCTION THAT CREATES USER IN USER DB (all fields + points)
          // MAYBE: Initial points > 0 as gift for registration

      }).catch(function (err) {
          // Registration not successful
          console.log("createUser error: " + err);
          alert("Bei der Erstellung deines Accounts ist leider folgender Fehler aufgetreten: " + err);
      });
  };