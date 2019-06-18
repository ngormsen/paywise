const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
// const view = require("tns-core-modules/ui/core/view");
// const Button = require("tns-core-modules/ui/button").Button;
var page = null


//swipe:
var gestures = require("tns-core-modules/ui/gestures");
var labelModule = require("tns-core-modules/ui/label");
var label = new labelModule.Label();
label.on(gestures.GestureTypes.swipe, function (args) {
    console.log("Swipe Direction: " + args.direction);
});

/*
exports.animateIcon = function(args){
    const icon = getViewById("icon"); //rotate
    icon.originX =1;
    icon.orginY = 0.5;
    icon.animate({
        rotate: 360,
        duration: 1000
})};

*/

var orders;

// replaces the given characters in a string
// necessary to replace "." in emails as firebase does not accept certain characters
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();   

    page.bindingContext = viewModel;
    viewModel.set("sum", `Gesamtbetrag Bestellungen: ${0.00} EUR.`);


    var onChildEvent = function (result) {
        console.log("ORDER PAGE CHILD EVENT")
        console.log("RESULT", result.value)
        console.log("USER", data.guest.replaceAll("\.","").replaceAll("@", "")) 
        // total orders value
        var sum = 0;

        // creates orders array 
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

        // set items and sum to display in view
        var sumTo2 = sum.toFixed(2);
        //viewModel.set("sum", `Gesamtbetrag Bestellungen: ${sum.toFixed(2)} EUR.`);
        viewModel.set("sum", `Gesamtbetrag Bestellungen: ${sumTo2} EUR.`);
        viewModel.set("myItems", myItems)
    };
    
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
exports.onNavigatingTo = onNavigatingTo;


// Picks an item for guest order list
exports.onTap = onTap;
function onTap(args) {
    const button = args.object;
    var id = button.id;
    var buttonKey;
    var buttonName;
    var buttonPrize;

    // Receives the correct dish, prize and key on Tap event
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
    firebase.setValue(
        `restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.","")}/myorders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );
    firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`);
    data.bit = false;
}

// Splits an item from the list
exports.splitItem = splitItem;
function splitItem(args) {
    const button = args.object;
    var id = button.id;
    var buttonKey;
    var buttonName;
    var buttonPrize;
    var maxButtonKey;

    // Receives the correct dish, prize and key on Tap event
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
            if (key > maxButtonKey){
                maxButtonKey = key;
            }
        }
    });

    // Split the item in n parts
    n = 2;
    for (i=0; i<n; i++){
        newPrize = Number((buttonPrize / n).toFixed(2));
        newName = buttonName + " (" + (i+1) + ")";
        //newKey = (parseFloat(maxButtonKey) + parseFloat(i) + 1);
        newKey= (Date.now() + i);
        firebase.setValue(
            `restaurants/${data.restaurant}/tables/${data.table}/global/orders/${newKey}`,
            {name: newName, prize: newPrize}
        );
    }
    firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`);
}

// Navigates to guest order page
function onMyOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/myorders/myorders-page");
}

exports.onMyOrdersTap = onMyOrdersTap

function testTap(){
    firebase.setValue(
        `/tables/0/hello/world/`,
        {name: "buttonName", prize: "buttonPrize"}
    );
}
exports.testTap = testTap

function onAddTap() {
    // firebase.setValue(
    //     '/tables/0/orders/10',
    //     {name:'jo', prize: 5}
    // );
    var onQueryEvent = function(result) {
        // note that the query returns 1 match at a time
        // in the order specified in the query
        if (!result.error) {
            console.log("Event type: " + result.type);
            console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value)); // a JSON object
            console.log("Children: " + JSON.stringify(result.children)); // an array, added in plugin v 8.0.0
        }
        // traverse the query result for a certain dish
        Object.keys(result.value).forEach(function(key, idx) {
            console.log(result.value[key].name)
         }); 
         
    };
    

}

exports.onAddTap = onAddTap;
