var observableModule = require("tns-core-modules/data/observable");

function LoginViewModel() {
    var viewModel = observableModule.fromObject({

        orders: [
            { type: Pizza, count: 1 },
            { type: Beer, count: 2 },
            { type: Cake, count: 1 },
            { type: Cola, count: 0 },
            { type: Fanta, count: 3 }
        ]
    });

    return viewModel;
}

var loginViewModel = LoginViewModel();

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = loginViewModel;
}

exports.pageLoaded = pageLoaded;