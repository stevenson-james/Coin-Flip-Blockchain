import web3 from './web3';
import GameFactory from './build/GameFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(GameFactory.interface),
    '0x84824ce0a712ec107e7C51D539d7B22fE8775CBf'
);

export default instance;