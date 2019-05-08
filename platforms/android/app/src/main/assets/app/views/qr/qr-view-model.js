var observable_1 = require("data/observable");
var dialogs_1 = require("ui/dialogs");
var nativescript_barcodescanner_1 = require("nativescript-barcodescanner");
var BarcodeModel = (function (_super) {
    __extends(BarcodeModel, _super);
    function BarcodeModel() {
        _super.call(this);
        this.barcodeScanner = new nativescript_barcodescanner_1.BarcodeScanner();
    }
    
    BarcodeModel.prototype.doCheckAvailable = function () {
        this.barcodeScanner.available().then(function (avail) {
            dialogs_1.alert({
                title: "Scanning available?",
                message: avail ? "YES" : "NO",
                okButtonText: "OK"
            });
        }, function (err) {
            dialogs_1.alert(err);
        });
    };
    BarcodeModel.prototype.doCheckHasCameraPermission = function () {
        this.barcodeScanner.hasCameraPermission().then(function (permitted) {
            dialogs_1.alert({
                title: "Has Camera permission?",
                message: permitted ? "YES" : "NO",
                okButtonText: "OK"
            });
        }, function (err) {
            dialogs_1.alert(err);
        });
    };
    BarcodeModel.prototype.doRequestCameraPermission = function () {
        this.barcodeScanner.requestCameraPermission().then(function () {
            console.log("Camera permission requested");
        });
    };
    ;
    BarcodeModel.prototype.doScanWithBackCamera = function () {
        this.scan(false, true);
    };
    ;
    BarcodeModel.prototype.doScanWithFrontCamera = function () {
        this.scan(true, false);
    };
    ;
    BarcodeModel.prototype.doScanWithTorch = function () {
        this.scan(false, true, true, "portrait");
    };
    ;
    BarcodeModel.prototype.doScanPortrait = function () {
        this.scan(false, true, false, "portrait");
    };
    ;
    BarcodeModel.prototype.doScanLandscape = function () {
        this.scan(false, true, false, "landscape");
    };
    ;
    BarcodeModel.prototype.doContinuousScan = function () {
        this.barcodeScanner.scan({
            continuousScanCallback: function (result) {
                console.log(result.format + ": " + result.text);
            }
        });
    };
    ;
    BarcodeModel.prototype.doContinuousScanMax3 = function () {
        var count = 0;
        console.log("-- in doContinuousScanMax3, count: " + count);
        var self = this;
        this.barcodeScanner.scan({
            reportDuplicates: false,
            continuousScanCallback: function (result) {
                count++;
                console.log(result.format + ": " + result.text + " (count: " + count + ")");
                if (count === 3) {
                    // funilly this is required on Android to reset the counter for a second run
                    count = 0;
                    self.barcodeScanner.stop();
                    setTimeout(function () {
                        dialogs_1.alert({
                            title: "Scanned 3 codes",
                            message: "Check the log for the results",
                            okButtonText: "Sweet!"
                        });
                    }, 1000);
                }
            }
        });
    };
    ;
    BarcodeModel.prototype.scan = function (front, flip, torch, orientation) {
        this.barcodeScanner.scan({
            formats: "QR_CODE, EAN_13",
            cancelLabel: "EXIT. Also, try the volume buttons!",
            message: "Use the volume buttons for extra light",
            preferFrontCamera: front,
            showFlipCameraButton: flip,
            showTorchButton: torch,
            orientation: orientation,
            openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
        }).then(function (result) {
            // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
            setTimeout(function () {
                dialogs_1.alert({
                    title: "Scan result",
                    message: "Format: " + result.format + ",\nValue: " + result.text,
                    okButtonText: "OK"
                });
            }, 500);
        }, function (errorMessage) {
            console.log("No scan. " + errorMessage);
        });
    };
    ;
    return BarcodeModel;
}(observable_1.Observable));
exports.BarcodeModel = BarcodeModel;