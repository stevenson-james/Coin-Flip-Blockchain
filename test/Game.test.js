const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/GameFactory.json');
const compiledGame = require('../ethereum/build/Game.json');

let accounts;
let factory;
let gameAddress;
let game;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createGame('game1', '1000000000000000000').send({
        from: accounts[0],
        value: '1000000000000000000',
        gas: '1000000'
    });

    // get first element from getDeployedCampaigns and assign to campaignAddress
    [gameAddress] = await factory.methods.getDeployedGames().call();
    // set campaign to deployed campaign
    game = await new web3.eth.Contract(
        JSON.parse(compiledGame.interface),
        gameAddress
    );
});

describe('Games', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(game.options.address);
    });

    it('marks caller as player one of game', async () => {
        const player1 = await game.methods.player1().call();
        assert.equal(accounts[0], player1);
    });

    it('allows someone to bet on a game', async () => {
        await game.methods.bet().send({
            value: '1000000000000000000',
            from: accounts[1]
        });
        const player2 = await game.methods.player2().call();
        assert.equal(accounts[1], player2);
    });

    it('requires a correct betting amount (under)', async () => {
        try {
            await game.methods.bet().send({
                value: '1',
                from: accounts[1]
            });
            assert(false);
        }
        catch (err) {
            assert(err);
        }
    });

    it('requires a correct betting amount (over)', async () => {
        try {
            await game.methods.bet().send({
                value: '1000000000000000001',
                from: accounts[1]
            });
            assert(false);
        }
        catch (err) {
            assert(err);
        }
    });

    it('allows user to cancel request', async () => {
        try {
            await game.methods.cancel().send({
                from: accounts[0],
                value: 0
            });
            var cancelled = await game.methods.cancelled().call();
        }
        catch (err) {
            assert(err);
        }
        assert(cancelled);
    });

    it('gives proper funds after winning a game', async() => {
        await game.methods.bet().send({
            from: accounts[1],
            value: '1000000000000000000'
        });
        await game.methods.ready().send({
            from: accounts[0],
            value: '0'
        });
        await game.methods.ready().send({
            from: accounts[1],
            value: '0'
        });
        let initialBalance = await web3.eth.getBalance(accounts[0]);
        initialBalance = parseFloat(initialBalance);
        await game.methods.beginCompletion().send({
            from: accounts[0],
            value: '0'
        });
        await game.methods.chooseSide(true).send({
            from: accounts[0],
            value: '0'
        });
        await game.methods.coinFlip(true).send({
            from: accounts[0],
            value: '0'
        });
        let finalBalance = await web3.eth.getBalance(accounts[0]);
        finalBalance = parseFloat(finalBalance);
        assert(finalBalance > initialBalance);
    });
});