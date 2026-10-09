# Pantallas, pestañas y flujos

## Navegación principal

Cuatro secciones, iguales en escritorio (columna lateral) y en móvil (barra inferior):

1. **Proyecto**: nombre, cliente, folio, ubicación de la obra, moneda, notas y resumen de conceptos y muros.
2. **APU**: conceptos con su composición (materiales, mano de obra, equipo), porcentajes y precio unitario.
   Al escribir un insumo ya capturado antes (en este proyecto o en otro), se sugiere y se completa solo.
3. **Cotización**: partidas (un concepto del APU × una cantidad), condiciones comerciales, totales e impresión.
   Si la cantidad de una partida viene de un muro, el muro se mide ahí mismo: no hay pantalla de muros aparte
   (ver "Flujo de muro", abajo, y la razón del cambio en docs/15).
4. **Ajustes**: datos del contratista (van en el encabezado de la cotización impresa), respaldo, borrado y
   estado del almacenamiento.

No hay "Catálogo" ni "Guías" como pantallas propias: el catálogo de insumos es una sugerencia dentro de APU
(sin pantalla dedicada), y el modo estudiante con ejemplos guiados sigue sin construirse (ver `docs/10`, roadmap).

## Pantallas

- **Historial** (pantalla de entrada): buscar por nombre, cliente o folio; ordenar; filtrar activos/archivados;
  crear, duplicar o archivar un proyecto.
- **Datos del proyecto**: nombre (sincronizado con la pestaña), cliente, folio (sugerido o propio), moneda,
  notas, resumen de conceptos y muros, archivar/eliminar.
- **APU**: selector de concepto, alta de concepto (solo pide nombre; la unidad arranca en m² y se cambia aquí),
  renglones de materiales/mano de obra/equipo con proveedor y fecha del precio, resultado con indirectos y
  utilidad.
- **Cotización**: partidas, condiciones comerciales (IVA, anticipo, vigencia), resumen con totales, documento
  de impresión.
- **Dentro de una partida, al medir un muro**: croquis siempre visible; botón "Editar muro" para nombre,
  ancho, alto y aberturas (cada una con su altura desde el piso, para distinguir puerta de ventana).
- **Ajustes**: perfil del contratista, estado del almacenamiento, exportar/importar respaldo, borrar todo.

## Flujo principal: contratista

Historial → Nuevo proyecto (solo el nombre) → APU: nuevo concepto (solo el nombre) → Añadir materiales, mano de
obra y equipo → Ajustar indirectos/utilidad → Revisar precio unitario → Cotización: agregar partida → Elegir el
concepto y cómo se obtiene la cantidad → Revisar total → Imprimir o guardar PDF.

## Flujo de muro (dentro de una partida)

Cotización → Agregar partida → "Área neta de un muro" → se crea el muro si no hay ninguno (o se elige uno ya
creado) → Ancho y alto → Aberturas opcionales, cada una con su altura desde el piso → El croquis y el importe de
la partida se actualizan solos.

**Detalles del cálculo:**
- Área neta = (ancho × alto) − Σ(aberturas)
- Importe de la partida = precio unitario del concepto × área neta
- Croquis: aproximado, con las aberturas repartidas a lo ancho (la app no captura su posición horizontal exacta);
  avisa si una abertura no cabe, en vez de dibujarla mal.

No existe ya un cálculo de "cuántos envases de producto comprar" dentro del muro: ese número no llegaba a
ningún lado (ver docs/15). Si una partida necesita esa cantidad, se escribe directamente ahí como insumo del
concepto (p. ej., litros de pintura como material, con su propio costo y rendimiento).

## Flujo estudiante

Pendiente de construir (fuera del alcance de esta fase; ver `docs/10-calidad-y-roadmap.md`).

## Popups y confirmaciones

- Confirmación antes de eliminar un proyecto, un concepto, una partida o un muro.
- Alerta antes de borrar todos los datos locales.
- Selector de archivo para el respaldo JSON.
- `window.confirm` nativo para estas confirmaciones; no hay cuadros propios.

No se usan popups publicitarios, anuncios intersticiales ni cuadros modales al abrir la página.

## Avisos y errores

- Mensaje "Guardado en este dispositivo"; nunca se afirma que existe copia en la nube.
- Aviso si falta la fecha del precio de un insumo.
- Validación inline para valores negativos, texto no numérico, fuera de rango o aberturas que no caben.
- Aviso de folio repetido si coincide con el de otro proyecto.
- Aviso al importar un respaldo que no tiene la estructura esperada o es de una versión más nueva.
