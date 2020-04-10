// deploys a GameFactory

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/GameFactory.json');

const fs = require('fs-extra');
let credentialsFile = fs.readFileSync('./credentials.json');
let credentials = JSON.parse(credentialsFile);
const provider = new HDWalletProvider(
    credentials.mneumonic,
    credentials.infuraNode
);

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: '0x' + compiledFactory.bytecode }) // add 0x bytecode
        .send({from: accounts[0]}); // remove 'gas'
    console.log('Contract deployed to', result.options.address);
};
deploy();