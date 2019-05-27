const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var data = require("../shared/data.js");
const Observable = require("tns-core-modules/data/observable").Observable;

function onPageLoaded(args) {
    var sum = data.value;
    console.log('sum', sum)
    const page = args.object;
    viewModel = new Observable();
    viewModel.set("sum", `Zu bezahlender Betrag: ${sum} EUR.`)
    page.bindingContext = viewModel;
}
exports.onPageLoaded = onPageLoaded;

function onPaypalTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/paypal/paypal-page");
}

exports.onPaypalTap = onPaypalTap;

function onGoogleTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/google-page/google-page");
}

exports.onGoogleTap = onGoogleTap;