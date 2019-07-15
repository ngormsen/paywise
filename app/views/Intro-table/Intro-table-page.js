// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


//Navigate to Tutorial - split
function onSplitTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/intro-table-split/intro-table-split-page");
  }
  exports.onSplitTap = onSplitTap;
  