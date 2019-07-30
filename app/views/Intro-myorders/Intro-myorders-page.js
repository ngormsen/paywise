// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


//Navigate to Tutorial - game
function onGameTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/Intro-game/Intro-game-page");
  }
  exports.onGameTap = onGameTap;
  