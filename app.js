/* App.js
   The Main Cmd line to call the list of commands for init, config, etc.

   To see the list of all commands type "node app help" in the console.

   Authors: David Bishop, Jacob Pritchett, Alex Frizzell
   Created Date: June 16, 2022
   Updates:
   Date, Author, Description
   June 20, 2022, David, main cli for fist arg done, info.txt readFile.

*/

const fs = require("fs");
const path = require("path");

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("./logEvent");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

const initializeApp = require("./init");
const configApp = require("./config");
const { tokenApp } = require("./token.js");

global.DEBUG = true;

// Can make global
const slicedArgs = process.argv.slice(2); // Creates a new array sliced at the the 3rd arguemnt; Ex: [ 'node', 'app', 'help' ] -> [ 'help' ] - the 3rd argument.
// 3rd and beyond args to the console, if DEBUG is changed to true:
if (DEBUG) console.log("the app's sliced args: ", slicedArgs);

// Switch statements at the first argument of our new sliced array.
switch (slicedArgs[0]) {
  case "init":
  case "i":
    if (DEBUG) console.log(slicedArgs[0], " - initialize the app.");
    initializeApp();
    break;
  case "config":
  case "c":
    if (DEBUG) console.log(slicedArgs[0], " - display the configuration file.");
    configApp();
    break;
  case "token":
  case "t":
    if (DEBUG) console.log(slicedArgs[0], " - generate a user token.");
    tokenApp();
    break;
  case "help":
    // Reads info.txt and log the files text to the console. Also, emits an error if any.
    fs.readFile(path.join(__dirname, "public", "info.txt"), (err, data) => {
      if (err) {
        myEmitter.emit(
          "log",
          `${err.name}:\t${err.message}`,
          "ERROR",
          "errLog.log"
        );
        console.error(err);
      }
      console.log(data.toString());
    });
    break;
  default:
    console.log(`Type "node app help" for additional information.`);
}
