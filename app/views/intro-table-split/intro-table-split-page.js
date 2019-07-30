// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


//Navigate to Tutorial - pick
function onPickTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/intro-table-pick/intro-table-pick-page");
  }
  exports.onPickTap = onPickTap;
  