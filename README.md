# ☕ Máquina de café: de la maqueta a la funcionalidad

En este proyecto vamos a transformar una interfaz estática en una máquina expendedora de café. La persona puede elegir una bebida, personalizarla, ingresar dinero, preparar el café, recibir el vuelto y retirar su pedido.

El trabajo tiene dos caminos:

- Usar la maqueta resuelta y concentrarse en JavaScript.
- Escribir el HTML y el CSS desde cero antes de agregar la funcionalidad.

En ambos casos, JavaScript se construye con **baby steps**: una funcionalidad pequeña, comprobable y entendible por vez.

## Las tres partes del proyecto

```text
┌──────────────────────────────────────────────────────────┐
│ HTML (index.html)   → estructura y contenido             │
│ CSS (styles.css)    → diseño y maquetación               │
│ JS (app.js)         → interactividad y comportamiento    │
└──────────────────────────────────────────────────────────┘
```

La maqueta usa reglas sencillas:

- Grid para el layout general.
- Flexbox dentro de los componentes.
- Colores escritos directamente, sin variables CSS.
- Medidas en `px` y `%`.
- Comentarios didácticos en los tres archivos.
- JavaScript Vanilla, sin librerías.

## Archivos

```text
maquina-cafe/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   └── images/
│       └── latte.png
└── README.md
```

El JavaScript se conecta al final de `index.html`:

```html
<script src="js/app.js"></script>
```

## ¿Qué hace la versión terminada?

- Permite seleccionar una bebida.
- Cambia el tamaño y la intensidad.
- Controla el azúcar entre 0 y 5.
- Permite elegir leche extra.
- Calcula el precio automáticamente.
- Acumula el dinero ingresado.
- Habilita la preparación solamente con crédito suficiente.
- Simula calentado, molienda y preparación.
- Muestra el café en la bandeja.
- Calcula el vuelto.
- Reinicia la máquina para un nuevo pedido.

## Cómo trabajar con los prompts

No hay que pedirle a la IA que programe toda la máquina de una vez. Copien un prompt, revisen el código recibido y prueben esa funcionalidad antes de continuar.

Antes del primer prompt, compartan con la IA el contenido actualizado de `index.html`. En los siguientes pasos también deben compartir el `app.js` que ya fueron construyendo.

Si la IA propone cambios grandes de diseño, recuérdenle que conserve el HTML y el CSS existentes. Puede agregar solamente los selectores o atributos mínimos que necesite.

## Prompt 1: crear y enlazar JavaScript

```text
Tengo una máquina de café maquetada con HTML y CSS, pero todavía no sé programar en JavaScript.

Creá un archivo independiente llamado js/app.js y enlazalo al final de index.html con una etiqueta script.

Dentro de app.js agregá solamente un comentario didáctico que explique que JavaScript le dará comportamiento a la interfaz.

No agregues ninguna funcionalidad todavía y no cambies el diseño existente.
```

### Comprobar

- `app.js` aparece dentro de la carpeta `js`.
- La consola del navegador no muestra errores.
- La interfaz conserva su diseño.

## Prompt 2: seleccionar una bebida

```text
Quiero agregar la primera funcionalidad con JavaScript Vanilla y sin librerías.

Cada .drink-card tiene data-drink con el nombre y data-price con el precio. Cuando se haga clic en su botón Elegir:

1. La tarjeta elegida debe recibir la clase .is-selected.
2. Las demás tarjetas deben perder esa clase.
3. #order-title debe mostrar el nombre leído desde data-drink.

Usá querySelectorAll, forEach, addEventListener, classList y dataset. Explicá esos conceptos con comentarios didácticos dentro de app.js.

No programes todavía tamaños, precios, crédito ni preparación. Conservá el HTML y el CSS existentes.
```

### Comprobar

- Solamente una bebida queda marcada.
- El resumen muestra su nombre.
- Se puede cambiar de bebida varias veces.

## Prompt 3: elegir tamaño e intensidad

