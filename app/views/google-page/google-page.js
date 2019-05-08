var webViewInterfaceModule = require('nativescript-webview-interface');
var oWebViewInterface;
 
function pageLoaded(args){
    page = args.object;
    setupWebViewInterface(page) 
}
 
// Initializes plugin with a webView
function setupWebViewInterface(page){
    var webView = page.getViewById('webView');
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, '~/www/google.html');
}
