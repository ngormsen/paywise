var webViewInterfaceModule = require('nativescript-webview-interface');
var oWebViewInterface;

const fileSystemModule = require("tns-core-modules/file-system");
const documents = fileSystemModule.knownFolders.documents();
const folder = documents.getFolder("payment/");
const file = folder.getFile("paypal.html");

var dataStore = require("../shared/data");

// Define Paypal web view template
const paypalTemplate1 = "<html><head></head><body><div id='paypal-button-container'></div><script src='https://www.paypal.com/sdk/js?client-id=sb&currency=EUR'></script><script>paypal.Buttons({createOrder: function(data, actions) {return actions.order.create({purchase_units: [{amount: {value: "
const paypalTemplate2 = "}}]});},onApprove: function(data, actions) {return actions.order.capture().then(function(details) {alert('Transaction completed by ' + details.payer.name.given_name + '!');});}}).render('#paypal-button-container');</script></body></html>"
 
exports.pageLoaded = pageLoaded;
function pageLoaded(args){
    page = args.object;
    setupWebViewInterface(page) 
}
 
// Initialize webView
function setupWebViewInterface(page){
    var webView = page.getViewById('webView');
    // Get value for payment
    var value = dataStore.value;
    // Create html page for web view
    var paypalHTML = paypalTemplate1.concat(value, paypalTemplate2);
    // Save html page for web view
    file.writeText(paypalHTML)
    .then((result) => {
        file.readText()
            .then((res) => {
            });
    }).catch((err) => {
        console.log(err);
    });
    // Load html page in web view
    var path = file.path;
    path = '~/www/paypal-dummy.html';
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, path);
    handleEventFromWebView();
}

// Handle events from webview
function handleEventFromWebView(){
    oWebViewInterface.on('transactionFinished', function(eventData){
        console.log(eventData);
        finalValue = dataStore.value;
        oWebViewInterface.emit('submitValue', finalValue);
    });
}