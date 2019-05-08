const getFrameById = require("tns-core-modules/ui/frame").getFrameById;


function onNavigatingTo(args) {
    /* Creates a reference to the current page.*/
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

exports.onNavigatingTo = onNavigatingTo;

function onTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/navigate/navigate");
}

exports.onTap = onTap;