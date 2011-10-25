/**
 * Pruebas para revision del modulo Orderbook en calipso
 */
 
var Feature = require('vows-bdd').Feature,
    assert = require('assert'),
    zombie = require('zombie');
    
Feature('Revicion Inicial')
  .scenario('Index')
  .given('Logueado', function() {
    var self = this;
    zombie.visit('http://localhost:3000/', function(e, b, s) {
      b.clickLink('Log In', function(e, b, s) {
        b.fill("user[username]", "probando")
          .fill("user[password]", "probando")
          .pressButton("Login", self.callback);
      });
    });
  })
  .when('En el Home', function(b, s) {
    b.location = 'http://localhost:3000/';
    b.wait(this.callback); 
  })
  .then('Veo en el menu el enlace al libro de ordenes', function(e, b, s) {
    assert.equal(b.text('#orderbook-menu-item > a'), 'Libro de Ordenes');
  })
  .then('Veo en el menu el enlace a mis ordenes', function(e, b, s) {
    assert.equal(b.text('#misordenes-menu-item > a'), 'Mis Ordenes');
  })
  .then('Veo el widget del orderbook', function(e, b, s) {
    assert.equal(b.text('#orderbook-module h2'), 'Balance')
  })
  .and('Veo mi balance', function(e, b, s) {
    assert.equal(b.querySelectorAll('#orderbook-module p').length, 2);
    assert.isNumber(parseInt(b.text('#user-balance-cop')));
    assert.isNumber(parseInt(b.text('#user-balance-btc')));
  })
  .and('Debo tener saldo suficiente', function(e, b, s) {
    assert.strictEqual((b.text('#user-balance-cop') == 0) 
      && (b.text('#user-balance-btc') == 0), false);
  })
  .complete()
  .finish(module);
  
Feature('Orden de Compra')
  .scenario('')
  .given('Logueado', function() {
    var self = this;
    zombie.visit('http://localhost:3000/', function(e, b, s) {
      b.clickLink('Log In', function(e, b, s) {
        b.fill("user[username]", "probando")
          .fill("user[password]", "probando")
          .pressButton("Login", self.callback);
      });
    });
  })
  .when('form de creacion', function(b, s) {
    b.location = 'http://localhost:3000/orderbook/compra';
    b.wait(this.callback);
  })
  .then('veo el titulo de creacion de orden', function(e, b, s) {
    assert.equal(b.text('header.form-header h2'), 'Crear Nueva Orden');
  })
  .and('debe ser una orden de compra', function(e, b, s) {
    assert.equal(b.text('#form-section-core h3'), 'compra');
  })
  .and('debo tener los inputs necesarios', function(e, b, s) {
    assert.equal(b.querySelectorAll('input').length, 3);
  })
  .when('lleno el form', function(b, s) {
    b.fill('orden[volumen]', '1')
     .fill('orden[precio]', '5000')
     .pressButton('Crear Orden', this.callback)
  })
  .then('llego a mis ordenes', function(e, b, s) {
    assert.equal(b.location.href, 'http://localhost:3000/misordenes')
  })
  .and('veo el mensaje de confirmacion', function(e, b, s) {
    assert.equal(b.text('#messages ul.info li').trim(), 
      'Orden creada!, tu orden sera cerrada cuando se encuentre una orden que la llene.'
    );
  })
  .complete()
  .finish(module);

Feature('Orden de Venta').scenario('')
  .given('Logueado', function() {
    var self = this;
    zombie.visit('http://localhost:3000/', function(e, b, s) {
      b.clickLink('Log In', function(e, b, s) {
        b.fill("user[username]", "probando")
          .fill("user[password]", "probando")
          .pressButton("Login", self.callback);
      });
    });
  })
  .when('form de creacion', function(b, s) {
    b.location = 'http://localhost:3000/orderbook/venta';
    b.wait(this.callback);
  })
  .then('veo el titulo de creacion de orden', function(e, b, s) {
    assert.equal(b.text('header.form-header h2'), 'Crear Nueva Orden');
  })
  .and('debe ser una orden de venta', function(e, b, s) {
    assert.equal(b.text('#form-section-core h3'), 'venta');
  })
  .and('debo tener los inputs necesarios', function(e, b, s) {
    assert.equal(b.querySelectorAll('input').length, 3);
  })
  .when('lleno el form', function(b, s) {
    b.fill('orden[volumen]', '2')
     .fill('orden[precio]', '6000')
     .pressButton('Crear Orden', this.callback)
  })
  .then('llego a mis ordenes', function(e, b, s) {
    assert.equal(b.location.href, 'http://localhost:3000/misordenes')
  })
  .and('veo el mensaje de confirmacion', function(e, b, s) {
    assert.equal(b.text('#messages ul.info li').trim(), 
      'Orden creada!, tu orden sera cerrada cuando se encuentre una orden que la llene.'
    );
  })
  .complete()
  .finish(module);
