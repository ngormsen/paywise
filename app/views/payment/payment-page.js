// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var data = require("../shared/data.js");
const Observable = require("tns-core-modules/data/observable").Observable;
var webViewInterfaceModule = require('nativescript-webview-interface');
var oWebViewInterface;
var firebase = require("nativescript-plugin-firebase");
var dialogs = require("tns-core-modules/ui/dialogs");
var dataStore = require("../shared/data");
var view = require("ui/core/view");
var drawer;

// Global variables
viewModel = new Observable();
var page;


// Initialization (page load)
exports.pageLoaded = pageLoaded;

function pageLoaded(args) {
    page = args.object;
    drawer = view.getViewById(page, "sideDrawer");
    page.bindingContext = viewModel;
    // Show payment information
    var sum = parseFloat(data.value).toFixed(2);
    if (data.empty == true) {
        viewModel.set("sum", `Zu bezahlender Betrag: ${0.00} EUR.`);
    } else {
        viewModel.set("sum", `Zu bezahlender Betrag: ${sum} EUR.`);

    }
    viewModel.set("restaurant", `${data.restaurant}`);
    viewModel.set("points", `Du hast aktuell ${data.points} Punkte.`);
    // Setup webView
    setupWebViewInterface(page);
}


// Initialize webView
function setupWebViewInterface(page) {
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
function handleEventFromWebView() {

    // Send transaction value to web view
    oWebViewInterface.on('getTransactionValue', function (eventData) {
        // Get value for payment
        finalValue = dataStore.value;
        oWebViewInterface.emit('submitValue', finalValue);
    });

    // Handle finished transaction
    oWebViewInterface.on('transactionFinished', function (details) {
        console.log(details);
        var payerName = details.payer.name.given_name;
        var payerSurname = details.payer.name.surname;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        console.log("MYORDER", data.myorder)
        // Update database invoice with the completed order.
        firebase.push(
            `/restaurants/${data.restaurant}/paid`, {
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

        // Update global tips and avgtip value in database
        firebase.push(
            `/restaurants/${data.restaurant}/tips`, {
                'tip': data.percent
            }
        ).then(
            function (result) {
                console.log("created key: " + result.key);
            }
        );
        

        let updatedPoints = parseInt(data.points) + parseInt(data.pointsGained)
        firebase.setValue(
            `/users/${(data.guest).replaceAll("\.", "")}`, {
                email: data.guest,
                name: data.name,
                points: updatedPoints
            });
        
        // Updating avg Tip value
        firebase.getValue(`/restaurants/${data.restaurant}/tips`)
            .then(result => calculateAverage(result))
            .catch(error => console.log("Error: " + error));
        
        //TODO Calculate Tip Value based on past tips
        //TODO add current Tip to database

        // Resetting values
        console.log("resettting values: ", data.tip)
        data.value = 0;
        data.percent = 0;
        data.tip = 0;
        data.empty = true;
        console.log("resettting values: ", data.tip)

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
            frame.navigate("views/Check-out/check-out-page");
        });
        // TODO: Adjust value in data.js & Firebase database
    });
}


// Use points for payment
exports.onPoints = onPoints;

function onPoints() {
    let points = data.points;;
    let pointValue = points / 100 * 0.1;
    data.value = (data.value - pointValue).toFixed(2);
    if (data.value < 0) {
        data.value = 0.01
    };
    points = 0;
    viewModel.set("points", `Du hast aktuell ${points} Punkte.`);
    viewModel.set("sum", `Zu bezahlender Betrag: ${data.value} EUR.`);
    console.log("onPoints", data.points);

    // TODO Punkte in data.points setzen
    // TODO Punkte in DB setzen
    data.points = points



    //var page = page;
    console.log("here11:" + page);
    //setupWebViewInterface(page);
    var webView = page.getViewById('webView');
    webView.reload();
}


exports.toggleDrawer = function() {
    drawer.toggleDrawerState();
};


function quickTest() {
    console.log("hello world")
    firebase.getValue(`/restaurants/${data.restaurant}/tips`)
    .then(result => calculateAverage(result))
    .catch(error => console.log("Error: " + error));

}
exports.quickTest = quickTest

function calculateAverage(result){
    let nrOfTips = 0;
    let totalValueOfTips = 0;
    for(var key in result.value){
        console.log(result.value[key].tip)
        totalValueOfTips += result.value[key].tip
        nrOfTips += 1
    }
    let avgTip = parseFloat((totalValueOfTips / nrOfTips).toFixed(2))
    console.log("avgTip", parseFloat((totalValueOfTips / nrOfTips).toFixed(2)))
    data.avgTip = avgTip;
    firebase.setValue(
        `/restaurants/${data.restaurant}/avgtip`,
        {currentAvg: avgTip}
    );
  
}