/* Token.js
   The token part of the cmd line, which is the second argument.
   Houses all token functions.

   To see the list of commands type "node app token help" in the console.

   Authors: David Bishop, Jacob Pritchett, Alex Frizzell
   Created Date: June 21, 2022
   Updates:
   Date, Author, Description
   June 23, David, Created app interface, created --create, --undo, --count and --new.
   June 24, David, Fixed new function, generate on web page, --search function.

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

const myArgs = process.argv.slice(2);

const tokenApp = () => {
  switch (myArgs[1]) {
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
      newToken(myArgs[2]);
      break;
    case "--search":
      if (DEBUG) console.log("tokenApp.searchToken() --search");
      searchToken(myArgs[2]);
      break;
    case "--addphone":
      if (DEBUG) console.log("tokenApp.Add() --add");
      break;
    case "--addemail":
      if (DEBUG) console.log("tokenApp.Add() --add");
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
      "tokenFile(); token.json file was created.",
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
    // if (!tokenJSON) {
    //   console.log("");
    //   console.log("There are no tokens to be found silly.");
    // }
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

const newToken = async (username) => {
  try {
    if (DEBUG) console.log("Made it to: token.newToken()");

    let newToken = JSON.parse(`{
   "created": "1969-01-31",
   "username": "username",
   "email": "user@example.com",
   "phone": "5556597890",
   "token": "token",
   "expires": "1969-02-03",
   "confirmed": "tbd"
}`);
    if (DEBUG) console.log("JSON.parse()");

    const dateNow = moment().format("YYYY-MM-DD");
    const expireDate = moment().add(4, "days").format("YYYY-MM-DD");

    newToken.created = dateNow;
    newToken.username = username;
    newToken.token = crc32(username).toString();
    newToken.expires = expireDate;

    if (
      fs.readFileSync(path.join(__dirname, "json", "tokens.json"), "utf-8") ==
      ""
    ) {
      let tokens = [];
      tokens.push(newToken);
      // stringify changes it to a JSON string instead of javaScript objects form to be able to write JSON disk.
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
  //   return newToken.token;
};

const searchToken = async (username) => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, "json", "tokens.json")
    );

    json = JSON.parse(data);

    let finder = json.find((data) => data.username == username);
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

const tokenAddEmail = async () => {
  try {
  } catch (err) {}
};

// const websiteToken = async () => {
//   try {
//     const btn = document.querySelector("#btn");

//     btn.addEventListener("click", () => {
//       if (DEBUG) console.log("Made it to: token.newToken()");

//     let newToken = JSON.parse(`{
//    "created": "1969-01-31",
//    "username": "username",
//    "email": "user@example.com",
//    "phone": "5556597890",
//    "token": "token",
//    "expires": "1969-02-03",
//    "confirmed": "tbd"
// }`);

//     const dateNow = moment().format("YYYY-MM-DD");
//     const expireDate = moment().add(4, "days").format("YYYY-MM-DD");

//     let username = document.querySelector("#name").value;
//     let email = document.querySelector("#email").value;
//     let phoneNum = document.querySelector("#phone").value;

//     newToken.created = dateNow;
//     newToken.username = username;
//     newToken.email = email;
//     newToken.phone = phoneNum;
//     newToken.token = crc32(username).toString();
//     newToken.expires = expireDate;

//     if (
//       fs.readFileSync(path.join(__dirname, "json", "tokens.json"), "utf-8") ==
//       ""
//     ) {
//       let tokens = [];
//       tokens.push(newToken);
//       // stringify changes it to a JSON string instead of javaScript objects form to be able to write JSON disk.
//       userTokens = JSON.stringify(tokens, null, 2);

//       await fsPromises.writeFile(
//         path.join(__dirname, "json", "tokens.json"),
//         userTokens
//       );
//     } else {
//       const data = await fsPromises.readFile(
//         path.join(__dirname, "json", "tokens.json")
//       );
//       let tokens = JSON.parse(data);

//       tokens.push(newToken);

//       userTokens = JSON.stringify(tokens, null, 2);

//       await fsPromises.writeFile(
//         path.join(__dirname, "json", "tokens.json"),
//         userTokens
//       );
//     }
//     });

//   } catch (err) {
//     myEmitter.emit(
//       "log",
//       `${err.name}:\t${err.message}`,
//       "ERROR",
//       "errLog.log"
//     );
//     console.error(err);
//   }
// };

module.exports = tokenApp;
