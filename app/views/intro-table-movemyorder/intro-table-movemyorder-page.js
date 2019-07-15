// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


//Navigate to Tutorial - move
function onMyOrderTutTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/Intro-myorders/Intro-myorders-page");
  }
  exports.onMyOrderTutTap = onMyOrderTutTap;
  