/* Sever.js
   List of functions for running the node HTTP sever on LocalHost. 

   Authors: David Bishop, Jacob Pritchett,
   Alex Frizzell
   Created Date: June 16, 2022
   Updates:
   Date, Author, Description
   June 20, 2022, David, modules, server function, displayFile & server listen & events.
*/

const http = require("http");
const fs = require("fs");

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("./logEvent");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

const port = 3069;

//
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  let path = "./views/";
  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      myEmitter.emit("log", `${req.method}\t${req.url}`, "INFO", "reqLog.log");
      displayFile(path);
      break;
    case "/form":
      path += "form.html";
      res.statusCode = 200;
      myEmitter.emit("log", `${req.method}\t${req.url}`, "INFO", "reqLog.log");
      displayFile(path);
      break;
    default:
      myEmitter.emit(
        "log",
        `${req.method}\t${req.url}\t404: no such file or directory found`,
        "ERROR",
        "errLog.log"
      );
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      break;
  }

  //
  function displayFile(filename) {
    fs.readFile(filename, (err, data) => {
      if (err) {
        myEmitter.emit(
          "log",
          `${err.name}:\t${err.message}`,
          "ERROR",
          "errLog.log"
        );
        console.error(err);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(res.statusCode, { "Content-Type": "text/html" });
        res.write(data);
        //   const path = require("path");

        //   res.writeHead(200, { "Content-type": "text/css" });
        //   let cssPath = path.join(__dirname, "public", "index.css");
        //   console.log(cssPath);
        //   let css = fs.readFileSync(cssPath, {
        //     encoding: "utf-8",
        //   });
        //   res.write(css);
        //   console.log("css");
      }
      res.end();
    });
  }
});

//
server.listen(port, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${port}; Ctrl-C to terminate...`
  );
});
