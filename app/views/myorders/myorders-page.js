const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
const view = require("tns-core-modules/ui/core/view");
var data = require("../shared/data.js");
const Button = require("tns-core-modules/ui/button").Button;
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var getViewById = require("tns-core-modules/ui/core/view").getViewById;
const fromObject = require("tns-core-modules/data/observable").fromObject;

var page = null
var orders = null
var tip;

// data.value = 10;
// console.log(data.value);

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    page.bindingContext = viewModel;
    
    // const source = fromObject({
    //     textSource: "Text set via twoWay binding"
    // });
    
    // tip = page.getViewById("tip").text;
    // console.log("TIP", tip)

    
    var onChildEvent = function (result) {
        console.log("USER", data.guest.replaceAll("\.","")) 
        

        console.log("items", result.value)
        if(result.key == "myorders"){
            orders = result.value;

            // set observable array
            var myItems = new ObservableArray(
                []
            )

            console.log(orders)
            Object.keys(orders).forEach(function(key, idx) {
                if(orders[key] != null){
                    if(orders[key] != null){
                        myItems.push({ name: orders[key].name, prize: orders[key].prize});
                        data.myorder.push({ name: orders[key].name, prize: orders[key].prize})
                    }
                }
            }); 

    
            viewModel.set("myItems", myItems)
        }

    };
    
    firebase.addChildEventListener(onChildEvent, `/restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.", "")}`).then(
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
    // Receives the correct name, prize and key on Tap event
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
     }); 

     firebase.setValue(
        `restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );

    firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.", "")}/myorders/${buttonKey}`);

  
}
exports.onTap = onTap;

// Navigates to orders page
function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap

// Navigates to orders page
function onPayTap() {
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
    console.log("total", Number(tip))
    tip = page.getViewById("tipField").text
    data.value = sum + parseFloat(tip);
    console.log(data.value);
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
    }   

exports.onPayTap = onPayTap

function testTap(){
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
    console.log("total", Number(tip))
    tip = page.getViewById("tipField").text
    data.value = sum + parseFloat(tip);
    percent =  parseFloat(tip) / data.value * 100
    alert(`Trinkgeld gegeben: ${percent.toFixed(2) }%. Das Durchschnittliche Trinkgeld in den letzten 30 Tagen beträgt: 9%. `)
}

exports.testTap = testTap
