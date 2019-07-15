// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


// Navigates to guest order page
function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap;

  