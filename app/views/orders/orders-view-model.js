// const Observable = require("tns-core-modules/data/observable").Observable;
// var firebase = require("nativescript-plugin-firebase");

// function getMessage(counter) {
//     if (counter <= 0) {
//         return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
//     } else {
//         return `${counter} taps left`;
//     }
// }

// function createViewModel() {
//     const viewModel = new Observable();

//     viewModel.onChildEvent = function(){
//         var onChildEvent = function(result){
//             console.log("Event type: " + result.type);
//             console.log("Key: " + result.key);
//             console.log("Value: " + JSON.stringify(result.value));
//         }
//     };
//     firebase.addChildEventListener(onChildEvent, "/tables").then(
//         function (result) {
//             that._userListenerWrapper = result;
//             console.log("firebase.addChildEventListener added");
//         },
//         function (error) {
//             console.log("firebase.addChildEventListener error: " + error);
//         }
//     );


    // viewModel.set("counter", 42);
    // viewModel.set("message", getMessage(viewModel.counter));

    // viewModel.onTap = function () {
    //     this.set("message", getMessage(--this.counter));
    // };

//     return viewModel;
// }
// exports.createViewModel = createViewModel;
