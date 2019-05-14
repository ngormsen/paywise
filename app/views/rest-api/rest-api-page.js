/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var dialogsModule = require("tns-core-modules/ui/dialogs");


function onNavigatingTo(args) { 
    /* Creates a reference to the current page.*/
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}
exports.onNavigatingTo = onNavigatingTo;

function onTapTest1() {
    const frame = getFrameById("topframe");
    /*frame.navigate("views/qr/qr-page");*/
    dialogsModule.alert({
        message: "Läuft ;)",
        okButtonText: "OK"
    });
}
exports.onTapTest1 = onTapTest1;