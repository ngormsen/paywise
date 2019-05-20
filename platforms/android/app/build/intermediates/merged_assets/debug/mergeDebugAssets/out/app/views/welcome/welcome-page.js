const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var firebase = require("nativescript-plugin-firebase");
var createViewModel = require("./welcome-view-model").createViewModel;

/*
 In NativeScript, a file with the same name as an XML file is known as
 a code-behind file. The code-behind is a great place to place your view
 logic, and to set up your page’s data binding.
 */

function onNavigatingTo(args) {
    /*
     This gets a reference this page’s <Page> UI component. You can
     view the API reference of the Page to see what’s available at
     https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
     */
    var page = args.object;
  
    /*
     A page’s bindingContext is an object that should be used to perform
     data binding between XML markup and JavaScript code. Properties
     on the bindingContext can be accessed using the {{ }} syntax in XML.
     In this example, the {{ message }} and {{ onTap }} bindings are resolved
     against the object returned by createViewModel().
     You can learn more about data binding in NativeScript at
     https://docs.nativescript.org/core-concepts/data-binding.
     */
    page.bindingContext = createViewModel();
  }
  
  /*
   Exporting a function in a NativeScript code-behind file makes it accessible
   to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
   function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
   file work.
   */
  exports.onNavigatingTo = onNavigatingTo;

function onTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/navigate/navigate");
}

exports.onTap = onTap;

function onUploadTap() {
    console.log("upload")
    firebase.init({
        onAuthStateChanged: function(data) { // optional but useful to immediately re-logon the user when he re-visits your app
          console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
          if (data.loggedIn) {
            console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
          }
        }
      });

    firebase.getCurrentUser()
    .then(user => console.log("User uid: " + user.uid))
    .catch(error => console.log("Trouble in paradise: " + error));

    

    // firebase.keepInSync(
    //     "/play-9c4d7", // which path in your Firebase needs to be kept in sync?
    //     true      // set to false to disable this feature again
    //   ).then(
    //     function () {
    //       console.log("firebase.keepInSync is ON for /test");
    //     },
    //     function (error) {
    //       console.log("firebase.keepInSync error: " + error);
    //     }
    //   );
    
    // firebase.getValue('/playSammlung/F7YdVm9SR3i2nHz90GbW')
    // .then(console.log(results))
    // .catch(error => console.log("Error: " + error));
    // var onChildEvent = function(result) {
    //     console.log("Event type: " + result.type);
    //     console.log("Key: " + result.key);
    //     console.log("Value: " + JSON.stringify(result.value));
    //   };
    
    //   // listen to changes in the /users path
    // firebase.addChildEventListener(onChildEvent, "/play-9c4d7").then(
    // function(listenerWrapper) {
    //     var path = listenerWrapper.path;
    //     var listeners = listenerWrapper.listeners; // an Array of listeners added
    //     // you can store the wrapper somewhere to later call 'removeEventListeners'
    // }
    // );
    
    firebase.push(
        '/test',
        {
          'first': 'Eddy',
          'last': 'Verbruggen',
          'birthYear': 1977,
          'isMale': true,
          'address': {
            'street': 'foostreet',
            'number': 123
          }
        }
    ).then(
        function (result) {
          console.log("created key: " + result.key);
        }
    );
  
}

exports.onUploadTap = onUploadTap;



// function pageLoaded(args) {
//     //var express = require('node_modules/express');
//     // var app = express();
//     console.log("hello worldd")

    
//     // app.get('/', function (req, res) {
//     //     res.send('Hello World!');
//     //   });
    
//     // app.listen(3000, function () {
//     //     console.log('Example app listening on port 3000!');
//     //   });
      
//     // Get the event sender
//     var page = args.object;
//     page.bindingContext = '';
// }

// exports.pageLoaded = pageLoaded