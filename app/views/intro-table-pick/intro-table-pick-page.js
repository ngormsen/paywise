// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


//Navigate to Tutorial - move
function onMoveTap() {
    const frame = getFrameById("topframe");
    frame.navigate("/views/intro-table-movemyorder/intro-table-movemyorder-page");

  }
  exports.onMoveTap = onMoveTap;
  