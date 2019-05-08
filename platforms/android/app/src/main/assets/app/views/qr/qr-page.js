var qr_view_model_1 = require("./qr-view-model");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;

// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {
    // Get the event sender
    var page = args.object;
    page.bindingContext = new qr_view_model_1.BarcodeModel();
}

function onTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/welcome/welcome-page");

}

exports.pageLoaded = pageLoaded;
exports.onTap = onTap;