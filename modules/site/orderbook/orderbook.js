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
  // Agrego las rutas necesarias
  calipso.lib.step(
    function defineRoutes() {
      // agrego el block para mostrar el balance de cuentas.
      module.router.addRoute(/.*/, allPages, {
        template:'templateAll',
        block:'side.orderbook'
      }, this.parallel());
    }, function done() {
      // Extiendo el modelo del usuario para agregarle un balance.
      var UserSchema = calipso.lib.mongoose.modelSchemas.User;
      
      UserSchema.add({
        balanceCop: { type: Number, default: 0 },
        balanceBtc: { type: Number, default: 0 }
      });
      
      // Registro el nuevo esquema para el modelo User.
      calipso.lib.mongoose.model('User', UserSchema);
      next();
    }
  );
};

/*
 * Funcion para traer el balance del usuario y ponerlo disponible
 */
function allPages(req, res, template, block, next) {
  var User = calipso.lib.mongoose.model('User'),
      isUser = (req.session.user);
  
  if (isUser && isUser.username) {
    User.findOne({username:isUser.username}, function(err, user) {
      var balance = {
        cop: user.toJSON().balanceCop,
        btc: user.toJSON().balanceBtc
      };
      // Ahora renderizamos el block
      calipso.theme.renderItem(req, res, template, block, {
        balance: balance
      },next);
    });
  } else {
    // Usuario no logueado
    next();
  }
}
