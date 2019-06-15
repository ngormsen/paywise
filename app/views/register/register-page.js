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

// Navigate to home page
exports.testChg = navToLogin;
function navToLogin(){
  getFrameById("topframe").navigate("views/home/home-page");
}

// Replace 
String.prototype.replaceAll = function(str1, str2, ignore) 
{
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

// Register new user at firebase DB
exports.Register = register;
function register(){
  var usrName = page.getViewById("name").text;
  var email = page.getViewById("email").text;
  var password = page.getViewById("password").text;

  // TODO: Check if password=password AND check box checked

      firebase.createUser({
        email: email,
        password: password
       }).then(function (result) {
          // Registration successful
          console.log("User created; userid: " + result.key);
          var emailID = email.replaceAll("\.","");
          console.log(`/users/${emailID}/`);
          firebase.setValue(
            `/users/${emailID}/`,
            {'name': usrName, 'email': email, 'points': 100}
          );
          navToLogin();
          alert("Es wurde erfolgreich ein Account angelegt. Du kannst dich nun mit E-Mail und Passwort einloggen.");
      }).catch(function (err) {
          // Registration not successful
          console.log("createUser error: " + err);
          alert("Bei der Erstellung deines Accounts ist leider folgender Fehler aufgetreten: " + err);
      });
  };