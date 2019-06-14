const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
var welcomeViewModel = require("./welcome-view-model");
var view = require("ui/core/view");
var drawer;

/*
 In NativeScript, a file with the same name as an XML file is known as
 a code-behind file. The code-behind is a great place to place your view
 logic, and to set up your page’s data binding.
 */

function pageLoaded(args) {
    /*
     This gets a reference this page’s <Page> UI component. You can
     view the API reference of the Page to see what’s available at
     https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
     */
    var page = args.object;

    /*
     A page’s bindingContext is an object that should be used to perform
     data binding between XML markup and JavaScript code. Properties
     on the bindingContext can be accessed using the {{ }} syntax in XML.
     In this example, the {{ message }} and {{ onTap }} bindings are resolved
     against the object returned by createViewModel().
     You can learn more about data binding in NativeScript at
     https://docs.nativescript.org/core-concepts/data-binding.
     */
    page.bindingContext = welcomeViewModel;
  }
  
  /*
   Exporting a function in a NativeScript code-behind file makes it accessible
   to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
   function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
   file work.
   */
  exports.pageLoaded = pageLoaded;

function onTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/navigate/navigate");
}

exports.onTap = onTap;


exports.pageLoaded = function(args) {
    var page = args.object;
    drawer = view.getViewById(page, "sideDrawer");
};

exports.toggleDrawer = function() {
    drawer.toggleDrawerState();
};


// Navigates to orders page
function onOrdersTap() {
  const frame = getFrameById("topframe");
  frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap

// Navigates to orders page
function onPayTap() {
  var sum = 0;
  // console.log(orders.orders)
  // Receives the correct dish, prize and key on Tap event
  Object.keys(orders).forEach(function(key, idx) {
      if(orders[key] != null){
          sum += orders[key].prize
          console.log(orders[key].prize)
      }
  });
  console.log(sum);
  console.log("total", Number(tip))
  tip = page.getViewById("tipField").text
  data.tip = tip;
  data.value = sum + parseFloat(tip);
  console.log(data.value);
  const frame = getFrameById("topframe");
  frame.navigate("views/payment/payment-page");
  }   

exports.onPayTap = onPayTap


//Sign out Function:
exports.SignOut = function(args){
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  }).catch(function(error) {
  // An error happened.
});
}

exports.onTap = onTap;

// Navigates to guest order page
function onMyOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}

exports.onMyOrdersTap = onMyOrdersTap

//Navigate to QR Code Scanner
function onTap() {
  const frame = getFrameById("topframe");
  frame.navigate("views/qr/qr-page");

}

exports.onTap = onTap;

// Navigates to orders page
function onPayTap() {
  var sum = 0;
  // console.log(orders.orders)
  // Receives the correct dish, prize and key on Tap event
  Object.keys(orders).forEach(function(key, idx) {
      if(orders[key] != null){
          sum += orders[key].prize
          console.log(orders[key].prize)
      }
  });
  console.log(sum);
  console.log("total", Number(tip))
  tip = page.getViewById("tipField").text
  data.tip = tip;
  data.value = sum + parseFloat(tip);
  console.log(data.value);
  const frame = getFrameById("topframe");
  frame.navigate("views/payment/payment-page");
  }   

exports.onPayTap = onPayTap