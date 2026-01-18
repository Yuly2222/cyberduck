# TODO: Enviar productos del carrito en el checkout

## Completado
- [x] Agregar campo oculto "productos" al formulario en checkout.html
- [x] Modificar JavaScript para serializar el carrito y asignarlo al campo oculto
- [x] Verificar que los productos se envíen junto con los demás datos del formulario

## Descripción
Se modificó el archivo `front_end/checkout.html` para incluir los productos seleccionados del carrito de compras en el envío del formulario de pedido. Los productos se serializan como JSON y se envían en un campo oculto llamado "productos" junto con los demás datos (nombre, correo, celular, etc.) a través del API POST ya implementado.

## Cambios realizados
- Agregado `<input type="hidden" id="cartInput" name="productos" value="" />` al formulario
- Agregado código JavaScript: `cartInput.value = JSON.stringify(cart);` para poblar el campo con los productos del carrito
