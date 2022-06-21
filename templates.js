/* Templates.js
init for command line


Authors: David Bishop, Jacob Pritchett,
Alex Frizzell
Created Date: June 21, 2022
Updates:
Date, Author, Description
June 21, 2022 Alex Frizzell main CLI templates 

*/


let initText = `
app init <command>

Usage:

app init --all          creates the folder structure and config file
app init --mk           creates the folder structure and add usage files
app init --cat          creates the config file with default settings
`;

let configText = `
app config <command>

Usage:

app config --show             displays a list of the current config settings
app config --reset            resets the config file with default settings
app config --set              sets a specific config setting
`;

const configJson = { 
    name: 'AppConfigCLI',
    version: '1.0.0',
    description: 'The Command Line Interface (CLI) for the App.',
    main: 'app.js',
    superuser: 'adm1n'
};

module.exports = {
    initText,
    configText,
    configJson,
};