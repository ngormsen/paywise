//var observableModule = require("tns-core-modules/data/observable");
//const listViewModule = require("tns-core-modules/ui/list-view");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const fromObject = require("tns-core-modules/data/observable").fromObject;

function pageLoaded(args) {
    const page = args.object;
    const vm = fromObject({
        // Setting the listview binding source
        myTitles: [
            { title: "Antipasti", amount: 0 , value: 0},
            { title: "Grillgemüse", amount: 0, value: 0 },
            { title: "Gebackener Käse", amount: 0, value: 0 },
            { title: "Hackbällchen", amount: 0, value: 0 },
            { title: "Salat", amount: 0, value: 0 },
            { title: "Nudeln", amount: 0, value: 0 }
        ]
    });
    page.bindingContext = vm;

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