```text
Mejorá el código anterior sin borrar la selección de bebida.

Los botones de .size-buttons tienen data-size y los de .intensity-buttons tienen data-intensity. Al hacer clic en una opción:

1. Agregá .is-active al botón elegido.
2. Quitá .is-active de los otros botones del mismo grupo.
3. Mostrá el tamaño en #order-size.
4. Mostrá la intensidad en #order-intensity.

Creá una función reutilizable para marcar una sola opción activa. Explicá con comentarios qué recibe la función y por qué evita repetir código.

No calcules precios todavía y no modifiques el diseño.
```

### Comprobar

- Cada grupo conserva una sola opción activa.
- Tamaño e intensidad aparecen correctamente en el resumen.

## Prompt 4: controlar el azúcar

```text
Agregá un contador de azúcar que comience en 0.

Al hacer clic en #increase-sugar debe aumentar de uno en uno hasta un máximo de 5. Al hacer clic en #decrease-sugar debe disminuir hasta un mínimo de 0.

Mostrá el número en #sugar-count. También actualizá #order-sugar: debe decir “Sin azúcar” cuando vale 0 y “1 de azúcar”, “2 de azúcar”, etcétera en los demás casos.

Usá condicionales if para respetar los límites y explicalos con comentarios didácticos. No agregues todavía el precio.
```

### Comprobar

- Nunca baja de 0 ni supera 5.
- El contador y el resumen coinciden.

## Prompt 5: elegir leche extra

```text
Agregá la funcionalidad para los botones de .milk-buttons.

Cada botón tiene data-milk con true o false. Al elegir uno, debe recibir .is-active y el otro debe perderla.

#order-milk debe mostrar “Con leche extra” cuando el valor sea true y “Sin leche extra” cuando sea false.

Recordá que dataset devuelve texto: explicá en un comentario cómo lo convertís en un valor booleano. Todavía no cambies el total.
```

### Comprobar

- Sí y No cambian el estado visual.
- El texto del resumen coincide con la selección.

## Prompt 6: calcular el precio

```text
Ahora necesito calcular el total del pedido.

Creá un objeto order que guarde: drink, basePrice, size, sizeExtra, intensity, sugar, extraMilk, credit y total.

El precio debe calcularse así:

- Precio base: data-price de la bebida.
- Chico: sin recargo.
- Mediano: suma $300.
- Grande: suma $600.
- Leche extra: suma $300.
- Intensidad y azúcar no modifican el precio.

Los botones de tamaño ya tienen el recargo en data-extra. Creá las funciones calculateTotal y formatMoney. Mostrá el resultado en #order-total con formato como $2.100.

Actualizá el precio cuando cambie la bebida, el tamaño o la leche. Explicá con comentarios qué son un objeto, una propiedad, una función y Number.

No programes todavía el crédito ni la preparación.
```

### Comprobar

- Cambiar bebida modifica el precio base.
- Tamaño y leche aplican sus recargos.
- Los valores se muestran con separador de miles.

## Prompt 7: ingresar dinero

```text
Agregá la funcionalidad de los botones de .money-buttons.

Cada botón tiene data-amount. Al hacer clic, convertí ese texto a número, sumalo a order.credit y mostrá el crédito acumulado en #order-credit usando formatMoney.

En #credit-help mostrá cuánto dinero falta. Si todavía no se eligió una bebida, debe decir “Elegí una bebida”.

Creá una función updatePurchaseState para actualizar estos mensajes y agregá comentarios didácticos. No prepares todavía el café.
```

### Comprobar

- Varios clics acumulan el dinero.
- El importe faltante disminuye correctamente.
- El formato de moneda se conserva.

## Prompt 8: validar la compra

```text
El botón #prepare-button debe habilitarse solamente cuando se cumplan dos condiciones al mismo tiempo:

1. Hay una bebida seleccionada.
2. order.credit es igual o mayor que order.total.

Agregá esta validación dentro de updatePurchaseState. Mientras falte una condición, el botón debe tener disabled.

Actualizá #machine-message con “Elegí una bebida”, “Crédito insuficiente” o “Lista para preparar”, según corresponda.

Explicá con comentarios los operadores && y >=. No agregues aún los tiempos de preparación.
```

