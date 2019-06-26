var observableModule = require("tns-core-modules/data/observable");
var data = require("../shared/data.js");

function paymentViewModel() {
  var viewModel = observableModule.fromObject({
    sum: data.value,
    restaurant: data.restaurant,
    points: data.points
  });

  return viewModel;
}

module.exports = paymentViewModel;
