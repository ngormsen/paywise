// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


// Navigate to my orders 
exports.myOrders = myOrders;
function myOrders() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}