// Imports
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;

// Global variables
var page = null
var orders;

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

        // Create orders array 
        var myItems = new ObservableArray(
            []
        );
        orders = result.value;
        Object.keys(orders).forEach(function(key, idx) {
            if(orders[key] != null){
                if(orders[key] != null){
                    myItems.push({ name: orders[key].name, prize: orders[key].prize}); 
                    sum += orders[key].prize;
                }
            }
        }); 

        // Set items and sum to display in view
        var sumTo2 = sum.toFixed(2);
        viewModel.set("sum", `Gesamtbetrag Bestellungen: ${sumTo2} EUR.`);
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

    // Split the item in n parts
    n = 2;
    for (i=0; i<n; i++){
        // Divide price with n and round to two digits
        newPrize = Number((buttonPrize / n).toFixed(2));
        newName = buttonName + " (" + (i+1) + ")";
        //newKey = (parseFloat(maxButtonKey) + parseFloat(i) + 1);
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

// Navigates to guest order page
exports.onMyOrdersTap = onMyOrdersTap;
function onMyOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}