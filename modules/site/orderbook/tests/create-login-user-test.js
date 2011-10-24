/**
 * Pruebas para la creacion de un usuario en el sitio y su identificacion
 */
 
var Feature = require('vows-bdd').Feature,
    http = require('http'),
    assert = require('assert'),
    zombie = require('zombie');
     

Feature('Creando un usuario')
  .scenario('Usando el registro')
  .given('El servidor esta corriendo', function(){
    var self = this;
    var req = http.request({
      host:"localhost",
      port:3000
    }, function(res) {
      if (res) self.callback();
    });
    req.on('error', function(e) {
      if (e.code === 'ECONNREFUSED') {
        console.log('ERROR: El servidor debe estar corriendo para esta prueba');
        console.log('MSG: ', e.message)
      } else {
        console.log('ERROR: ', e);
      }
    });
    req.end();
  })
  .when('Visito el formulario de registro', function() {
    zombie.visit('http://localhost:3000/user/register', this.callback);
  })
  .then('Status correcto', function(err, browser, status) {
    assert.isNull(err);
    assert.equal(status, 200);
    assert.isObject(browser);
  })
  .and('Veo el titulo de registro en ingles', function(err, browser, status) {
    var headers = browser.querySelectorAll('header.form-header h2');
    if (headers && headers.length === 2) {
      assert.equal(headers[1].innerHTML, 'Register');
      assert.equal(headers[0].innerHTML, 'Log In');
    } else {
      assert.ok(false);
    }
  })
  .and('Veo el titulo de registro en español', function(err, browser, status) {
    var headers = browser.querySelectorAll('header.form-header h2');
    if (headers && headers.length === 2) {
      assert.equal(headers[1].innerHTML, 'Registrarse');
      assert.equal(headers[0].innerHTML, 'Ingresar');
    } else {
      assert.ok(false);
    }
  })
  .and('Tiene 10 elementos', function(e, b, s) {
    assert.equal(b.querySelectorAll('input').length, 10);
  })
  .when('Lleno el formulario', function(b, s) {
    // Hack para borrar el formulario de login
    // y que llene el formulario correcto
    b.querySelector('#user-login').innerHTML = '';
    
    b.fill('user[username]', 'probando')
    .fill('user[new_password]', 'probando')
    .fill('user[repeat_password]', 'probando')
    .fill('user[email]', 'probando@ando.com')
    .pressButton("Register", this.callback)
  })
  .then('No veo errores', function(e, b, s) {
    assert.isUndefined(b.querySelector('#messages ul.error'));
  })
  .then('Llego a la pagina de perfil', function(e, b, s) {
    assert.equal(b.location.href, 'http://localhost:3000/user/profile/probando');
  })
  .then('Veo el mensaje de confirmacion', function(e, b, s) { 
    assert.equal(b.text('#messages ul.info li').trim(), 'Profile created, you can now login using this account.');
    
  })
  .complete()
  .finish(module);
  
Feature('Logueandose')
  .scenario('Inicio')
  .when('Visito el Homepage', function() {
    zombie.visit('http://localhost:3000/', this.callback);
  })
  .then('Veo el enlace de login', function(e, b, s) {
    assert.equal(b.text('a#userFormToggleTrigger'), 'Log In');
  })
  .and('No veo el cuadro de login', function(e, b, s) {
    assert.equal(b.querySelector('#user-login').style.display, 'none');
  })
  .when('Click en login', function(b, s) {
    b.clickLink('Log In', this.callback)
  })
  .then('Veo el cuadro de login', function(e, b, s) {
    assert.equal(b.querySelector('#user-login').style.display, '');
  })
  .when('Lleno el formulario de login', function(b, s) {
    b.fill("user[username]", "probando")
      .fill("user[password]", "probando")
      .pressButton("Login", this.callback);
  })
  .then('Veo menu de usuario', function(e, b, s) {
    var userLogin = b.querySelector('#user-login'),
        enlaces = userLogin.querySelectorAll('a');
        
    // Deben aparecer 2 enlaces
    assert.equal(enlaces.length, 2);
        
    // El primer enlace debe decir el nombre de usuario
    assert.equal(enlaces[0].innerHTML, "probando");
    // El segundo enlace debe decir logout
    assert.equal(enlaces[1].innerHTML, "Logout");
  })
  .complete()
  .finish(module);
