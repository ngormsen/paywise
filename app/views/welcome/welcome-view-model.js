var observableModule = require("tns-core-modules/data/observable");
var data = require("../shared/data.js");

function welcomeViewModel() {
  var viewModel = observableModule.fromObject({
    guest: data.guest,
    restaurant: data.restaurant,
    table: data.table
  });

  return viewModel;
}

module.exports = welcomeViewModel;

