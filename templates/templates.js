/* Templates.js
init for command line


Authors: David Bishop, Jacob Pritchett,
Alex Frizzell
Created Date: June 21, 2022
Updates:
Date, Author, Description
June 21, 2022 Alex Frizzell main CLI templates 

*/

const initText = `
Usage:

app init <command>

List of all available initialization commands:

app init help           Shows the usage file that was created for help.
app init --all          Creates the folder structure, usage files and config file.
app init --init         Creates the folder structure and add usage files.
app init --cat          Creates the config file with the default settings.
app init --undo         Deletes the usage files and config file.
`;

const configText = `
Usage:

app config <command>

List of all available configuration commands:

app config --show            displays a list of the current config settings.
app config --reset                resets the config file with default settings.
app config --alter <key> <value>        sets a specific config setting.
app token --count                       displays a count of the tokens created.
`;

const configJSON = {
  name: "AppConfigCLI",
  description: "The Command Line Interface (CLI) for the App.",
  version: "1.0.0",
  main: "app.js",
  superuser: "adm1n",
};

module.exports = {
  initText,
  configText,
  configJSON,
};
