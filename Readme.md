# Mercabits

Mercado colombiano de bitcoins.

Probando por ahora calip.so

## Order Book

El order book es el registro completo de todas las ordenes de compra y venta, de cada usuario.

### Orden

Una orden tiene los siguientes atributos

 * tipo (compra o venta)
 * volumen
 * precio

Cada uno de estos items ingresado por el usuario.

Cuando una orden es creada, es necesario revisar si ya existe alguna orden de **tipo contrario** por el precio.
Si existe tal orden entonces se debe revisar si el volumen de la orden encontrada es igual o mayor a la orden creada. De ser asi entonces
se determina si con la orden nueva queda cerrada la orden de tipo contrario encontrada o solo restaria a su volumen. En caso de no ser suficiente entonces
se cerrara la orden encontrada y se restara ese volumen al volumen de la orden creada. Al momento de cerrar una orden se genera un **Negocio**.

En caso de no encontrarse una orden de tipo contrario por el mismo precio entonces se quedara la orden en "cola" esperando que una orden de tipo contrario
y por el mismo precio sea creada.

### Negocio
Es cuando alguna de las ordenes creadas por algun usuario es cerrada por haberse creado o encontrado una orden contrario por el mismo precio. 
En este momento se debe anunciar a ambas partes del negocio cerrado.


#### Desarrollo
Por el momento se esta creando un modulo para calip.so que defina el trabajo del orderbook, si desea mirar el modulo, seleccione el Branch `orderbook` y revise el directorio `modules/site/orderbook`