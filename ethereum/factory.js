import web3 from './web3';
import GameFactory from './build/GameFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(GameFactory.interface),
    '0x33AFBA375f5A62b74cdF32FA38CC69eBb7584e8E'
);

export default instance;