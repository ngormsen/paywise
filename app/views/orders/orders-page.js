// Imports
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var dialogs = require("tns-core-modules/ui/dialogs");
var view = require("ui/core/view");

// Global variables
var page = null
var orders;
var drawer;
var myItems = new ObservableArray([]);

//SideDrawer_ToogleDrawer
exports.pageLoaded = function(args) {
    var page = args.object;
    drawer = view.getViewById(page, "sideDrawer");
};

exports.toggleDrawer = function() {
    drawer.toggleDrawerState();
};



// Replaces the given characters in a string
// necessary to replace "." in emails as firebase does not accept certain characters
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

// Handle navigation to page
exports.onNavigatingTo = onNavigatingTo;
function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();

    page.bindingContext = viewModel;
    viewModel.set("sum", `Gesamtbetrag Bestellungen: ${0.00} EUR.`);

    // Add child event
    var onChildEvent = function (result) {
        console.log("ORDER PAGE CHILD EVENT")
        console.log("RESULT", result.value)
        console.log("USER", data.guest.replaceAll("\.","").replaceAll("@", "")) 
        // Variable for total value of orders
        var sum = 0;

        // Reset orders array 
        myItems = [];

        orders = result.value;
        Object.keys(orders).forEach(function(key, idx) {
            if(orders[key] != null){
                if(orders[key] != null){
                    myItems.push({ name: orders[key].name, prize: orders[key].prize.toFixed(2)}); 
                    sum += orders[key].prize;
                }
            }
        }); 

        // Set items and sum to display in view
        var sumTo2 = sum.toFixed(2);
        viewModel.set("sum", `${sumTo2} EUR.`);
        viewModel.set("myItems", myItems)
    };
    
    // Add child event listener for firebase
    firebase.addChildEventListener(onChildEvent, `/restaurants/${data.restaurant}/tables/${data.table}/global/`).then(
        function (result) {
            this._userListenerWrapper = result;
            console.log("firebase.addChildEventListener added");
        },
        function (error) {
            console.log("firebase.addChildEventListener error: " + error);
        }
    );

}

// Pick an item (moves it to the cart of the guest)
exports.onTap = onTap;
function onTap(args) {
    const button = args.object;
    var id = button.id;
    var buttonKey;
    var buttonName;
    var buttonPrize;

    // Setting empty flag false.
    data.empty = false;

    // Receive the correct name, price and key
    Object.keys(orders).forEach(function(key, idx) {
        if(orders[key] != null){
            if(orders[key].name == id){
                console.log(key)
                buttonKey = key;
                console.log(orders[key].name)
                buttonName = orders[key].name;
                console.log(orders[key].prize)
                buttonPrize = orders[key].prize  
            }
        }
    });
    // Create item in the user cart on firebase
    firebase.setValue(
        `restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.","")}/myorders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );
    // Remove item from the global order list on firebase
    firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`);
    data.bit = false;

    // Force refresh of list view if the last item is picked
    if (myItems.length == 1){
        const frame = getFrameById("topframe");
        const navigationEntry = {
            moduleName: "views/orders/orders-page",
            backstackVisible: false,
            animated: false
        };
        frame.navigate(navigationEntry);
    }
}

// Split an item from the list
exports.splitItem = splitItem;
function splitItem(args) {
    const button = args.object;
    var id = button.id;
    var buttonKey;
    var buttonName;
    var buttonPrize;
    var maxButtonKey;
    var n;

    // Receive the correct name, price and key
    maxButtonKey = 0;
    Object.keys(orders).forEach(function(key, idx) {
        if(orders[key] != null){
            if(orders[key].name == id){
                console.log(key)
                buttonKey = key;
                console.log(orders[key].name)
                buttonName = orders[key].name;
                console.log(orders[key].prize)
                buttonPrize = orders[key].prize  
            }
            // Detect the highest key that used in the global order list
            if (key > maxButtonKey){
                maxButtonKey = key;
            }
        }
    });

    // Ask user in how many (n) parts to split
    dialogs.action({
        message: "Mit wie vielen Personen möchtest du dir diese Bestellung teilen?",
        cancelButtonText: "Abbrechen",
        actions: ["2", "3", "4", "5"]
    }).then(function (result) {
        console.log("Dialog result: " + result);
        if(result == "2"){
            n = 2;
            splitterFun(n, buttonPrize, buttonName, buttonKey);
            n = null;
        }else if(result == "3"){
            n = 3;
            splitterFun(n, buttonPrize, buttonName, buttonKey);
            n = null;
        }else if(result == "4"){
            n = 4;
            splitterFun(n, buttonPrize, buttonName, buttonKey);
            n = null;
        }else if(result == "5"){
            n = 5;
            splitterFun(n, buttonPrize, buttonName, buttonKey);
            n = null;
        }else{
            n = 0;
        }
    });
}

// Split the item in n parts
function splitterFun(n, buttonPrize, buttonName, buttonKey) {
    if (n > 0){
        for (i=0; i<n; i++){
            // Divide price with n and round to two digits
            newPrize = Number((buttonPrize / n).toFixed(2));

            // Adjust percentage in []
            matches = buttonName.match(/\[(.*?)\]/);
            if (matches) {
                oldPercentage = matches[1];
            } else {
                oldPercentage = "100%";
            }
            oldPercentageInt = parseInt(oldPercentage, 10) / 100;
            newPercentage = (oldPercentageInt / n) * 100;
            newName = buttonName.replace(" [" + oldPercentage + "]", "") + " [" + parseFloat(newPercentage).toFixed(0)+ "%]";

            // Use milliseconds since 01.01.1970 00:00:00 as key for splitted items
            newKey= (Date.now() + i);
            // Create item on firebase
            firebase.setValue(
                `restaurants/${data.restaurant}/tables/${data.table}/global/orders/${newKey}`,
                {name: newName, prize: newPrize}
            )
        }
        // Remove splitted item on firebase
        firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`);
    }
}


// Navigates to guest order page
exports.onMyOrdersTap = onMyOrdersTap;
function onMyOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}