// Imports
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


// Navigate to intro page for gamification / "Intro-game"
exports.introGame = introGame;
function introGame() {
    const frame = getFrameById("topframe");
    frame.navigate("views/Intro-game/Intro-game-page");
}