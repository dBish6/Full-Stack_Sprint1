/* Config.js
   The configuration part of the cmd line, which is the second argument.
   Houses all config functions

   To see the list of commands type "app help" in the console.

   Authors: David Bishop, Jacob Pritchett,
   Alex Frizzell
   Created Date: June 21, 2022
   Updates:
   Date, Author, Description
   June 21, 2022 Alex Frizzell implemented Config Functions.

*/

// MAKE A functLog.log

const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("./logEvent");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

const { configJson } = require("./templates/templates");

const configApp = () => {
  const slicedArgs = process.argv.slice(2);
  // Use this line of code to send the 3rd and beyond args to the console
  // if(myArgs.length > 1) console.log('the init.args: ', myArgs);
  switch (slicedArgs[1]) {
    case "--show":
      //   displayConfig();
      if (DEBUG) console.log("configApp.Show() --show");
      break;
    case "--reset":
      //   resetConfig();
      if (DEBUG) console.log("configApp.Reset() --reset");
      break;
    case "--set":
      //   setConfig();
      if (DEBUG) console.log("configApp.Set() --set");
      break;
    case "--help":
      //   setConfig();
      if (DEBUG) console.log("configApp.Set() --set");
      break;
    default:
      if (DEBUG) console.log("configApp - default");
      fs.readFile(path.join(__dirname, "views", "config.txt"), (err, data) => {
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
  }
};

// Just shows the config.json in the console.
function displayConfig() {
  if (DEBUG) console.log("config.displayConfig()");
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) throw error;
    console.log(JSON.parse(data));
  });
}

// Just writes over it again with "configdata" template.
function resetConfig() {
  if (DEBUG) console.log("config.resetConfig()");
  // You need to change it to a string instead of JSON sturture to right it do disk.
  let configdata = JSON.stringify(configJson, null, 2);
  fs.writeFile(__dirname + "/config.json", configdata, (error) => {
    if (error) throw error;
    if (DEBUG) console.log("Config file reset to original state");
  });
}

// Changes selected object key to whatever text in config.json.
function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(myArgs);
  let match = false;
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) throw error;
    if (DEBUG) console.log(JSON.parse(data));
    // To work with JSON basically you have to parse it to JSON object, also a array like myArgs.
    let cfg = JSON.parse(data);
    // To find a curtain object(element) in config.json.
    // Key value pairs; main is a key and 'app.js' is the value.
    for (let key of Object.keys(cfg)) {
      // If key exists...
      if (key === myArgs[2]) {
        cfg[key] = myArgs[3];
        match = true;
      }
    }
    if (!match) {
      console.log(`invalid key: ${myArgs[2]}, try another.`);
    }
    if (DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    fs.writeFile(__dirname + "/config.json", data, (error) => {
      if (error) throw error;
      if (DEBUG) console.log("Config file successfully updated.");
    });
  });
}

module.exports = configApp;
