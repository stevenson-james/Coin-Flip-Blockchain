const routes = require('next-routes')();

// : says what will be different
routes
    .add('/games/new', '/games/new')
    .add('/games/:address', '/index')
    .add('/games/:address/flipcoin', '/index');
module.exports = routes;