"use strict";
const clc = require('cli-color');
//const readline = require('readline');
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
    formatText(data);
});
else {
    console.log(clc.magenta.bold("What are you interested in?"));
}
//TODO: what the heck -> search for "alma"
//TODO: be able to start a browser with the schosen result

///* Configuring io */
//const rl = readline.createInterface({
//    input: process.stdin,
//    output: process.stdout
//});

const formatText = function (response) {
    if (response.mainAnswer != "") {
        console.log(response.mainAnswer)
    }
    for (let topic of response.related) {
        console.log(clc.bold.green.underline("\n" + topic.category)+"\n");
        for (let item of topic.data) {
            console.log(clc.bold.xterm(39)((item.title)) + (item.data != "" ? " - " : "") + item.data);
        }
    }
    console.log()
};