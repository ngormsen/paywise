const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var data = require("../shared/data.js");
const Observable = require("tns-core-modules/data/observable").Observable;
var paymentViewModel = require("./payment-view-model");
var observableModule = require("tns-core-modules/data/observable");


viewModel = new Observable();




function onPageLoaded(args) {
    var sum = parseFloat(data.value).toFixed(2);
    const page = args.object;
    viewModel.set("sum", `Zu bezahlender Betrag: ${data.value} EURO.`);
    viewModel.set("restaurant", `${data.restaurant}`);
    viewModel.set("points", `Du hast aktuell ${data.points} Punkte.`)
    // viewModel.on(Observable.propertyChangeEvent, (propertyChangeData) => {
    //     console.log("observable change")
    // })
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


function onPoints(){
    let points = data.points;
    let value = points / 100 * 0.5
    console.log(value)
    data.value = data.value - value
    data.points = 0;
    viewModel.set("points", `Du hast aktuell ${data.points} Punkte.`)
    viewModel.set("sum", `Zu bezahlender Betrag: ${data.value} EURO.`);

    console.log("onPoints", data.points)

}
exports.onPoints = onPoints;