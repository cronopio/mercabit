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
    res.menu.primary.addMenuItem({name:'Comprar Bitcoins',path:'orderbook/compra',url:'/orderbook/compra',description:'Crear una Orden de Compra',security:[]});
    res.menu.primary.addMenuItem({name:'Vender Bitcoins',path:'orderbook/venta',url:'/orderbook/venta',description:'Crear una Orden de Venta',security:[]});
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
      
      // Agrego la ruta para ver el orderbook completo
      module.router.addRoute('GET /orderbook', orderBook, {
        template:'orderbook', 
        block:'content' 
      }, this.parallel());
      
      // Agrego la ruta para mostrar el formulario al crear una orden de compra
      module.router.addRoute('GET /orderbook/:tipo', ordenForm, { block:'content' }, this.parallel());
      // Agrego la ruta para procesar el formulario y guardar la orden.
      module.router.addRoute('POST /orderbook/:tipo', ordenSave, null, this.parallel());
      
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

/**
 * Funcion para mostrar el order book con todas la ordenes
 */
function orderBook(req, res, template, block, next) {
  var Orden = calipso.lib.mongoose.model('Orden'),
      format = req.moduleParams.format ? req.moduleParams.format : 'html';
  
  calipso.lib.step(
    function getOrdenes() {
      Orden.find({tipo:'compra'}, this.parallel());
      Orden.find({tipo:'venta'}, this.parallel());
    },
    function done(err, compras, ventas) {
      if (format === 'html') {
        calipso.theme.renderItem(req, res, template, block, {
          compras:compras,
          ventas:ventas
        },next);
      }
      
      if (format === "json") {
        res.format = format;
        res.send({compras:compras,ventas:ventas});
        next();
      }
      
    }
  );
};

/*
 * Funcion para mostrar el formulario de creacion de orden de compra.
 */
function ordenForm(req, res, template, block, next) {
  if (req.session && req.session.user) {
    var tipo = req.moduleParams.tipo;
    var orderForm = {
      id:'FORM', title:req.t('Crear Nueva Orden'), type:'form', method:'POST', action:'/orderbook/' + tipo,
      sections: [{
        id:'form-section-core',
        label:tipo,
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

/*
 * Funcion para guardar la nueva orden de compra
 */
function ordenSave(req, res, template, block, next) {
  if (req.session && req.session.user) {
    calipso.form.process(req, function(form) {
      if (form) {
        var Orden = calipso.lib.mongoose.model('Orden'),
            uOrden = new Orden(form.orden);
        
        uOrden.owner = req.session.user.id;
        uOrden.tipo = req.moduleParams.tipo;
        
        // TODO: Agregar las emisiones de los pre eventos.
        
        uOrden.save(function(err) {
          if(err) {
            req.flash('error',req.t('No se pudo crear la orden porque: {msg}.',{msg:err.message}));
            if(res.statusCode != 302 && !res.noRedirect) {
              res.redirect('back');
            }
          } else {
            // TODO: Agregar las emisiones a los post eventos.
            // TODO: como un post evento debe estar la revision por una orden que llene esta
            if(!res.noRedirect) {
              req.flash('info',req.t('Orden creada!, tu orden sera cerrada cuando se encuentre una orden que la llene.'));
              res.redirect('/misordenes/' + req.session.user.username);
            }
          }
        });
      }
    });
  }
};
