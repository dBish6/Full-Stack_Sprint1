/* logEvent.js
   The Main Cmd line



   Authors: David Bishop, Jacob Pritchett,
   Alex Frizzell
   Created Date: June 16, 2022
   Updates:
   Date, Author, Description
   June 20, 2022, David, modules, logEvents function.
*/

const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, level, logName) => {
  const dateTime = moment().format("YYYY-MM-DD HH:mm A"); // Datetime format.
  const logEvent = `${dateTime}\t${uuidv4()}\t${msg}\t${level}\n`; // Logging the request showing the date with uuid(random id), msg and level.
  console.log(logEvent);
  try {
    // If this certain path does not exist... existsSync just returns true or flase.
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs")); // Makes "logs" directory if path does not exist.
    }
    // __dirname/logs/eventLog.txt
    // __dirname is the absolute path of the directory containing the current executed file.
    await fsPromises.appendFile(
      path.join(__dirname, "logs", logName),
      logEvent
    ); // Appends data from logEvent to the filename which is in this case is logName. logName is "reqlog" & "errLog".
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;
