/* Init.js
init for command line


Authors: David Bishop, Jacob Pritchett,
Alex Frizzell
Created Date: June 21, 2022
Updates:
Date, Author, Description
June 21, 2022 Alex Frizzell initializeation for CLI 

*/

const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

const {configJson, configText, initText} = require('./templates')

function initializeApp() {

const myArgs = process.argv.slice(2);
//Use this line of code to send the 3rd and beyond args to the console 
//if(myArgs.length > 1) console.log('the init.args: ', myArgs);
    switch (myArgs[1]) {
        case '--all':
            createInit();
            createConfig();
            if(DEBUG) console.log('initializeApp.All() --all');
            break;
        case '--mk':
            createInit();
            if(DEBUG) console.log('initializeApp.createFolders() --mk');
            break;
        case '--cat':
            createConfig();
            if(DEBUG) console.log('initializeApp.createInit() --cat');
            break;
        default:
            if(DEBUG) console.log('initializeApp - default');
            fs.readFile(__dirname + "/views/init.txt", (error, data) => {
                if(error) throw error;
                console.log(data.toString());
            });
    }
}

function createInit() {
    if(fs.existsSync(path.join(__dirname, './views'))) {
        fs.writeFile(path.join(__dirname, 'views', 'init.txt'), initText, (err) => {
            if(err) console.log(err);
            else if(DEBUG) console.log('Data written to init.txt file');
        });
        fs.writeFile(path.join(__dirname, 'views', 'config.txt'), configText, (err) => {
            if(err) console.log(err);
            else if(DEBUG) console.log('Data written to config.txt file');
        });
    } else {
        fs.mkdir(path.join(__dirname, 'views'), (err) => {
            if(err) console.log(err);
            else if(DEBUG) console.log('Directory created.');
        });
    }
}

function createConfig() {
    try {
        let data = JSON.stringify(configJson, null, 2);
        if(!fs.existsSync(path.join(__dirname, 'config.json'))) {
            fs.writeFile('config.json', data, (err) => {
                if(DEBUG) console.log('Data written to config.json file');
            });
        } else {
            if(DEBUG) console.log('config.json file already exists');
        }
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    initializeApp,
  }