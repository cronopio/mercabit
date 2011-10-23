/*!
 * Order book for bitcoins market
 */
var rootpath = process.cwd() + '/',
  path = require('path'),
  calipso = require(path.join(rootpath, 'lib/calipso')),

exports = module.exports = {
  init: init,
  route: route,
  depends:["user"],
  about: {
    description: 'Order book for bitcoin market',
    author: 'cronopio',
    version: '0.0.1',
    home:'http://github.com/cronopio/calipso-orderbook'
  },
};

/*
 * Router
 */
function route(req, res, module, app, next) {
  // Router
  module.router.route(req, res, next);
}

/**
 * Inicializador al arrancar calipso
 */
function init(module, app, next) {
  next();
}
