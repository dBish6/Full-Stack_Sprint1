/* Sever.js
   List of functions for running the node HTTP sever on LocalHost. 

   Authors: David Bishop, Jacob Pritchett,
   Alex Frizzell
   Created Date: June 16, 2022
   Updates:
   June 20, 2022, David, Implemented 
*/

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  let path = "./views/";
  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      displayFile(path);
      break;
    case "/about":
      path += "form.html";
      res.statusCode = 200;
      displayFile(path);
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
  }

  async function displayFile(filename) {
    fs.readFile(filename, (err, data) => {
      if (err) {
        myEmitter.emit(
          "log",
          `${err.name}:\t${err.message}`,
          "errLog.txt",
          "ERROR"
        );
        console.error(err);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(res.statusCode, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  }
});

server.listen(port, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${port}; press Ctrl-C to terminate...`
  );
});
