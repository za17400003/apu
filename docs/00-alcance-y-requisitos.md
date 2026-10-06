# Alcance y requisitos

## Propósito

Crear una herramienta gratuita, sencilla y adaptable a PC, tableta y móvil que ayude a desglosar, reutilizar y compartir análisis de precios unitarios (APU) de conceptos de obra. El producto no cobrará suscripciones. La publicidad es una posibilidad de monetización posterior y no debe interferir con el cálculo.

## Usuarios

- Contratista pequeño o trabajador independiente: prepara cotizaciones y guarda sus propios insumos, rendimientos y tarifas.
- Estudiante: practica el desglose de un concepto y consulta ejemplos guiados. Los ejercicios de muestra se identifican como educativos, no como precios oficiales.

El flujo de contratista es el principal. El modo estudiante reutiliza la misma lógica y añade datos de ejemplo y explicaciones.

## Alcance de la primera versión

- Crear, editar, duplicar y eliminar proyectos y conceptos.
- APU configurable por unidad de trabajo.
- Desglose de materiales, mano de obra y equipo/herramienta.
- Porcentajes editables para indirectos y utilidad, con base de cálculo visible.
- Catálogo local de insumos, precios, unidades, proveedor opcional y fecha de actualización.
- Croquis 2D de un muro con ancho, alto y aberturas rectangulares opcionales.
- Asociar acabado/producto e imagen opcional al muro.
- Calcular área neta y cantidades a partir del rendimiento que configure el usuario.
- Guardar en el mismo navegador, exportar/importar respaldo JSON e imprimir o guardar como PDF.
- Contenido educativo original y navegación responsive.
- Espacios publicitarios documentados pero desactivados hasta contar con aprobación del proveedor de anuncios.

## Fuera de alcance

- Suscripciones, pagos, cuentas, sincronización entre dispositivos o colaboración en equipo.
- Base de precios nacional automática, scraping de tiendas o afirmaciones de precio oficial.
- Medición automática desde fotografías, CAD/BIM, planos complejos o modelado 3D.
- Cálculo fiscal, asesoría de licitación o garantía de costos reales.
- IA generativa dentro del cálculo o escritura autónoma en producción.
- App nativa; se prioriza la web y podrá evaluarse instalación como PWA después.

## Requisitos de producto

- R1. Un usuario puede abrir la aplicación sin registrarse.
- R2. Cada APU muestra unidad, cantidad base, costos directos por rubro, porcentajes aplicados, precio unitario y fecha de actualización de precios.
- R3. Los costos, rendimientos, desperdicio y porcentajes son editables por el usuario.
- R4. Cada operación explica de dónde sale el resultado y permite corregir las entradas.
- R5. Los datos persisten entre sesiones del mismo navegador y origen, con aviso de que no hay respaldo en la nube.
- R6. El usuario puede exportar/importar los datos y borrar todo el almacenamiento local.
- R7. La interfaz se puede operar con teclado y tiene controles táctiles adecuados.
- R8. El contenido educativo distingue ejemplos hipotéticos de precios reales.
- R9. Ningún anuncio se confunde con el control de cálculo ni con una recomendación imparcial.

## Criterios iniciales de aceptación

1. Crear un proyecto, dibujar un muro con medidas en metros y ver área bruta, aberturas y área neta.
2. Crear un concepto con materiales, mano de obra y equipo; cambiar un costo y ver actualizado el precio unitario.
3. Asociar un producto y su imagen al acabado del muro y visualizarlo en el resumen exportable.
4. Recargar la página y recuperar el proyecto en el mismo navegador.
5. Exportar e importar un respaldo sin perder las imágenes incluidas o mostrar claramente cuáles quedan fuera.
6. Completar el flujo en viewport móvil sin desplazamiento horizontal ni acciones inaccesibles.
7. Usar la herramienta sin anuncios mientras no exista aprobación; los espacios reservados no se muestran vacíos ni bloquean el contenido.

## Glosario de términos de construcción

- **APU (Análisis de Precio Unitario)**: desglose detallado de los costos (materiales, mano de obra, equipo) necesarios para ejecutar una unidad de obra (p. ej., 1 m² de pintura). El resultado es un precio unitario.
- **Rendimiento**: cantidad de insumo requerido por unidad de obra (p. ej., 0,2 L/m² de pintura). Puede expresarse en litros/m², kg/m², piezas/m², etc.
- **Desperdicio**: porcentaje de insumo adicional para cubrir pérdidas, retrabajos o variaciones (p. ej., 10% por evaporación). Se aplica multiplicando (1 + desperdicio%).
- **Indirectos**: porcentaje sobre costos directos para cubrir gastos no asignables directamente (p. ej., 10% para administración, transporte, herramientas comunes).
- **Utilidad (o Ganancia)**: porcentaje de margen de rentabilidad sobre el costo total (p. ej., 20% ganancia del contratista).
- **Costo directo**: suma de materiales + mano de obra + equipo/herramienta por unidad de obra.
- **Precio unitario**: costo directo + indirectos + utilidad. Es el valor final que el contratista cobra.
- **Muro (o superficie)**: elemento constructivo con dimensiones (ancho, alto en metros). Puede tener aberturas rectangulares (puertas, ventanas).
- **Área neta**: superficie real a trabajar, calculada como (ancho × alto) − suma de aberturas.

## Nota sobre monetización

La publicidad es una opción futura de monetización y **no interfiere ni modifica las fórmulas de cálculo APU**. Los espacios publicitarios están documentados pero desactivados hasta contar con aprobación del proveedor.
