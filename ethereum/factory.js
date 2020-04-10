import web3 from './web3';
import GameFactory from './build/GameFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(GameFactory.interface),
    '0xaE95AffBbc23Ef965383615f663789D9e7866c6B'
);

export default instance;