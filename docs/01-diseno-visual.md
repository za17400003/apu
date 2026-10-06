# Diseño visual

## Dirección

Herramienta de trabajo de obra: precisa, clara y utilizable desde el sitio. Evitar estética de ERP pesado y de página promocional. El primer viewport muestra el título de la herramienta y el flujo para iniciar un presupuesto, no una sección de marketing.

## Sistema visual inicial

- Paleta: carbón para estructura, blanco cálido para superficie, amarillo seguridad para acciones primarias y verde para resultados válidos. Rojo reservado para errores/destructivo. No usar el color como único indicador.
- Tipografía: IBM Plex Sans para interfaz y IBM Plex Mono para medidas, unidades, cantidades y precios.
- Radios pequeños (4-8 px), bordes definidos y sombras mínimas.
- Iconografía consistente; cada botón solo-icono debe tener etiqueta accesible y tooltip.
- Densidad media en escritorio; formularios apilados y controles amplios en móvil.
- Unidades y números alineados; moneda MXN por defecto, configurable en preferencias.

## Layout responsive

### Escritorio (>= 1024 px)

- Barra superior: nombre provisional del producto, proyecto activo, guardar/estado local y menú de ayuda.
- Navegación lateral estrecha: Proyecto, APU, Catálogo, Guías, Ajustes.
- Área principal: editor en la izquierda y resumen calculado persistente a la derecha.
- Croquis del muro dentro del área de trabajo; tabla de conceptos debajo o en pestaña propia.

### Tableta (768-1023 px)

- Navegación lateral colapsable.
- Editor y resultado en dos paneles solo si caben; si no, editor arriba y resumen abajo.
- El croquis conserva una relación de aspecto estable y no altera la altura al cambiar medidas.

### Móvil (< 768 px)

- Barra superior compacta con proyecto y menú.
- Navegación inferior de cuatro destinos: Proyecto, APU, Catálogo y Más.
- Una columna; resumen mediante panel anclado compacto y expandible.
- Formularios por pasos para reducir densidad; los resultados siguen visibles al confirmar.
- Áreas táctiles >= 44 px; teclado numérico para medidas y costos.

## Estados de interfaz

- Vacío: llamada a crear el primer presupuesto y ejemplo cargable.
- Editando: cambios guardados automáticamente localmente y estado visible.
- Guardando: indicador breve no bloqueante.
- Guardado: etiqueta “Guardado en este dispositivo”.
- Error de almacenamiento: mantener formulario, avisar y ofrecer exportación inmediata.
- Sin red: cálculo y proyectos locales siguen disponibles; no se promete sincronización.
- Impresión: hoja limpia sin navegación ni anuncios.

## Imágenes

La imagen del producto se presenta como miniatura junto al acabado/material seleccionado. El croquis del muro es geométrico 2D, no una fotografía ni una representación de exactitud constructiva. Se permite seleccionar archivo local, recortar/centrar y reemplazarlo; se guarda en IndexedDB.
