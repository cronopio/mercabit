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
  
  // Agrego enlace al order book
  res.menu.primary.addMenuItem({name:'Libro de Ordenes',path:'orderbook',url:'/orderbook',description:'Libro de Ordenes de Compra y Venta',security:[]});
  
  // Agrego los enlaces para que el usuario cree ordenes
  if (req.session && req.session.user) {
    res.menu.primary.addMenuItem({name:'Crear Orden de Compra',path:'orderbook/compra',url:'/orderbook/compra',description:'Crear una Orden de Compra',security:[]});
    res.menu.primary.addMenuItem({name:'Crear Orden de Venta',path:'orderbook/venta',url:'/orderbook/venta',description:'Crear una Orden de Venta',security:[]});
  }
  
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
      
      // Agrego la ruta para mostrar el formulario al crear una orden de compra
      module.router.addRoute('GET /orderbook/compra', ordenCompraForm, { block:'content' }, this.parallel());
      
    }, function done() {
      // Creo el modelo de Orden
      var Orden = new calipso.lib.mongoose.Schema({
        tipo:{type: String, required: true},
        volumen: Number,
        precio: Number,
        owner: String
      });
      calipso.lib.mongoose.model('Orden', Orden);
      
      
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
};

/*
 * Funcion para mostrar el formulario de creacion de orden de compra.
 */
function ordenCompraForm(req, res, template, block, next) {
  if (req.session && req.session.user) {
    var orderForm = {
      id:'FORM', title:req.t('Crear Nueva Orden'), type:'form', method:'POST', action:'/orderbook/compra',
      sections: [{
        id:'form-section-core',
        label:'Compra',
        fields: [
          {label:'Cantidad', name:'orden[volumen]', type:'text'},
          {label:'Precio', name:'orden[precio]', type:'text'}
        ]
      }],
      buttons: [
        {name:'submit', type:'submit', value:'Crear Orden'}
      ]
    };
    
    calipso.form.render(orderForm, null, req, function(form) {
      calipso.theme.renderItem(req, res, form, block, {}, next);
    });
  }
};