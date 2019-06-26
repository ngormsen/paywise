const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;

var page = null
var orders = null
var sum = 0;
var myItems = new ObservableArray([]);  // Sets observable array


function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    page.bindingContext = viewModel;

    viewModel.set("sum", `${0} EURO.`);

    // Slider values:
    viewModel.set("currentValue", data.percent); // displays the sliderValue
    viewModel.set("sliderValue", data.percent);  // Internal slider value
    viewModel.set("firstMinValue", 0);  // Minimum Slider Value
    viewModel.set("firstMaxValue", 20); // Maximum Slider value
    viewModel.set("tipValue", data.tip) // Calculated tip value 

    // Slider event listener.
    viewModel.on(Observable.propertyChangeEvent, (propertyChangeData) => {
        if (propertyChangeData.propertyName === "sliderValue") {
            
            if(data.empty != true){
                console.log(myItems.length)
                // Sets the currentValue, tipValue and the new sum in case of sliderValue change.
                viewModel.set("currentValue", propertyChangeData.value.toFixed(0));
                viewModel.set("tipValue", calculateTip(sum, viewModel.get("currentValue")).toFixed(2))
                viewModel.set("sum", `${calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2)} EUR.`);
                
                // Updates the global data values.
                data.percent = viewModel.get("sliderValue")
                data.tip = calculateTip(sum, viewModel.get("currentValue")).toFixed(2)
                data.value = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2);
            }
            
        } 


    });

    // Updates data values in case of database event.
    var onChildEvent = function (result) {
        console.log("childEvent")
        //TODO Bezahlen zurück zu myorders: keep values        
        viewModel.set("sum", `${0} EUR.`)
        viewModel.set("tipValue", calculateTip(sum, viewModel.get("currentValue")).toFixed(2))
        data.value = 0;
        
        // console.log("Total", calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2));

        percent = viewModel.get("sliderValue")
        data.tip = calculateTip(sum, viewModel.get("currentValue")).toFixed(2)
        data.value = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2);

        
        // total orders value
        // Set sum to zero prior calculating the current value
        sum = 0.00;

        // console.log("items", result.value)      
        // Pushes the correct items into the list and calculates the total sum.
        if(result.key == "myorders"){
            orders = result.value;
            data.mydata = [];   // local myorder list
            myItems = [];       // database myorder list

            Object.keys(orders).forEach(function(key, idx) {
                if(orders[key] != null){
                    if(orders[key] != null){
                        // Pushes the order items into the view list.
                        myItems.push({ name: orders[key].name, prize: orders[key].prize});
                        // Pushes the order items into a data array that is pushed to the firebase at the 
                        // end of a transaction.
                        data.myorder.push({ name: orders[key].name, prize: orders[key].prize});
                        // Updates the sum.
                        sum += orders[key].prize
                    }
                }
            }); 

        }
        
        viewModel.set("myItems", myItems);
        viewModel.set("sum", `${calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2)} EUR.`);
        viewModel.set("tipValue", calculateTip(sum, viewModel.get("currentValue")).toFixed(2))
    };

    // Adds a listener that fires in case of modifications on the database
    firebase.addChildEventListener(onChildEvent, `/restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.", "")}`).then(
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
                buttonName = orders[key].name
                buttonPrize = orders[key].prize
                
            }
        }
     }); 

    // Creates the item in the global order list
    firebase.setValue(
        `restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );

    // Removes the item from the myorder list
    firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.", "")}/myorders/${buttonKey}`);
  

    // Refreshes the page in case of zero items.
    if (myItems.length == 1){
        data.value = 0;
        data.percent = 0;
        data.tip = 0;
        data.empty = true;
        const frame = getFrameById("topframe");
        const navigationEntry = {
            moduleName: "views/myorders/myorders-page",
            backstackVisible: false,
            animated: false
        };
        frame.navigate(navigationEntry);
    }

}
exports.onTap = onTap;

// Navigates to global orders page
function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}
exports.onOrdersTap = onOrdersTap

// Navigates to payment page
function onPayTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
    }   
exports.onPayTap = onPayTap


// Gamification of the tip element. 
function tipTap(args){
    if(data.percent > data.avgTip && data.bit == false){
        // data.attempts -= 1;
        alert(`Trinkgeld gegeben: ${data.percent.toFixed(2) }%. Das durchschnittliche Trinkgeld der letzten Tage ist geringer. Für deine Großzügigkeit erhälst du nach Beendigung der Transaktion ${calculatePoints(data.avgTip, data.percent)} Punkte! `)
        data.pointsGained = calculatePoints(data.avgTip, data.percent);
        console.log(data.points, data.attempts)
        // data.bit = true;
    }else if(data.bit == true){
        alert(`Du hast deine Punkte bereits erhalten.`)
    }else if(data.attempts <= 0){
        alert(`Trinkgeld gegeben: ${data.percent.toFixed(2) }%. Leider hast du deine Versuche bereits aufgebraucht.`)

    }
    else{
        alert(`Trinkgeld gegeben: ${data.percent.toFixed(2) }%. Das durchschnittliche Trinkgeld der letzten Tage ist höher. Leider erhälst du keine Punkte.`)
    }

}
exports.tipTap = tipTap

// Calculates the points one gets for a tip.
function calculatePoints(avgTip, percent){
    console.log((percent - avgTip) * 100)
    return (percent - avgTip) * 100
}


// Replaces the given characters in a string.
// Necessary to replace "." in emails as firebase does not accept certain characters.
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};


// Calculates the tip value based on the choosen slider value and the total order value.
function calculateTip(orderValue, sliderValue){
    return (orderValue * sliderValue) / 100 
}


// Calculates the total value based on the tip and total order value.
function calculateTotal(orderValue, tipValue){
    return(orderValue + tipValue)
}