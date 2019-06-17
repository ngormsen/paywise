const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var firebase = require("nativescript-plugin-firebase");
var data = require("../../app/views/shared/data.js");
const Observable = require("tns-core-modules/data/observable").Observable;

console.log(data.guest)
// app/components/sidedrawer.js
function onLoaded(args) {
    console.log("Custom Component Loaded");

    // Navigates to orders page
    // you could also extend the custom component logic here e.g.:
    var stack = args.object;
    var viewModel = new Observable();
    console.log("guest data", data.guest)   
    viewModel.set("guest", data.guest);
    viewModel.set("points", data.points)
    stack.bindingContext = viewModel;    

    ;
}
exports.onLoaded = onLoaded;
function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap

//Sign out Function:
exports.SignOut = function(args){
    firebase.logout().then(function (){
        console.log("User logged out.");
        const frame = getFrameById("topframe");
        frame.navigate("views/home/home-page"); 
    });
/*     firebase.auth().signOut().then(function() {

        // Sign-out successful.
    }).catch(function(error) {
    // An error happened.
  }); */
}
  
exports.onTap = onTap;
  


//Navigate to QR Code Scanner
function onTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/qr/qr-page");
  
  }
  
exports.onTap = onTap;
  
// Navigates to guest order page
function onMyOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}

exports.onMyOrdersTap = onMyOrdersTap;

function onWelcomeTap(){
    const frame = getFrameById("topframe");
    frame.navigate("views/welcome/welcome-page")
}
exports.onWelcomeTap = onWelcomeTap;


function onPayTap() {
    // var sum = 0;
    // // console.log(orders.orders)
    // // Receives the correct dish, prize and key on Tap event
    // Object.keys(orders).forEach(function(key, idx) {
    //     if(orders[key] != null){
    //         sum += orders[key].prize
    //         console.log(orders[key].prize)
    //     }
    // });
    // console.log(sum);
    // console.log("total", Number(tip))
    // tip = page.getViewById("tipField").text
    // data.tip = tip;
    // data.value = sum + parseFloat(tip);
    // console.log(data.value);
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
    }   
  
exports.onPayTap = onPayTap
  