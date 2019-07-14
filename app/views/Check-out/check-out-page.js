// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var data = require("../shared/data.js");


// Show points gained
exports.loaded = loaded;

function loaded(args) {
    page = args.object;
    const label = page.getViewById("points");
    label.text = data.pointsGained;
}


// Navigate to global order list / "table"
exports.backTable = backTable;

function backTable() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

// Navigate to QR scanner
exports.checkOut = checkOut;

function checkOut() {
    const frame = getFrameById("topframe");
    frame.navigate("views/qr/qr-page");

    data.table = null;
    data.restaurant = null;
}