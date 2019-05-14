const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
/* Module for alerts */
var dialogsModule = require("tns-core-modules/ui/dialogs");
/* Module for REST API */
var fetchModule = require("tns-core-modules/fetch");

/* Make reference to current page accessible */
var page;

/* Link to API URL (store this in app/views/shared/config.js later!) */
var apiURL = "https://reqres.in";

exports.loaded = loaded;
function loaded(args) { 
    /* Creates a reference to the current page.*/
    page = args.object;
};

/* Test 1: Load and show user data for one user */
exports.onTapTest1 = onTapTest1;
function onTapTest1() {
    var requestURL = "/api/users/2";
    var id, email, first_name, last_name, avatar;

    fetchModule.fetch(apiURL + requestURL)
    .then((response) => response.json())
    .then((r) => {
        /* Extract data from JSON */
        id = r.data.id;
        email = r.data.email;
        first_name = r.data.first_name;
        last_name = r.data.last_name;
        avatar = r.data.avatar;
        /* Show data from JSON in view */
        var label = page.getViewById("name");
        label.text = "Name: " + first_name + " " + last_name;
        var pic = page.getViewById("pic");
        pic.src = r.data.avatar;
        /* Show alert with name etc. */
        dialogsModule.alert({
            message: "Hallo " + first_name + " (" + email + ")",
            okButtonText: "OK"
        });
    }).catch((e) => {
    }); 
 
};