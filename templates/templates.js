const initText = `
Usage:

app init <command>

List of all Available Initialization Commands:

app init help           Shows the usage file that was created.
app init --all          Creates the folder structure, usage files and config file.
app init --init         Creates the folder structure and add usage files.
app init --fig          Creates the config file with the default settings.
app init --undo         Deletes the usage files and config file.
`;

const configText = `
Usage:

app config <command>

List of all Available Configuration Commands:

app config help              Shows the usage file that was initialized.
app config --show            Displays a list of the current config settings.
app config --reset                Resets the config file with default settings.
app config --alter <key> <value>        Changes a specific config value.
`;

const tokenText = `
Usage:

app token <command>

List of all Available Token Commands:

app token help                                Shows the usage file that was initialized.
app token --create                            Creates an empty token.json file to get started.
app token --undo                              Deletes the token.json file.          
app token --count                             displays a count of the tokens created.
app token --new <username> <email> <phone>    Generates a token for a given username, email, phone and saves the token to tokens.json.
app token --search <username>                 Logs the token for the given username.
app token --alter <username> <key> <value>    Changes a specific token value by the given username.

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
  tokenText,
};
