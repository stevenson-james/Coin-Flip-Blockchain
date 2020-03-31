import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    // We are in the browser and Metamask is running
    // get new web3 from Metamask web3 provider
    const provider = window.ethereum;
    provider.enable();
    web3 = new Web3(provider);
}
else {
    // We are on the server or user is not running metamask
    const provider = new Web3.providers.HttpProvider('INSERT INFURA NODE HERE');
    web3 = new Web3(provider);
}

export default web3;