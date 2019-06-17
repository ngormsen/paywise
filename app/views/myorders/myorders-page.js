const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var data = require("../shared/data.js");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
// const sliderModule = require("tns-core-modules/ui/slider");
// const fromObject = require("tns-core-modules/data/observable").fromObject;
// const view = require("tns-core-modules/ui/core/view");
// const Button = require("tns-core-modules/ui/button").Button;
// var getViewById = require("tns-core-modules/ui/core/view").getViewById;
// const listViewModule = require("tns-core-modules/ui/list-view");

var page = null
var orders = null
var tip = 0;
var sum = 0;
var total = 0;
var avgTip = 0;
var attempts = 0;


// Sets observable array
var myItems = new ObservableArray([]);

// Replaces the given characters in a string.
// Necessary to replace "." in emails as firebase does not accept certain characters.
String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};


// Calculates the tip value based on the choosen slider value and the total order value.
function calculateTip(orderValue, sliderValue){
    // console.log((orderValue * sliderValue) / 100 )
    return (orderValue * sliderValue) / 100 
}


// Calculates the total value based on the tip and order value.
function calculateTotal(orderValue, tipValue){
    return(orderValue + tipValue)
}


function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    viewModel.set("sum", `${0} EUR.`);
    viewModel.set("currentValue", data.percent);
    viewModel.set("sliderValue", data.percent);
    viewModel.set("firstMinValue", 0);
    viewModel.set("firstMaxValue", 20);
    viewModel.set("tipValue", data.tip)
    viewModel.on(Observable.propertyChangeEvent, (propertyChangeData) => {
      
        if (propertyChangeData.propertyName === "sliderValue") {
            console.log("sliderEvent")
            viewModel.set("currentValue", propertyChangeData.value.toFixed(0));
            viewModel.set("tipValue", calculateTip(sum, viewModel.get("currentValue")).toFixed(2))
            viewModel.set("sum", `${calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2)} EUR.`);
            total = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2)
            tip = calculateTip(sum, viewModel.get("currentValue")).toFixed(2)
            data.value = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2);
            data.percent = viewModel.get("sliderValue")
            data.tip = calculateTip(sum, viewModel.get("currentValue")).toFixed(2)
            data.total = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2);
            // tip = viewModel.get("tipValue")
            // sum = viewModel.get("sum")
        } 


    });

    page.bindingContext = viewModel;

    var onChildEvent = function (result) {
        console.log("childEvent")
        // console.log("USER", data.guest.replaceAll("\.","")) 
        viewModel.set("currentValue", data.percent);
        viewModel.set("sliderValue", data.percent);
        viewModel.set("tipValue", calculateTip(sum, viewModel.get("currentValue")).toFixed(2))
        viewModel.set("sum", `${0} EUR.`)
        data.value = 0;
        
        // console.log("Total", calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2));

        total = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2)
        tip = calculateTip(sum, viewModel.get("currentValue")).toFixed(2)
        // console.log(total,tip)
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
            data.mydata = [];
            
            myItems = [];

            // console.log(orders);
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

        data.value = calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2);
        viewModel.set("sum", `${calculateTotal(sum, parseFloat(calculateTip(sum, viewModel.get("currentValue")))).toFixed(2)} EUR.`);
        viewModel.set("myItems", myItems);

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
                // console.log(key)
                buttonName = orders[key].name
                // console.log(orders[key].name)
                buttonPrize = orders[key].prize
                // console.log(orders[key].prize)
                
            }
        }
     }); 

     firebase.setValue(
        `restaurants/${data.restaurant}/tables/${data.table}/global/orders/${buttonKey}`,
        {name: buttonName, prize: buttonPrize}
    );

    firebase.remove(`restaurants/${data.restaurant}/tables/${data.table}/guests/${data.guest.replaceAll("\.", "")}/myorders/${buttonKey}`);
  


    // var listView = page.getViewById("ordersList");
    if (myItems.length == 1){
        const frame = getFrameById("topframe");
        //frame.reloadPage();
        const navigationEntry = {
            moduleName: "views/myorders/myorders-page",
            backstackVisible: false,
            animated: false
        };
        frame.navigate(navigationEntry);
    }
    //listView.refresh();
}
exports.onTap = onTap;

// Navigates to orders page
function onOrdersTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/orders/orders-page");
}

exports.onOrdersTap = onOrdersTap

// Navigates to payment page
function onPayTap() {
    // var sum = 0;
    // // console.log(orders.orders)
    // // Receives the correct dish, prize and key on Tap event
    // Object.keys(orders).forEach(function(key, idx) {
    //     if(orders[key] != null){
    //         sum += orders[key].prize
    //         console.log(orders[key].prize)
    //     }
    // });
    // console.log(sum);
    // console.log("total", Number(tip))
    // tip = page.getViewById("tipField").text
    // data.tip = tip;
    // data.value = sum + parseFloat(tip);
    // console.log(data.value);
    const frame = getFrameById("topframe");
    frame.navigate("views/payment/payment-page");
    }   

