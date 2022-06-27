/* Token.js
   The token part of the cmd line, which is the second argument.
   Houses all token functions.

   To see the list of commands type "node app token help" in the console.

   Authors: David Bishop, Jacob Pritchett, Alex Frizzell
   Created Date: June 21, 2022
   Updates:
   Date, Author, Description
   June 23, David, Created app interface, created --create, --undo, --count and --new.
   June 24, David, Fixed new function, token generate on web page, --search function.
   June 25, David, added new parameters to newToke function, fixed token generation 
   on web page, --alter function

*/

// Node.js common core global modules
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const crc32 = require("crc/crc32");
const moment = require("moment");

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("./logEvent");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

const slicedArgs = process.argv.slice(2);

// I have this here also becasue when it is not it says an error,
// DEBUG is not defined when you create a token from the web page.
global.DEBUG = true;

const tokenApp = () => {
  switch (slicedArgs[1]) {
    case "--create":
      if (DEBUG) console.log("tokenApp.tokenFile() --create");
      tokenFile();
      break;
    case "--undo":
      if (DEBUG) console.log("tokenApp.undoTokenFile() --undo");
      undoTokenFile();
      break;
    case "--count":
      if (DEBUG) console.log("tokenApp.tokenCount() --count");
      tokenCount();
      break;
    case "--new":
      if (DEBUG) console.log("tokenApp.newToken() --new");
      newToken(slicedArgs[2], slicedArgs[3], slicedArgs[4]);
      break;
    case "--search":
      if (DEBUG) console.log("tokenApp.searchToken() --search");
      searchToken(slicedArgs[2]);
      break;
    case "--alter":
      if (DEBUG) console.log("tokenApp.alterToken() --alter");
      alterToken(slicedArgs[2]);
      break;
    case "help":
      fs.readFile(path.join(__dirname, "views", "token.txt"), (err, data) => {
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
      console.log(
        `Type "node app token --create" to get started; "node app token help" for additional information.`
      );
  }
};

// Creates the token.json file in the json folder if it does not exist asynchronously.
const tokenFile = async () => {
  try {
    if (DEBUG) console.log("Made it to: tokenFile()");

    // openSync doesn't need data passed in, it creates an emtpy file. With the "a" flag, creates the file if it doesn't already exist.
    fs.openSync(path.join(__dirname, "json", "tokens.json"), "a");

    myEmitter.emit(
      "log",
      "tokenFile(); tokens.json file was created.",
      "INFO",
      "functLog.log"
    );
    console.log("tokens.json file was created.");
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

const undoTokenFile = async () => {
  try {
    if (DEBUG) console.log("Made it to: undoTokenFile()");

    await fsPromises.rm(path.join(__dirname, "json", "tokens.json"), {
      force: true,
    });
    myEmitter.emit(
      "log",
      "undoTokenFile(); token.json was removed.",
      "INFO",
      "functLog.log"
    );
    console.log("tokens.json was removed.");
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

// Reads token.json and counts each json object by Object.keys.
const tokenCount = async () => {
  try {
    if (DEBUG) console.log("Made it to: tokenCount()");

    const tokenJSON = await fsPromises.readFile(
      path.join(__dirname, "json", "tokens.json")
    );
    let tokens = JSON.parse(tokenJSON);

    let count = Object.keys(tokens).length;

    myEmitter.emit(
      "log",
      "tokenCount(); current token count was displayed in console.",
      "INFO",
      "functLog.log"
    );
    console.log(`Current token count is ${count}.`);
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

// Writes a newtoken with the newToken template with the given parameters; username, email, phone.
const newToken = async (username, email, phone) => {
  let newToken = JSON.parse(`{
    "created": "1969-01-31",
    "username": "username",
    "email": "user@example.com",
    "phone": "5556597890",
    "token": "token",
    "expires": "1969-02-03",
    "confirmed": "tbd"
  }`);
  try {
    if (DEBUG) console.log("Made it to: token.newToken()");

    if (DEBUG) console.log("JSON.parse()");

    const dateNow = moment().format("YYYY-MM-DD");
    const expireDate = moment().add(4, "days").format("YYYY-MM-DD");

    newToken.created = dateNow;
    newToken.username = username;
    newToken.email = email;
    newToken.phone = phone;
    newToken.token = crc32(username).toString();
    newToken.expires = expireDate;

    // If the token.js file is empty...
    if (
      fs.readFileSync(path.join(__dirname, "json", "tokens.json"), "utf-8") ==
      ""
    ) {
      let tokens = [];
      tokens.push(newToken);

      userTokens = JSON.stringify(tokens, null, 2);

      await fsPromises.writeFile(
        path.join(__dirname, "json", "tokens.json"),
        userTokens
      );
    } else {
      const data = await fsPromises.readFile(
        path.join(__dirname, "json", "tokens.json")
      );
      let tokens = JSON.parse(data);

      tokens.push(newToken);

      userTokens = JSON.stringify(tokens, null, 2);

      await fsPromises.writeFile(
        path.join(__dirname, "json", "tokens.json"),
        userTokens
      );
    }

    myEmitter.emit(
      "log",
      `newToken(); new token ${newToken.token} was created for ${username} in json directory.`,
      "INFO",
      "functLog.log"
    );
    console.log(`New token ${newToken.token} was created for ${username}.`);
  } catch (err) {
    myEmitter.emit(
      "log",
      `${err.name}:\t${err.message}`,
      "ERROR",
      "errLog.log"
    );
    console.error(err);
  }
  return newToken;
};

// Searches for a token by the given username.
const searchToken = async (username) => {
  try {
    if (DEBUG) console.log("Made it to: token.searchToken()");
    const data = await fsPromises.readFile(
      path.join(__dirname, "json", "tokens.json")
    );

    let json = JSON.parse(data);

    let finder = json.find((data) => data.username == username);

    myEmitter.emit(
      "log",
      `searchToken(); function was fired, diplaying requested token to console.`,
      "INFO",
      "functLog.log"
    );

    console.log(finder);
    if (finder === undefined) {
      console.log("");
      console.log("There are no tokens with that name silly.");
    }
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

// Changes selected object key to whatever value in tokens.json.
const alterToken = async (username) => {
  try {
    if (DEBUG) console.log("token.alterToken()");

    let json = await fsPromises.readFile(
      path.join(__dirname, "json", "tokens.json")
    );
    // To work with JSON basically you have to parse it to JSON object, also is a array.
    let token = JSON.parse(json);
    // Finds the token with the given username.
    let finder = token.find((data) => data.username == username);

    // Key value pairs...
    for (let key of Object.keys(finder)) {
      // If key exists...
      if (key === slicedArgs[3]) {
        finder[key] = slicedArgs[4];
      }
    }
    console.log(finder);

    json = JSON.stringify(token, null, 2);
    await fsPromises.writeFile(
      path.join(__dirname, "json", "tokens.json"),
      json
    );
    myEmitter.emit(
      "log",
      `alterToken(); ${slicedArgs[3]} key was changed to ${slicedArgs[4]}.`,
      "INFO",
      "functLog.log"
    );
    console.log(`${slicedArgs[3]} key was changed to desired value.`);
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

module.exports = {
  tokenApp,
  newToken,
};
