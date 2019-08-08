# PayWise
<p align="center">
  <img src="app/images/paypalwriteapplogo.png" width="200" alt="accessibility text">
</p>
Paywise is a modern payment application that allows users to pay their restaurant bill via PayPal and share orders with their friends. Additionally, customers have the opportunity to gain points by giving a higher than average tip. Points can later be used to get a discount from the restaurant.


## Prerequisites
Please make sure that nativescript is installed and configured. You can get the latest version from: https://www.npmjs.com/package/nativescript 
or use  
`npm install nativescript -g`.

Additionally you need to setup an emulator for either android or iOS.

## Setup Firebase
The application is connected to a Firebase backend and uses the authentication and realtime database modules. To setup your own database with the application, follow the instructions on: https://github.com/EddyVerbruggen/nativescript-plugin-firebase.

Import the paywise-db-export.json file into a realtime database that is connected to the paywise application. 

## Setup PayPal
The current configuration uses a sandbox account. For details check: https://developer.paypal.com/.
To use real PayPal accounts change the file under `./app/www/paypal.html` according to: https://developer.paypal.com/docs/checkout/integrate/#8-go-live. 

## QR-Code
<img src="app/images/qrLaContessa.png" width="200" alt="accessibility text">


## Emulate the App
To build the app localy on the selected target platform, navigate into the root directory of the repository and run 
`tns run android`
or
`tns run ios`.
