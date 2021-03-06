const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var firebase = require("nativescript-plugin-firebase");
var data = require("../../app/views/shared/data.js");
const Observable = require("tns-core-modules/data/observable").Observable;

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

// app/components/sidedrawer.js
function onLoaded(args) {
    console.log("Custom Component Loaded");
    var onValueEvent = function(result) {
        // console.log("Event type: " + result.type);
        // console.log("Key: " + result.key);
        // console.log("Value: " + JSON.stringify(result.value));
        // console.log(result.value.name)
        data.name = result.value.name;
        data.points = result.value.points;
        var stack = args.object;
        var viewModel = new Observable();
        viewModel.set("guest", data.name);
        viewModel.set("points", data.points);
        viewModel.set("restaurant", data.restaurant);
        stack.bindingContext = viewModel;    
      };
    
      // listen to changes in the /companies path
      firebase.addValueEventListener(onValueEvent, `/users/${(data.guest).replaceAll("\.", "")}`).then(
        function(listenerWrapper) {
          var path = listenerWrapper.path;
          var listeners = listenerWrapper.listeners; // an Array of listeners added
          // you can store the wrapper somewhere to later call 'removeEventListeners'
        }
      );
    
    // Navigates to orders page
    // you could also extend the custom component logic here e.g.:

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

    const frame = getFrameById("topframe");
    if(data.empty == true || data.value == 0){
      alert('Bevor du bezahlen kannst, musst du Bestellungen vom Tisch auswählen und zu deinem persönlichen Warenkorb hinzufügen.');
      // console.log("empty")
    }
    else{
      data.pointsGained = calculatePoints(data.avgTip, data.percent);
      frame.navigate("views/payment/payment-page");
    }
    }   
  
exports.onPayTap = onPayTap

function calculatePoints(avgTip, percent){
  let distance = percent - avgTip
  if ( distance < 5 && distance > 0){
      return (10 * data.value * distance).toFixed()
  }
  else if(distance > 5){
      return (10 * data.value * distance * 2).toFixed()
  }
}
exports.calculatePoints = calculatePoints


//Navigate to Tutorial
function onTutorialTap() {
  const frame = getFrameById("topframe");
  frame.navigate("views/Intro-table/Intro-table-page");
}
exports.onTutorialTap = onTutorialTap;
