import web3 from './web3';
import GameFactory from './build/GameFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(GameFactory.interface),
    '0x2c82de9FffDDc2686e34b9896f5E9CA7640D7118'
);

export default instance;