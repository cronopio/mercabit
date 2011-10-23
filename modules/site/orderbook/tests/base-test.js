/**
 * Pruebas para el modulo de orderbook.
 */

var zombie = require('zombie'),
    assert = require('assert');
    
zombie.visit('http://localhost:3000', function(err, browser, status) {
  if (err) throw(err.message);
  
  assert.equal(browser.text('title'), 'MercaBits');
  
  // Esta logueado?
  assert.equal(browser.text('a#userFormToggleTrigger'), 'Log In');
  
  // El form de login debe estar escondido
  var formLogin = browser.querySelector('#user-login');
  assert.equal(formLogin.style.display, 'none');
  
  // Identifiquemonos
  browser.clickLink('Log In', function(err, browser, status) {
    // Ahora debe aparecer el formulario
    assert.equal(browser.querySelector('#user-login').style.display, '');
    browser
      .fill("user[username]", "test")
      .fill("user[password]", "test")
      .pressButton("Login", function(err, browser, status) {
        var userLogin = browser.querySelector('#user-login');
        var enlaces = userLogin.querySelectorAll('a');
        
        // Deben aparecer 2 enlaces
        assert.equal(enlaces.length, 2);
        
        // El primer enlace debe decir el nombre de usuario
        assert.equal(enlaces[0].innerHTML, "test");
        // El segundo enlace debe decir logout
        assert.equal(enlaces[1].innerHTML, "Logout");
      });
  });
  
});
