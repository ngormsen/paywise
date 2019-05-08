"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paypal_checkout_common_1 = require("./paypal-checkout.common");
var app = require("tns-core-modules/application");
var PaypalCheckout = (function (_super) {
    __extends(PaypalCheckout, _super);
    function PaypalCheckout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaypalCheckout.prototype.paypalRequest = function (options) {
        return new Promise(function (resolve, reject) {
            var braintree = null;
            try {
                var activity = app.android.startActivity || app.android.foregroundActivity;
                braintree = com.braintreepayments.api.BraintreeFragment.newInstance(activity, options.token);
            }
            catch (error) {
                reject("Braintree created error: " + error);
            }
            var request = new com.braintreepayments.api.models.PayPalRequest(options.amount)
                .currencyCode(options.currencyCode)
                .intent(com.braintreepayments.api.models.PayPalRequest.INTENT_AUTHORIZE);
            com.braintreepayments.api.PayPal.requestOneTimePayment(braintree, request);
            braintree.addListener(new com.braintreepayments.api.interfaces.PaymentMethodNonceCreatedListener({
                onPaymentMethodNonceCreated: function (paymentMethodNonce) {
                    resolve(paymentMethodNonce.getNonce());
                }
            }));
            braintree.addListener(new com.braintreepayments.api.interfaces.BraintreeCancelListener({
                onCancel: function (requestCode) {
                    reject("Buyer canceled payment approval");
                }
            }));
            braintree.addListener(new com.braintreepayments.api.interfaces.BraintreeErrorListener({
                onError: function (error) {
                    reject(error);
                }
            }));
        });
    };
    return PaypalCheckout;
}(paypal_checkout_common_1.Common));
exports.PaypalCheckout = PaypalCheckout;
//# sourceMappingURL=paypal-checkout.js.map