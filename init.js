/* Init.js
   initialization part of the command line.
   Houses all init functions.

   To see the list of commands type "node app help" in the console.

   Authors: David Bishop, Jacob Pritchett,
   Alex Frizzell
   Created Date: June 21, 2022
   Updates:
   Date, Author, Description
   June 21, 2022, Alex, initializeation for CLI.
   June 22, 2022, David, Fixed application interface, created all init functions with fsPromises, and events.

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

const { configJSON, configText, initText } = require("./templates/templates");

function initializeApp() {
  const myArgs = process.argv.slice(2);

  switch (myArgs[1]) {
    case "--all":
      createInit();
      createConfig();
      if (DEBUG) console.log("initializeApp.all() --all");
      break;
    case "--init":
      createInit();
      if (DEBUG) console.log("initializeApp.createInit() --init");
      break;
    case "--fig":
      createConfig();
      if (DEBUG) console.log("initializeApp.createConfig() --fig");
      break;
    case "--undo":
      deleteFiles();
      if (DEBUG) console.log("initializeApp.deleteFiles() --undo");
      break;
    case "help":
      fs.readFile(path.join(__dirname, "views", "init.txt"), (err, data) => {
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
    default:
      console.log(
        `type "node init --init" to create usage files; When created "node init help" for more information.`
      );
  }
}

const createInit = async () => {
  try {
    if (DEBUG) console.log("Made it to: createInit()");
    // Makes the directory only if it doesn't exist because the recursive argument indicates wheather or
    // not the folder should be created; turning it to true makes it so it don't create it when it exists.
    await fsPromises.mkdir(path.join(__dirname, "views"), { recursive: true });

    // Writes the two initializing text files to views asynchronously.
    await fsPromises.writeFile(
      path.join(__dirname, "views", "init.txt"),
      initText
    );
    await fsPromises.writeFile(
      path.join(__dirname, "views", "config.txt"),
      configText
    );
    myEmitter.emit(
      "log",
      "createInit(); views folder was created if needed; txt files were written to folder.",
      "INFO",
      "functLog.log"
    );
    console.log("App was initialized");
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

// Creates the default config.json file from the list of templates in templates folder.
const createConfig = async () => {
  try {
    if (DEBUG) console.log("Made it to: createConfig()");
    // stringify changes it to a string instead of javaScript objects form to be able to right it do disk.
    let data = JSON.stringify(configJSON, null, 2);
    await fsPromises.writeFile(
      path.join(__dirname, "json", "config.json"),
      data
    );
    myEmitter.emit(
      "log",
      "createConfig(); Defaulted config.json was written to json folder.",
      "INFO",
      "functLog.log"
    );
    console.log("Defaulted config.json was created");
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

// Removes just the files from their directory asynchronously.
const deleteFiles = async () => {
  try {
    if (DEBUG) console.log("Made it to: deleteFiles()");
    // When force is true, exceptions will be ignored if path does not exist.
    await fsPromises.rm(path.join(__dirname, "json", "config.json"), {
      force: true,
    });
    await fsPromises.rm(path.join(__dirname, "views", "init.txt"), {
      force: true,
    });
    await fsPromises.rm(path.join(__dirname, "views", "config.txt"), {
      force: true,
    });
    myEmitter.emit(
      "log",
      "deleteFiles(); All init files were deteled if existed.",
      "INFO",
      "functLog.log"
    );
    console.log("Files were indeed deleted");
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

module.exports = initializeApp;
