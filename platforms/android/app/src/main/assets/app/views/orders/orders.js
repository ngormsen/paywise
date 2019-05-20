//var observableModule = require("tns-core-modules/data/observable");
//const listViewModule = require("tns-core-modules/ui/list-view");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const fromObject = require("tns-core-modules/data/observable").fromObject;
var firebase = require("nativescript-plugin-firebase");
const listViewModule = require("tns-core-modules/ui/list-view");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const repeaterModule = require("tns-core-modules/ui/repeater");
const Observable = require("tns-core-modules/data/observable").Observable;

const createViewModel = require("./orders-view-model").createViewModel;

// function onNavigatingTo(args) {
//     const page = args.object;

//     // using the view model as binding context for the current page
//     const mainViewModel = createViewModel();
//     page.bindingContext = mainViewModel;
// }
// exports.onNavigatingTo = onNavigatingTo;

function pageLoaded(args) {
    var orders;
    var viewModel = new Observable();

    const page = args.object;
    const listView = page.getViewById("listView");
    // determines action in case of database change
    var onChildEvent = function (result) {
        // var dish = [];
        // var prize = [];
        // var dishPrize = []
        console.log("Event type: " + result.type);
        console.log("Key: " + result.key);
        console.log("Value: " + JSON.stringify(result.value));
        
        // getting the orders 
        orders = result.value;

        // create arrays of dish and prize
        // Object.keys(orders.orders).forEach(function(key,idx){
        //     dish.push(key);
        //     console.log(key); 
        //     prize.push(orders.orders[key])
        //     console.log(orders.orders[key]);
        // }); 
        // dishPrize.push(dish)
        // dishPrize.push(prize)
        console.log(orders.orders)

        // viewModel.set("orderModel", orders);
        // viewModel.set("dish", dish);
        // viewModel.set("prize", prize)
        const viewModel = fromObject({
            orders: orders.orders
        });
        // const viewModel = fromObject({
        //     dish: dish,
        //     prize: prize
        // });
        // const viewModel = fromObject({
        //     items: [1, 2, 3],
        //     test: "Parent binding! (the value came from the `test` property )"
        // });

        // var orderArray = new ObservableArray([orders.orders]);
        // console.log(dish)
        page.bindingContext = viewModel;
        
        listView.refresh();

    };

    // event listener for changes on database
    firebase.addChildEventListener(onChildEvent, "/tables").then(
        function (result) {
            that._userListenerWrapper = result;
            console.log("firebase.addChildEventListener added");
        },
        function (error) {
            console.log("firebase.addChildEventListener error: " + error);
        }
    );

}

exports.pageLoaded = pageLoaded;
function onListViewLoaded(args) {
    const listView = args.object;
}
exports.onListViewLoaded = onListViewLoaded;

function onItemTap(args) {
    const page = args.object;
    const index = args.index;
    const listView = page.getViewById("listView");
    const item = page.bindingContext.myTitles[index].title;
    //const amount = page.bindingContext.myTitles[index].amount

    console.log(`Second ListView item tap ${index}`);
    // page.bindingContext.myTitles.push({ title: item });
    console.log(item)
    page.bindingContext.myTitles[index].amount += 1
    listView.refresh();
}
exports.onItemTap = onItemTap;

function onTap() {
    const frame = getFrameById("topframe");
    frame.navigate("views/navigate/navigate");
}

exports.onTap = onTap;

// requests the receipt
function onOrderTap(args) {
    console.log("orderTap");
}


exports.onOrderTap = onOrderTap;



// Set up Database structure
// TODO  Display Data in list
// TODO  update data
// TODO  look for changes and automatically update the list
// TODO  take amount from table and sum
// TODO  pass sum to paypal amount