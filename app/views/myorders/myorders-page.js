const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
var view = require("ui/core/view");
var page = null
var orders = null
var sum = 0;
var myItems = new ObservableArray([]);  // Sets observable array
var drawer;


function onNavigatingTo(args) {
    page = args.object;
    drawer = view.getViewById(page, "sideDrawer");
    var viewModel = new Observable();    
    page.bindingContext = viewModel;
    drawer = view.getViewById(page, "sideDrawer");
    viewModel.set("sum", `${0.00.toFixed(2)} EUR.`);

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
                viewModel.set("currentValue", propertyChangeData.value.toFixed());
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
        viewModel.set("sum", `${0.00.toFixed(2)} EUR.`)
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
            myItems = [];       // local myorder list
            data.myorder = [];  // database myorder list

            Object.keys(orders).forEach(function(key, idx) {
                if(orders[key] != null){
                    if(orders[key] != null){
                        // Pushes the order items into the view list.
                        myItems.push({ name: orders[key].name, prize: orders[key].prize.toFixed(2)});
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

// Navigates to payment page (if sum <> 0)
function onPayTap() {
    if (sum != 0 && data.empty == false){
        const frame = getFrameById("topframe");
        //TODO Load avgTip value at app initialisation
        //TODO Set global order on secret button
        data.pointsGained = calculatePoints(data.avgTip, data.percent);
        frame.navigate("views/payment/payment-page");
    } else {
        alert('Bevor du bezahlen kannst, musst du Bestellungen vom Tisch auswählen und zu deinem persönlichen Warenkorb hinzufügen.');
    }
}
exports.onPayTap = onPayTap



// Calculates the points one gets for a tip.
function calculatePoints(avgTip, percent){
    let distance = percent - avgTip
    if ( distance < 5 && distance > 0){
        console.log(10 * data.value * distance)
        return (10 * data.value * distance).toFixed()
    }
    else if(distance > 5){
        return (10 * data.value * distance * 2).toFixed()
    }
  }
  exports.calculatePoints = calculatePoints
  


// Replaces the given characters in a string.
// Necessary to replace "." in emails as firebase does not accept certain characters.
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

// TODO reevaluate tip calcuation
// Calculates the tip value based on the choosen slider value and the total order value.
function calculateTip(orderValue, sliderValue){
    return (orderValue * sliderValue) / 100 
}


// Calculates the total value based on the tip and total order value.
function calculateTotal(orderValue, tipValue){
    return(orderValue + tipValue)
}


function toggleDrawer(){
    drawer.toggleDrawerState();
};
exports.toggleDrawer = toggleDrawer;
