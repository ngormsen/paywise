const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const Observable = require("tns-core-modules/data/observable").Observable;
var firebase = require("nativescript-plugin-firebase");
const view = require("tns-core-modules/ui/core/view");
var data = require("../shared/data.js");
const Button = require("tns-core-modules/ui/button").Button;
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
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
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

function onNavigatingTo(args) {
    page = args.object;
    var viewModel = new Observable();    
    page.bindingContext = viewModel;


    var onChildEvent = function (result) {
        console.log("ORDER PAGE CHILD EVENT")
        console.log("RESULT", result.value)
        console.log("USER", data.guest.replaceAll("\.","").replaceAll("@", "")) 

        // set observable array
        var myItems = new ObservableArray(
            []
        );
        orders = result.value;
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
        // console.log(myItems.length)
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

// Picks an item for own order list
function onTap(args) {
    const button = args.object;
    var id = button.id;
    var buttonKey;
    var buttonName;
    var buttonPrize;
    // console.log(id)
    // console.log(orders.orders)
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

    // firebase.getValue('/companies')
    // .then(result => console.log(JSON.stringify(result)))
    // .catch(error => console.log("Error: " + error));
}
exports.onTap = onTap;

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
