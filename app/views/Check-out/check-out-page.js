// require the plugin module
var explosion = require("nativescript-explosionfield");

function goBoom(args) {    
    // call the *explode* method on the plugin passing in a view
    // on tap events in Nativescript this will be args.object.
    explosion.explode(args.object);
}
exports.goBoom = goBoom;