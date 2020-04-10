const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// set path to build folder and delete
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const gamePath = path.resolve(__dirname, 'contracts', 'Game.sol');
const source = fs.readFileSync(gamePath,'utf8');
const output = solc.compile(source, 1).contracts;

// create build folder
fs.ensureDirSync(buildPath);

for (let contract in output){
    // writes out json file to specified folder
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}