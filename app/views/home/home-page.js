const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");

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
    alert("Sie wurden registriert!")
  }).catch(function (err) {
    Fehler("Es gabe leider einen Fehler:" + err)
    dialogs.alert(err);
  });
};

exports.success = success;
function success(result) {
  data.guest = result.email;
  const navigationEntry = {
    moduleName: "views/qr/qr-page",
    clearHistory: true
  };
  getFrameById("topframe").navigate(navigationEntry);
}


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
    .catch(error => alert("Falsches Passwort oder falsche E-Mail-Adresse eingegeben."));

}

exports.resetPassword = function () {
  const email = page.getViewById("email").text;
  firebase.sendPasswordResetEmail(email)
    .then(() => console.log("Password reset email sent"))
  alert("Password reset email sent")
    .catch(error => console.log("Error sending password reset email: " + error));
}