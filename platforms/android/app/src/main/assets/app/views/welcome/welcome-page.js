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

function pageLoaded(args) {
    //var express = require('node_modules/express');
    // var app = express();
    console.log("hello worldd")
    
    // app.get('/', function (req, res) {
    //     res.send('Hello World!');
    //   });
    
    // app.listen(3000, function () {
    //     console.log('Example app listening on port 3000!');
    //   });
      
    // Get the event sender
    var page = args.object;
    page.bindingContext = '';
}

exports.pageLoaded = pageLoaded