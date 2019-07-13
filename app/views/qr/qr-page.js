var qr_view_model_1 = require("./qr-view-model");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const timerModule = require("tns-core-modules/timer");

// var x
// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {

}


function onTap(args) {
    var page = args.object;
    barcodeScanner = new qr_view_model_1.BarcodeModel();

    barcodeScanner.doScanWithBackCamera();
  
    setTimeout(() => {
        
        const frame = getFrameById("topframe");
        frame.navigate("views/orders/orders-page");

    }, 300);
    

}

exports.pageLoaded = pageLoaded;
exports.onTap = onTap;