### Comprobar

- No se puede preparar sin una bebida.
- No se puede preparar con crédito insuficiente.
- El botón se habilita al completar el pago.

## Prompt 9: preparar el café por etapas

```text
Cuando se haga clic en #prepare-button, simulá la preparación mediante una función prepareCoffee.

#machine-message debe cambiar en este orden:

1. “Calentando agua...”
2. “Moliendo café...”
3. “Preparando tu bebida...”
4. “¡Tu bebida está lista!”

Usá setTimeout para que las etapas aparezcan con pequeñas pausas. Durante el proceso, deshabilitá las bebidas, personalizaciones, pagos y el botón Preparar para evitar cambios o preparaciones duplicadas.

Explicá setTimeout y el bloqueo de controles con comentarios. No muestres todavía el vaso ni calcules el vuelto.
```

### Comprobar

- Los cuatro mensajes aparecen en orden.
- No se pueden cambiar opciones mientras se prepara.
- Un doble clic no crea dos preparaciones.

## Prompt 10: entregar el café y calcular el vuelto

```text
Al terminar el último setTimeout, completá el pedido.

1. Agregá .is-ready a .pickup-tray.
2. Mostrá el nombre de order.drink dentro de #pickup-drink.
3. Actualizá #pickup-message para avisar que la bebida está lista.
4. Calculá el vuelto restando order.total a order.credit.
5. Mostrá el vuelto en #credit-help y #change-message usando formatMoney.

Creá una función finishOrder y explicá con comentarios cómo se calcula el vuelto y cómo classList modifica el estado visual de la bandeja.
```

### Comprobar

- La bandeja se ilumina al terminar.
- Aparece el nombre correcto de la bebida.
- Con pago exacto, el vuelto es $0.
- Con crédito mayor, la diferencia es correcta.

## Prompt 11: reiniciar la máquina

```text
Agregá la funcionalidad del botón #reset-button mediante una función resetMachine.

Debe restaurar el objeto order, quitar .is-selected de las bebidas, seleccionar Mediano, Media y No como opciones iniciales, volver el azúcar a 0, limpiar el crédito, bloquear Preparar y apagar la bandeja.

Los textos deben volver a “Sin selección”, “$0”, “Elegí una bebida” y “La bandeja se iluminará cuando tu bebida esté lista”.

Reutilizá las funciones que ya existen en lugar de repetir todo el código. Explicá con comentarios qué significa restablecer el estado de una aplicación.
```

### Comprobar

- El reinicio funciona antes y después de preparar.
- No hace falta recargar la página.
- Es posible completar un segundo pedido normalmente.

## Prompt 12: revisión final

```text
Revisá mi index.html y js/app.js completos como docente de JavaScript inicial.

No agregues funcionalidades nuevas. Verificá solamente que:

- No se usen librerías.
- No haya errores en la consola.
- Cada grupo permita una sola selección.
- El azúcar permanezca entre 0 y 5.
- El total y el vuelto sean correctos.
- Los controles se bloqueen durante la preparación.
- Reiniciar restaure toda la interfaz.
- Las funciones y eventos tengan comentarios didácticos claros.

Primero indicame los problemas encontrados. Después mostrá únicamente las correcciones necesarias, sin reescribir el diseño.
```

## Desafíos opcionales

Cuando la versión principal funcione, pueden pedir una mejora por vez:

1. Cobrar un recargo por intensidad Intensa.
2. Deshabilitar `+` o `−` al alcanzar los límites de azúcar.
3. Agregar un botón para cancelar y devolver el crédito.
4. Llevar stock y marcar bebidas agotadas.
5. Contar cuántos cafés se prepararon durante la sesión.
6. Mostrar un historial con los últimos pedidos.

## Idea importante

La versión final de `app.js` sirve como referencia, pero el objetivo no es copiarla completa. El aprendizaje está en construirla paso a paso, probar cada cambio y poder explicar qué hace cada parte.
