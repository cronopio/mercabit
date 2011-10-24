## Test del Modulo

En este directorio almacenare todas las pruebas hechas para este modulo.

Las pruebas son hechas gracias a [zombie](http://zombie.labnotes.org/) necesita instalar zombie primero.

Hay otras pruebas creadas usando la libreria `vows-bdd` que lo que hace es poner un comportamiento Given-When-Then sobre `vows` y posibilita mejor el uso de `zombie`.

### Instalacion zombie
```npm install zombie```

### Corriendo zombie
Aqui se corre la prueba `modules/site/orderbook/tests/base-test.js` que lo que hace es probar que el usuario `test` se pueda identificar en el sistema. Si no reporta nada la salida todas las pruebas fueron complidas.

```node modules/site/orderbook/tests/base-test.js```

### Corriendo Vows + Zombie
Hay otra prueba `modules/site/orderbook/tests/create-login-user-test.js` que lo que hace es probar que se pueda crear un usuario y posteriormente prueba que ese usuario se pueda loguear en el sitio. Para ejecutar la prueba simplemente:

```vows --spec modules/site/orderbook/tests/create-login-user-test.js```
