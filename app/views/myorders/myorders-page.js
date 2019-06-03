const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
const view = require("tns-core-modules/ui/core/view");
var data = require("../shared/data.js");
const Button = require("tns-core-modules/ui/button").Button;
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;

var page = null
var orders = null

// data.value = 10;
// console.log(data.value);

function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    page.bindingContext = viewModel;




    var onChildEvent = function (result) {
        // set observable array
        console.log("items", result.value)
        if(result.key == "myorders"){
            orders = result.value;
            var myItems = new ObservableArray(
                []
            )
            console.log(orders)
            Object.keys(orders).forEach(function(key, idx) {
                if(orders[key] != null){
                    if(orders[key] != null){
                        myItems.push({ name: orders[key].name, prize: orders[key].prize});
                    }
                }
            }); 
            // try{
            //     for (var i = 0; i <= 30; i++) {
            //         if(orders[i] != null){
            //             myItems.push({ name: orders[i].name, prize: orders[i].prize});
            //             console.log({ prize: orders[i].prize})
            //         }
            //     }
            // }catch{
            //     console.log("No data available.")
            // }
    
            viewModel.set("myItems", myItems)
        }
        //else{
        //     var myItems = new ObservableArray(
        //         []
        //     )
        //     viewModel.set("myItems", myItems)
        // };
    };
    
    firebase.addChildEventListener(onChildEvent, `/restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest}`).then(
        function (result) {
            this._userListenerWrapper = result;
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
    Object.keys(orders).forEach(function(key, idx) {
        if(orders[key] != null){
            if(orders[key].name == id){
                buttonKey = key;
                console.log(key)
                buttonName = orders[key].name
                console.log(orders[key].name)
                buttonPrize = orders[key].prize
                console.log(orders[key].prize)
                
            }
        }
    // console.log(`/tables/0/guest/${data.guest}/myorders/${buttonKey}`)
    // console.log(guestOrders)
     }); 
     firebase.setValue(
        `restaurants/testRestaurant/tables/0/global/orders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );
    // firebase.getValue('/tables/0/guest/Moritz/myorders/6')
    //   .then(result => console.log(JSON.stringify(result)))
    //   .catch(error => console.log("Error: " + error));
    firebase.remove(`restaurants/testRestaurant/tables/0/guests/${data.guest}/myorders/${buttonKey}`);

  
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
    Object.keys(orders).forEach(function(key, idx) {
        if(orders[key] != null){
            sum += orders[key].prize
            console.log(orders[key].prize)
        }
    });
    console.log(sum);
    data.value = sum;
    console.log(data.value);
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
    }   

exports.onPayTap = onPayTap


