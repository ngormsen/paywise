const observableModule = require("tns-core-modules/data/observable");
const observableModule = require("data/observable");
const dialogsModule = require("ui/dialogs");
const userService = require("~/services/user-service");
const topmost = require("ui/frame").topmost;
const firebase = require("nativescript-plugin-firebase");
const firebaseWebApi = require("nativescript-plugin-firebase/app");

/*
function LoginViewModel() {
    const viewModel = observableModule.fromObject({
        email: "js@nativescript.com",
        password: "nscore",
        confirmPassword: "",
        isLoggingIn: true,
        toggleForm() {
            this.isLoggingIn = !this.isLoggingIn;
        },
        
        firebase.createUser({
            email: email.txt,
            password: password.txt
        }).then(function (result) {
            console.log("userid: " + result.key);
        }).catch(function (err) {
            console.log("createUser error: " + err);
            dialogs.alert(err);
        });

        */



        //Template:


        const observableModule = require("data/observable");
const dialogsModule = require("ui/dialogs");
const userService = require("~/services/user-service");
const topmost = require("ui/frame").topmost;

function LoginViewModel() {
    const viewModel = observableModule.fromObject({
        email: "js@nativescript.com",
        password: "nscore",
        confirmPassword: "",
        isLoggingIn: true,
        toggleForm() {
            this.isLoggingIn = !this.isLoggingIn;
        },
        submit() {
            if (this.email.trim() === "" || this.password.trim() === "") {
                alert("Please provide both an email address and password.");
                return;
            }

            if (this.isLoggingIn) {
                this.login();
            } else {
                this.register();
            }
        },
        login() {
            userService.login({
                email: this.email,
                password: this.password
            }).then(() => {
                topmost().navigate("./home/home-page");
                /*
                    If you don't want the user to come back to login page
                    then use clearHistory: true to clear the navigation stack

                    topmost().navigate({
                        moduleName: "./home/home-page",
                        clearHistory: true
                    });
                */
            })
            .catch((e) => {
                alert("Unfortunately we could not find your account.");
            });
        },
        register() {
            if (this.password != this.confirmPassword) {
                alert("Your passwords do not match.");
                return;
            }
            firebase.createUser({
                email: this.email,
                password: this.password
            }).then(() => {
                    alert("Your account was successfully created. You can now login.");
                    this.isLoggingIn = true;
                })
                .catch(() => {
                    alert("Unfortunately we were unable to create your account.");
                });
        },
        forgotPassword() {
            dialogsModule.prompt({
                title: "Forgot Password",
                message: "Enter the email address you used to register for APP NAME to reset your password.",
                inputType: "email",
                defaultText: "",
                okButtonText: "Ok",
                cancelButtonText: "Cancel"
            }).then((data) => {
                if (data.result) {
                    userService.resetPassword(data.text.trim())
                      .then(() => {
                        alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                      }).catch(() => {
                        alert("Unfortunately, an error occurred resetting your password.");
                      });
                }
            });
        }
    });

    return viewModel;
}

module.exports = LoginViewModel;
