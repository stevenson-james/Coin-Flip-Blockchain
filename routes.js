const routes = require('next-routes')();

// : says what will be different
routes
    .add('/games/new', '/games/new')
    .add('/games/:address', '/games/show')
    .add('/games/:address/flipcoin', '/games/flipcoin');
module.exports = routes;