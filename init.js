// just copyied from node week 7 for a gerneral idea of what to do\\
// just copyied from node week 7 for a gerneral idea of what to do\\
// just copyied from node week 7 for a gerneral idea of what to do\\

const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

const {configJson, tokenText, configText, initText} = require('./templates')

// Add logging to the CLI project by using eventLogging
// load the logEvents module
const logEvents = require('./logEvent');

// define/extend an EventEmitter class
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};

// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on('log', (event, level, msg) => logEvents(event, level, msg));

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
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'View folder already existed.');
        fs.writeFile(path.join(__dirname, 'views', 'init.txt'), initText, (err) => {
            if(err) console.log(err);
            else if(DEBUG) console.log('Data written to init.txt file');
            myEmitter.emit('log', 'init.createInitText()', 'INFO', 'Created init text file.');
        });
        fs.writeFile(path.join(__dirname, 'views', 'config.txt'), configText, (err) => {
            if(err) console.log(err);
            else if(DEBUG) console.log('Data written to config.txt file');
            myEmitter.emit('log', 'init.createConfigText()', 'INFO', 'Created config text file.');
        });
        fs.writeFile(path.join(__dirname, 'views', 'token.txt'), tokenText, (err) => {
            if(err) console.log(err);
            else if(DEBUG) console.log('Data written to token.txt file');
            myEmitter.emit('log', 'init.createTokenText()', 'INFO', 'Created token text file.');
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