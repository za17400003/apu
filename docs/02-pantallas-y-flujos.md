# Pantallas, pestañas y flujos

## Navegación principal

1. **Proyecto**: nombre, fecha, ubicación opcional, moneda, notas y conceptos incluidos.
2. **APU**: edición del concepto, unidad, composición, cantidades, costos y precio unitario.
3. **Superficies**: muros y áreas medidas, aberturas, acabados y productos con imagen.
4. **Catálogo**: insumos, unidades, costos, proveedor opcional, rendimiento y fecha del precio.
5. **Guías**: ejercicios y explicaciones de cálculo.
6. **Ajustes**: moneda, porcentajes predeterminados, respaldo, privacidad y datos locales.

En móvil, Proyecto/APU/Catálogo/Más se convierten en navegación inferior; Superficies se alcanza desde el proyecto y el APU.

## Pantallas

- Inicio/herramienta: crear presupuesto, abrir reciente, cargar ejemplo educativo.
- Editor de proyecto: datos básicos y lista de conceptos.
- Editor APU: pestañas internas Desglose, Costos indirectos y Resultado.
- Editor de muro: croquis, medidas, aberturas y acabado.
- Selector de producto: catálogo local, imagen, rendimiento y presentación.
- Historial local: proyectos recientes, buscar, duplicar, exportar y eliminar.
- Guía educativa: instrucciones y ejemplos reproducibles.
- Ajustes y privacidad: estado de almacenamiento, respaldo y eliminación.
- Impresión/descarga: resumen del proyecto, croquis, producto seleccionado y desglose.

## Flujo principal: contratista

Inicio → Nuevo proyecto → Añadir concepto → Definir unidad/cantidad → Añadir materiales, mano de obra y equipo → Ajustar indirectos/utilidad → Revisar precio unitario → Añadir al presupuesto → Vista previa → Imprimir/guardar PDF.

## Flujo de muro y producto

Proyecto → Superficies → Añadir muro → Capturar ancho/alto → Añadir aberturas opcionales → Revisar área neta → Elegir acabado → Elegir o crear producto → Confirmar rendimiento, desperdicio y precio → Ver cantidad calculada y miniatura → Añadir al APU.

**Detalles del cálculo:**
- Área calculada: (ancho en m × alto en m) − Σ(aberturas rectangulares)
- Rendimiento: expresado en unidades de compra por m² (p. ej., 0,2 L/m², 2 kg/m², 5 piezas/m²)
- Desperdicio: porcentaje configurable (p. ej., 10% para evaporación o recortes)
- Cantidad total = (área neta × rendimiento) × (1 + desperdicio%) / factor de presentación (p. ej., L por cubeta)
- Envases requeridos: se redondea hacia arriba solo en compra; el usuario puede desactivar para ver consumo fraccionario
- Costo producto: precio unitario × cantidad total de envases

## Flujo estudiante

Inicio → Ejemplo educativo → Leer unidades y supuestos → Cambiar datos → Ver el efecto en el desglose → Restablecer ejemplo o guardar copia.

## Popups y confirmaciones

- Confirmación antes de eliminar proyecto, concepto o insumo.
- Alerta antes de borrar todos los datos locales.
- Selector de archivo para imagen y respaldo JSON.
- Diálogo para importar respaldo, con vista de cantidad de proyectos y opción de cancelar.
- Ayuda contextual para base de porcentaje, rendimiento y desperdicio.

No usar popups publicitarios, anuncios intersticiales ni cuadros modales al abrir la página.

## Avisos y errores

- Mensaje de guardado local al cambiar datos; nunca afirmar que existe copia en nube.
- Advertencia de precio sin fuente/fecha o precio con antigüedad configurable.
- Validación inline para valores negativos, dimensiones vacías o unidad incompatible.
- Si el navegador rechaza escritura por cuota, conservar la pantalla y ofrecer exportar o quitar imágenes grandes.
- Aviso al importar datos que reemplazan o combinan con el estado actual.
