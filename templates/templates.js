const initText = `
Usage:

app init <command>

List of all Available Initialization Commands:

app init help           Shows the usage file that was created for help.
app init --all          Creates the folder structure, usage files and config file.
app init --init         Creates the folder structure and add usage files.
app init --cat          Creates the config file with the default settings.
app init --undo         Deletes the usage files and config file.
`;

const configText = `
Usage:

app config <command>

List of all Available Configuration Commands:

app config --show            Displays a list of the current config settings.
app config --reset                Resets the config file with default settings.
app config --alter <key> <value>        Sets a specific config setting.
`;

const tokenText = `
Usage:

app token <command>

List of all Available Token Commands:

app token --count                           displays a count of the tokens created.
app token --new <username>                  Generates a token for a given username and saves the token to tokens.json.
app token --addphone <username> <phone>
app token --addemail <username> <email>
app token --search <username>               Logs the token for a given username.

`;

const configJSON = {
  name: "AppConfigCLI",
  description: "The Command Line Interface (CLI) for the App.",
  version: "1.0.0",
  main: "app.js",
  superuser: "adm1n",
};

const tokenStart = [];

module.exports = {
  initText,
  configText,
  configJSON,
  tokenText,
  tokenStart,
};
