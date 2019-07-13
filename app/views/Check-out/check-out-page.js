// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


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
}