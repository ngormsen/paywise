// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var data = require("../shared/data.js");
const Observable = require("tns-core-modules/data/observable").Observable;
var paymentViewModel = require("./payment-view-model");
var observableModule = require("tns-core-modules/data/observable");
var webViewInterfaceModule = require('nativescript-webview-interface');
var oWebViewInterface;
var firebase = require("nativescript-plugin-firebase");
var dialogs = require("tns-core-modules/ui/dialogs");
var dataStore = require("../shared/data");

// Global variables
viewModel = new Observable();
var page;


// Initialization (page load)
exports.pageLoaded = pageLoaded;
function pageLoaded(args){
    page = args.object;
    page.bindingContext = viewModel;
    // Show payment information
    var sum = parseFloat(data.value).toFixed(2);
    viewModel.set("sum", `Zu bezahlender Betrag: ${sum} EURO.`);
    viewModel.set("restaurant", `${data.restaurant}`);
    viewModel.set("points", `Du hast aktuell ${data.points} Punkte.`);
    // Setup webView
    setupWebViewInterface(page)
}
 

// Initialize webView
function setupWebViewInterface(page){
    var webView = page.getViewById('webView');
    path = '~/www/paypal.html';
    //path = '~/www/paypal-new.html';
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, path);
    handleEventFromWebView();
}


// Touch gesture callback method for web view
exports.webViewTouch = webViewTouch;
function webViewTouch(args) {
    //console.log("log: web view touched");
}


// Handle events from webview (paypal)
function handleEventFromWebView(){

    // Send transaction value to web view
    oWebViewInterface.on('getTransactionValue', function(eventData){
        // Get value for payment
        finalValue = dataStore.value;
        oWebViewInterface.emit('submitValue', finalValue);
    });

    // Handle finished transaction
    oWebViewInterface.on('transactionFinished', function(details){
        console.log(details);
        var payerName = details.payer.name.given_name;
        var payerSurname = details.payer.name.surname;
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        today = mm + '/' + dd + '/' + yyyy;
    
        console.log("MYORDER", data.myorder)
        firebase.push(
            '/restaurants/testRestaurant/paid',
            {
              'order': data.myorder,
              'guest': data.guest,
              'table': data.table,
              'date': today,
              'sum': data.value,
              'tip': data.tip
            }
        ).then(
            function (result) {
              console.log("created key: " + result.key);
            }
        );
        
        firebase.remove(`/restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.", "")}/myorders`);
        //var payedValue = details.purchase_units.amount.value;
        //var payedValueCurr = details.purchase_units.amount.currency_code;
        //var messageText = "Die Zahlung in Höhe von " + payedValue + " " + payedValueCurr + " wurde erfolgreich von " + payerName + " " + payerSurname + " an das Restaurant übermittelt.";
        var messageText = "Die Zahlung wurde erfolgreich von " + payerName + " " + payerSurname + " an das Restaurant übermittelt.";
        dialogs.alert({
            title: "Zahlung erfolgreich",
            message: messageText,
            okButtonText: "Okay"
        }).then(function () {
           
            const frame = getFrameById("topframe");
            // TODO: CHANGE NAVIGATION TO HOME VIEW
            frame.navigate("views/orders/orders-page");
        });
        // TODO: Adjust value in data.js & Firebase database
    });
}


// Use points for payment
exports.onPoints = onPoints;
function onPoints(){
    let points = data.points;
    let value = points / 100 * 0.5
    console.log(value)
    data.value = data.value - value
    data.points = 0;
    viewModel.set("points", `Du hast aktuell ${data.points} Punkte.`)
    viewModel.set("sum", `Zu bezahlender Betrag: ${data.value} EURO.`);

    console.log("onPoints", data.points)

}

/* exports.onPaypalTap = onPaypalTap;
function onPaypalTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/paypal/paypal-page");
}


exports.onGoogleTap = onGoogleTap;
function onGoogleTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/google-page/google-page");
} */