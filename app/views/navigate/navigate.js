const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


function onNavigatingTo(args) {
    /* Creates a reference to the current page.*/
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

exports.onNavigatingTo = onNavigatingTo;

function onPaymentTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
}

function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
}

exports.onPaymentTap = onPaymentTap;

exports.onRestAPITap = onRestAPITap;

function onRestAPITap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/rest-api/rest-api-page");  
}