exports.onPayTap = onPayTap


// Gamification of the tip element. 
function tipTap(args){
    var sum = 0;
    // console.log(orders.orders)
    // Receives the correct dish, prize and key on Tap event
    Object.keys(orders).forEach(function(key, idx) {
        if(orders[key] != null){
            sum += orders[key].prize
            console.log(orders[key].prize)
        }
    });
    // console.log(sum);
    // console.log("total", Number(tip))
    //tip = page.getViewById("tipField").text
    // data.value = sum + parseFloat(tip);
    data.value = total;
    data.tip = tip;
    // avgTip = firebase.getValue(`/users/${data.guest}/points`)
    // .then(result => console.log(JSON.stringify(result)))
    // .catch(error => console.log("Error: " + error));

    if(data.percent > avgTip){
        alert(`Trinkgeld gegeben: ${data.percent.toFixed(2) }%. Das durchschnittliche Trinkgeld der letzten Tage beträgt: 9.00%. Für deine Großzügigkeit erhälst du x Punkte!`)
        //give points
    }else{
        alert(`Trinkgeld gegeben: ${data.percent.toFixed(2) }%. Das durchschnittliche Trinkgeld der letzten Tage beträgt: 9.00%. Leider erhälst du keine Punkte!`)
    }
    // attempts - 1
    // 

}

exports.tipTap = tipTap




//Swipe Actions
/*
On MyOders List, the Swipe Actions are implementet without Tab-to-execute actions.
We Use the SwipeActions with a specific threshold position.
When this position is reached, the action starts 
*/


//Start Swiping
/*
function onSwipeCellStarted(args)
 {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args.swipeView;
    const leftItem = swipeView.getViewById('mark-view');
    const rightItem = swipeView.getViewById('delete-view');
    swipeLimits.left = swipeLimits.right = args.data.x > 0 ? swipeView.getMeasuredWidth() / 2 : swipeView.getMeasuredWidth() / 2;
    swipeLimits.threshold = swipeView.getMeasuredWidth();
}
exports.onSwipeCellStarted=onSwipeCellStarted
*/
//Defining the swipe threshold
/*
function onCellSwiping(args) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args.swipeView;
    const mainView = args.mainView;
    const leftItem = swipeView.getViewById('mark-view');
    const rightItem = swipeView.getViewById('delete-view');

    if (args.data.x > swipeView.getMeasuredWidth() / 4 && !leftThresholdPassed) {
        console.log("Notify perform left action");
        const markLabel = leftItem.getViewById('mark-text');
        leftThresholdPassed = true;
    } else if (args.data.x < -swipeView.getMeasuredWidth() / 4 && !rightThresholdPassed) {
        const deleteLabel = rightItem.getViewById('delete-text');
        console.log("Notify perform right action");
        rightThresholdPassed = true;
    }
    if (args.data.x > 0) {
        const leftDimensions = View.measureChild(
            leftItem.parent,
            leftItem,
            layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
            layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY));
        View.layoutChild(
            leftItem.parent,
            leftItem,
            0, 0,
            leftDimensions.measuredWidth, leftDimensions.measuredHeight);
    } else {
        const rightDimensions = View.measureChild(
            rightItem.parent,
            rightItem,
            layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
            layout.makeMeasureSpec(mainView.getMeasuredHeight(), layout.EXACTLY));

        View.layoutChild(
            rightItem.parent,
            rightItem,
            mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0,
            mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
    }
}
exports.SwipeActionsEventData = SwipeActionsEventData
*/

//slider
/*
function onNavigatingTo(args) {
    const page = args.object;
    // set up the initial values for the slider components
    const vm = new observableModule.Observable();
    vm.set("currentValue", 10);
    vm.set("sliderValue", 10);
    vm.set("fontSize", 20);
    vm.set("firstMinValue", 0);
    vm.set("firstMaxValue", 100);
    // handle value change
    vm.on(observableModule.Observable.propertyChangeEvent, (propertyChangeData) => {
        if (propertyChangeData.propertyName === "sliderValue") {
            vm.set("currentValue", propertyChangeData.value);
        }
    });
    page.bindingContext = vm;
}
// handle value change
function onSliderLoaded(args) {
    const sliderComponent = args.object;
    sliderComponent.on("valueChange", (sargs) => {
        const page = sargs.object.page;
        const vm = page.bindingContext;
        vm.set("fontSize", sargs.object.value);
    });
}

exports.onSliderLoaded = onSliderLoaded;
exports.onNavigatingTo = onNavigatingTo;*/