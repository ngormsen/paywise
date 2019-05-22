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
    
    firebase.getValue('/test')
    .then(result => console.log(result.value['-LfKN_YZHY_g-4jqa8QK']))
    .catch(error => console.log("Error: " + error));
     
}

exports.onUploadTap = onUploadTap;

