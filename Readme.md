# Mercabits

Mercado colombiano de bitcoins.

Probando por ahora calip.so

## Order Book

El order book es el registro completo de todas las ordenes de compra y venta, de todos los usuarios.

### Orden

Una orden tiene los siguientes atributos

 * tipo (compra o venta)
 * volumen
 * precio
 * Dueño (usuario creador de la orden)

Cada uno de estos items ingresado por el usuario.

Para crear una orden el usuario debe contar con saldo suficiente para cubrir la orden en su balance. 
En caso de ser una orden de compra, poseer los pesos colombianos necesarios y en caso de que sea una orden de venta pues tener los bitcoins necesarios.

Cuando una orden es creada, es necesario revisar si ya existe alguna orden de **tipo contrario** por el precio.
Si existe tal orden entonces se debe revisar si el volumen de la orden encontrada es igual o mayor a la orden creada. De ser asi entonces
se determina si con la orden nueva queda cerrada la orden de tipo contrario encontrada o solo restaria a su volumen. En caso de no ser suficiente entonces
se cerrara la orden encontrada y se restara ese volumen al volumen de la orden creada. Al momento de cerrar una orden se genera un **Negocio**.

En caso de no encontrarse una orden de tipo contrario por el mismo precio entonces se quedara la orden en "cola" esperando que una orden de tipo contrario
y por el mismo precio sea creada.

### Negocio
Es cuando alguna de las ordenes creadas por algun usuario es cerrada por haberse creado o encontrado una orden contrario por el mismo precio. 
En este momento se debe anunciar a ambas partes del negocio cerrado.