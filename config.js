// just copyied from node week 7 for a gerneral idea of what to do\\
// just copyied from node week 7 for a gerneral idea of what to do\\
// just copyied from node week 7 for a gerneral idea of what to do\\

const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

const { configJson } = require('./templates')

const myArgs = process.argv.slice(2);

function displayConfig() {
    if(DEBUG) console.log('config.displayConfig()');
    fs.readFile(__dirname + "/config.json", (error, data) => {
        if(error) throw error;         
        console.log(JSON.parse(data));
    });
}

function resetConfig() {
    if(DEBUG) console.log('config.resetConfig()');
    let configdata = JSON.stringify(configJson, null, 2);
    fs.writeFile(__dirname + '/config.json', configdata, (error) => {
        if(error) throw error;   
        if(DEBUG) console.log('Config file reset to original state');
    });
}

function setConfig() {
    if(DEBUG) console.log('config.setConfig()');
    if(DEBUG) console.log(myArgs);
    let match = false;
    fs.readFile(__dirname + "/config.json", (error, data) => {
        if(error) throw error;         
        if(DEBUG) console.log(JSON.parse(data));
        let cfg = JSON.parse(data);
        for(let key of Object.keys(cfg)){
            if(key === myArgs[2]) {
                cfg[key] = myArgs[3];
                match = true;
            }
        }
        if(!match) {
            console.log(`invalid key: ${myArgs[2]}, try another.`)
        }
        if(DEBUG) console.log(cfg);
        data = JSON.stringify(cfg, null, 2);
        fs.writeFile(__dirname + '/config.json', data, (error) => {
            if (error) throw error;
            if(DEBUG) console.log('Config file successfully updated.');
        });
    });
}
function configApp() {
const myArgs = process.argv.slice(2);
//Use this line of code to send the 3rd and beyond args to the console 
//if(myArgs.length > 1) console.log('the init.args: ', myArgs);
    switch (myArgs[1]) {
        case '--show':
            displayConfig();
            if(DEBUG) console.log('configApp.Show() --show');
            break;
        case '--reset':
            resetConfig();
            if(DEBUG) console.log('configApp.Reset() --reset');
            break;
        case '--set':
            setConfig();
            if(DEBUG) console.log('configApp.Set() --set');
            break;
        default:
            if(DEBUG) console.log('configApp - default');
            fs.readFile(__dirname + "/views/config.txt", (error, data) => {
                if(error) throw error;
                console.log(data.toString());
            });
    }
}

module.exports = {
    configApp,
  }