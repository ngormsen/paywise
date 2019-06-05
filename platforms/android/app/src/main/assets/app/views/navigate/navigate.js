const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var navigateViewModel = require("./navigate-view-model");

var navigateViewModel = new navigateViewModel();


function pageLoaded(args) {
    /* Creates a reference to the current page.*/
    const page = args.object;
    page.bindingContext = navigateViewModel;
}

exports.pageLoaded = pageLoaded;

function onPaymentTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
}
exports.onPaymentTap = onPaymentTap;

function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap

function onMyOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}

exports.onMyOrdersTap = onMyOrdersTap

