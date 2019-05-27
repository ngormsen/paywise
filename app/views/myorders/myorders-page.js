const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
const view = require("tns-core-modules/ui/core/view");
var data = require("../shared/data.js");
const Button = require("tns-core-modules/ui/button").Button;
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var x

var page = null
var orders = null
// var x = data.value
// data.value = 10;
// console.log(data.value);

function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    page.bindingContext = viewModel;



    var onChildEvent = function (result) {
        // var dish = [];
        // var prize = [];
        // var dishPrize = []
        //get database values
        // console.log("Event type: " + result.type);
        // console.log("Key: " + result.key);
        // console.log("Value: " + JSON.stringify(result.value));
        orders = result.value; 
        guestOrders = orders.guest[data.guest].myorders
        console.log("the orders", orders)
        console.log("the guest orders", orders.guest[data.guest].myorders)
        // console.log(orders.orders[0].name)

        // set observable array
        var myItems = new ObservableArray(
            []
        );

        // updates the observable array in case of database modification
        try{
            for (var i = 0; i <= 30; i++) {
            if(guestOrders[i] != null){
                myItems.push({ name: guestOrders[i].name, prize: guestOrders[i].prize});
                }
            }
        }catch{
            console.log("No data available")
        }
        
        viewModel.set("myItems", myItems)
    };
    
    firebase.addChildEventListener(onChildEvent, "/tables").then(
        function (result) {
            that._userListenerWrapper = result;
            console.log("firebase.addChildEventListener added");
        },
        function (error) {
            console.log("firebase.addChildEventListener error: " + error);
        }
    );


    // console.log(page.bindingContext)
    // console.log("here", viewModel.myItems)
}
exports.onNavigatingTo = onNavigatingTo;

// Pushes an item back to the global order list
function onTap(args) {
    const button = args.object;
    var id = button.id;
    var buttonKey;
    var buttonName;
    var buttonPrize;
    // console.log(orders.orders)
    // Receives the correct dish, prize and key on Tap event
    Object.keys(guestOrders).forEach(function(key, idx) {
        if(guestOrders[key] != null){
            if(guestOrders[key].name == id){
                buttonKey = key;
                console.log(key)
                buttonName = guestOrders[key].name
                console.log(guestOrders[key].name)
                buttonPrize = guestOrders[key].prize
                console.log(guestOrders[key].prize)
                
            }
        }
    // console.log(`/tables/0/guest/${data.guest}/myorders/${buttonKey}`)
    // console.log(guestOrders)
     }); 
     firebase.setValue(
        `/tables/0/orders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );
    // firebase.getValue('/tables/0/guest/Moritz/myorders/6')
    //   .then(result => console.log(JSON.stringify(result)))
    //   .catch(error => console.log("Error: " + error));
    firebase.remove(`/tables/0/guest/${data.guest}/myorders/${buttonKey}`);

  
}
exports.onTap = onTap;

// Navigates to orders page
function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap

// Navigates to orders page
function onPayTap(args) {
    var sum = 0;
    // console.log(orders.orders)
    // Receives the correct dish, prize and key on Tap event
    Object.keys(guestOrders).forEach(function(key, idx) {
        if(guestOrders[key] != null){
            sum += guestOrders[key].prize
            console.log(guestOrders[key].prize)
        }
    });
    console.log(sum);
    data.value = sum;
    console.log(data.value);
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
    }   

exports.onPayTap = onPayTap




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

    firebase.query(
        onQueryEvent,
        "/tables/0",
        {
            // set this to true if you want to check if the value exists or just want the event to fire once
            // default false, so it listens continuously.
            // Only when true, this function will return the data in the promise as well!
            singleEvent: true,
            // order by company.country
            orderBy: {
                type: firebase.QueryOrderByType.CHILD,
                value: 'since' // mandatory when type is 'child'
            },
            // but only companies 'since' a certain year (Telerik's value is 2000, which is imaginary btw)
            // use either a 'range'
            // range: {
            //    type: firebase.QueryRangeType.EQUAL_TO,
            //    value: '0'
            // },
            // .. or 'chain' ranges like this:
            // ranges: [
            //   {
            //       type: firebase.QueryRangeType.START_AT,
            //       value: 1999
            //   },
            //   {
            //       type: firebase.QueryRangeType.END_AT,
            //       value: 2000
            //   }
            // ],
            // only the first 2 matches
            // (note that there's only 1 in this case anyway)
            limit: {
                type: firebase.QueryLimitType.LAST,
                value: 10
            }
        }
    );
    

}

exports.onAddTap = onAddTap;
var x;
