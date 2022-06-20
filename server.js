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

const server = http.createServer((req, res) => {});

server.listen(port, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${port}; press Ctrl-C to terminate...`
  );
});
