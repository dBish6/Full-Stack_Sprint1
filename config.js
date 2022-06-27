/* Config.js
   The configuration part of the cmd line.
   Houses all config functions

   To see the list of commands type "node app config help" in the console.

   Authors: David Bishop, Jacob Pritchett, Alex Frizzell
   Created Date: June 21, 2022
   Updates:
   Date, Author, Description
   June 21, 2022, Alex, implemented Config App.
   June 22, 2022, David, Fixed application interface, created all config functions with fsPromises, and events

*/

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("./logEvent");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

const slicedArgs = process.argv.slice(2);

// Make an undo.
const configApp = () => {
  switch (slicedArgs[1]) {
    case "--show":
      if (DEBUG) console.log("configApp.displayConfig() --show");
      displayConfig();
      break;
    case "--reset":
      if (DEBUG) console.log("configApp.resetConfig() --reset");
      resetConfig();
      break;
    case "--alter":
      if (DEBUG) console.log("configApp.alterConfig() --alter");
      alterConfig();
      break;
    case "help":
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
      break;
    default:
      console.log(`Type "node app config help" for additional information.`);
  }
};

// Just reads the config.json file asynchronously and shows the it in the console.
const displayConfig = async () => {
  try {
    if (DEBUG) console.log("Made it to: displayConfig()");

    const readJson = await fsPromises.readFile(
      path.join(__dirname, "json", "config.json")
    );
    // Parse just changes a JSON string to javaScript objects.
    console.log(JSON.parse(readJson));
  } catch (err) {
    myEmitter.emit(
      "log",
      `${err.name}:\t${err.message}`,
      "ERROR",
      "errLog.log"
    );
    console.error(err);
  }
};

// Requring the templete which is in javaScript object form.
const { configJSON } = require("./templates/templates");

// Just writes over config.json again with "configJSON" template asynchronously.
const resetConfig = async () => {
  try {
    if (DEBUG) console.log("Made it to: displayConfig()");

    // stringify changes it to a JSON string instead of javaScript objects form to be able to write JSON disk.
    let configdata = JSON.stringify(configJSON, null, 2);
    await fsPromises.writeFile(
      path.join(__dirname, "json", "config.json"),
      configdata
    );
    myEmitter.emit(
      "log",
      "resetConfig(); Config file was reset to it's default state.",
      "INFO",
      "functLog.log"
    );
    console.log("config.json was reset.");
  } catch (err) {
    myEmitter.emit(
      "log",
      `${err.name}:\t${err.message}`,
      "ERROR",
      "errLog.log"
    );
    console.error(err);
  }
};

// Changes selected object key to whatever value in config.json.
const alterConfig = async () => {
  try {
    if (DEBUG) console.log("config.alterConfig()");

    let json = await fsPromises.readFile(
      path.join(__dirname, "json", "config.json")
    );
    // To work with JSON basically you have to parse it to JSON object, also is a array.
    let cfg = JSON.parse(json);
    // To find a curtain object(element) in config.json.
    // Key value pairs; main is a key and 'app.js' is the value.
    for (let key of Object.keys(cfg)) {
      // If key exists...
      if (key === slicedArgs[2]) {
        cfg[key] = slicedArgs[3];
      }
    }
    console.log(cfg);

    json = JSON.stringify(cfg, null, 2);
    await fsPromises.writeFile(
      path.join(__dirname, "json", "config.json"),
      json
    );
    myEmitter.emit(
      "log",
      `alterConfig(); ${slicedArgs[2]} key was changed to ${slicedArgs[3]}.`,
      "INFO",
      "functLog.log"
    );
    console.log(`${slicedArgs[2]} key was changed to desired value.`);
  } catch (err) {
    myEmitter.emit(
      "log",
      `${err.name}:\t${err.message}`,
      "ERROR",
      "errLog.log"
    );
    console.error(err);
  }
};

module.exports = configApp;
