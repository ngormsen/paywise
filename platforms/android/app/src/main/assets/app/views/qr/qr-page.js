var qr_view_model_1 = require("./qr-view-model");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const timerModule = require("tns-core-modules/timer");

// var x
// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {

}

function onTap(args) {
    var page = args.object;
    page.bindingContext = new qr_view_model_1.BarcodeModel();

    page.bindingContext.doRequestCameraPermission();
    page.bindingContext.doScanWithTorch();
  
    setTimeout(() => {
        
        const frame = getFrameById("topframe");
        frame.navigate("views/welcome/welcome-page");

    }, 300);
    

}

exports.pageLoaded = pageLoaded;
exports.onTap = onTap;