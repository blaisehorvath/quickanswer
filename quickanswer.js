"use strict";
const clc = require('cli-color');
const readline = require('readline');
const searchWeb = require('./lib/searchddg');
const ArgumentParser = require('argparse').ArgumentParser;

/* Parsing the arguments */
let parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'A CLI application to get information quickly from the internet'
});

parser.addArgument(["searchterm"], {
});

let args = parser.parseArgs();

if (args.searchterm) searchWeb(args.searchterm).then((data)=>{
    console.log(data.abstract);
    formatText(data.extracted)
});
else {
    console.log(clc.magenta.bold("What are you interested in?"));
}

/* Configuring io */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const formatText = function (response) {
    for (let topic of response) {
        console.log(clc.bold.green(topic.category));
        for (let item of topic.data) {
            console.log(clc.bold.xterm(39)((item.id)) + " - " + item.data)
            console.log()
        }
    }
};