const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


function onNavigatingTo(args) {
    /* Creates a reference to the current page.*/
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

exports.onNavigatingTo = onNavigatingTo;

function onPaypalTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/paypal/paypal-page");
}

function onGoogleTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/google-page/google-page");
}

exports.onPaypalTap = onPaypalTap;
exports.onGoogleTap = onGoogleTap;