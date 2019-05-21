const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
var x
var page = null
var orders = null
function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    page.bindingContext = viewModel;



    var onChildEvent = function (result) {
        // var dish = [];
        // var prize = [];
        // var dishPrize = []
        //get database values
        console.log("Event type: " + result.type);
        console.log("Key: " + result.key);
        console.log("Value: " + JSON.stringify(result.value));
        orders = result.value; 
        console.log("the orders", orders.orders)  
        // console.log(orders.orders[0].name)

        // set observable array
        var myItems = new ObservableArray(
            // orders.orders
            []
        );
        // update the observable array in case of new order
        for (var i = 0; i <= 10; i++) {
            if(orders.orders[i] != null){
                myItems.push({ name: orders.orders[i].name, prize: orders.orders[i].prize});
                console.log({ prize: orders.orders[i].prize})
            }
            
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

function onAddTap() {
    // page.bindingContext.myItems.push({name:"PublishingPublishing"});
    // console.log(page.bindingContext.myItems.)
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
        "/tables/0/orders/",
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
            //    value: "something"
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
                value: 2
            }
        }
    );
    

}

exports.onAddTap = onAddTap;
